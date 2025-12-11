import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialData } from '../initialData';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

interface Stat {
    title: string;
    value: string;
    change: string;
    icon: string;
}

interface DashboardContextType {
    users: User[];
    stats: Stat[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    addUser: (user: Omit<User, 'id'>) => void;
    updateUser: (user: User) => void;
    filteredUsers: User[];
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [users, setUsers] = useState<User[]>(initialData.users);
    const [stats, setStats] = useState<Stat[]>(initialData.stats);
    const [searchTerm, setSearchTerm] = useState('');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Fetch users from API
    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error('Error fetching users:', err));
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const addUser = async (newUser: Omit<User, 'id'>) => {
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });
            const savedUser = await res.json();
            setUsers(prev => [savedUser, ...prev]);
        } catch (err) {
            console.error('Error adding user:', err);
        }
    };

    const updateUser = async (updatedUser: User) => {
        try {
            const res = await fetch(`/api/users/${updatedUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser),
            });
            const savedUser = await res.json();
            setUsers(prev => prev.map(user => user.id === savedUser.id ? savedUser : user));
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Update stats dynamically based on users
    useEffect(() => {
        const totalUsers = users.length;
        const activeSessions = users.filter(u => u.status === 'Active').length; // Mock logic

        setStats(prevStats => [
            { ...prevStats[0], value: totalUsers.toLocaleString() },
            { ...prevStats[1], value: (activeSessions * 123).toLocaleString() }, // Mock dynamic value
            prevStats[2],
            prevStats[3]
        ]);
    }, [users]);

    return (
        <DashboardContext.Provider value={{ users, stats, searchTerm, setSearchTerm, addUser, updateUser, filteredUsers, theme, toggleTheme }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
}
