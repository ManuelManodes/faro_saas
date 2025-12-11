import React, { useState, useMemo } from 'react';
import { cn } from '../utils';
import { Edit2, Save, X, ChevronUp, ChevronDown, ArrowUpDown, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

type SortField = 'id' | 'name' | 'email' | 'role' | 'status';
type SortDirection = 'asc' | 'desc';

export function EditableTable() {
    const { filteredUsers, updateUser, searchTerm } = useDashboard();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<UserData | null>(null);

    // Sorting state - Default to ID Descending (Newest first)
    const [sortField, setSortField] = useState<SortField>('id');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    // Filtering state
    const [roleFilter, setRoleFilter] = useState<string>('All');
    const [statusFilter, setStatusFilter] = useState<string>('All');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Reset pagination when search term changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const processedUsers = useMemo(() => {
        let result = [...filteredUsers];

        // Apply filters
        if (roleFilter !== 'All') {
            result = result.filter(user => user.role === roleFilter);
        }
        if (statusFilter !== 'All') {
            result = result.filter(user => user.status === statusFilter);
        }

        // Apply sorting
        result.sort((a, b) => {
            // Handle ID sorting specifically as it's a number
            if (sortField === 'id') {
                return sortDirection === 'asc' ? a.id - b.id : b.id - a.id;
            }

            const aValue = String(a[sortField]).toLowerCase();
            const bValue = String(b[sortField]).toLowerCase();

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [filteredUsers, roleFilter, statusFilter, sortField, sortDirection]);

    // Ensure current page is valid when data changes (e.g. filtering reduces pages)
    React.useEffect(() => {
        const calculatedTotalPages = Math.ceil(processedUsers.length / itemsPerPage);
        if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
            setCurrentPage(1);
        }
    }, [processedUsers.length, itemsPerPage, currentPage]);

    // Pagination logic
    const totalPages = Math.ceil(processedUsers.length / itemsPerPage);
    const paginatedUsers = processedUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleEdit = (user: UserData) => {
        setEditingId(user.id);
        setEditForm({ ...user });
    };

    const handleSave = () => {
        if (editForm) {
            updateUser(editForm);
            setEditingId(null);
            setEditForm(null);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (editForm) {
            setEditForm({ ...editForm, [e.target.name]: e.target.value });
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ArrowUpDown className="w-4 h-4 text-muted-foreground/50" />;
        return sortDirection === 'asc'
            ? <ChevronUp className="w-4 h-4 text-primary" />
            : <ChevronDown className="w-4 h-4 text-primary" />;
    };

    const MobileUserCard = ({ user }: { user: UserData }) => (
        <div className="bg-card p-4 rounded-lg border border-border space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-medium text-foreground">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex gap-2">
                    {editingId === user.id ? (
                        <>
                            <button onClick={handleSave} className="p-1.5 bg-emerald-100 text-emerald-600 rounded dark:bg-emerald-900/30 dark:text-emerald-400">
                                <Save className="w-4 h-4" />
                            </button>
                            <button onClick={handleCancel} className="p-1.5 bg-red-100 text-red-600 rounded dark:bg-red-900/30 dark:text-red-400">
                                <X className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <button onClick={() => handleEdit(user)} className="p-1.5 bg-accent text-muted-foreground rounded hover:text-foreground">
                            <Edit2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {editingId === user.id ? (
                <div className="space-y-3 pt-2 border-t border-border">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={editForm?.name}
                            onChange={handleChange}
                            className="w-full bg-background border border-input rounded px-2 py-1.5 text-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={editForm?.email}
                            onChange={handleChange}
                            className="w-full bg-background border border-input rounded px-2 py-1.5 text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Role</label>
                            <select
                                name="role"
                                value={editForm?.role}
                                onChange={handleChange}
                                className="w-full bg-background border border-input rounded px-2 py-1.5 text-sm"
                            >
                                <option>Admin</option>
                                <option>User</option>
                                <option>Editor</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Status</label>
                            <select
                                name="status"
                                value={editForm?.status}
                                onChange={handleChange}
                                className="w-full bg-background border border-input rounded px-2 py-1.5 text-sm"
                            >
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3 pt-2 text-sm">
                    <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        user.role === "Admin" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                            user.role === "Editor" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    )}>
                        {user.role}
                    </span>
                    <span className={cn(
                        "inline-flex items-center gap-1.5",
                        user.status === "Active" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                    )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", user.status === "Active" ? "bg-emerald-600 dark:bg-emerald-400" : "bg-red-600 dark:bg-red-400")} />
                        {user.status}
                    </span>
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold">Recent Users</h3>
                    <p className="text-sm text-muted-foreground">Manage and edit user details directly.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <select
                            value={roleFilter}
                            onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                            className="h-8 text-sm bg-background border border-input rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                            <option value="All">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="User">User</option>
                            <option value="Editor">Editor</option>
                        </select>
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        className="h-8 text-sm bg-background border border-input rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Mobile View (Cards) */}
            <div className="md:hidden p-4 space-y-4">
                {paginatedUsers.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        No users found matching your filters.
                    </div>
                ) : (
                    paginatedUsers.map(user => (
                        <MobileUserCard key={user.id} user={user} />
                    ))
                )}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                        <tr>
                            <th
                                className="px-6 py-3 font-medium cursor-pointer hover:bg-muted/80 transition-colors"
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center gap-2">Name <SortIcon field="name" /></div>
                            </th>
                            <th
                                className="px-6 py-3 font-medium cursor-pointer hover:bg-muted/80 transition-colors"
                                onClick={() => handleSort('email')}
                            >
                                <div className="flex items-center gap-2">Email <SortIcon field="email" /></div>
                            </th>
                            <th
                                className="px-6 py-3 font-medium cursor-pointer hover:bg-muted/80 transition-colors"
                                onClick={() => handleSort('role')}
                            >
                                <div className="flex items-center gap-2">Role <SortIcon field="role" /></div>
                            </th>
                            <th
                                className="px-6 py-3 font-medium cursor-pointer hover:bg-muted/80 transition-colors"
                                onClick={() => handleSort('status')}
                            >
                                <div className="flex items-center gap-2">Status <SortIcon field="status" /></div>
                            </th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                    No users found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            paginatedUsers.map((user) => (
                                <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4 font-medium">
                                        {editingId === user.id ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={editForm?.name}
                                                onChange={handleChange}
                                                className="w-full bg-background border border-input rounded px-2 py-1"
                                            />
                                        ) : (
                                            user.name
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === user.id ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={editForm?.email}
                                                onChange={handleChange}
                                                className="w-full bg-background border border-input rounded px-2 py-1"
                                            />
                                        ) : (
                                            user.email
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === user.id ? (
                                            <select
                                                name="role"
                                                value={editForm?.role}
                                                onChange={handleChange}
                                                className="w-full bg-background border border-input rounded px-2 py-1"
                                            >
                                                <option>Admin</option>
                                                <option>User</option>
                                                <option>Editor</option>
                                            </select>
                                        ) : (
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-xs font-medium",
                                                user.role === "Admin" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                                                    user.role === "Editor" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                                        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                            )}>
                                                {user.role}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === user.id ? (
                                            <select
                                                name="status"
                                                value={editForm?.status}
                                                onChange={handleChange}
                                                className="w-full bg-background border border-input rounded px-2 py-1"
                                            >
                                                <option>Active</option>
                                                <option>Inactive</option>
                                            </select>
                                        ) : (
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5",
                                                user.status === "Active" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                                            )}>
                                                <span className={cn("w-1.5 h-1.5 rounded-full", user.status === "Active" ? "bg-emerald-600 dark:bg-emerald-400" : "bg-red-600 dark:bg-red-400")} />
                                                {user.status}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {editingId === user.id ? (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={handleSave} className="p-1 hover:bg-emerald-100 text-emerald-600 rounded dark:hover:bg-emerald-900/30">
                                                    <Save className="w-4 h-4" />
                                                </button>
                                                <button onClick={handleCancel} className="p-1 hover:bg-red-100 text-red-600 rounded dark:hover:bg-red-900/30">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={() => handleEdit(user)} className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-border flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, processedUsers.length)}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, processedUsers.length)}</span> of <span className="font-medium">{processedUsers.length}</span> results
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md border border-input hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="text-sm font-medium">
                        Page {currentPage} of {Math.max(totalPages, 1)}
                    </div>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 rounded-md border border-input hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
