import operator
from datetime import datetime
from typing import Any, Dict
from engineClasses.condition_evaluator import ConditionEvaluator
from engineClasses.action_applier import ActionApplier
from engineClasses.cart_calculator import CartCalculator
from models import EvaluationRequest, EvaluationResponse, AppliedRule

class RuleEngine:
    def __init__(self):
        self.condition_evaluator = ConditionEvaluator()
        self.action_applier = ActionApplier()
        self.cart_calculator = CartCalculator()

    def evaluate(self, request: EvaluationRequest) -> EvaluationResponse:
        applied_rules = []
        line_discounts = {}
        
        # Sort rules by salience (lowest first)
        sorted_rules = sorted(request.rules, key=lambda r: r.salience)
        cart_metrics = self.cart_calculator.calculate_cart_metrics(request.cart)

        base_context = {
            "customer": request.customer.dict(),
            "cart": {**request.cart.dict(), **cart_metrics},
            "now": datetime.utcnow().isoformat()
        }

        # Keep a running total for each line, initialized to the original total
        line_current_totals = {idx: line.quantity * line.unitPrice for idx, line in enumerate(request.cart.lines)}
        
        # Track lines that have received a non-stackable discount
        locked_lines = set()
        
        # Phase 1: Process all line-scoped rules sequentially
        for rule in sorted_rules:
            is_line_scoped = (
                (hasattr(rule.action, 'target') and rule.action.target == 'line') or
                self.condition_evaluator.mentions_line_field(rule.condition)
            )
            
            if not is_line_scoped:
                continue # Skip cart-level rules for now
                
            for idx, line in enumerate(request.cart.lines):
                if idx in locked_lines:
                    continue
                    
                context = {**base_context, "line": line.dict()}
                condition_result = self.condition_evaluator.evaluate_condition(rule.condition, context)
                
                if condition_result:
                    discount = self.action_applier.calculate_action_discount(rule.action, line.dict(), context, line_current_totals[idx])
                    
                    if discount > 0:
                        line_current_totals[idx] -= discount
                        line_discounts[idx] = line_discounts.get(idx, 0) + discount
                        
                        applied_rules.append(AppliedRule(
                            ruleId=rule.id, 
                            ruleName=rule.name, 
                            discount=round(discount, 2)
                        ))
                        
                        if not rule.stackable:
                            locked_lines.add(idx)

        cart_current_subtotal = sum(line_current_totals.values())
        cart_discount = 0

        # # Phase 2: Process all cart-scoped rules sequentially
        for rule in sorted_rules:
            is_line_scoped = (
                (hasattr(rule.action, 'target') and rule.action.target == 'line') or
                self.condition_evaluator.mentions_line_field(rule.condition)
            )

            if is_line_scoped:
                continue # Skip line-level rules in this phase
            
            context = base_context
            condition_result = self.condition_evaluator.evaluate_condition(rule.condition, context)
            
            if condition_result:
                mock_line = {"unitPrice": cart_current_subtotal, "quantity": 1}
                discount = self.action_applier.calculate_action_discount(rule.action, mock_line, context, cart_current_subtotal)
                
                if discount > 0:
                    cart_current_subtotal -= discount
                    cart_discount += discount
                    
                    applied_rules.append(AppliedRule(
                        ruleId=rule.id, 
                        ruleName=rule.name, 
                        discount=round(discount, 2)
                    ))
                    
                    if not rule.stackable:
                        break

        # Calculate final totals from the final running totals
        original_subtotal = self.cart_calculator.calculate_subtotal_from_lines(request.cart)
        total_discount = cart_discount + sum(line_discounts.values())
        final_total = max(0, original_subtotal - total_discount)

        return EvaluationResponse(
            appliedRules=applied_rules,
            cartDiscount=round(cart_discount, 2),
            lineDiscounts={str(k): round(v, 2) for k, v in line_discounts.items()},
            subtotal=round(original_subtotal, 2),
            totalDiscount=round(total_discount, 2),
            finalTotal=round(final_total, 2)
        )