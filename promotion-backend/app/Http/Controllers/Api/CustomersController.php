<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomersController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $customers = Customer::all();    
            return response()->json($customers);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to get customers'], 500);
        }        
    }
}
