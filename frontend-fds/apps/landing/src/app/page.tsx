import { 
    FileText, 
    ArrowRight, 
    Shield, 
    Search, 
    Truck, 
    Zap, 
    CheckCircle, 
    Users, 
    Lock, 
    Factory,
    Server
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 selection:bg-indigo-500 selection:text-white">
            {/* 1. Hero Section */}
            <section className="relative overflow-hidden bg-slate-950 text-white min-h-[90vh] flex items-center">
                {/* Background effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-[120px]" />
                    <div className="absolute -bottom-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px]" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-grid-slate-800/[0.04] bg-[size:32px_32px]"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 z-10 w-full">
                    <div className="text-center max-w-5xl mx-auto flex flex-col items-center">
                        {/* Tagline */}
                        <div className="inline-flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full px-4 py-1.5 mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            <span className="text-sm font-medium text-slate-300">Licitaciones B2B | NDA Digital Incluido | Cobertura Latam</span>
                        </div>

                        {/* H1 */}
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-[1.1]">
                            La fábrica de impresión 3D <br className="hidden md:block"/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">más grande del continente</span>, <br className="hidden md:block"/>
                            sin barreras ni fricciones.
                        </h1>

                        {/* H2 */}
                        <p className="text-xl md:text-2xl text-slate-400 mb-12 leading-relaxed max-w-3xl">
                            Sube tu archivo confidencial, firma un NDA automático y recibe cotizaciones de nuestra red de manufactura industrial en menos de 2 horas. Orquestamos tu producción sin riesgos para tu Propiedad Intelectual.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto">
                            <Link
                                href={`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3031'}/bidding/new`}
                                className="group relative bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.7)] hover:-translate-y-1"
                            >
                                <Lock className="w-5 h-5 text-indigo-200" />
                                <span>Cotizar Pieza Segura</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            
                            <Link
                                href={`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3031'}/supplier/onboarding`}
                                className="group bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm hover:-translate-y-1"
                            >
                                <Factory className="w-5 h-5 text-slate-400" />
                                <span>Quiero ser Proveedor FDS</span>
                            </Link>
                        </div>

                        {/* Social Proof */}
                        <div className="mt-12 flex items-center justify-center space-x-2 text-slate-400 bg-slate-900/50 px-6 py-3 rounded-2xl backdrop-blur-sm border border-slate-800">
                            <Shield className="w-5 h-5 text-emerald-400" />
                            <p className="text-sm font-medium">Operando mediante enlaces pre-firmados Cero-Trust. Tu CAD 100% seguro.</p>
                        </div>
                    </div>
                </div>
                
                {/* Decorative bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
            </section>

            {/* 2. El Problema que Resolvemos */}
            <section className="py-24 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3">El Problema</h2>
                        <h3 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                            Fabricar repuestos o prototipos no debería ser un caos de correos.
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Dolor 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                                <Search className="w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-4 inline-flex items-center gap-2">
                                <span className="text-red-500">🛑</span> Opacidad en los Precios
                            </h4>
                            <p className="text-slate-600 leading-relaxed">
                                ¿Días esperando una cotización que nunca llega? Nuestro modelo de licitación distribuida lanza a competir a la red por tu pieza, asegurando un precio justo de mercado en tiempo real.
                            </p>
                        </div>

                        {/* Dolor 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                                <Shield className="w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-4 inline-flex items-center gap-2">
                                <span className="text-red-500">🛑</span> Riesgo Operacional
                            </h4>
                            <p className="text-slate-600 leading-relaxed">
                                Tu diseño CAD es el corazón de tu negocio. FDS asegura que ningún proveedor vea tu archivo hasta haber firmado un Acuerdo de Confidencialidad trazable.
                            </p>
                        </div>

                        {/* Dolor 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                                <Truck className="w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-4 inline-flex items-center gap-2">
                                <span className="text-red-500">🛑</span> Logística a Ciegas
                            </h4>
                            <p className="text-slate-600 leading-relaxed">
                                No más &quot;Hola, ¿Cómo va mi pieza?&quot;. Trazabilidad logística <span className="italic font-medium">End-to-End</span> integrada; desde la inyección del material hasta el despacho formal corporativo, todo en tu Dashboard.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. How it Works (Motor MaaS) */}
            <section className="py-24 bg-white relative overflow-hidden border-y border-slate-100">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3">Product-Led Growth</h2>
                        <h3 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                            Tres Pasos. Fricción Cero.<br/>Ciberseguridad Total.
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting line for desktop */}
                        <div className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-100 via-indigo-300 to-indigo-100 z-0"></div>

                        {/* Step 1 */}
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-slate-100 text-indigo-600 mb-8 relative">
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shadow-sm">1</div>
                                <FileText className="w-10 h-10" />
                            </div>
                            <h4 className="text-2xl font-bold text-slate-900 mb-4">Sube tu Archivo y Parametriza</h4>
                            <p className="text-slate-600 leading-relaxed">
                                Arrastra tu modelo <code>.STL</code> o <code>.STEP</code>. Selecciona el relleno, material técnico (Ej. TPU, ABS Industrial) y confirma en un click el marco legal del NDA. Infraestructura encriptada de corto plazo.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-slate-100 text-indigo-600 mb-8 relative">
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shadow-sm">2</div>
                                <Zap className="w-10 h-10" />
                            </div>
                            <h4 className="text-2xl font-bold text-slate-900 mb-4">La Red Pujará por Ti (Bidding)</h4>
                            <p className="text-slate-600 leading-relaxed">
                                Tu Orden de Trabajo anónima es publicada. En minutos, nuestra red validada de proveedores chilenos emite sus tiempos de producción y costos.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-slate-100 text-indigo-600 mb-8 relative">
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shadow-sm">3</div>
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h4 className="text-2xl font-bold text-slate-900 mb-4">Elige, Paga y Recibe</h4>
                            <p className="text-slate-600 leading-relaxed">
                                Adjudica la mejor oferta comparativa. Procesado tu pago en custodia (Escrow), se dispara la manufactura real. Sigue el despacho desde tu plataforma.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Sección de Beneficios */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
                        {/* Decorative background for the card */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
                        
                        <div className="grid md:grid-cols-2 gap-0 relative z-10">
                            <div className="p-12 md:p-16 lg:p-20 flex flex-col justify-center">
                                <h2 className="text-indigo-400 font-semibold tracking-wide uppercase text-sm mb-3">Moat Competitivo B2B</h2>
                                <h3 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                                    Diseñado para escalar tu producción sin riesgos.
                                </h3>
                                
                                <ul className="space-y-8">
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mr-6">
                                            <Server className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-semibold text-white mb-2">Cero Inversión en Maquinaria (Capex)</h4>
                                            <p className="text-slate-400">Tu negocio es diseñar productos increíbles, no mantener maquinaria ociosa. Aumenta o detén tu volumen de producción bajo demanda.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mr-6">
                                            <Shield className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-semibold text-white mb-2">Garantía Transaccional e Imparcial</h4>
                                            <p className="text-slate-400">FDS funciona como orquestador. El proveedor no cobra hasta que cumple los hitos prometidos; tu capital corporativo no asume riesgo.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mr-6">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-semibold text-white mb-2">Red Validada Legalmente</h4>
                                            <p className="text-slate-400">No pasamos trabajos a informales. Cada Granja de Impresión en FDS atravesó rigurosos filtros comerciales, tributarios y de ciberseguridad.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="bg-slate-800/50 hidden md:block border-l border-slate-700 relative">
                                 {/* Abstract representation of 3D printing and network */}
                                 <div className="absolute inset-0 flex items-center justify-center">
                                     <div className="relative w-3/4 h-3/4">
                                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-indigo-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-cyan-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-purple-500/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
                                         
                                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-2xl z-10">
                                            <Shield className="w-16 h-16 text-indigo-400" />
                                         </div>
                                     </div>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. El Lado de la Oferta (Supply) */}
            <section className="py-24 bg-gradient-to-br from-indigo-900 to-slate-900 border-t border-slate-800 relative overflow-hidden text-center text-white">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
                    <Factory className="w-16 h-16 text-indigo-400 mb-8" />
                    <h3 className="text-3xl md:text-5xl font-bold mb-6">
                        ¿Tienes máquinas de Impresión 3D con capacidad ociosa?
                    </h3>
                    <p className="text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
                        Rentabiliza tus impresoras sin gastar en fuerza de ventas. FDS centraliza requerimientos industriales masivos. Olvídate de cobrar y negociar: Ofertá, adjudicaté y fabrica con el dinero asegurado.
                    </p>
                    <Link
                        href={`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3031'}/supplier/onboarding`}
                        className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-xl hover:-translate-y-1 inline-flex items-center space-x-2"
                    >
                        <span>Postular mi Granja a FDS</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                 </div>
            </section>

            {/* 6. Footer Extra/Trust Badges */}
            <section className="bg-slate-950 py-12 border-t border-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-slate-400">
                        <div className="flex items-center gap-3">
                            <Truck className="w-6 h-6 text-slate-500" />
                            <span className="text-sm font-medium">Alianzas tecnológicas con despachadores clase mundial.</span>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
                            <Shield className="w-5 h-5 text-indigo-400" />
                            <span className="text-sm font-medium">Arquitectura Segura by Diseño Corporativo</span>
                        </div>
                        <div className="flex gap-4 text-sm">
                            <a href="#" className="hover:text-indigo-400 transition-colors">Términos NDA</a>
                            <span className="text-slate-700">|</span>
                            <a href="#" className="hover:text-indigo-400 transition-colors">Aviso Legal Escrow</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
