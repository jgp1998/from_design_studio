'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Menu, X, Package } from 'lucide-react';
import { useUserStore } from '../../../store/userStore';
import { useCartStore } from '../../../store/cartStore';
import { NavigationLinks } from './NavigationLinks';
import { MobileMenu } from './MobileMenu';
import type { UserRole } from '../../../types';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Zustand Stores
  const role = useUserStore((state) => state.role);
  const setRole = useUserStore((state) => state.setRole);
  const cartItems = useCartStore((state) => state.cartItems);
  
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setRole('guest');
    router.push('/');
  };

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Package className="w-8 h-8 text-indigo-400" />
              <span className="font-bold text-xl">FDS</span>
            </Link>

            <nav className="hidden md:flex space-x-6 items-center">
              <NavigationLinks role={role} />
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {role === 'guest' ? (
              <Link href="/login" className="hidden md:block text-sm font-medium hover:text-indigo-400 transition-colors">
                Sign In
              </Link>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-300 capitalize bg-slate-800 px-3 py-1 rounded-full">{role}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium hover:text-indigo-400 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}

            <Link href="/checkout" className="relative hover:text-indigo-400 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <MobileMenu 
           isOpen={mobileMenuOpen} 
           role={role} 
           onClose={() => setMobileMenuOpen(false)} 
           onLogout={handleLogout} 
        />
      </div>
    </header>
  );
}
