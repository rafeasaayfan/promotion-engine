import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Calculator, User, Package, Tag } from 'lucide-react';
import Products from './sections/products';
import Customers from './sections/customers';
import Cart from './sections/cart';
import Result from './sections/result';
import axios from "axios";

const PromotionEngine = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(null);
  const [rules, setRules] = useState([]); // New state for rules
  const [cart, setCart] = useState({ lines: [] });
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Rules
        const res = await axios.get("http://127.0.0.1:8000/api/rules");
        setRules(res.data);

      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch initial data:", err);
      }
    };

    fetchData();
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => ({
      ...prevCart,
      lines: prevCart.lines.map(line =>
        line.productId === productId
          ? { ...line, quantity: newQuantity }
          : line
      )
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => ({
      ...prevCart,
      lines: prevCart.lines.filter(line => line.productId !== productId)
    }));
  };

  const evaluateCart = async () => {
    if (!selectedCustomer || cart.lines.length === 0 || rules.length === 0) {
      setError('Please select a customer, add items to cart, and ensure rules are loaded.');
      return;
    }

    setLoading(true);
    setError(null);

    const cartSubtotal = calculateCartTotal();
    const cartItemCount = cart.lines.reduce((count, line) => count + line.quantity, 0);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/evaluate', {
          cart: {
            lines: cart.lines.map(line => ({
              productId: line.productId,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
              categoryId: line.categoryId,
            })),
            subtotal: cartSubtotal,
            itemCount: cartItemCount,
          },
          customer: {
            id: selectedCustomer.id,
            email: selectedCustomer.email,
            type: selectedCustomer.type,
            city: selectedCustomer.city,
            loyaltyTier: selectedCustomer.loyalty_tier, 
            ordersCount: selectedCustomer.orders_count,
          },
          rules: rules, 
      });

      setEvaluation(response.data);

    } catch (err) {
      setError(err.message);
      console.error("Evaluation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart({ lines: [] });
    setEvaluation(null);
  };

  const calculateCartTotal = () => {
    return cart.lines.reduce((total, line) => total + (line.quantity * line.unitPrice), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-white p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-start mb-5">
          <h1 className="text-4xl font-bold text-black mb-1">B2B Promotion Engine</h1>
          <p className="text-gray-600">Advanced rule-based discount calculator</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Products Section */}
            <Products
              setCart={setCart}
            />

            {/* Customer Section */}
            <Customers
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
            />
          </div>

          <div className="lg:col-span-3 flex flex-col gap-5">
            {/* Cart */}
            <Cart
              loading={loading}
              cart={cart}
              calculateCartTotal={calculateCartTotal}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              evaluateCart={evaluateCart}
              selectedCustomer={selectedCustomer}
              clearCart={clearCart}
            />
            
            {/* Results Section */}
            <Result
              error={error}
              evaluation={evaluation}
              calculateCartTotal={calculateCartTotal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionEngine;