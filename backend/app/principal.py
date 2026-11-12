from fastapi import FastAPI

app = FastAPI(title="Gota a Gota")


@app.get("/saude")
def saude():
    return {"ok": True}
