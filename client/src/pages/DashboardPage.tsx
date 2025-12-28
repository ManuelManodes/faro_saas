import { Users, Calendar as CalendarIcon, ArrowUpRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStudents } from "../hooks/useStudents";
import { useCourses } from "../hooks/useCourses";
import { useUpcomingEvents } from "../hooks/useCalendarEvents";

export function DashboardPage() {
    const { user } = useAuth();

    // Fetch real data from backend
    const { data: students, isLoading: studentsLoading } = useStudents({ status: 'ACTIVO' });
    const { data: courses, isLoading: coursesLoading } = useCourses({ status: 'ACTIVO' });
    const { data: upcomingEvents, isLoading: eventsLoading } = useUpcomingEvents(5);

    const stats = [
        {
            label: "Estudiantes Activos",
            value: studentsLoading ? "..." : (students?.length || 0).toString(),
            icon: Users,
            color: "text-muted-foreground",
            bg: "bg-muted/30"
        },
        {
            label: "Cursos Activos",
            value: coursesLoading ? "..." : (courses?.length || 0).toString(),
            icon: BookOpen,
            color: "text-muted-foreground",
            bg: "bg-muted/30"
        },
        {
            label: "Próximos Eventos",
            value: eventsLoading ? "..." : (upcomingEvents?.length || 0).toString(),
            icon: CalendarIcon,
            color: "text-muted-foreground",
            bg: "bg-muted/30"
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-display font-bold tracking-tight text-primary">Hola, {user?.name.split(" ")[0]} 👋</h1>
                <p className="text-muted-foreground mt-2 font-body">Bienvenido al panel de control de Faro. Aquí tienes un resumen de hoy.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => (
                    <div key={index} className="p-6 rounded-xl border bg-card text-card-foreground shadow-soft transition-smooth hover:shadow-soft-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <div className="text-3xl font-display font-bold mt-2 text-primary">{stat.value}</div>
                            </div>
                            <div className={`p-3 rounded-full ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="p-6 rounded-xl border bg-card shadow-soft">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-semibold text-lg text-primary">Accesos Rápidos</h3>
                    </div>
                    <div className="grid gap-2">
                        {[
                            { label: "Gestionar Estudiantes", to: "/app/students" },
                            { label: "Gestionar Calendario", to: "/app/calendar" },
                            { label: "Registrar Asistencia", to: "/app/attendance" },
                            { label: "Nuevo Test Vocacional", to: "/app/holland-test" },
                        ].map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 hover:bg-muted/20 transition-smooth group"
                            >
                                <span className="font-medium group-hover:text-primary transition-smooth">{link.label}</span>
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-smooth" />
                            </Link>
                        ))}
                    </div>
                </div>


                <div className="p-6 rounded-xl border bg-card shadow-soft">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display font-semibold text-lg text-primary">Próximos Eventos</h3>
                        <Link to="/app/calendar" className="text-sm text-muted-foreground hover:text-primary transition-smooth font-medium">
                            Ver todos
                        </Link>
                    </div>
                    {eventsLoading ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>Cargando eventos...</p>
                        </div>
                    ) : upcomingEvents && upcomingEvents.length > 0 ? (
                        <div className="space-y-3">
                            {upcomingEvents.slice(0, 3).map((event: any) => (
                                <div
                                    key={event.id}
                                    className="p-3 rounded-lg border hover:bg-muted transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{event.title}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(event.startDate).toLocaleDateString('es-CL')}
                                            </p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${event.eventType === 'EVALUACION' ? 'bg-red-500/10 text-red-600' :
                                            event.eventType === 'REUNION' ? 'bg-blue-500/10 text-blue-600' :
                                                'bg-purple-500/10 text-purple-600'
                                            }`}>
                                            {event.eventType}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No hay eventos próximos</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
