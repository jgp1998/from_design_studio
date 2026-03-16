import { ArrowRight, Shield, Zap, Users, Package, FileText, Store } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@repo/ui/Header';

export default function LandingPage() {
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
                            Manufactura 3D bajo demanda
                            <span className="block text-indigo-400 mt-2">& Marketplace</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed">
                            Conecta con fabricantes verificados de impresión 3D o explora nuestra tienda de diseños listos para usar. Seguro, rápido y profesional.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3031'}/bidding/new`}
                                className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                            >
                                <FileText className="w-5 h-5" />
                                <span>Cotizar Modelo 3D</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href={process.env.NEXT_PUBLIC_SHOP_URL || 'http://localhost:3032'}
                                className="group bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                            >
                                <Store className="w-5 h-5" />
                                <span>Explorar Tienda</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">¿Cómo funciona?</h2>
                    <p className="text-xl text-slate-600">Simple, seguro y eficiente</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full text-2xl font-bold mb-4">
                            1
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-3">Sube tu Diseño</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Sube tu modelo 3D y especifica los requerimientos. Todos los archivos están protegidos bajo NDA.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full text-2xl font-bold mb-4">
                            2
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-3">Recibe Ofertas</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Fabricantes verificados pujan por tu proyecto. Compara precios y tiempos de entrega.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full text-2xl font-bold mb-4">
                            3
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-3">Recibe tus Piezas</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Acepta la mejor oferta. Haz seguimiento a la producción y recibe tus piezas a tiempo.
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-slate-100 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Diseñado para B2B</h2>
                        <p className="text-xl text-slate-600">Seguridad y confiabilidad a nivel empresarial</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-md">
                            <Shield className="w-12 h-12 text-indigo-600 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">Protección NDA</h3>
                            <p className="text-slate-600">
                                Todos los diseños están protegidos bajo Acuerdos de Confidencialidad legales. Tu propiedad intelectual está segura.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-md">
                            <Zap className="w-12 h-12 text-indigo-600 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">Tiempos Rápidos</h3>
                            <p className="text-slate-600">
                                Nuestra red de fabricantes verificados asegura precios competitivos y entregas rápidas.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-md">
                            <Users className="w-12 h-12 text-indigo-600 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">Aseguramiento de Calidad</h3>
                            <p className="text-slate-600">
                                Todos los fabricantes son evaluados y calificados. Rastrea la calidad y confiabilidad a lo largo del tiempo.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Navegar Categorías</h2>
                    <p className="text-xl text-slate-600">Diseños listos para usar disponibles ahora</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link
                            href={`${process.env.NEXT_PUBLIC_SHOP_URL || 'http://localhost:3032'}/category/${category.name.toLowerCase()}`}
                            key={category.name}
                            className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-8 text-center block"
                        >
                            <div className={`inline-flex items-center justify-center w-16 h-16 ${category.color} text-white rounded-full mb-4 group-hover:scale-110 transition-transform`}>
                                <category.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para Empezar?</h2>
                    <p className="text-xl text-indigo-100 mb-10">
                        Únete a miles de empresas que usan FDS para sus necesidades de manufactura 3D
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3031'}/bidding/new`}
                            className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg inline-block"
                        >
                            Iniciar un Proyecto
                        </Link>
                        <Link
                            href={process.env.NEXT_PUBLIC_SHOP_URL || 'http://localhost:3032'}
                            className="bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all border-2 border-white/20 inline-block"
                        >
                            Ver Productos
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
