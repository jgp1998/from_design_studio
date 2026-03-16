"use client";

import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Product } from '@repo/ui/types';
import { mockProducts } from '@repo/ui/mockData';
import { Header } from '@repo/ui/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StoreCatalog() {
    const router = useRouter();
    const [products] = useState<Product[]>(mockProducts);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [materialFilter, setMaterialFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = products.filter(product => {
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const matchesMaterial = materialFilter === 'all' || product.materials.includes(materialFilter);
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesMaterial && matchesSearch;
    });

    const handleViewChange = (view: string) => {
        if(view === 'landing') {
           window.location.href = process.env.NEXT_PUBLIC_LANDING_URL || 'http://localhost:3030';
        } else if (view.startsWith('client') || view.startsWith('provider') || view === 'checkout') {
            window.location.href = `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3031'}`;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header 
                currentView="store-catalog" 
                currentRole="guest" 
                onViewChange={handleViewChange} 
                onRoleChange={() => {}} 
                cartItemCount={0} 
            />

            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-4">Catálogo de Productos</h1>
                    <p className="text-xl text-indigo-100">Productos impresos en 3D listos para pedir y personalizar</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                            <div className="flex items-center space-x-2 mb-4">
                                <SlidersHorizontal className="w-5 h-5 text-slate-700" />
                                <h2 className="font-semibold text-slate-900">Filtros</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Categoría</h3>
                                    <div className="space-y-2">
                                        {categories.map(category => (
                                            <label key={category} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    checked={categoryFilter === category}
                                                    onChange={() => setCategoryFilter(category)}
                                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="text-sm text-slate-700 capitalize">{category}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-200">
                                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Material</h3>
                                    <div className="space-y-2">
                                        {['all', 'PLA', 'PETG', 'ABS'].map(material => (
                                            <label key={material} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="material"
                                                    checked={materialFilter === material}
                                                    onChange={() => setMaterialFilter(material)}
                                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="text-sm text-slate-700 capitalize">{material}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1">
                        <div className="mb-6">
                            <p className="text-slate-600">
                                Mostrando <span className="font-semibold text-slate-900">{filteredProducts.length}</span> productos
                            </p>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                <p className="text-slate-600">No hay productos que coincidan con tus filtros</p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredProducts.map(product => (
                                    <Link
                                        href={`/product/${product.id}`}
                                        key={product.id}
                                        className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden block"
                                    >
                                        <div className="aspect-square overflow-hidden bg-slate-100">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <div className="mb-2">
                                                <span className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                                                    {product.category}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                                {product.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-slate-500">Desde</p>
                                                    <p className="text-2xl font-bold text-slate-900">${product.basePrice}</p>
                                                </div>
                                                <span className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                                                    Ver Detalles
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
