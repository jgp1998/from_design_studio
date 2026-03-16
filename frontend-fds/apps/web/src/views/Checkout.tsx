import { Trash2, CreditCard, Check } from 'lucide-react';
import { useState } from 'react';
import { CartItem } from '../types';

interface CheckoutProps {
    cartItems: CartItem[];
    onRemoveFromCart: (itemId: string) => void;
    onClearCart: () => void;
}

export function Checkout({ cartItems, onRemoveFromCart, onClearCart }: CheckoutProps) {
    const [shippingData, setShippingData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = cartItems.length > 0 ? 15 : 0;
    const total = subtotal + shippingCost;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuccess(true);
        setTimeout(() => {
            onClearCart();
            setShowSuccess(false);
        }, 3000);
    };

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
                        <Check className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">Order Placed Successfully!</h2>
                    <p className="text-slate-600 mb-6">
                        Thank you for your order. You'll receive a confirmation email shortly with tracking information.
                    </p>
                    <p className="text-sm text-slate-500">Order ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 text-slate-400 rounded-full mb-6">
                            <CreditCard className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">Your cart is empty</h2>
                        <p className="text-slate-600">Add some products or request custom manufacturing to get started</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-slate-900 mb-4">Cart Items</h2>
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900">{item.name}</h3>
                                            {item.configuration && (
                                                <p className="text-sm text-slate-600 mt-1">
                                                    {item.configuration.size && `Size: ${item.configuration.size} • `}
                                                    {item.configuration.color && `Color: ${item.configuration.color} • `}
                                                    {item.configuration.material && `Material: ${item.configuration.material}`}
                                                </p>
                                            )}
                                            <p className="text-sm text-slate-500 mt-1">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-slate-900">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-slate-500">${item.price} each</p>
                                        </div>
                                        <button
                                            onClick={() => onRemoveFromCart(item.id)}
                                            className="text-red-600 hover:text-red-800 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-slate-900 mb-4">Shipping & Billing Information</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={shippingData.fullName}
                                            onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={shippingData.email}
                                            onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={shippingData.phone}
                                        onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={shippingData.address}
                                        onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={shippingData.city}
                                            onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            State/Province *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={shippingData.state}
                                            onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            ZIP/Postal Code *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={shippingData.zipCode}
                                            onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Country *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={shippingData.country}
                                            onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-lg transition-all shadow-lg text-lg mt-6 hidden lg:block"
                                >
                                    Place Order
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                            <h2 className="text-xl font-semibold text-slate-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-slate-700">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-700">
                                    <span>Shipping (FDS)</span>
                                    <span className="font-semibold">${shippingCost.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-slate-200 pt-3 flex justify-between">
                                    <span className="text-lg font-bold text-slate-900">Total</span>
                                    <span className="text-2xl font-bold text-indigo-600">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-lg transition-all shadow-lg text-lg flex items-center justify-center space-x-2"
                            >
                                <CreditCard className="w-5 h-5" />
                                <span>Place Order</span>
                            </button>

                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    All transactions are secure and encrypted. Your order will be processed within 24 hours.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
