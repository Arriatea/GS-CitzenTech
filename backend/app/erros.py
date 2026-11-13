from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as ErroHTTP

MENSAGENS = {
    "missing": "campo obrigatório",
    "bool_parsing": "deve ser verdadeiro ou falso",
    "bool_type": "deve ser verdadeiro ou falso",
    "float_parsing": "deve ser um número",
    "float_type": "deve ser um número",
    "int_parsing": "deve ser um número inteiro",
    "int_type": "deve ser um número inteiro",
    "string_type": "deve ser um texto",
    "string_too_short": "não pode ser vazio",
    "greater_than": "deve ser maior que {gt}",
    "greater_than_equal": "deve ser maior ou igual a {ge}",
    "less_than_equal": "deve ser menor ou igual a {le}",
    "json_invalid": "JSON inválido",
}


def traduzir(erro: dict) -> dict:
    campo = ".".join(str(parte) for parte in erro["loc"] if parte != "body")
    modelo = MENSAGENS.get(erro["type"], "valor inválido")
    return {"campo": campo, "mensagem": modelo.format(**erro.get("ctx", {}))}


async def erro_de_validacao(_: Request, erro: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"erro": "Dados inválidos.", "detalhes": [traduzir(e) for e in erro.errors()]},
    )


async def erro_http(_: Request, erro: ErroHTTP):
    detalhe = "Rota não encontrada." if erro.status_code == 404 and erro.detail == "Not Found" else erro.detail
    return JSONResponse(status_code=erro.status_code, content={"erro": detalhe})
