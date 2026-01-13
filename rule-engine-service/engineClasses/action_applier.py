from models import Action, Condition
from engineClasses.condition_evaluator import ConditionEvaluator

class ActionApplier:
    def __init__(self):
        self.condition_evaluator = ConditionEvaluator()

    def calculate_action_discount(self, action: Action, line: dict, context: dict, base_price: float) -> float:
        if action.type == "applyPercent":
            percent = action.percent if action.percent is not None else 0
            return base_price * (percent / 100)
            # return base_price * (action.percent / 100)

        elif action.type == "applyFreeUnits":
            return line["unitPrice"] * action.quantity

        elif action.type == "ifElse":
            if action.condition and self.condition_evaluator.evaluate_condition(action.condition, context):
                return self.calculate_action_discount(action.ifTrue, line, context, base_price) if action.ifTrue else 0.0
            else:
                return self.calculate_action_discount(action.ifFalse, line, context, base_price) if action.ifFalse else 0.0

        return 0.0