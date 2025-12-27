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
        <div className="min-h-screen bg-background text-foreground font-body transition-colors duration-300">
            <header className="border-b border-primary-600 sticky top-0 z-50 bg-primary text-white shadow-soft">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 bg-coral rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-display font-bold text-lg">F</span>
                        </div>
                        <span className="font-display font-semibold text-lg tracking-tight hidden md:inline-block">Faro</span>
                    </div>

                    {/* Search Bar - Responsive */}
                    <div className="flex-1 max-w-md mx-2 md:mx-4">
                        <div className="relative group">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/60 group-focus-within:text-white transition-colors" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-9 pl-9 pr-8 sm:pr-12 rounded-md border border-white/20 bg-white/10 focus:bg-white/20 text-sm text-white placeholder:text-white/60 shadow-sm transition-smooth focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan"
                            />
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="p-0.5 hover:bg-white/20 rounded-full text-white/60 hover:text-white transition-colors mr-1">
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/30 bg-white/10 px-1.5 font-mono text-[10px] font-medium text-white/80">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 md:gap-4 shrink-0">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-white/10 transition-smooth focus:outline-none focus:ring-2 focus:ring-cyan"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <div className="flex items-center gap-2 pl-3 md:pl-4 border-l border-white/20">
                            <div className="flex flex-col items-end hidden md:flex">
                                <span className="text-sm font-medium font-display">Manuel Manodes</span>
                                <span className="text-xs text-white/70">Admin</span>
                            </div>
                            <div className="w-8 h-8 md:w-9 md:h-9 bg-cyan rounded-full flex items-center justify-center border border-white/30">
                                <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
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
