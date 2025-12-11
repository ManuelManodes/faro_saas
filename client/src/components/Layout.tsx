import React from 'react';
import { Moon, Sun, User, Search, X } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { searchTerm, setSearchTerm, theme, toggleTheme } = useDashboard();
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
            <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-lg">V</span>
                        </div>
                        <span className="font-semibold text-lg tracking-tight hidden md:inline-block">Velvet Dashboard</span>
                    </div>

                    {/* Search Bar - Responsive */}
                    <div className="flex-1 max-w-md mx-2 md:mx-4">
                        <div className="relative group">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-9 pl-9 pr-8 sm:pr-12 rounded-md border border-input bg-background/50 focus:bg-background text-sm shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="p-0.5 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition-colors mr-1"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 md:gap-4 shrink-0">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <div className="flex items-center gap-2 pl-3 md:pl-4 border-l border-border">
                            <div className="flex flex-col items-end hidden md:flex">
                                <span className="text-sm font-medium">Manuel Manodes</span>
                                <span className="text-xs text-muted-foreground">Admin</span>
                            </div>
                            <div className="w-8 h-8 md:w-9 md:h-9 bg-secondary rounded-full flex items-center justify-center border border-border">
                                <User className="w-4 h-4 md:w-5 md:h-5 text-secondary-foreground" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
