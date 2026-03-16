import { useState } from 'react';
import { Header } from './components/Header';

import { ClientNewBidding } from './views/ClientNewBidding';
import { ClientDashboard } from './views/ClientDashboard';
import { ProviderDashboard } from './views/ProviderDashboard';
import { ProviderOTDetail } from './views/ProviderOTDetail';
import { Checkout } from './views/Checkout';
import { UserRole, ViewType, CartItem } from './types';

function App() {
    const [currentView, setCurrentView] = useState<ViewType>('landing');
    const [currentRole, setCurrentRole] = useState<UserRole>('guest');
    const [selectedProductId, setSelectedProductId] = useState<string>('');

    const handleViewChange = (view: ViewType) => {
        if(view === 'landing') {
           window.location.href = process.env.NEXT_PUBLIC_LANDING_URL || 'http://localhost:3030';
        } else if (view.startsWith('store-')) {
            window.location.href = process.env.NEXT_PUBLIC_SHOP_URL || 'http://localhost:3032';
        } else {
            setCurrentView(view);
        }
    };
    const [selectedWOId, setSelectedWOId] = useState<string>('');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const handleAddToCart = (item: CartItem) => {
        setCartItems([...cartItems, item]);
    };

    const handleRemoveFromCart = (itemId: string) => {
        setCartItems(cartItems.filter(item => item.id !== itemId));
    };

    const handleClearCart = () => {
        setCartItems([]);
    };

    const renderView = () => {
        switch (currentView) {
            case 'client-new-bidding':
                return <ClientNewBidding onViewChange={setCurrentView} />;
            case 'client-dashboard':
                return <ClientDashboard />;
            case 'provider-dashboard':
                return <ProviderDashboard onViewChange={setCurrentView} onSelectWO={setSelectedWOId} />;
            case 'provider-ot-detail':
                return <ProviderOTDetail selectedWOId={selectedWOId} onViewChange={setCurrentView} />;
            case 'checkout':
                return <Checkout cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} onClearCart={handleClearCart} />;
            default:
                return <ClientDashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header
                currentView={currentView}
                currentRole={currentRole}
                onViewChange={handleViewChange}
                onRoleChange={setCurrentRole}
                cartItemCount={cartItems.length}
            />
            {renderView()}
        </div>
    );
}

export default App;
