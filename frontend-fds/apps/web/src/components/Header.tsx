import { ShoppingCart, Menu, X, Package, FileText, Store } from 'lucide-react';

import { useState } from 'react';
import { UserRole, ViewType } from '../types';

interface HeaderProps {
    currentView: ViewType;
    currentRole: UserRole;
    onViewChange: (view: ViewType) => void;
    onRoleChange: (role: UserRole) => void;
    cartItemCount: number;
}

export function Header({ currentView, currentRole, onViewChange, onRoleChange, cartItemCount }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <button
                            onClick={() => onViewChange('landing')}
                            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                        >
                            <Package className="w-8 h-8 text-indigo-400" />
                            <span className="font-bold text-xl">FDS</span>
                        </button>

                        <nav className="hidden md:flex space-x-6">
                            <button
                                onClick={() => onViewChange('store-catalog')}
                                className={`flex items-center space-x-1 hover:text-indigo-400 transition-colors ${currentView.startsWith('store') ? 'text-indigo-400' : ''
                                    }`}
                            >
                                <Store className="w-4 h-4" />
                                <span>Store</span>
                            </button>

                            {currentRole === 'client' && (
                                <>
                                    <button
                                        onClick={() => onViewChange('client-new-bidding')}
                                        className={`flex items-center space-x-1 hover:text-indigo-400 transition-colors ${currentView === 'client-new-bidding' ? 'text-indigo-400' : ''
                                            }`}
                                    >
                                        <FileText className="w-4 h-4" />
                                        <span>Request Quote</span>
                                    </button>
                                    <button
                                        onClick={() => onViewChange('client-dashboard')}
                                        className={`flex items-center space-x-1 hover:text-indigo-400 transition-colors ${currentView === 'client-dashboard' ? 'text-indigo-400' : ''
                                            }`}
                                    >
                                        <span>My Orders</span>
                                    </button>
                                </>
                            )}

                            {currentRole === 'provider' && (
                                <button
                                    onClick={() => onViewChange('provider-dashboard')}
                                    className={`flex items-center space-x-1 hover:text-indigo-400 transition-colors ${currentView.startsWith('provider') ? 'text-indigo-400' : ''
                                        }`}
                                >
                                    <span>Available Jobs</span>
                                </button>
                            )}
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">
                        <select
                            value={currentRole}
                            onChange={(e) => onRoleChange(e.target.value as UserRole)}
                            className="hidden md:block bg-slate-800 text-white px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="guest">Guest</option>
                            <option value="client">Client</option>
                            <option value="provider">Provider</option>
                        </select>

                        <button
                            onClick={() => onViewChange('checkout')}
                            className="relative hover:text-indigo-400 transition-colors"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>

                        <button
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-slate-800">
                        <nav className="flex flex-col space-y-3">
                            <button
                                onClick={() => {
                                    onViewChange('store-catalog');
                                    setMobileMenuOpen(false);
                                }}
                                className="text-left hover:text-indigo-400 transition-colors"
                            >
                                Store
                            </button>

                            {currentRole === 'client' && (
                                <>
                                    <button
                                        onClick={() => {
                                            onViewChange('client-new-bidding');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="text-left hover:text-indigo-400 transition-colors"
                                    >
                                        Request Quote
                                    </button>
                                    <button
                                        onClick={() => {
                                            onViewChange('client-dashboard');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="text-left hover:text-indigo-400 transition-colors"
                                    >
                                        My Orders
                                    </button>
                                </>
                            )}

                            {currentRole === 'provider' && (
                                <button
                                    onClick={() => {
                                        onViewChange('provider-dashboard');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="text-left hover:text-indigo-400 transition-colors"
                                >
                                    Available Jobs
                                </button>
                            )}

                            <select
                                value={currentRole}
                                onChange={(e) => {
                                    onRoleChange(e.target.value as UserRole);
                                    setMobileMenuOpen(false);
                                }}
                                className="bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-700"
                            >
                                <option value="guest">Guest</option>
                                <option value="client">Client</option>
                                <option value="provider">Provider</option>
                            </select>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
