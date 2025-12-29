import { NavLink } from "react-router-dom";
import { LayoutDashboard, Calendar, Users, ClipboardCheck, BrainCircuit } from 'lucide-react';
import { cn } from "../../utils";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/app" },
    { icon: Users, label: "Estudiantes", to: "/app/students" },
    { icon: Calendar, label: "Calendario", to: "/app/calendar" },
    { icon: ClipboardCheck, label: "Asistencias", to: "/app/attendance" },
    { icon: BrainCircuit, label: "Test Vocacional", to: "/app/holland-test" },
];

export function Sidebar() {
    return (
        <aside className="w-64 border-r bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/20 min-h-screen flex flex-col hidden md:flex z-20">
            <NavLink to="/app" className="h-16 flex items-center px-6 border-b hover:bg-muted/50 transition-colors cursor-pointer">
                <svg className="h-6 w-6 text-primary mr-2" viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Haz de luz */}
                    <g opacity="0.3">
                        <path d="M50,28 L90,5 L90,51 Z" fill="currentColor" />
                    </g>
                    {/* Base */}
                    <rect x="35" y="100" width="30" height="40" fill="currentColor" rx="2" />
                    {/* Torre con rayas */}
                    <rect x="37" y="40" width="26" height="15" fill="currentColor" opacity="0.8" />
                    <rect x="37" y="55" width="26" height="15" fill="currentColor" opacity="0.4" />
                    <rect x="37" y="70" width="26" height="15" fill="currentColor" opacity="0.8" />
                    <rect x="37" y="85" width="26" height="15" fill="currentColor" opacity="0.4" />
                    {/* Techo */}
                    <polygon points="50,25 62,40 38,40" fill="currentColor" />
                    {/* Luz */}
                    <circle cx="50" cy="30" r="3" fill="currentColor" opacity="0.9" />
                </svg>
                <span className="font-bold text-lg tracking-tight">Faro</span>
            </NavLink>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/app"}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t">
                <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground">© 2025 Faro Inc.</p>
                </div>
            </div>
        </aside>
    );
}
