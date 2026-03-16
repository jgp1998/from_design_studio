import { ArrowRight, Shield, Zap, Users, Package, FileText, Store } from 'lucide-react';
import { ViewType } from '../types';

interface LandingPageProps {
    onViewChange: (view: ViewType) => void;
}

export function LandingPage({ onViewChange }: LandingPageProps) {
    const categories = [
        { name: 'Industrial', icon: Package, color: 'bg-blue-500' },
        { name: 'Electronics', icon: Zap, color: 'bg-indigo-500' },
        { name: 'Organization', icon: Store, color: 'bg-purple-500' },
        { name: 'Accessories', icon: Users, color: 'bg-cyan-500' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            On-Demand 3D Manufacturing
                            <span className="block text-indigo-400 mt-2">& Marketplace</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed">
                            Connect with verified 3D printing manufacturers or shop ready-made designs. Secure, fast, and professional.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => onViewChange('client-new-bidding')}
                                className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                            >
                                <FileText className="w-5 h-5" />
                                <span>Request Custom Quote</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => onViewChange('store-catalog')}
                                className="group bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                            >
                                <Store className="w-5 h-5" />
                                <span>Explore Store</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
                    <p className="text-xl text-slate-600">Simple, secure, and efficient</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full text-2xl font-bold mb-4">
                            1
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-3">Upload Your Design</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Upload your 3D model and specify requirements. All files are protected under NDA.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full text-2xl font-bold mb-4">
                            2
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-3">Receive Quotes</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Verified manufacturers bid on your project. Compare prices and delivery times.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full text-2xl font-bold mb-4">
                            3
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-3">Get Your Parts</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Accept the best offer. Track production and receive your parts on time.
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-slate-100 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Built for B2B</h2>
                        <p className="text-xl text-slate-600">Enterprise-grade security and reliability</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-md">
                            <Shield className="w-12 h-12 text-indigo-600 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">NDA Protection</h3>
                            <p className="text-slate-600">
                                All designs are protected under legally binding NDAs. Your intellectual property is secure.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-md">
                            <Zap className="w-12 h-12 text-indigo-600 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">Fast Turnaround</h3>
                            <p className="text-slate-600">
                                Network of verified manufacturers ensures competitive pricing and quick delivery.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-md">
                            <Users className="w-12 h-12 text-indigo-600 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">Quality Assurance</h3>
                            <p className="text-slate-600">
                                All manufacturers are vetted and rated. Track quality and reliability over time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Browse Categories</h2>
                    <p className="text-xl text-slate-600">Ready-made designs available now</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            onClick={() => onViewChange('store-catalog')}
                            className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 text-center"
                        >
                            <div className={`inline-flex items-center justify-center w-16 h-16 ${category.color} text-white rounded-full mb-4 group-hover:scale-110 transition-transform`}>
                                <category.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
                        </button>
                    ))}
                </div>
            </section>

            <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
                    <p className="text-xl text-indigo-100 mb-10">
                        Join thousands of businesses using FDS for their 3D manufacturing needs
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => onViewChange('client-new-bidding')}
                            className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg"
                        >
                            Start a Project
                        </button>
                        <button
                            onClick={() => onViewChange('store-catalog')}
                            className="bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all border-2 border-white/20"
                        >
                            Browse Products
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
