from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.rotas import agua as rota_agua, dados, leituras, precos

app = FastAPI(title="Gota a Gota")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dados.roteador)
app.include_router(precos.roteador)
app.include_router(rota_agua.roteador)
app.include_router(leituras.roteador)


@app.get("/saude")
def saude():
    return {"ok": True}
