from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def checkit():
    return "Hey there!"