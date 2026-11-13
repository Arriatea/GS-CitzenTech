CAPACIDADE_CAIXA_L = 10_000
PESSOAS = 60
LITROS_POR_PESSOA_DIA = 20
RESERVA = 0.2


def classificar_caixa(nivel_pct: float) -> str:
    if nivel_pct >= 70:
        return "cheia"
    if nivel_pct >= 30:
        return "metade"
    return "pouca"


def calcular_dias_para_beber(nivel_pct: float) -> int:
    litros_uteis = nivel_pct / 100 * CAPACIDADE_CAIXA_L * (1 - RESERVA)
    return max(0, int(litros_uteis // (PESSOAS * LITROS_POR_PESSOA_DIA)))


def atualizar_agua(agua: dict, leitura: dict) -> None:
    agua["caixa"] = classificar_caixa(leitura["nivelCaixa"])
    agua["fonte"] = "poco" if leitura["temSol"] else "caixa"
    agua["diasParaBeber"] = calcular_dias_para_beber(leitura["nivelCaixa"])
    if leitura["chuvaAmanha"]:
        agua["amanha"] = "Vai chover amanhã. Não precisa molhar a horta."
    else:
        agua["amanha"] = "Não vai chover amanhã. Pode molhar a horta."
