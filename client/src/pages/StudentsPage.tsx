import { useState } from 'react';
import toast from 'react-hot-toast';
import { Users, Plus, Search, Filter, Edit2, Trash2 } from 'lucide-react';
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent } from '../hooks/useStudents';
import { StudentFormModal } from '../components/StudentFormModal';
import { DeleteConfirmation } from '../components/DeleteConfirmation';
import type { Student, CreateStudentInput } from '../api/types';

export function StudentsPage() {
    const [filters, setFilters] = useState<{
        status?: string;
        grade?: string;
        section?: string;
    }>({});

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    // Queries and Mutations
    const { data: students, isLoading, error } = useStudents(filters);
    const createMutation = useCreateStudent();
    const updateMutation = useUpdateStudent();
    const deleteMutation = useDeleteStudent();

    // Handlers
    const handleCreate = () => {
        setSelectedStudent(null);
        setIsFormOpen(true);
    };

    const handleEdit = (student: Student) => {
        setSelectedStudent(student);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (student: Student) => {
        setSelectedStudent(student);
        setIsDeleteOpen(true);
    };

    const handleSubmit = async (data: CreateStudentInput) => {
        try {
            if (selectedStudent) {
                // Update
                await updateMutation.mutateAsync({
                    id: selectedStudent.id,
                    data,
                });
                toast.success('Estudiante actualizado exitosamente');
            } else {
                // Create
                await createMutation.mutateAsync(data);
                toast.success('Estudiante creado exitosamente');
            }
            setIsFormOpen(false);
            setSelectedStudent(null);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
            toast.error(`Error: ${errorMessage}`);
        }
    };

    const handleDelete = async () => {
        if (!selectedStudent) return;

        try {
            await deleteMutation.mutateAsync(selectedStudent.id);
            toast.success('Estudiante marcado como retirado');
            setIsDeleteOpen(false);
            setSelectedStudent(null);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
            toast.error(`Error: ${errorMessage}`);
        }
    };

    if (error) {
        return (
            <div className="p-8 text-center">
                <div className="text-destructive">
                    <p className="text-lg font-semibold mb-2">Error al cargar estudiantes</p>
                    <p className="text-sm">{(error as Error).message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Estudiantes</h1>
                    <p className="text-muted-foreground mt-2">
                        Gestiona la información de todos los estudiantes
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-decorative-blue text-white rounded-lg hover:bg-decorative-blue/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Estudiante
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 p-4 rounded-xl border bg-card">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o RUT..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
                        />
                    </div>
                </div>

                <select
                    value={filters.status || ''}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                    className="px-4 py-2 rounded-lg border bg-background"
                >
                    <option value="">Todos los estados</option>
                    <option value="ACTIVO">Activos</option>
                    <option value="INACTIVO">Inactivos</option>
                    <option value="RETIRADO">Retirados</option>
                </select>

                <select
                    value={filters.grade || ''}
                    onChange={(e) => setFilters({ ...filters, grade: e.target.value || undefined })}
                    className="px-4 py-2 rounded-lg border bg-background"
                >
                    <option value="">Todos los grados</option>
                    <option value="7° Básico">7° Básico</option>
                    <option value="8° Básico">8° Básico</option>
                    <option value="1° Medio">1° Medio</option>
                    <option value="2° Medio">2° Medio</option>
                    <option value="3° Medio">3° Medio</option>
                    <option value="4° Medio">4° Medio</option>
                </select>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-xl border bg-card">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-decorative-blue/10">
                            <Users className="w-5 h-5 text-decorative-blue" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Estudiantes</p>
                            <p className="text-2xl font-bold">{students?.length || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-xl border bg-card">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-decorative-green/10">
                            <Users className="w-5 h-5 text-decorative-green" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Activos</p>
                            <p className="text-2xl font-bold">
                                {students?.filter((s: any) => s.status === 'ACTIVO').length || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-xl border bg-card">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-decorative-purple/10">
                            <Filter className="w-5 h-5 text-decorative-purple" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Filtrados</p>
                            <p className="text-2xl font-bold">{students?.length || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border bg-card overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-decorative-blue"></div>
                        <p className="mt-4 text-muted-foreground">Cargando estudiantes...</p>
                    </div>
                ) : students && students.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        RUT
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Nombre Completo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Grado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Edad
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {students.map((student: any) => (
                                    <tr
                                        key={student.id}
                                        className="hover:bg-muted/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {student.rut}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {student.fullName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                            {student.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {student.grade} {student.section}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'ACTIVO'
                                                    ? 'bg-success/10 text-success'
                                                    : student.status === 'INACTIVO'
                                                        ? 'bg-warning/10 text-warning'
                                                        : 'bg-destructive/10 text-destructive'
                                                    }`}
                                            >
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {student.age} años
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    className="p-2 text-decorative-blue hover:bg-decorative-blue/10 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(student)}
                                                    disabled={student.status === 'RETIRADO'}
                                                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title={student.status === 'RETIRADO' ? 'Ya está retirado' : 'Eliminar'}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No hay estudiantes</p>
                        <p className="text-sm mt-2">
                            {filters.status || filters.grade
                                ? 'Intenta cambiar los filtros'
                                : 'Agrega tu primer estudiante'}
                        </p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <StudentFormModal
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setSelectedStudent(null);
                }}
                onSubmit={handleSubmit}
                student={selectedStudent}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />

            <DeleteConfirmation
                isOpen={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedStudent(null);
                }}
                onConfirm={handleDelete}
                studentName={selectedStudent?.fullName || ''}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
