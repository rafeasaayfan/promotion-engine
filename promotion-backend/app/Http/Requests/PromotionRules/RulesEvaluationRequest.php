<?php

namespace App\Http\Requests\PromotionRules;

use Illuminate\Foundation\Http\FormRequest;

class RulesEvaluationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // 'cart' => 'required|array',
            // 'cart.lines' => 'required|array',
            // 'cart.lines.*.productId' => 'required|integer',
            // 'cart.lines.*.quantity' => 'required|integer|min:1',
            // 'cart.lines.*.unitPrice' => 'required|numeric|min:0',
            // 'cart.lines.*.categoryId' => 'required|integer',
            // 'cart.subtotal' => 'required|numeric|min:0',
            // 'cart.itemCount' => 'required|integer|min:0',

            // 'customer' => 'required|array',
            // 'customer.id' => 'required',
            // 'customer.email' => 'required|string|email',
            // 'customer.type' => 'required|string',
            // 'customer.city' => 'required|string',
            // 'customer.loyaltyTier' => 'sometimes|string',
            // 'customer.ordersCount' => 'sometimes|integer|min:0',

            // 'rules' => 'required|array',
            // 'rules.*.id' => 'required|integer',
            // 'rules.*.name' => 'required|string',
            // 'rules.*.salience' => 'required|integer',
            // 'rules.*.stackable' => 'required|boolean',
        
            // // Condition validation
            // 'rules.*.condition' => 'required|array',
            // 'rules.*.condition.operator' => 'required|string',
            // 'rules.*.condition.field' => 'sometimes|string',
            // 'rules.*.condition.value' => 'sometimes',
            // 'rules.*.condition.rules' => 'sometimes|array',
            // 'rules.*.condition.rules.*.field' => 'required_with:rules.*.condition.rules|string',
            // 'rules.*.condition.rules.*.operator' => 'required_with:rules.*.condition.rules|string',
            // 'rules.*.condition.rules.*.value' => 'required_with:rules.*.condition.rules',
        
            // // Action validation
            // 'rules.*.action' => 'required|array',
            // 'rules.*.action.type' => 'required|string',
            // 'rules.*.action.target' => 'sometimes|string',
            // 'rules.*.action.percent' => 'sometimes|numeric',
            // 'rules.*.action.quantity' => 'sometimes|integer',
        
            // // ifElse action support
            // 'rules.*.action.condition' => 'sometimes|array',
            // 'rules.*.action.condition.field' => 'required_with:rules.*.action.condition|string',
            // 'rules.*.action.condition.operator' => 'required_with:rules.*.action.condition|string',
            // 'rules.*.action.condition.value' => 'required_with:rules.*.action.condition',
        
            // 'rules.*.action.ifTrue' => 'sometimes|array',
            // 'rules.*.action.ifTrue.type' => 'required_with:rules.*.action.ifTrue|string',
            // 'rules.*.action.ifTrue.target' => 'required_with:rules.*.action.ifTrue|string',
            // 'rules.*.action.ifTrue.percent' => 'required_with:rules.*.action.ifTrue|numeric',
        
            // 'rules.*.action.ifFalse' => 'sometimes|array',
            // 'rules.*.action.ifFalse.type' => 'required_with:rules.*.action.ifFalse|string',
            // 'rules.*.action.ifFalse.target' => 'required_with:rules.*.action.ifFalse|string',
            // 'rules.*.action.ifFalse.percent' => 'required_with:rules.*.action.ifFalse|numeric',
        ];
    }
}
