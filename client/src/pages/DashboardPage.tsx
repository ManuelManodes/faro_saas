import { Users, Calendar as CalendarIcon, BrainCircuit, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const stats = [
    { label: "Eventos Hoy", value: "3", icon: CalendarIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Asistencia Promedio", value: "92%", icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Tests Realizados", value: "12", icon: BrainCircuit, color: "text-purple-500", bg: "bg-purple-500/10" },
];

export function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Hola, {user?.name.split(" ")[0]}</h1>
                <p className="text-muted-foreground mt-2">Bienvenido al panel de control de EduSaaS. Aquí tienes un resumen de hoy.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => (
                    <div key={index} className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <div className="text-2xl font-bold mt-2">{stat.value}</div>
                            </div>
                            <div className={`p-3 rounded-full ${stat.bg}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="p-6 rounded-xl border bg-card shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Accesos Rápidos</h3>
                    </div>
                    <div className="grid gap-2">
                        {[
                            { label: "Gestionar Calendario", to: "/calendar" },
                            { label: "Registrar Asistencia", to: "/attendance" },
                            { label: "Nuevo Test Vocacional", to: "/holland-test" },
                        ].map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors group"
                            >
                                <span className="font-medium">{link.label}</span>
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
