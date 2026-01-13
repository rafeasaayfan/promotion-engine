import { Select } from "../../../components/fields";
import { ShoppingCart, Plus, Minus, Trash2, Calculator, User, Package, Tag } from 'lucide-react';

export default function Result({ error, evaluation }) {
    const getAppliedRules = () => {
        if (!evaluation) return [];
        return evaluation.appliedRules || [];
    };

    const appliedRules = getAppliedRules();

    return (
        <div className="bg-white rounded-md p-4 border border-black/8">
            <div className="flex items-center mb-4 border-b border-black/8 pb-3">
                <Tag className="text-orange-600 mr-2" />
                <h2 className="text-xl font-semibold">Promotion Results</h2>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800">{error}</p>
                </div>
            )}

            {evaluation ? (
                <div className="space-y-4">
                    {/* Applied Rules */}
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-3">Applied Promotions</h3>
                        {appliedRules.length === 0 ? (
                            <p className="text-gray-500">No promotions applied</p>
                        ) : (
                            <div className="space-y-2">
                                {appliedRules.map((rule, index) => (
                                    <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-green-800">{rule.ruleName}</p>
                                            </div>
                                            <span className="font-bold text-green-700">
                                                -${(rule.discount || 0).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="border-t pt-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal:</span>
                                <span>${(evaluation.subtotal || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-red-600">
                                <span>Total Discount:</span>
                                <span>-${(evaluation.totalDiscount || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-2">
                                <span>Final Total:</span>
                                <span className="text-green-600">${(evaluation.finalTotal || 0).toFixed(2)}</span>
                            </div>
                        </div>

                        {evaluation.totalDiscount > 0 && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-800 font-medium">
                                    🎉 You saved ${(evaluation.totalDiscount || 0).toFixed(2)} with these promotions!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Add items and select a customer to see promotions</p>
                </div>
            )}
        </div>
    );
}