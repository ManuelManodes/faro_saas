import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Users, TrendingUp, Check } from 'lucide-react';

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-body">
            {/* Hero Section - Púrpura Oscuro */}
            <section className="relative bg-primary text-white overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lavender rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-coral/20 rounded-full blur-3xl"></div>
                </div>

                {/* Art Pop 90s Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Formas geométricas flotantes */}
                    <div className="absolute top-20 right-10 w-32 h-32 border-4 border-cyan rotate-12 rounded-3xl opacity-30 animate-bounce-slow"></div>
                    <div className="absolute top-40 left-20 w-24 h-24 bg-coral/20 rotate-45 opacity-40"></div>
                    <div className="absolute bottom-32 right-32 w-40 h-40 border-4 border-lavender rounded-full opacity-25"></div>
                    <div className="absolute bottom-20 left-40 w-16 h-16 bg-cyan/30 rounded-full opacity-50"></div>

                    {/* Líneas diagonales Memphis */}
                    <svg className="absolute top-0 left-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                        <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r="2" fill="currentColor" className="text-coral" />
                            <circle cx="30" cy="30" r="2" fill="currentColor" className="text-cyan" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#dots)" />
                    </svg>

                    {/* Zigzag pattern */}
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
                        <svg width="100" height="200" viewBox="0 0 100 200" className="opacity-20">
                            <path d="M0,0 L50,50 L0,100 L50,150 L0,200" stroke="currentColor" strokeWidth="3" fill="none" className="text-lavender" />
                        </svg>
                    </div>
                </div>

                <div className="relative container mx-auto px-6 py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Content */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse"></span>
                                <span className="text-sm font-medium">Sistema de Gestión Educativa</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
                                Gestión educativa
                                <span className="block text-coral">inteligente.</span>
                            </h1>

                            <p className="text-xl text-white/80 leading-relaxed max-w-lg">
                                La plataforma todo-en-uno que transforma la administración de tu institución educativa. Simple, potente y diseñada para el éxito.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/app')}
                                    className="px-8 py-4 bg-coral hover:bg-coral-600 text-white font-display font-bold text-lg rounded-full transition-smooth shadow-soft-lg flex items-center justify-center gap-2"
                                >
                                    Comienza Gratis
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-display font-semibold text-lg rounded-full transition-smooth backdrop-blur-sm">
                                    Ver Demo
                                </button>
                            </div>
                        </div>

                        {/* Right: Stats Widget */}
                        <div className="space-y-4">
                            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-soft-lg">
                                <div className="text-6xl font-display font-bold text-coral mb-2">500+</div>
                                <div className="text-white/90 font-medium text-lg">Instituciones Confían en Faro</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-cyan/20 backdrop-blur-lg border border-cyan/30 rounded-2xl p-6">
                                    <div className="text-4xl font-display font-bold text-cyan mb-1">98%</div>
                                    <div className="text-white/80 text-sm">Satisfacción</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                                    <div className="text-4xl font-display font-bold text-white mb-1">24/7</div>
                                    <div className="text-white/80 text-sm">Disponibilidad</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Módulos Grid - 3 Columnas */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
                            Todo en un solo lugar
                        </h2>
                        <p className="text-xl text-gray-600">
                            Herramientas potentes y simples para cada aspecto de la vida educativa.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Calendar,
                                title: "Calendario Académico",
                                desc: "Organiza horarios, exámenes y eventos con sincronización automática.",
                                color: "coral"
                            },
                            {
                                icon: Users,
                                title: "Gestión de Asistencia",
                                desc: "Registro rápido, reportes y justificativos digitales en tiempo real.",
                                color: "cyan"
                            },
                            {
                                icon: TrendingUp,
                                title: "Test Vocacional",
                                desc: "Integra el test de Holland para orientación vocacional efectiva.",
                                color: "lavender"
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group bg-white border-2 border-gray-200 rounded-3xl p-8 hover:border-coral hover:shadow-soft-lg transition-smooth">
                                <div className={`w-14 h-14 ${feature.color === 'coral' ? 'bg-coral/10' :
                                        feature.color === 'cyan' ? 'bg-cyan/10' :
                                            'bg-lavender/30'
                                    } rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth`}>
                                    <feature.icon className={`w-7 h-7 ${feature.color === 'coral' ? 'text-coral' :
                                            feature.color === 'cyan' ? 'text-cyan' :
                                                'text-primary'
                                        }`} />
                                </div>
                                <h3 className="text-xl font-display font-bold text-primary mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Proceso - Numerado */}
            <section className="py-32 bg-gradient-lavender">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
                            Cómo Funciona
                        </h2>
                        <p className="text-xl text-gray-600">
                            Implementa Faro en tu institución en 3 pasos simples.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {[
                            {
                                num: "01",
                                title: "Configura",
                                desc: "Crea tu cuenta y configura cursos, estudiantes y profesores en minutos."
                            },
                            {
                                num: "02",
                                title: "Organiza",
                                desc: "Gestiona calendarios, asistencias y eventos desde un solo panel."
                            },
                            {
                                num: "03",
                                title: "Analiza",
                                desc: "Obtén insights valiosos con reportes automáticos y test vocacionales."
                            }
                        ].map((step, i) => (
                            <div key={i} className="text-center space-y-4">
                                <div className="text-8xl font-display font-bold text-lavender">{step.num}</div>
                                <h3 className="text-2xl font-display font-bold text-primary">{step.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Beneficios con Checks */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
                                Por qué elegir Faro
                            </h2>
                            <div className="space-y-4">
                                {[
                                    "Interfaz intutiva sin curva de aprendizaje",
                                    "Acceso desde cualquier dispositivo",
                                    "Notificaciones en tiempo real",
                                    "Seguridad y privacidad garantizadas",
                                    "Soporte técnico 24/7"
                                ].map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="w-6 h-6 bg-cyan/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="w-4 h-4 text-cyan" strokeWidth={3} />
                                        </div>
                                        <span className="text-lg text-gray-700">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-primary/5 rounded-3xl p-12 text-center">
                            <div className="text-6xl font-display font-bold text-primary mb-4">35%</div>
                            <div className="text-xl text-gray-600 mb-8">
                                Reducción en tiempo administrativo reportada por nuestros usuarios
                            </div>
                            <button
                                onClick={() => navigate('/app')}
                                className="px-8 py-4 bg-coral hover:bg-coral-600 text-white font-display font-bold rounded-full transition-smooth"
                            >
                                Prueba Gratis
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final - Full Width */}
            <section className="py-24 bg-primary text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
                        ¿Listo para transformar
                        <span className="block text-coral">tu institución?</span>
                    </h2>
                    <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                        Únete a cientos de instituciones que ya confían en Faro para su gestión educativa.
                    </p>
                    <button
                        onClick={() => navigate('/app')}
                        className="px-12 py-5 bg-coral hover:bg-coral-600 text-white font-display font-bold text-xl rounded-full transition-smooth shadow-soft-lg inline-flex items-center gap-3"
                    >
                        Empezar Ahora
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-primary-600 text-white/70 text-center text-sm">
                <div className="container mx-auto px-6">
                    © 2025 Faro. Todos los derechos reservados.
                </div>
            </footer>
        </div>
    );
}
