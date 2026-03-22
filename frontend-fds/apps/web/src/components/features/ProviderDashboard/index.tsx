import { Filter, Search, Eye } from 'lucide-react';
import { useState } from 'react';
import type { WorkOrder, ViewType } from '../../../types';
import { mockAvailableWorkOrders } from '../../../mockData';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { API } from '../../../api';

export function ProviderDashboard() {
    const router = useRouter();
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [materialFilter, setMaterialFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Fetch real orders from the API
        API.Orders.getOrders({ status: 'OPEN' })
            .then(data => setWorkOrders(data || mockAvailableWorkOrders))
            .catch(err => {
                console.error("Failed to fetch orders from API:", err);
                // Fallback to mock data if API is not running locally for this demo
                setWorkOrders(mockAvailableWorkOrders);
            });
    }, []);

    const filteredOrders = workOrders.filter(wo => {
        const matchesMaterial = materialFilter === 'all' || wo.material === materialFilter;
        const matchesSearch = wo.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            wo.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesMaterial && matchesSearch;
    });

    const handleViewDetails = (woId: string) => {
        router.push(`/dashboard/provider/orders/${woId}`);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Available Manufacturing Jobs</h1>
                    <p className="text-slate-600">Browse open work orders and submit your offers</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by order ID or file name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Filter className="w-5 h-5 text-slate-600" />
                            <select
                                value={materialFilter}
                                onChange={(e) => setMaterialFilter(e.target.value)}
                                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            >
                                <option value="all">All Materials</option>
                                <option value="PLA">PLA</option>
                                <option value="ABS">ABS</option>
                                <option value="PETG">PETG</option>
                                <option value="Resin">Resin</option>
                                <option value="Nylon">Nylon</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-100 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Order ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">File Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Material</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Color</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Tolerance</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Quantity</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Posted</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredOrders.map((wo) => (
                                    <tr key={wo.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-semibold text-slate-900">{wo.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-700">{wo.fileName}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                                                {wo.material}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-700">{wo.color}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600">{wo.tolerance}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-slate-900">{wo.quantity} units</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600">{wo.createdAt}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleViewDetails(wo.id)}
                                                className="inline-flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>View & Bid</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-600">No work orders match your filters</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                    <h3 className="font-semibold text-indigo-900 mb-2">New to FDS Provider Network?</h3>
                    <p className="text-sm text-indigo-800">
                        Submit competitive offers, build your reputation, and grow your 3D printing business. All design files are protected under NDA.
                    </p>
                </div>
            </div>
        </div>
    );
}
