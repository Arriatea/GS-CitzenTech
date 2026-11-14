LEITURA = {
    "nivelCaixa": 45,
    "umidadeSolo": 38,
    "temSol": False,
    "bomba": False,
    "valvula": True,
    "irrigando": True,
    "chuvaAmanha": True,
    "semaforo": "amarelo",
    "leituraLuz": 1200,
}


def test_agua_inicial(cliente):
    resposta = cliente.get("/agua")
    assert resposta.status_code == 200
    assert set(resposta.json()) == {"boa", "caixa", "diasParaBeber", "fonte", "amanha"}


def test_leitura_atualiza_agua(cliente):
    assert cliente.post("/leituras", json=LEITURA).status_code == 201
    agua = cliente.get("/agua").json()
    assert agua["caixa"] == "metade"
    assert agua["fonte"] == "caixa"
    assert agua["diasParaBeber"] == 3


def test_caixa_pouca_e_cheia(cliente):
    cliente.post("/leituras", json={**LEITURA, "nivelCaixa": 10, "temSol": True})
    agua = cliente.get("/agua").json()
    assert (agua["caixa"], agua["fonte"], agua["diasParaBeber"]) == ("pouca", "poco", 0)
    cliente.post("/leituras", json={**LEITURA, "nivelCaixa": 70})
    assert cliente.get("/agua").json()["caixa"] == "cheia"


def test_ultima_leitura(cliente):
    assert cliente.get("/leituras/ultima").status_code == 404
    cliente.post("/leituras", json=LEITURA)
    assert cliente.get("/leituras/ultima").json()["nivelCaixa"] == 45


def test_leitura_invalida(cliente):
    resposta = cliente.post("/leituras", json={**LEITURA, "nivelCaixa": 150})
    assert resposta.status_code == 422


def test_preco_por_cultura(cliente):
    resposta = cliente.get("/precos/alface")
    assert resposta.status_code == 200
    assert resposta.json()["valor"] == 2.8


def test_preco_inexistente(cliente):
    assert cliente.get("/precos/jabuticaba").status_code == 404


def test_erro_em_portugues(cliente):
    resposta = cliente.post("/leituras", json={**LEITURA, "nivelCaixa": 150, "semaforo": ""})
    assert resposta.status_code == 422
    corpo = resposta.json()
    assert corpo["erro"] == "Dados inválidos."
    assert {"campo": "nivelCaixa", "mensagem": "deve ser menor ou igual a 100.0"} in corpo["detalhes"]


def test_rota_inexistente(cliente):
    resposta = cliente.get("/nada")
    assert resposta.status_code == 404
    assert resposta.json() == {"erro": "Rota não encontrada."}
