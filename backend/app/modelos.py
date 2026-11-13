from pydantic import BaseModel, Field


class Leitura(BaseModel):
    nivelCaixa: float = Field(ge=0, le=100)
    umidadeSolo: float = Field(ge=0, le=100)
    temSol: bool
    bomba: bool
    valvula: bool
    irrigando: bool
    chuvaAmanha: bool
    semaforo: str = Field(min_length=1)
    leituraLuz: int = Field(ge=0)


class NovaColheita(BaseModel):
    cultura: str = Field(min_length=1)
    quantidade: float = Field(gt=0)
    unidade: str = Field(min_length=1)
