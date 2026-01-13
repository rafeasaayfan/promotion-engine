from fastapi import FastAPI
from routes import router as rule_router

app = FastAPI(title="Rule Engine Service", version="1.0.0") # make new app
app.include_router(rule_router) # include the router

@app.get("/health") # health check
async def health_check():
    return {"status": "healthy", "service": "rule-engine"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
