from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.rotas import dados

app = FastAPI(title="Gota a Gota")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dados.roteador)


@app.get("/saude")
def saude():
    return {"ok": True}
