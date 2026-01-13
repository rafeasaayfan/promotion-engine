// import { useState } from "react";
import { Select } from "../../../components/fields";
import { ShoppingCart, Plus, Minus, Trash2, Calculator, User, Package, Tag } from 'lucide-react';

export default function Cart({ loading, cart, calculateCartTotal, updateQuantity, removeFromCart, evaluateCart, selectedCustomer, clearCart }) {
    return (
        <div className="bg-white rounded-md p-4 border border-black/8">
            <div className="flex items-center justify-between mb-4 border-b border-black/8 pb-3">
                <div className="flex items-center">
                    <ShoppingCart className="text-green-600 mr-2" />
                    <h2 className="text-xl font-semibold">Shopping Cart</h2>
                </div>

                {cart.lines.length > 0 && (
                    <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Clear cart"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Cart Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-4 max-h-40 overflow-auto">
                {cart.lines.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                ) : (
                    cart.lines.map(line => (
                        <div key={line.productId} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-medium text-gray-800">{line.productName}</h4>
                                    <p className="text-sm text-gray-500">${line.unitPrice} each</p>
                                </div>
                                <button
                                    onClick={() => removeFromCart(line.productId)}
                                    className="text-red-600 hover:text-red-800 p-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => updateQuantity(line.productId, line.quantity - 1)}
                                        className="bg-gray-200 hover:bg-gray-300 rounded-full p-1"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="font-medium px-3">{line.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(line.productId, line.quantity + 1)}
                                        className="bg-gray-200 hover:bg-gray-300 rounded-full p-1"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className="font-bold text-green-600">
                                    ${(line.quantity * line.unitPrice).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Cart Summary */}
            {cart.lines.length > 0 && (
                <div className="border-t border-black/8 pt-4">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold text-gray-700">Subtotal:</span>
                        <span className="font-bold text-xl">${calculateCartTotal().toFixed(2)}</span>
                    </div>
                    <button
                        onClick={evaluateCart}
                        disabled={loading || !selectedCustomer}
                        className="w-full bg-gradient-to-r text-sm cursor-pointer from-green-600 to-blue-600 text-white px-4 py-3 
                        rounded-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed 
                        flex items-center justify-center font-medium"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                Calculating...
                            </div>
                        ) : (
                            <>
                                <Calculator className="w-4 h-4 mr-2" />
                                Apply Promotions
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
