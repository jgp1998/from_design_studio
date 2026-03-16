import { Shield, Download, Check, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { ViewType } from '../types';
import { mockAvailableWorkOrders } from '../mockData';

interface ProviderOTDetailProps {
    selectedWOId: string;
    onViewChange: (view: ViewType) => void;
}

export function ProviderOTDetail({ selectedWOId, onViewChange }: ProviderOTDetailProps) {
    const workOrder = mockAvailableWorkOrders.find(wo => wo.id === selectedWOId);
    const [ndaAccepted, setNdaAccepted] = useState(false);
    const [fileDownloaded, setFileDownloaded] = useState(false);
    const [offerData, setOfferData] = useState({
        price: '',
        deliveryTime: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);

    if (!workOrder) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-slate-600">Work order not found</p>
            </div>
        );
    }

    const handleDownload = () => {
        if (ndaAccepted) {
            setFileDownloaded(true);
        }
    };

    const handleSubmitOffer = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuccess(true);
        setTimeout(() => {
            onViewChange('provider-dashboard');
        }, 2000);
    };

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
                        <Check className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">Offer Submitted!</h2>
                    <p className="text-slate-600 mb-6">
                        Your offer has been sent to the client. You'll be notified if they accept.
                    </p>
                    <p className="text-sm text-slate-500">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => onViewChange('provider-dashboard')}
                    className="text-indigo-600 hover:text-indigo-800 font-medium mb-6 inline-flex items-center"
                >
                    ← Back to Available Jobs
                </button>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-8 py-6 text-white">
                        <h1 className="text-2xl font-bold mb-2">Work Order {workOrder.id}</h1>
                        <p className="text-indigo-100">{workOrder.fileName}</p>
                    </div>

                    <div className="p-8">
                        <div className="bg-slate-50 rounded-xl p-6 mb-8">
                            <h2 className="text-xl font-semibold text-slate-900 mb-4">Technical Specifications</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Material</p>
                                    <p className="font-semibold text-slate-900 text-lg">{workOrder.material}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Color</p>
                                    <p className="font-semibold text-slate-900 text-lg">{workOrder.color}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Tolerance</p>
                                    <p className="font-semibold text-slate-900 text-lg">{workOrder.tolerance}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Quantity</p>
                                    <p className="font-semibold text-slate-900 text-lg">{workOrder.quantity} units</p>
                                </div>
                            </div>
                            {workOrder.details && (
                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <p className="text-sm text-slate-600 mb-2">Additional Requirements</p>
                                    <p className="text-slate-900">{workOrder.details}</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 mb-8">
                            <div className="flex items-start space-x-4">
                                <Shield className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-amber-900 mb-2">Confidentiality Agreement Required</h3>
                                    <p className="text-amber-800 mb-4 leading-relaxed">
                                        To access and download the 3D design file, you must digitally accept our Non-Disclosure Agreement (NDA).
                                        This legally binding agreement protects the client's intellectual property and restricts unauthorized use or distribution.
                                    </p>
                                    <div className="bg-white rounded-lg p-4 mb-4">
                                        <label className="flex items-start space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={ndaAccepted}
                                                onChange={(e) => setNdaAccepted(e.target.checked)}
                                                className="w-5 h-5 text-indigo-600 border-amber-300 rounded focus:ring-indigo-500 mt-0.5 flex-shrink-0"
                                            />
                                            <span className="text-sm font-medium text-slate-900 leading-relaxed">
                                                I have read and agree to the terms of the Non-Disclosure Agreement. I understand that unauthorized
                                                use or distribution of the design files may result in legal action and termination from the FDS network.
                                            </span>
                                        </label>
                                    </div>
                                    <button
                                        onClick={handleDownload}
                                        disabled={!ndaAccepted}
                                        className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center space-x-2"
                                    >
                                        <Download className="w-5 h-5" />
                                        <span>Accept NDA & Download 3D File</span>
                                    </button>
                                    {fileDownloaded && (
                                        <div className="mt-4 flex items-center space-x-2 text-green-700">
                                            <Check className="w-5 h-5" />
                                            <span className="font-medium">File downloaded successfully</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {!fileDownloaded && (
                            <div className="bg-slate-100 border border-slate-300 rounded-xl p-6 text-center">
                                <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                <p className="text-slate-600 font-medium">
                                    You must download and review the 3D file before submitting an offer
                                </p>
                            </div>
                        )}

                        {fileDownloaded && (
                            <form onSubmit={handleSubmitOffer} className="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">Submit Your Offer</h3>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Offer Amount (USD)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-medium">$</span>
                                            <input
                                                type="number"
                                                min="1"
                                                step="0.01"
                                                required
                                                value={offerData.price}
                                                onChange={(e) => setOfferData({ ...offerData, price: e.target.value })}
                                                placeholder="0.00"
                                                className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Production Time (Days)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            required
                                            value={offerData.deliveryTime}
                                            onChange={(e) => setOfferData({ ...offerData, deliveryTime: e.target.value })}
                                            placeholder="7"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!offerData.price || !offerData.deliveryTime}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-all shadow-lg text-lg"
                                >
                                    Submit Offer to Client
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
