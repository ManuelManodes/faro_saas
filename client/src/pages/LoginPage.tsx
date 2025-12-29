import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";


export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/app";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Simulate network delay for effect
        await new Promise(resolve => setTimeout(resolve, 800));

        if (login(email, password)) {
            navigate(from, { replace: true });
        } else {
            setError("Credenciales inválidas. Intente nuevamente.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px]" />

            {/* Estrellas titilantes - mayoría blancas, algunas de color */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {[...Array(30)].map((_, i) => {
                    // Solo 30% de las estrellas tienen color
                    const isColored = i % 10 < 3;
                    const colors = ['#8B5CF6', '#17B1C1', '#A78BFA'];
                    const whiteGray = i % 2 === 0 ? '#FFFFFF' : '#E5E7EB';
                    const starColor = isColored ? colors[i % colors.length] : whiteGray;

                    return (
                        <circle
                            key={i}
                            cx={`${(i * 37 + 13) % 100}%`}
                            cy={`${(i * 47 + 7) % 100}%`}
                            r={i % 3 === 0 ? "2" : "1.5"}
                            fill={starColor}
                            style={{
                                animation: `twinkle ${3 + (i % 3)}s ease-in-out infinite`,
                                animationDelay: `${i * 0.2}s`,
                                opacity: isColored ? 0.7 : 0.5
                            }}
                        />
                    );
                })}

                {/* Estrella fugaz con posición aleatoria */}
                <line
                    x1="5%"
                    y1="15%"
                    x2="25%"
                    y2="35%"
                    stroke="url(#shootingStarGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{
                        animation: 'shootingStar1 12s ease-in-out infinite',
                        opacity: 0
                    }}
                />
                <line
                    x1="70%"
                    y1="10%"
                    x2="90%"
                    y2="30%"
                    stroke="url(#shootingStarGradient2)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{
                        animation: 'shootingStar2 15s ease-in-out infinite',
                        animationDelay: '5s',
                        opacity: 0
                    }}
                />
                <defs>
                    <linearGradient id="shootingStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
                        <stop offset="50%" stopColor="#8B5CF6" stopOpacity="1" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="shootingStarGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#17B1C1" stopOpacity="0" />
                        <stop offset="50%" stopColor="#17B1C1" stopOpacity="1" />
                        <stop offset="100%" stopColor="#17B1C1" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>

            <style>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
                
                @keyframes shootingStar1 {
                    0% { 
                        opacity: 0;
                        transform: translate(0, 0);
                    }
                    3% { 
                        opacity: 1;
                    }
                    6% { 
                        opacity: 0;
                        transform: translate(80px, 80px);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(80px, 80px);
                    }
                }
                
                @keyframes shootingStar2 {
                    0% { 
                        opacity: 0;
                        transform: translate(0, 0);
                    }
                    3% { 
                        opacity: 1;
                    }
                    6% { 
                        opacity: 0;
                        transform: translate(70px, 70px);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(70px, 70px);
                    }
                }
            `}</style>

            <div className="w-full max-w-md p-8 bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative z-10 mx-4">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-primary/10 rounded-xl mb-4">
                        <svg className="w-10 h-10 text-primary" viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Haz de luz apuntando a la derecha */}
                            <g opacity="0.3">
                                <path d="M50,28 L90,5 L90,51 Z" fill="currentColor" />
                            </g>
                            {/* Base del faro */}
                            <rect x="35" y="100" width="30" height="40" fill="currentColor" rx="2" />
                            {/* Torre con rayas */}
                            <rect x="37" y="40" width="26" height="15" fill="currentColor" opacity="0.8" />
                            <rect x="37" y="55" width="26" height="15" fill="currentColor" opacity="0.4" />
                            <rect x="37" y="70" width="26" height="15" fill="currentColor" opacity="0.8" />
                            <rect x="37" y="85" width="26" height="15" fill="currentColor" opacity="0.4" />
                            {/* Techo/linterna */}
                            <polygon points="50,25 62,40 38,40" fill="currentColor" />
                            {/* Luz brillante */}
                            <circle cx="50" cy="30" r="3" fill="currentColor" opacity="0.9" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Bienvenido a Faro</h1>
                    <p className="text-sm text-muted-foreground text-center mt-2">
                        Ingresa tus credenciales para acceder al panel de gestión institucional.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase text-muted-foreground ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full input-field pl-10 py-2.5 rounded-lg border bg-background/50 focus:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="nombre@institucion.cl"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase text-muted-foreground ml-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full input-field pl-10 py-2.5 rounded-lg border bg-background/50 focus:bg-background transition-all outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium flex items-center animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                Iniciar Sesión
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-muted-foreground">
                    <p>Credenciales de prueba: manuelmanodescofre@gmail.com / 1234</p>
                </div>
            </div>
        </div>
    );
}
