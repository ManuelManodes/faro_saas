import { Search, Bell, Sun, Moon, Laptop, Command } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../utils";
import { useState } from "react";

export function Header() {
    const { theme, setTheme } = useTheme();
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    return (
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 px-6 flex items-center justify-between">
            {/* Search Bar */}
            <div className={cn(
                "flex items-center bg-muted/50 rounded-full px-4 py-2 transition-all duration-200 border border-transparent",
                isSearchFocused ? "w-96 border-primary/20 bg-background ring-2 ring-primary/10" : "w-64"
            )}>
                <Search className="h-4 w-4 text-muted-foreground mr-2" />
                <input
                    type="text"
                    placeholder="Buscar... (Cmd + K)"
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                />
                <div className="hidden lg:flex items-center gap-1 text-[10px] font-medium text-muted-foreground border rounded px-1.5 bg-background/50">
                    <Command className="h-3 w-3" /> K
                </div>
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

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium leading-none">Manuel Manodes</p>
                        <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                        <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                            <span className="font-bold text-primary text-xs">MM</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
