from typing import List, Optional, Union, Dict
import json
from pydantic import BaseModel, validator, root_validator

class CartLine(BaseModel):
    productId: int
    quantity: int
    unitPrice: float
    categoryId: Optional[int] = None

class Cart(BaseModel):
    lines: List[CartLine]
    subtotal: float
    itemCount: int

class Customer(BaseModel):
    id: Union[str, int]
    email: str
    type: str
    city: Optional[str] = None
    loyaltyTier: Optional[str] = "none"
    ordersCount: Optional[int] = 0

def parse_json_recursively(obj):
    """Recursively parse JSON strings in nested dictionaries"""
    if isinstance(obj, str):
        try:
            parsed = json.loads(obj)
            # Recursively parse the result in case there are nested JSON strings
            return parse_json_recursively(parsed)
        except (json.JSONDecodeError, TypeError):
            return obj
    elif isinstance(obj, dict):
        return {key: parse_json_recursively(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [parse_json_recursively(item) for item in obj]
    else:
        return obj

class Condition(BaseModel):
    operator: str
    field: Optional[str] = None
    value: Optional[Union[str, int, float, bool]] = None
    rules: Optional[List["Condition"]] = None  
    
    @root_validator(pre=True)
    def parse_nested_json(cls, values):
        return parse_json_recursively(values)

Condition.update_forward_refs()

class Action(BaseModel):
    type: str
    target: Optional[str] = None 
    percent: Optional[float] = None
    quantity: Optional[int] = None
    condition: Optional[Condition] = None
    ifTrue: Optional["Action"] = None
    ifFalse: Optional["Action"] = None
    
    @root_validator(pre=True)
    def parse_nested_json(cls, values):
        return parse_json_recursively(values)

Action.update_forward_refs()

class Rule(BaseModel):
    id: int
    name: str
    salience: int
    stackable: bool
    condition: Condition
    action: Action
    
    @root_validator(pre=True)
    def parse_json_fields(cls, values):
        """Parse JSON strings in condition and action fields before field validation"""
        return parse_json_recursively(values)

class EvaluationRequest(BaseModel):
    cart: Cart
    customer: Customer
    rules: List[Rule]

class AppliedRule(BaseModel):
    ruleId: int
    ruleName: str
    discount: float

class EvaluationResponse(BaseModel):
    appliedRules: List[AppliedRule]
    cartDiscount: float
    lineDiscounts: Dict[str, float]
    subtotal: float  
    totalDiscount: float  
    finalTotal: float  