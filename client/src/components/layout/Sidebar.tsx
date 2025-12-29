import { NavLink } from "react-router-dom";
import { Calendar, LayoutDashboard, ClipboardCheck, BrainCircuit, Building2, Users } from "lucide-react";
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
            <div className="h-16 flex items-center px-6 border-b">
                <Building2 className="h-6 w-6 text-primary mr-2" />
                <span className="font-bold text-lg tracking-tight">Faro</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )
                        }
                    >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.label}
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
