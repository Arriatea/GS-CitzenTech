from datetime import datetime, timezone

from fastapi import APIRouter

from app.estado import estado
from app.modelos import NovaColheita

roteador = APIRouter()


@roteador.post("/colheitas", status_code=201)
def registrar_colheita(colheita: NovaColheita):
    registro = colheita.model_dump()
    registro["id"] = len(estado["colheitas"]) + 1
    registro["registradaEm"] = datetime.now(timezone.utc).isoformat()
    estado["colheitas"].append(registro)
    return registro


@roteador.get("/colheitas")
def listar_colheitas():
    return estado["colheitas"]
