from fastapi import APIRouter

from app.estado import estado

roteador = APIRouter()


def _lista(nome: str):
    def rota():
        return estado[nome]

    rota.__name__ = f"listar_{nome}"
    return rota


for _nome in ("tarefas", "canteiros", "cursos", "impacto", "comunidades"):
    roteador.add_api_route(f"/{_nome}", _lista(_nome), methods=["GET"])
