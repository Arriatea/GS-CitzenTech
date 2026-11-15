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
