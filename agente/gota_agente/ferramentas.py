"""
Ferramentas da Gotinha: consultam o backend do Gota a Gota.

Lembrete de como o ADK usa estas funções:
- O modelo NÃO vê o código, só o NOME, os PARÂMETROS (com tipos) e a DOCSTRING.
- Por isso a docstring explica QUANDO usar cada ferramenta.
- Cada função devolve um dicionário, que o modelo transforma em resposta falada.

O que mudou desde a etapa 1: em vez de ler uma lista fixa (dados.py),
cada função chama a API. O agent.py nem percebe a diferença.
"""

import os

import requests
from google.adk.tools.tool_context import ToolContext


def _api() -> str:
    """Endereço do backend (lido do .env na hora da chamada)."""
    return os.getenv("GOTA_API_URL", "http://localhost:8000").rstrip("/")


def _get(caminho: str) -> dict:
    """Faz um GET na API e devolve a resposta, ou um erro que o modelo entende."""
    try:
        resposta = requests.get(f"{_api()}{caminho}", timeout=10)
        if resposta.status_code == 404:
            return {"status": "nao_encontrado"}
        resposta.raise_for_status()
        return {"status": "ok", "dados": resposta.json()}
    except requests.RequestException:
        return {"status": "erro", "mensagem": "Não consegui acessar o sistema agora."}


def ver_agua() -> dict:
    """Mostra como está a água da comunidade agora.

    Use quando a pessoa perguntar se pode beber a água, se a caixa está cheia,
    quantos dias a água dura se o carro-pipa atrasar, de onde vem a água da horta
    ou se precisa molhar a horta.
    """
    return _get("/agua")


def ver_canteiros() -> dict:
    """Mostra todos os canteiros da horta e como cada um está.

    Use quando a pessoa perguntar o que colher, o que está crescendo
    ou se alguma planta precisa de cuidado.
    """
    return _get("/canteiros")


def preco_de_venda(cultura: str) -> dict:
    """Diz o preço mínimo para vender uma verdura ou fruta.

    O preço vem do mercado local e do custo de produção. Use sempre que a pessoa
    perguntar quanto cobrar. Nunca invente preço.

    Args:
        cultura: nome do produto, por exemplo "alface" ou "melancia".
    """
    return _get(f"/precos/{cultura.strip().lower()}")


def ver_compradores() -> dict:
    """Mostra quem compra a produção da comunidade, o que cada um quer e quando.

    Use quando a pessoa perguntar para quem vender, quem vai buscar ou onde vender.
    """
    return _get("/compradores")


def ver_aulas() -> dict:
    """Mostra as aulas disponíveis, com os passos de cada uma.

    Use quando a pessoa quiser aprender a plantar, cuidar de praga ou vender melhor.
    Ensine um passo de cada vez.
    """
    return _get("/cursos")


def registrar_colheita(cultura: str, quantidade: float, unidade: str, tool_context: ToolContext) -> dict:
    """Anota uma colheita que a pessoa contou (o "diário por voz").

    Use quando a pessoa disser que colheu algo, por exemplo "colhi 15 pés de alface".

    Args:
        cultura: o que foi colhido, por exemplo "alface".
        quantidade: quanto foi colhido, só o número.
        unidade: a unidade, por exemplo "pés", "maços", "quilos" ou "unidades".
    """
    corpo = {"cultura": cultura.strip().lower(), "quantidade": quantidade, "unidade": unidade}
    try:
        resposta = requests.post(f"{_api()}/colheitas", json=corpo, timeout=10)
        resposta.raise_for_status()
    except requests.RequestException:
        return {"status": "erro", "mensagem": "Não consegui anotar agora."}

    # Também guarda na memória da conversa (o ADK preenche o tool_context sozinho).
    tool_context.state["ultima_colheita"] = corpo
    return {"status": "ok", "anotado": f"{quantidade:g} {unidade} de {cultura}"}
