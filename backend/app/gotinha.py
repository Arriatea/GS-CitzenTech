import asyncio
import logging
import os
import sys
import threading
from pathlib import Path

PASTA_AGENTE = Path(__file__).resolve().parents[2] / "agente"
NOME_APP = "gota_a_gota"
USUARIO = "comunidade"
TEMPO_LIMITE_S = 60
RESPOSTA_DE_ERRO = "Não consegui responder agora, tente de novo."

log = logging.getLogger(__name__)
_trava = threading.Lock()
_runner = None
_laco = None


def _tem_credencial() -> bool:
    if os.getenv("GOOGLE_GENAI_USE_VERTEXAI", "").upper() == "TRUE":
        return bool(os.getenv("GOOGLE_CLOUD_PROJECT"))
    return bool(os.getenv("GOOGLE_API_KEY"))


def _preparar():
    global _runner, _laco
    with _trava:
        if _runner is None:
            if str(PASTA_AGENTE) not in sys.path:
                sys.path.insert(0, str(PASTA_AGENTE))
            from google.adk.runners import Runner
            from google.adk.sessions import InMemorySessionService
            from gota_agente.agent import root_agent

            # As ferramentas chamam este backend por HTTP: o agente roda num laço próprio para não travar o servidor.
            _laco = asyncio.new_event_loop()
            threading.Thread(target=_laco.run_forever, daemon=True).start()
            _runner = Runner(
                app_name=NOME_APP,
                agent=root_agent,
                session_service=InMemorySessionService(),
                auto_create_session=True,
            )
    return _runner, _laco


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
    futuro = None
    try:
        runner, laco = _preparar()
        futuro = asyncio.run_coroutine_threadsafe(_perguntar(runner, sessao, mensagem), laco)
        return futuro.result(timeout=TEMPO_LIMITE_S) or RESPOSTA_DE_ERRO
    except Exception:
        log.exception("Falha ao conversar com a Gotinha")
        if futuro:
            futuro.cancel()
        return RESPOSTA_DE_ERRO
