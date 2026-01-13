<?php

namespace App\Http\Controllers\Api\PromotionRules;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RulesEvaluationController extends Controller
{ 
    public function evaluate(Request $request): JsonResponse
    {
        $data = $request->all();

        try {
            $response = Http::post(env('RULE_ENGINE_SERVICE_URL', 'http://localhost:8001/engine/evaluate'), $data);

            if ($response->successful()) {
                return response()->json($response->json());
            } else {
                return response()->json(['error' => 'Rule engine service error', 'details' => $response->json()], $response->status());
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Could not connect to rule engine service', 'details' => $e->getMessage()], 500);
        }
    }
}
