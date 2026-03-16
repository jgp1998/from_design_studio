import { useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './views/LandingPage';
import { ClientNewBidding } from './views/ClientNewBidding';
import { ClientDashboard } from './views/ClientDashboard';
import { ProviderDashboard } from './views/ProviderDashboard';
import { ProviderOTDetail } from './views/ProviderOTDetail';
import { StoreCatalog } from './views/StoreCatalog';
import { ProductDetail } from './views/ProductDetail';
import { Checkout } from './views/Checkout';
import { UserRole, ViewType, CartItem } from './types';

function App() {
    const [currentView, setCurrentView] = useState<ViewType>('landing');
    const [currentRole, setCurrentRole] = useState<UserRole>('guest');
    const [selectedProductId, setSelectedProductId] = useState<string>('');
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
            case 'landing':
                return <LandingPage onViewChange={setCurrentView} />;
            case 'client-new-bidding':
                return <ClientNewBidding onViewChange={setCurrentView} />;
            case 'client-dashboard':
                return <ClientDashboard />;
            case 'provider-dashboard':
                return <ProviderDashboard onViewChange={setCurrentView} onSelectWO={setSelectedWOId} />;
            case 'provider-ot-detail':
                return <ProviderOTDetail selectedWOId={selectedWOId} onViewChange={setCurrentView} />;
            case 'store-catalog':
                return <StoreCatalog onViewChange={setCurrentView} onSelectProduct={setSelectedProductId} />;
            case 'store-product-detail':
                return <ProductDetail selectedProductId={selectedProductId} onViewChange={setCurrentView} onAddToCart={handleAddToCart} />;
            case 'checkout':
                return <Checkout cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} onClearCart={handleClearCart} />;
            default:
                return <LandingPage onViewChange={setCurrentView} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header
                currentView={currentView}
                currentRole={currentRole}
                onViewChange={setCurrentView}
                onRoleChange={setCurrentRole}
                cartItemCount={cartItems.length}
            />
            {renderView()}
        </div>
    );
}

export default App;
