import { useEffect, useState } from "react";
import axios from "axios";
import { Select, Input } from "../../../components/fields";
import { ShoppingCart, Plus, Minus, Trash2, Calculator, User, Package, Tag } from 'lucide-react';


export default function Products({ setCart }) {
  const [products, setProducts] = useState([]);

    // fetch products from API
    useEffect(() => {
        async function fetchProducts() {
            try {
                // const res = await axios.get("https://promotion-engine-production.up.railway.app/api/products");
                const res = await axios.get("http://127.0.0.1:8000/api/products");
                setProducts(res.data);

            } catch (err) {
                console.error("Error fetching products:", err);
            }
        }

        fetchProducts();
    }, []);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingLine = prevCart.lines.find(line => line.productId === product.id);

            if (existingLine) {
                return {
                    ...prevCart,
                    lines: prevCart.lines.map(line =>
                        line.productId === product.id
                            ? { ...line, quantity: line.quantity + 1 }
                            : line
                    )
                };
            } else {
                return {
                    ...prevCart,
                    lines: [...prevCart.lines, {
                        productId: product.id,
                        quantity: 1,
                        productName: product.name,
                        unitPrice: product.unit_price,
                        categoryId: product.category_id
                    }]
                };
            }
        });
    };

    return (
        <div className="bg-white/50 rounded-md p-4 border border-black/8">
            <div className="flex gap-2 items-center mb-4 border-b border-black/8 pb-3">
                <Package className="text-blue-600" />
                <h2 className="text-xl font-semibold">Products</h2>
            </div>

            <div className="max-h-80 overflow-y-auto">
                <div className="grid grid-cols-1 gap-3 ">
                    {products.map(product => (
                        <div key={product.id} className="w-full bg-white flex justify-between gap-3 border border-black/8 rounded-lg p-4 hover:shadow transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-black">{product.name}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-2"><span>Category ID:</span>{product.category_id}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="font-bold flex items-center gap-2">
                                    <span className="text-sm">Price:</span>
                                    <span className="text-green-600">${product.unit_price}</span>
                                </div>

                                <div className="border-t border-black/8 pt-3" >
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-full bg-blue-600 text-sm cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add to Cart
                                    </button>

                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
