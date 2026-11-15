from fastapi import APIRouter

from app.gotinha import conversar
from app.modelos import Conversa

roteador = APIRouter()


@roteador.post("/conversar")
def conversar_com_gotinha(conversa: Conversa):
    return {"resposta": conversar(conversa.sessao, conversa.mensagem)}
