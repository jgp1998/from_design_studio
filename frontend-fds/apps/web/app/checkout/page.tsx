'use client';

import { Checkout } from '../../src/components/features/Checkout';
import { useCartStore } from '../../src/store/cartStore';

export default function CheckoutPage() {
    const cartItems = useCartStore(state => state.cartItems);
    const removeFromCart = useCartStore(state => state.removeFromCart);
    const clearCart = useCartStore(state => state.clearCart);
    return <Checkout cartItems={cartItems} onRemoveFromCart={removeFromCart} onClearCart={clearCart} />;
}
