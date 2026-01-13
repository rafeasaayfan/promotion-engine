import operator
from datetime import datetime
from models import Condition

class ConditionEvaluator:
    OPERATORS = {
        'EQUALS': operator.eq,
        'NOT_EQUALS': operator.ne,
        'GT': operator.gt,
        'GTE': operator.ge,
        'LT': operator.lt,
        'LTE': operator.le,
        'ENDS_WITH': lambda a, b: str(a).endswith(str(b)),
        'LT_DATE': lambda a, b: datetime.fromisoformat(a) < datetime.fromisoformat(b)
    }

    def get_field_value(self, context: dict, field: str):
        keys = field.split(".")
        current = context

        for key in keys:
            if isinstance(current, dict):
                current = current.get(key)
            else:
                return None
            if current is None:
                return None
        return current

    def evaluate_condition(self, condition: Condition, context: dict) -> bool:
        if condition.operator in ['AND', 'OR']:
            if not condition.rules:
                return True
            results = [self.evaluate_condition(rule, context) for rule in condition.rules]
            return all(results) if condition.operator == 'AND' else any(results)
        
        if not condition.field:
            return False
            
        val = self.get_field_value(context, condition.field)
        op_func = self.OPERATORS.get(condition.operator)
        
        if op_func:
            try:
                return op_func(val, condition.value)
            except Exception:
                return False
        
        return False
    
    def mentions_line_field(self, condition: Condition) -> bool:
        if condition.field and condition.field.startswith('line.'):
            return True

        if condition.rules:
            return any(self.mentions_line_field(rule) for rule in condition.rules)
            
        return False