import json

from app.estado import estado
from app.fonte_preco import PASTA_DADOS, FonteDePrecoReferencia, fonte_referencia

MARGEM_SOBRE_CUSTO = 1.3
MARGEM_SOBRE_ATACADO = 1.2

REGRA = (
    "Com comerciantes: o maior valor entre custo por unidade × 1,3, a média dos comerciantes locais "
    "e o preço de atacado da Ceasa (piso). Sem comerciantes: o maior valor entre custo por unidade × 1,3 "
    "e o atacado da Ceasa × 1,2."
)

_custos = {c["cultura"]: c for c in json.loads((PASTA_DADOS / "custos_producao.json").read_text(encoding="utf-8"))["culturas"]}


def custo_por_unidade(custo: dict) -> float:
    total = custo["sementes"] + custo["adubo"] + custo["horas_trabalho"] * custo["valor_hora"]
    return total / custo["producao_por_ciclo"]


def calcular_preco_minimo(custo_unidade: float | None, media_comerciantes: float | None, preco_atacado: float | None):
    candidatos = {}
    if custo_unidade is not None:
        candidatos["custo_por_unidade_x_1_3"] = custo_unidade * MARGEM_SOBRE_CUSTO
    if media_comerciantes is not None:
        candidatos["media_comerciantes_locais"] = media_comerciantes
        if preco_atacado is not None:
            candidatos["preco_atacado_ceasa"] = preco_atacado
    elif preco_atacado is not None:
        candidatos["preco_atacado_ceasa_x_1_2"] = preco_atacado * MARGEM_SOBRE_ATACADO
    if not candidatos:
        return None, None
    criterio = max(candidatos, key=candidatos.get)
    return round(candidatos[criterio], 2), criterio


def preco_calculado(produto: dict, fonte: FonteDePrecoReferencia = fonte_referencia) -> dict:
    cultura = produto["id"]
    custo = _custos.get(cultura)
    custo_unidade = custo_por_unidade(custo) if custo else None
    locais = [p["preco"] for p in estado["precosLocais"] if p["cultura"] == cultura]
    media = sum(locais) / len(locais) if locais else None
    referencia = fonte.buscar(cultura)
    atacado = referencia["preco_atacado"] if referencia else None

    valor, criterio = calcular_preco_minimo(custo_unidade, media, atacado)
    if valor is None:
        valor, criterio = produto["valor"], "preco_cadastrado"

    return {
        **produto,
        "valor": valor,
        "preco_minimo": valor,
        "como_calculamos": {
            "preco_atacado_ceasa": atacado,
            "fonte_ceasa": referencia["fonte"] if referencia else None,
            "data_consulta_ceasa": referencia["data_consulta"] if referencia else None,
            "media_comerciantes_locais": round(media, 2) if media is not None else None,
            "comerciantes_considerados": len(locais),
            "custo_por_unidade": round(custo_unidade, 2) if custo_unidade is not None else None,
            "regra": REGRA,
            "valor_escolhido": criterio,
        },
    }
