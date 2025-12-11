import { createContext, useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

type User = {
    email: string;
    name: string;
    role: "admin" | "student";
};

type AuthContextType = {
    user: User | null;
    login: (email: string, pass: string) => boolean;
    logout: () => void;
    isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem("auth_user");
        return saved ? JSON.parse(saved) : null;
    });

    const login = (email: string, pass: string) => {
        // Hardcoded credentials as requested
        if (email === "manuelmanodescofre@gmail.com" && pass === "1234") {
            const newUser = { email, name: "Manuel Manodes", role: "admin" as const };
            setUser(newUser);
            localStorage.setItem("auth_user", JSON.stringify(newUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("auth_user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

export function RequireAuth({ children }: { children: React.ReactElement }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
