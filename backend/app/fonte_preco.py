import json
from abc import ABC, abstractmethod
from pathlib import Path

PASTA_DADOS = Path(__file__).resolve().parent.parent / "dados"


class FonteDePrecoReferencia(ABC):
    """Preço de atacado de referência. Troque a implementação para usar uma API real."""

    @abstractmethod
    def buscar(self, cultura: str) -> dict | None: ...


class ReferenciaEmArquivo(FonteDePrecoReferencia):
    def __init__(self, arquivo: Path = PASTA_DADOS / "precos_referencia.json"):
        registros = json.loads(arquivo.read_text(encoding="utf-8"))
        self._por_cultura = {r["cultura"]: r for r in registros}

    def buscar(self, cultura: str) -> dict | None:
        return self._por_cultura.get(cultura.lower())


fonte_referencia: FonteDePrecoReferencia = ReferenciaEmArquivo()
