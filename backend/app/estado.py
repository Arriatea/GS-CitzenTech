import json
from pathlib import Path

# Todos os dados são simulados e ficam só em memória; reiniciar o servidor volta ao estado inicial.
ARQUIVO_DADOS = Path(__file__).resolve().parent.parent / "dados_iniciais.json"

estado: dict = {}


def reiniciar():
    estado.clear()
    estado.update(json.loads(ARQUIVO_DADOS.read_text(encoding="utf-8")))
    estado["ultimaLeitura"] = None
    estado["colheitas"] = []


reiniciar()
