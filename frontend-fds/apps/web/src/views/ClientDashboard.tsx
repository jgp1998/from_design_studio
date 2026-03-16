import { Clock, Package, Truck, Check, Eye } from 'lucide-react';
import { useState } from 'react';
import { WorkOrder } from '../types';
import { mockWorkOrders } from '../mockData';

export function ClientDashboard() {
    const [workOrders] = useState<WorkOrder[]>(mockWorkOrders);
    const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'waiting_offers':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'in_production':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'dispatched':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'waiting_offers':
                return <Clock className="w-4 h-4" />;
            case 'in_production':
                return <Package className="w-4 h-4" />;
            case 'dispatched':
                return <Truck className="w-4 h-4" />;
            case 'completed':
                return <Check className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const formatStatus = (status: string) => {
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">My Work Orders</h1>
                    <p className="text-slate-600">Track your manufacturing requests and manage offers</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-100 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Order ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">File Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Material</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Quantity</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Offers</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {workOrders.map((wo) => (
                                    <tr key={wo.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-semibold text-slate-900">{wo.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-700">{wo.fileName}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                {wo.material}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-700">{wo.quantity}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600">{wo.createdAt}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(wo.status)}`}>
                                                {getStatusIcon(wo.status)}
                                                <span>{formatStatus(wo.status)}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {wo.offers.length > 0 ? (
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
                                                    {wo.offers.length}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedWO(wo)}
                                                disabled={wo.offers.length === 0}
                                                className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-medium text-sm disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>View</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {selectedWO && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedWO(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-1">Work Order {selectedWO.id}</h2>
                                <p className="text-slate-600">{selectedWO.fileName}</p>
                            </div>
                            <button
                                onClick={() => setSelectedWO(null)}
                                className="text-slate-400 hover:text-slate-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="bg-slate-50 rounded-lg p-6 mb-6">
                                <h3 className="font-semibold text-slate-900 mb-4">Order Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-slate-600 mb-1">Material</p>
                                        <p className="font-medium text-slate-900">{selectedWO.material}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 mb-1">Color</p>
                                        <p className="font-medium text-slate-900">{selectedWO.color}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 mb-1">Tolerance</p>
                                        <p className="font-medium text-slate-900">{selectedWO.tolerance}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600 mb-1">Quantity</p>
                                        <p className="font-medium text-slate-900">{selectedWO.quantity} units</p>
                                    </div>
                                </div>
                                {selectedWO.details && (
                                    <div className="mt-4">
                                        <p className="text-sm text-slate-600 mb-1">Additional Details</p>
                                        <p className="text-slate-900">{selectedWO.details}</p>
                                    </div>
                                )}
                            </div>

                            <h3 className="font-semibold text-slate-900 mb-4">Received Offers ({selectedWO.offers.length})</h3>
                            <div className="space-y-4">
                                {selectedWO.offers.map((offer) => (
                                    <div key={offer.id} className="border border-slate-200 rounded-lg p-6 hover:border-indigo-300 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-semibold text-slate-900 mb-1">{offer.providerName}</h4>
                                                <p className="text-sm text-slate-600">Submitted {offer.createdAt}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-slate-900">${offer.price}</p>
                                                <p className="text-sm text-slate-600">{offer.deliveryTime} days delivery</p>
                                            </div>
                                        </div>
                                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all">
                                            Accept Offer
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
