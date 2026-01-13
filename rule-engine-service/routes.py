from fastapi import APIRouter, HTTPException
from models import EvaluationRequest, EvaluationResponse
from engine import RuleEngine

router = APIRouter() # make new router

@router.post("/engine/evaluate", response_model=EvaluationResponse) # evaluate rules
async def evaluate_rules(request: EvaluationRequest): 
    try:
        engine = RuleEngine()  # Create instance of RuleEngine
        return engine.evaluate(request)  
    except Exception as e:
        print(f"Error in rule evaluation: {e}")  # Add logging
        raise HTTPException(status_code=400, detail=str(e))
