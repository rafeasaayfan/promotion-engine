import { useEffect, useState } from "react";
import axios from "axios";
import { Select } from "../../../components/fields";
import { ShoppingCart, Plus, Minus, Trash2, Calculator, User, Package, Tag } from 'lucide-react';

export default function Customers({ selectedCustomer, setSelectedCustomer }) {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        async function fetchCustomers() {
            try {
                // const res = await axios.get("https://promotion-engine-production.up.railway.app/api/customers");
                const res = await axios.get("http://127.0.0.1:8000/api/customers");
                setCustomers(res.data);
            } catch (err) {
                console.error("Error fetching customers:", err);
            }
        }

        fetchCustomers();
    }, []);

    return (
        <div className="bg-white/50 rounded-md p-4 border border-black/8">
            <div className="flex items-center justify-between mb-4 border-b border-black/8 pb-3">
                <div className="flex items-center">
                    <ShoppingCart className="text-green-600 mr-2" />
                    <h2 className="text-xl font-semibold">Customers</h2>
                </div>
            </div>

            {/* Customer Selection */}
            <div className="mb-6">
                <div className="flex items-center mb-2">
                    <User className="text-purple-600 mr-2 w-4 h-4" />
                    <label className="font-medium text-gray-700">Select Customer</label>
                </div>
                <select
                    value={selectedCustomer?.id || ''}
                    onChange={(e) => {
                        const customer = customers.find(c => c.id === parseInt(e.target.value));
                        setSelectedCustomer(customer);
                    }}
                    className="w-full border cursor-pointer border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Choose a customer...</option>
                    {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                            {customer.email} ({customer.type}, {customer.loyalty_tier})
                        </option>
                    ))}
                </select>
                {selectedCustomer && (
                    <div className="mt-2 p-3 bg-white rounded-lg text-sm">
                        <p><strong>Type:</strong> {selectedCustomer.type}</p>
                        <p><strong>Loyalty:</strong> {selectedCustomer.loyalty_tier}</p>
                        <p><strong>Orders:</strong> {selectedCustomer.orders_count}</p>
                        <p><strong>City:</strong> {selectedCustomer.city}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
