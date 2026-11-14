import pytest
from fastapi.testclient import TestClient

from app.estado import reiniciar
from app.principal import app


@pytest.fixture
def cliente():
    reiniciar()
    return TestClient(app)
