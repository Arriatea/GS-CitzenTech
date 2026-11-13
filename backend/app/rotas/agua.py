from fastapi import APIRouter

from app.estado import estado

roteador = APIRouter()


@roteador.get("/agua")
def buscar_agua():
    return estado["agua"]
