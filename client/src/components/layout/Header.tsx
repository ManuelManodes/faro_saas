import { Search, Bell, Sun, Moon, Laptop, Command, X, LogOut, Settings, User as UserIcon, ChevronDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const APP_ROUTES = [
    { name: "Dashboard", path: "/app" },
    { name: "Calendario", path: "/app/calendar" },
    { name: "Asistencia", path: "/app/attendance" },
    { name: "Test Holland", path: "/app/holland-test" },
];

export function Header() {
    const { theme, setTheme } = useTheme();
    const { logout, user } = useAuth();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    // Filter routes based on search query
    const filteredRoutes = searchQuery
        ? APP_ROUTES.filter(route =>
            route.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle keyboard navigation in search input
    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredRoutes.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredRoutes.length) % filteredRoutes.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && filteredRoutes[selectedIndex]) {
                navigate(filteredRoutes[selectedIndex].path);
                setSearchQuery("");
                setSelectedIndex(-1);
                searchInputRef.current?.blur();
            } else if (filteredRoutes.length > 0) {
                // If no specific index selected but results exist, go to first
                navigate(filteredRoutes[0].path);
                setSearchQuery("");
                setSelectedIndex(-1);
                searchInputRef.current?.blur();
            }
        } else if (e.key === 'Escape') {
            searchInputRef.current?.blur();
        }
    };

    return (
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 px-6 flex items-center justify-between">
            {/* Search Bar */}
            <div className={cn(
                "relative flex items-center bg-muted/50 rounded-full px-4 py-2 transition-all duration-200 border border-transparent",
                isSearchFocused ? "w-96 border-primary/20 bg-background ring-2 ring-primary/10" : "w-64"
            )}>
                <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
                <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSelectedIndex(0); // Reset selection on type
                    }}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Buscar vistas..."
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => {
                        // Delay hide to allow click on dropdown items
                        setTimeout(() => setIsSearchFocused(false), 200);
                    }}
                />

                {searchQuery && (
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            searchInputRef.current?.focus();
                        }}
                        className="mr-2 p-0.5 rounded-full hover:bg-muted-foreground/20 text-muted-foreground transition-colors"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}

                <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground border rounded-md px-2 py-0.5 bg-background/50 shrink-0 ml-1">
                    <Command className="h-3 w-3" />
                    <span>K</span>
                </div>

                {/* Autocomplete Dropdown */}
                {isSearchFocused && searchQuery && filteredRoutes.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg overflow-hidden py-1 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                        {filteredRoutes.map((route, index) => (
                            <button
                                key={route.path}
                                onClick={() => {
                                    navigate(route.path);
                                    setSearchQuery("");
                                }}
                                className={cn(
                                    "w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors",
                                    index === selectedIndex ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                                )}
                            >
                                <Search className="h-3 w-3 opacity-50" />
                                {route.name}
                            </button>
                        ))}
                    </div>
                )}
                {isSearchFocused && searchQuery && filteredRoutes.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg px-4 py-3 text-sm text-muted-foreground z-20">
                        No se encontraron resultados
                    </div>
                )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
                <button className="relative p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full ring-2 ring-background"></span>
                </button>

                {/* Theme Toggle */}
                <div className="flex items-center border rounded-full p-1 bg-muted/30">
                    <button
                        onClick={() => setTheme("light")}
                        className={cn("p-1.5 rounded-full transition-all", theme === "light" && "bg-background shadow-sm text-warning")}
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
                        className={cn("p-1.5 rounded-full transition-all", theme === "dark" && "bg-background shadow-sm text-info")}
                    >
                        <Moon className="h-4 w-4" />
                    </button>
                </div>

                {/* User Profile Menu */}
                <div className="relative pl-4 border-l" ref={userMenuRef}>
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-3 hover:bg-muted/50 p-1.5 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium leading-none">{user?.name || "Usuario"}</p>
                            <p className="text-xs text-muted-foreground">{user?.email || "Admin"}</p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                            <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                                <span className="font-bold text-primary text-xs">
                                    {user?.name ? user.name.substring(0, 2).toUpperCase() : "MM"}
                                </span>
                            </div>
                        </div>
                        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isUserMenuOpen ? "rotate-180" : "")} />
                    </button>

                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-background border rounded-lg shadow-lg shadow-black/5 overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-2 border-b border-border/50 bg-muted/30">
                                <p className="text-sm font-medium">Mi Cuenta</p>
                                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>

                            <div className="p-1">
                                <button className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted rounded-md transition-colors text-foreground">
                                    <UserIcon className="h-4 w-4 opacity-70" />
                                    Perfil
                                </button>
                                <button className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted rounded-md transition-colors text-foreground">
                                    <Settings className="h-4 w-4 opacity-70" />
                                    Preferencias
                                </button>
                            </div>

                            <div className="border-t border-border/50 my-1"></div>

                            <div className="p-1">
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
