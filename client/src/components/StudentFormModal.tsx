import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Student, CreateStudentInput } from '../api/types';

interface StudentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateStudentInput) => void;
    student?: Student | null;
    isLoading?: boolean;
}

export function StudentFormModal({ isOpen, onClose, onSubmit, student, isLoading }: StudentFormModalProps) {
    const [formData, setFormData] = useState<CreateStudentInput>({
        rut: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        grade: '',
        section: '',
        address: '',
        emergencyContact: {
            name: '',
            phone: '',
            relationship: '',
        },
    });

    // Update form when editing student
    useEffect(() => {
        if (student) {
            setFormData({
                rut: student.rut,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                phone: student.phone,
                birthDate: student.birthDate.split('T')[0], // Extract date only
                grade: student.grade,
                section: student.section,
                address: student.address,
                emergencyContact: student.emergencyContact,
            });
        } else {
            // Reset form when creating new
            setFormData({
                rut: '',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                birthDate: '',
                grade: '',
                section: '',
                address: '',
                emergencyContact: {
                    name: '',
                    phone: '',
                    relationship: '',
                },
            });
        }
    }, [student]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-3xl rounded-xl shadow-2xl border max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold">
                        {student ? 'Editar Estudiante' : 'Nuevo Estudiante'}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* RUT */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                RUT <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                disabled={!!student || isLoading} // RUT no se puede editar
                                value={formData.rut}
                                onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                                placeholder="12345678-9"
                                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            {student && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    El RUT no se puede modificar
                                </p>
                            )}
                        </div>

                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                disabled={isLoading}
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                placeholder="Juan"
                                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Apellido <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                disabled={isLoading}
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                placeholder="Pérez"
                                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                disabled={isLoading}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="juan.perez@example.com"
                                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Teléfono <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                required
                                disabled={isLoading}
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+56912345678"
                                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
                            />
                        </div>

                        {/* Birth Date */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Fecha de Nacimiento <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                disabled={isLoading}
                                value={formData.birthDate}
                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
                            />
                        </div>

                        {/* Grade */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Grado <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                disabled={isLoading}
                                value={formData.grade}
                                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
                            >
                                <option value="">Seleccionar...</option>
                                <option value="7° Básico">7° Básico</option>
                                <option value="8° Básico">8° Básico</option>
                                <option value="1° Medio">1° Medio</option>
                                <option value="2° Medio">2° Medio</option>
                                <option value="3° Medio">3° Medio</option>
                                <option value="4° Medio">4° Medio</option>
                            </select>
                        </div>

                        {/* Section */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Sección <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                disabled={isLoading}
                                value={formData.section}
                                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                placeholder="A"
                                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
                            />
                        </div>

                        {/* Address - Full Width */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">
                                Dirección <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                disabled={isLoading}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Calle Falsa 123, Santiago"
                                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
                            />
                        </div>

                        {/* Emergency Contact Section */}
                        <div className="md:col-span-2 border-t pt-4 mt-2">
                            <h3 className="font-semibold text-lg mb-4">Contacto de Emergencia</h3>
                        </div>

                        {/* Emergency Contact Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                disabled={isLoading}
                                value={formData.emergencyContact.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        emergencyContact: { ...formData.emergencyContact, name: e.target.value },
                                    })
                                }
                                placeholder="María González"
                                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
                            />
                        </div>

                        {/* Emergency Contact Phone */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Teléfono <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                required
                                disabled={isLoading}
                                value={formData.emergencyContact.phone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        emergencyContact: { ...formData.emergencyContact, phone: e.target.value },
                                    })
                                }
                                placeholder="+56987654321"
                                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
                            />
                        </div>

                        {/* Emergency Contact Relationship */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Parentesco <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                disabled={isLoading}
                                value={formData.emergencyContact.relationship}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        emergencyContact: { ...formData.emergencyContact, relationship: e.target.value },
                                    })
                                }
                                placeholder="Madre"
                                className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-6 py-2 rounded-lg border hover:bg-muted transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>{student ? 'Actualizar' : 'Crear'} Estudiante</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
