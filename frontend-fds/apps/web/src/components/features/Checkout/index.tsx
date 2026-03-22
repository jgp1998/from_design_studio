'use client';

import { useState } from 'react';
import { CreditCard, Check } from 'lucide-react';
import { API } from '../../../api';
import type { CartItem } from '../../../types';
import { CartItemList } from './CartItemList';
import { CheckoutForm, type ShippingData } from './CheckoutForm';
import { OrderSummary } from './OrderSummary';

interface CheckoutProps {
    cartItems: CartItem[];
    onRemoveFromCart: (itemId: string) => void;
    onClearCart: () => void;
}

export function Checkout({ cartItems, onRemoveFromCart, onClearCart }: CheckoutProps) {
    const [shippingData, setShippingData] = useState<ShippingData>({
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

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        try {
            // Process the checkout for the first item as a POC, or iterate
            const firstItem = cartItems[0];
            if (firstItem) {
                 const res = await API.Checkout.generateCheckout(firstItem.id);
                 console.log("Checkout generated:", res?.payment_url);
                 // if (res?.payment_url) window.location.href = res.payment_url;
            }

            setShowSuccess(true);
            setTimeout(() => {
                onClearCart();
                setShowSuccess(false);
            }, 3000);
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Error processing checkout");
        }
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
                        <CartItemList 
                           cartItems={cartItems} 
                           onRemoveFromCart={onRemoveFromCart} 
                        />
                        <CheckoutForm 
                           shippingData={shippingData} 
                           setShippingData={setShippingData} 
                           onSubmit={handleSubmit} 
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <OrderSummary 
                           subtotal={subtotal} 
                           shippingCost={shippingCost} 
                           total={total} 
                           onPlaceOrder={handleSubmit} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
