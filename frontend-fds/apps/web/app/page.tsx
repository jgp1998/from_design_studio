import Link from 'next/link';
import { Package, Shield, Truck, Zap } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-slate-50">
            {/* Hero Section */}
            <section className="relative bg-slate-900 text-white py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-indigo-900 opacity-90"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Package className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Manufacturing On Demand
                    </h1>
                    <p className="mt-4 max-w-2xl text-xl text-indigo-100 mx-auto mb-10">
                        The secure, traceable, and competitive network for industrial 3D printing. Connect with certified providers or join as a manufacturer.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
                        <Link
                            href="/register/b2b"
                            className="group flex items-center justify-center space-x-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 px-10 rounded-xl transition-all duration-300 text-lg shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.7)] hover:-translate-y-1"
                        >
                            <Package className="w-6 h-6 text-indigo-200 group-hover:scale-110 transition-transform" />
                            <span>Order Parts</span>
                        </Link>
                        
                        <div className="text-slate-500 font-medium italic hidden sm:block">or</div>
                        
                        <Link
                            href="/register/provider"
                            className="group flex items-center justify-center space-x-3 bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-600 font-semibold py-4 px-10 rounded-xl transition-all duration-300 text-lg backdrop-blur-sm hover:-translate-y-1"
                        >
                            <Shield className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                            <span>Join Manufacturer Network</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-white flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <Shield className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Zero Trust Architecture</h3>
                            <p className="text-slate-600">
                                Your CAD files are encrypted and protected by automated legal NDAs. No one sees your IP without signing.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <Zap className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Anonymous Bidding</h3>
                            <p className="text-slate-600">
                                Receive competitive quotes from certified providers in real-time. Choose based on price, rating, and speed.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <Truck className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">End-to-end Logistics</h3>
                            <p className="text-slate-600">
                                Track your order from printing to dispatch. Unified payments ensure that funds are held securely.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
