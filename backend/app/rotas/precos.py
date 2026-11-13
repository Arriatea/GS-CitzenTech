from fastapi import APIRouter, HTTPException

from app.estado import estado

roteador = APIRouter()


@roteador.get("/precos")
def listar_precos():
    return estado["precos"]


@roteador.get("/precos/{cultura}")
def buscar_preco(cultura: str):
    for preco in estado["precos"]:
        if preco["id"] == cultura.lower():
            return preco
    raise HTTPException(status_code=404, detail=f"Cultura '{cultura}' não encontrada.")


@roteador.get("/compradores")
def listar_compradores():
    return estado["compradores"]
