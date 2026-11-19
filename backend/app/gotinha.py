import asyncio
import logging
import os
import sys
import threading
from pathlib import Path

PASTA_AGENTE = Path(__file__).resolve().parents[2] / "agente"
NOME_APP = "gota_a_gota"
USUARIO = "comunidade"
# Se o modelo principal falhar ou demorar (ex.: 503 por excesso de uso no Google), tenta o reserva.
MODELO_RESERVA = os.getenv("GOTINHA_MODELO_RESERVA", "gemini-flash-lite-latest")
TEMPOS_LIMITE_S = (15, 20)
RESPOSTA_DE_ERRO = "Não consegui responder agora, tente de novo."

log = logging.getLogger(__name__)
_trava = threading.Lock()
_runners = None
_laco = None


def _tem_credencial() -> bool:
    if os.getenv("GOOGLE_GENAI_USE_VERTEXAI", "").upper() == "TRUE":
        return bool(os.getenv("GOOGLE_CLOUD_PROJECT"))
    return bool(os.getenv("GOOGLE_API_KEY"))


def _preparar():
    global _runners, _laco
    with _trava:
        if _runners is None:
            if str(PASTA_AGENTE) not in sys.path:
                sys.path.insert(0, str(PASTA_AGENTE))
            from google.adk.runners import Runner
            from google.adk.sessions import InMemorySessionService
            from gota_agente.agent import root_agent

            # As ferramentas chamam este backend por HTTP: o agente roda num laço próprio para não travar o servidor.
            os.environ.setdefault("GOTA_API_URL", f"http://127.0.0.1:{os.getenv('PORT', '8000')}")
            _laco = asyncio.new_event_loop()
            threading.Thread(target=_laco.run_forever, daemon=True).start()
            # Os dois usam as mesmas sessões, então a conversa continua mesmo se trocar de modelo.
            sessoes = InMemorySessionService()
            reserva = root_agent.model_copy(update={"model": MODELO_RESERVA})
            _runners = [
                Runner(app_name=NOME_APP, agent=agente, session_service=sessoes, auto_create_session=True)
                for agente in (root_agent, reserva)
            ]
    return _runners, _laco


async def _perguntar(runner, sessao: str, mensagem: str) -> str:
    from google.genai import types

    pergunta = types.Content(role="user", parts=[types.Part(text=mensagem)])
    resposta = ""
    async for evento in runner.run_async(user_id=USUARIO, session_id=sessao, new_message=pergunta):
        if evento.is_final_response() and evento.content and evento.content.parts:
            resposta = "".join(parte.text or "" for parte in evento.content.parts).strip()
    return resposta


def conversar(sessao: str, mensagem: str) -> str:
    if not _tem_credencial():
        return RESPOSTA_DE_ERRO
    try:
        runners, laco = _preparar()
    except Exception:
        log.exception("Falha ao preparar a Gotinha")
        return RESPOSTA_DE_ERRO
    for nome, runner, limite in zip(("principal", "reserva"), runners, TEMPOS_LIMITE_S):
        futuro = asyncio.run_coroutine_threadsafe(_perguntar(runner, sessao, mensagem), laco)
        try:
            resposta = futuro.result(timeout=limite)
            if resposta:
                return resposta
        except Exception:
            log.exception("Falha ao conversar com a Gotinha (modelo %s)", nome)
            futuro.cancel()
    return RESPOSTA_DE_ERRO
