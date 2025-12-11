import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

export function RegistrationForm() {
    const { addUser } = useDashboard();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'User',
        status: 'Active'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addUser({
            name: formData.name,
            email: formData.email,
            role: formData.role,
            status: formData.status
        });
        setFormData({
            name: '',
            email: '',
            role: 'User',
            status: 'Active'
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, status: (e.target as HTMLInputElement).checked ? 'Active' : 'Inactive' }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    return (
        <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-1">Registration</h2>
            <p className="text-sm text-muted-foreground mb-6">Create a new account entry.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="John Doe"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="john@example.com"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Role
                    </label>
                    <select
                        id="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Status
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="status"
                            checked={formData.status === 'Active'}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-primary text-primary focus:ring-ring"
                        />
                        <label htmlFor="status" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Active Account
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 mt-2"
                >
                    Register User
                </button>
            </form>
        </div>
    );
}
