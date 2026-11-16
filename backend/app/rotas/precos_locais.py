from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from app.estado import estado
from app.modelos import PrecoLocal

roteador = APIRouter()


@roteador.post("/precos-locais", status_code=201)
def registrar_preco_local(preco_local: PrecoLocal):
    registro = preco_local.model_dump()
    registro["cultura"] = registro["cultura"].strip().lower()
    produto = next((p for p in estado["precos"] if p["id"] == registro["cultura"]), None)
    if produto is None:
        raise HTTPException(status_code=404, detail=f"Cultura '{preco_local.cultura}' não encontrada.")
    if registro["unidade"].strip().lower() != produto["unidade"]:
        raise HTTPException(status_code=422, detail=f"Use a unidade '{produto['unidade']}' para {produto['nome'].lower()}.")
    registro["unidade"] = produto["unidade"]
    registro["simulado"] = False
    registro["registradoEm"] = datetime.now(timezone.utc).isoformat()
    estado["precosLocais"].append(registro)
    return registro


@roteador.get("/precos-locais")
def listar_precos_locais(cultura: str | None = None):
    if cultura is None:
        return estado["precosLocais"]
    return [p for p in estado["precosLocais"] if p["cultura"] == cultura.strip().lower()]
