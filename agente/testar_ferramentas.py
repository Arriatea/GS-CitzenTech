"""
Testa as ferramentas SEM chamar a IA, direto contra o backend.

1. Suba o backend (pasta backend/).
2. Na pasta agente/, rode:  python testar_ferramentas.py
"""

from gota_agente.ferramentas import (
    preco_de_venda,
    registrar_colheita,
    ver_agua,
    ver_aulas,
    ver_canteiros,
    ver_compradores,
)


class ContextoFalso:
    """Imita o ToolContext do ADK: só precisamos do 'state' (memória da conversa)."""

    def __init__(self):
        self.state = {}


print("ver_agua():", ver_agua())
print("ver_canteiros():", ver_canteiros())
print("preco_de_venda('Alface'):", preco_de_venda("Alface"))
print("preco_de_venda('mandioca'):", preco_de_venda("mandioca"))
print("ver_compradores():", ver_compradores())
print("ver_aulas():", ver_aulas())
print("registrar_colheita:", registrar_colheita("alface", 15, "pés", ContextoFalso()))
