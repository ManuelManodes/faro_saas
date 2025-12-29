import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Users, TrendingUp, Check } from 'lucide-react';
import styles from './LandingPage.module.css';

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-body">
            {/* Hero Section - NEGRO con tinte púrpura oscuro */}
            <section className={`relative text-white overflow-hidden ${styles.heroSection}`}>
                {/* Decorative Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lavender rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-lavender/20 rounded-full blur-3xl"></div>
                </div>

                {/* Art Pop 90s Elements */}
                <div className="absolute inset-0 overflow-visible pointer-events-none">
                    {/* Faros - Temática Náutica Realista */}
                    <div className="absolute top-[83%] -translate-y-1/2 right-20 opacity-25 z-10">
                        {/* Faro Principal con Haz de Luz */}
                        <svg width="120" height="170" viewBox="0 0 100 140" className="animate-pulse-slow" style={{ overflow: 'visible' }}>

                            {/* Base del faro */}
                            <rect x="35" y="100" width="30" height="40" fill="currentColor" className="text-lavender" rx="2" />

                            {/* Torre del faro con rayas */}
                            <rect x="37" y="40" width="26" height="15" fill="currentColor" className="text-white" opacity="0.8" />
                            <rect x="37" y="55" width="26" height="15" fill="currentColor" className="text-lavender" />
                            <rect x="37" y="70" width="26" height="15" fill="currentColor" className="text-white" opacity="0.8" />
                            <rect x="37" y="85" width="26" height="15" fill="currentColor" className="text-lavender" />

                            {/* Techo/linterna */}
                            <polygon points="50,25 62,40 38,40" fill="currentColor" className="text-primary" />

                            {/* Luz brillante */}
                            <circle cx="50" cy="28" r="6" fill="currentColor" className="text-lavender animate-lighthouse-glow" />

                            {/* Haz de luz giratorio - MÁS VISIBLE */}
                            <g className={`origin-center animate-lighthouse-beam ${styles.lighthouseBeamPrimary}`}>
                                <path d="M50,28 L90,5 L90,51 Z" fill="currentColor" className="text-lavender" opacity="0.4" />
                            </g>
                        </svg>
                    </div>




                    {/* Mar muy sutil */}
                    <svg className={`absolute bottom-0 left-0 w-full z-0 ${styles.oceanWave}`} height="80" viewBox="0 0 1000 80" preserveAspectRatio="none">
                        <path d="M0,40 Q250,20 500,40 T1000,40 L1000,80 L0,80 Z" fill="#17B1C1" />
                    </svg>




                    {/* Estrellas parpadeantes - Cielo nocturno */}
                    <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        {/* Estrellas como puntos brillantes */}
                        {[...Array(30)].map((_, i) => (
                            <circle
                                key={i}
                                cx={`${(i * 37 + 13) % 100}%`}
                                cy={`${(i * 47 + 7) % 80}%`}
                                r={i % 3 === 0 ? "2" : "1.5"}
                                fill="currentColor"
                                className={`${i % 2 === 0 ? "text-lavender" : "text-white"} animate-twinkle ${styles.star}`}
                                style={{ '--star-delay': `${i * 0.3}s` } as React.CSSProperties}
                            />
                        ))}
                    </svg>
                </div>

                <div className="relative container mx-auto px-6 py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Content */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                                <span className="w-2 h-2 rounded-full bg-lavender animate-pulse"></span>
                                <span className="text-sm font-medium">Sistema de Gestión Educativa</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
                                Gestión educativa
                                <span className="block text-lavender">inteligente.</span>
                            </h1>

                            <p className="text-xl text-white/80 leading-relaxed max-w-lg">
                                La plataforma todo-en-uno que transforma la administración de tu institución educativa. Simple, potente y diseñada para el éxito.
                            </p>

                            <div className="flex justify-start">
                                <button
                                    onClick={() => navigate('/app')}
                                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-lg rounded-full transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    Comenzar Ahora
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Right: Stats Widget */}
                        <div className="space-y-4">
                            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-soft-lg">
                                <div className="text-6xl font-display font-bold text-lavender mb-2">500+</div>
                                <div className="text-white/90 font-medium text-lg">Instituciones Confían en Faro</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                                    <div className="text-4xl font-display font-bold text-white mb-1">98%</div>
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
            <section id="features" className="py-24 md:py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
                            Todo en un solo lugar
                        </h2>
                        <p className="text-lg text-slate-600">
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
                            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-indigo-300 hover:shadow-lg transition-all">
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                                    <feature.icon className="w-7 h-7 text-indigo-600" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-display font-semibold text-slate-800 mb-3">{feature.title}</h3>
                                <p className="text-lg text-slate-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Proceso - Numerado */}
            <section className="py-24 md:py-32 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
                            Cómo Funciona
                        </h2>
                        <p className="text-lg text-slate-600">
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
                            <div key={i} className="text-center">
                                <div className="text-7xl font-display font-black text-indigo-600 mb-6">{step.num}</div>
                                <h3 className="text-2xl md:text-3xl font-display font-semibold text-slate-800 mb-4">{step.title}</h3>
                                <p className="text-lg text-slate-600 leading-relaxed max-w-sm mx-auto">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Beneficios con Checks */}
            <section className="py-24 md:py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-8">
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
                                        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="w-4 h-4 text-white" strokeWidth={3} />
                                        </div>
                                        <span className="text-lg text-slate-600">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-primary/5 rounded-3xl p-12 text-center">
                            <div className="text-6xl font-display font-bold text-primary mb-4">35%</div>
                            <div className="text-xl text-slate-600 mb-8">
                                Reducción en tiempo administrativo reportada por nuestros usuarios
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final - Full Width */}
            <section className="py-24 md:py-32 bg-slate-50">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">
                        ¿Listo para transformar tu institución?
                    </h2>
                    <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
                        Únete a cientos de instituciones que ya confían en Faro para su gestión educativa.
                    </p>
                    <button
                        onClick={() => navigate('/app')}
                        className="px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold text-xl rounded-full transition-smooth shadow-soft-lg inline-flex items-center gap-3"
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
