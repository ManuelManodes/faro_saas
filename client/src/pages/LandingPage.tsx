
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Laptop } from 'lucide-react';
import heroImage from '../assets/hero-dashboard.png';
import studentImage from '../assets/feature-student.png';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils';

export function LandingPage() {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white transition-colors duration-300">
            {/* Navbar */}
            <nav className="absolute top-0 w-full px-6 py-6 z-50">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Logo */}
                        <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-foreground">Faro v2</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <div className="flex items-center border rounded-full p-1 bg-background/50 backdrop-blur-sm border-border">
                            <button
                                onClick={() => setTheme("light")}
                                className={cn("p-1.5 rounded-full transition-all", theme === "light" && "bg-background shadow-sm text-yellow-500")}
                            >
                                <Sun className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setTheme("system")}
                                className={cn("p-1.5 rounded-full transition-all", theme === "system" && "bg-background shadow-sm")}
                            >
                                <Laptop className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setTheme("dark")}
                                className={cn("p-1.5 rounded-full transition-all", theme === "dark" && "bg-background shadow-sm text-blue-400")}
                            >
                                <Moon className="h-4 w-4" />
                            </button>
                        </div>

                        <button
                            onClick={() => navigate('/app')}
                            className="px-6 py-2.5 text-sm font-bold bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                        >
                            Ver Demo
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="bg-background relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    {/* Left Content */}
                    <div className="text-foreground space-y-8 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-semibold uppercase tracking-wider text-primary">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            Nueva Versión 2.0
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-foreground">
                            Gestión educativa <span className="text-primary">sin límites.</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed">
                            La plataforma integral que transforma la administración de tu institución. Simple, potente y diseñada para el éxito estudiantil.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={() => navigate('/app')}
                                className="px-8 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary/90 hover:-translate-y-1 transition-all shadow-lg shadow-primary/25"
                            >
                                Comienza gratis hoy
                            </button>
                            <button
                                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 bg-muted/50 text-foreground text-lg font-medium rounded-xl border border-border hover:bg-muted transition-colors"
                            >
                                Descubre más
                            </button>
                        </div>
                        <div className="pt-8 flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex -space-x-2 grayscale opacity-70">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] text-muted-foreground font-bold">U{i}</div>
                                ))}
                            </div>
                            <p>Más de 500 instituciones confían en nosotros</p>
                        </div>
                    </div>

                    {/* Right Image - Dashboard Mockup */}
                    <div className="relative lg:ml-auto">
                        {/* Decorative Blobs */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-secondary/5 blur-3xl rounded-full opacity-70"></div>
                        <img
                            src={heroImage}
                            alt="Plataforma Faro Dashboard"
                            className="relative rounded-xl shadow-2xl border border-border w-full max-w-2xl transform hover:scale-[1.02] transition-transform duration-500"
                        />
                    </div>
                </div>
            </header>

            {/* Trust/Logos Section */}
            <section className="py-10 bg-background border-b border-border">
                <div className="container mx-auto px-6">
                    <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6">Integrado con las mejores herramientas</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Google Classroom', 'Zoom', 'Canvas', 'Moodle', 'Microsoft Teams'].map(brand => (
                            <span key={brand} className="text-xl font-bold text-foreground">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Split Section */}
            <section id="features" className="py-24 bg-background">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Image */}
                        <div className="order-2 lg:order-1 relative">
                            <div className="absolute -bottom-6 -left-6 w-full h-full bg-muted/30 rounded-2xl -z-10"></div>
                            <img
                                src={studentImage}
                                alt="Estudiante usando Faro"
                                className="rounded-2xl shadow-xl w-full object-cover h-[500px]"
                            />
                            {/* Floating Badge */}
                            <div className="absolute bottom-8 right-8 bg-card p-4 rounded-xl shadow-lg border border-border max-w-xs animate-bounce-slow">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-green-100 rounded-full text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">Asistencia Registrada</p>
                                        <p className="text-xs text-muted-foreground">Hace 2 minutos</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="order-1 lg:order-2 space-y-6">
                            <h2 className="text-4xl font-bold text-foreground">Una experiencia diseñada para las personas.</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                La tecnología no debería ser una barrera. Faro v2 conecta a estudiantes, profesores y administrativos en un entorno digital fluido y amigable.
                            </p>
                            <ul className="space-y-4 pt-4">
                                {[
                                    'Interfaz intuitiva que no requiere capacitación.',
                                    'Accesible desde cualquier dispositivo (Móvil, Tablet, Desktop).',
                                    'Notificaciones en tiempo real para mantener a todos informados.'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                        </div>
                                        <span className="text-foreground font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                className="mt-4 text-primary font-bold hover:underline flex items-center gap-2"
                                onClick={() => navigate('/app')}
                            >
                                Explora las características <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3-Column Features Grid */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Todo lo que necesitas en un solo lugar</h2>
                        <p className="text-muted-foreground">Herramientas potentes para cada aspecto de la vida educativa.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <SimpleFeatureCard
                            icon={<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                            title="Calendario Académico"
                            description="Organiza horarios, exámenes y eventos extracurriculares con sincronización automática."
                        />
                        <SimpleFeatureCard
                            icon={<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />}
                            title="Gestión de Asistencia"
                            description="Toma de asistencia rápida, reportes de ausentismo y justificativos digitales."
                        />
                        <SimpleFeatureCard
                            icon={<path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
                            title="Analítica Vocacional"
                            description="Integra el test de Holland para guiar a los estudiantes en sus decisiones futuras."
                        />
                    </div>
                </div>
            </section>

            <footer className="bg-secondary py-12 text-white border-t border-white/5">
                <div className="container mx-auto px-6 text-center">
                    <h3 className="text-2xl font-bold mb-6">¿Listo para transformar tu institución?</h3>
                    <button
                        onClick={() => navigate('/app')}
                        className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors shadow-lg"
                    >
                        Empezar Ahora
                    </button>
                    <div className="mt-12 pt-8 border-t border-white/10 text-sm text-blue-200/40">
                        © 2026 Faro v2. Todos los derechos reservados.
                    </div>
                </div>
            </footer>
        </div>
    );
}

function SimpleFeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {icon}
                </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
    )
}

