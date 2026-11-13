from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as ErroHTTP

from app.erros import erro_de_validacao, erro_http

from app.rotas import agua as rota_agua, colheitas, dados, leituras, precos

app = FastAPI(title="Gota a Gota")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(RequestValidationError, erro_de_validacao)
app.add_exception_handler(ErroHTTP, erro_http)

app.include_router(dados.roteador)
app.include_router(precos.roteador)
app.include_router(rota_agua.roteador)
app.include_router(leituras.roteador)
app.include_router(colheitas.roteador)


@app.get("/saude")
def saude():
    return {"ok": True}
