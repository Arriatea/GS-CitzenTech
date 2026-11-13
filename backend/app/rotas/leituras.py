from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from app.agua import atualizar_agua
from app.estado import estado
from app.modelos import Leitura

roteador = APIRouter()


@roteador.post("/leituras", status_code=201)
def receber_leitura(leitura: Leitura):
    registro = leitura.model_dump()
    registro["recebidaEm"] = datetime.now(timezone.utc).isoformat()
    estado["ultimaLeitura"] = registro
    atualizar_agua(estado["agua"], registro)
    return registro


@roteador.get("/leituras/ultima")
def buscar_ultima_leitura():
    if estado["ultimaLeitura"] is None:
        raise HTTPException(status_code=404, detail="Nenhuma leitura recebida ainda.")
    return estado["ultimaLeitura"]
