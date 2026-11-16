from fastapi import APIRouter, HTTPException

from app.estado import estado
from app.preco_minimo import preco_calculado

roteador = APIRouter()


@roteador.get("/precos")
def listar_precos():
    return [preco_calculado(p) for p in estado["precos"]]


@roteador.get("/precos/{cultura}")
def buscar_preco(cultura: str):
    for preco in estado["precos"]:
        if preco["id"] == cultura.lower():
            return preco_calculado(preco)
    raise HTTPException(status_code=404, detail=f"Cultura '{cultura}' não encontrada.")


@roteador.get("/compradores")
def listar_compradores():
    return estado["compradores"]
