<?php

namespace App\Http\Controllers\Api\PromotionRules;

use App\Http\Controllers\Controller;
use App\Models\Rule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\PromotionRules\RulesRequest;

class RulesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $rules = Rule::orderBySalience()->get();
            return response()->json($rules);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to get rules'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RulesRequest $request): JsonResponse
    {
        $data = $request->validated();

        try {
            Rule::create($data);
            return response()->json(['message' => 'Rule created successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create rule'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Rule $rule): JsonResponse
    {
        try {
            return response()->json($rule);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to show rule'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RulesRequest $request, Rule $rule): JsonResponse
    {
        $data = $request->validated();
        if (isset($data['condition'])) {
            $data['condition'] = json_decode($data['condition'], true);
        }
        if (isset($data['action'])) {
            $data['action'] = json_decode($data['action'], true);
        }

        try {
            $rule->update($data);
            return response()->json(['message' => 'Rule updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update rule'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rule $rule): JsonResponse
    {
        try {
            $rule->delete();
            return response()->json(['message' => 'Rule deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete rule'], 500);
        }
    }
}
