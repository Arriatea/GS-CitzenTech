import pytest

from app.preco_minimo import calcular_preco_minimo


def test_media_dos_comerciantes_vence():
    assert calcular_preco_minimo(1.0, 2.8, 1.5) == (2.8, "media_comerciantes_locais")


def test_custo_com_margem_vence():
    assert calcular_preco_minimo(3.0, 2.8, 1.5) == (3.9, "custo_por_unidade_x_1_3")


def test_ceasa_e_piso_com_comerciantes():
    assert calcular_preco_minimo(1.0, 2.0, 2.5) == (2.5, "preco_atacado_ceasa")


def test_sem_comerciantes_usa_ceasa_com_margem():
    assert calcular_preco_minimo(1.0, None, 2.0) == (2.4, "preco_atacado_ceasa_x_1_2")


def test_sem_comerciantes_custo_ainda_vence():
    assert calcular_preco_minimo(2.0, None, 1.5) == (2.6, "custo_por_unidade_x_1_3")


def test_sem_dados():
    assert calcular_preco_minimo(None, None, None) == (None, None)


def test_rota_mostra_como_calculamos(cliente):
    preco = cliente.get("/precos/alface").json()
    assert preco["preco_minimo"] == preco["valor"] == 2.8
    assert {"nome", "unidade", "valor"} <= preco.keys()
    calculo = preco["como_calculamos"]
    assert calculo["media_comerciantes_locais"] == 2.8
    assert calculo["preco_atacado_ceasa"] == 1.5
    assert calculo["custo_por_unidade"] == pytest.approx(1.71)


def test_novo_comerciante_muda_o_preco(cliente):
    novo = {"comprador": "Bodega do Zé", "cultura": "alface", "preco": 3.7, "unidade": "cada pé"}
    assert cliente.post("/precos-locais", json=novo).status_code == 201
    assert cliente.get("/precos/alface").json()["preco_minimo"] == 3.1


def test_lista_usa_preco_calculado(cliente):
    for preco in cliente.get("/precos").json():
        assert preco["valor"] == preco["preco_minimo"]
