import asyncio
import threading

from app import gotinha

PERGUNTA = {"sessao": "teste", "mensagem": "A água está boa?"}


def test_sem_chave_responde_com_aviso(cliente, monkeypatch):
    monkeypatch.setenv("GOOGLE_API_KEY", "")
    monkeypatch.delenv("GOOGLE_GENAI_USE_VERTEXAI", raising=False)
    resposta = cliente.post("/conversar", json=PERGUNTA)
    assert resposta.status_code == 200
    assert resposta.json() == {"resposta": gotinha.RESPOSTA_DE_ERRO}


def test_erro_do_agente_responde_com_aviso(cliente, monkeypatch):
    monkeypatch.setenv("GOOGLE_API_KEY", "chave-falsa")

    def falhar():
        raise RuntimeError("falhou")

    monkeypatch.setattr(gotinha, "_preparar", falhar)
    assert cliente.post("/conversar", json=PERGUNTA).json() == {"resposta": gotinha.RESPOSTA_DE_ERRO}


def test_mensagem_vazia(cliente):
    resposta = cliente.post("/conversar", json={"sessao": "teste", "mensagem": ""})
    assert resposta.status_code == 422
    assert resposta.json()["detalhes"] == [{"campo": "mensagem", "mensagem": "não pode ser vazio"}]


def test_modelo_reserva_responde_quando_o_principal_falha(cliente, monkeypatch):
    monkeypatch.setenv("GOOGLE_API_KEY", "chave-falsa")
    laco = asyncio.new_event_loop()
    threading.Thread(target=laco.run_forever, daemon=True).start()
    monkeypatch.setattr(gotinha, "_preparar", lambda: (["principal", "reserva"], laco))

    async def perguntar(runner, sessao, mensagem):
        if runner == "principal":
            raise RuntimeError("503 UNAVAILABLE")
        return "A caixa está cheia."

    monkeypatch.setattr(gotinha, "_perguntar", perguntar)
    try:
        assert cliente.post("/conversar", json=PERGUNTA).json() == {"resposta": "A caixa está cheia."}
    finally:
        laco.call_soon_threadsafe(laco.stop)
