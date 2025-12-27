import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useCourses } from "../hooks/useCourses";
import { useStudents } from "../hooks/useStudents";
import { useBulkCreateAttendance } from "../hooks/useAttendance";
import { Check, X, Users, Save, CheckCircle2 } from "lucide-react";
import { cn } from "../utils";

export function AttendancePage() {
    const { data: courses = [], isLoading: coursesLoading } = useCourses();
    const bulkCreateAttendance = useBulkCreateAttendance();

    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [absentStudents, setAbsentStudents] = useState<Set<string>>(new Set());
    const [isSaved, setIsSaved] = useState(false);



    // Load all students (mostrar todos sin filtrar temporalmente)
    const { data: allStudents = [], isLoading: studentsLoading } = useStudents({ status: 'ACTIVO' });


    // Filter courses to show only those with students
    const coursesWithStudents = courses.filter(course =>
        allStudents.some(student =>
            student.grade === course.grade && student.section === course.section
        )
    );

    // DEBUG
    console.log('🔍 DEBUG - Total courses:', courses.length);
    courses.forEach(c => console.log(`  Course: "${c.name}" - Grade:"${c.grade}" Section:"${c.section}"`));
    console.log('🔍 DEBUG - Total students:', allStudents.length);
    allStudents.forEach(s => console.log(`  Student: "${s.fullName}" - Grade:"${s.grade}" Section:"${s.section}"`));
    console.log('🔍 DEBUG - Filtered courses:', coursesWithStudents.length, coursesWithStudents);

    // Filter students by course grade/section

    const courseStudents = allStudents; // Mostrar TODOS temporalmente

    // Set first course as selected when courses load
    useEffect(() => {
        if (courses.length > 0 && !selectedCourseId) {
            setSelectedCourseId(courses[0].id);
        }
    }, [courses, selectedCourseId]);

    const toggleAttendance = (studentId: string) => {
        const newAbsent = new Set(absentStudents);
        if (newAbsent.has(studentId)) {
            newAbsent.delete(studentId);
        } else {
            newAbsent.add(studentId);
        }
        setAbsentStudents(newAbsent);
        setIsSaved(false);
    };

    const handleSave = async () => {
        const selectedCourse = courses.find(c => c.id === selectedCourseId);
        if (!selectedCourse || courseStudents.length === 0) return;

        try {
            // Create attendance records for all students
            const attendances = courseStudents.map(student => ({
                studentId: student.id,
                status: absentStudents.has(student.id) ? 'AUSENTE' as const : 'PRESENTE' as const,
                arrivalTime: '',  // Campo requerido por backend
                notes: '',        // Campo requerido por backend
            }));

            const payload = {
                courseId: selectedCourse.id,
                date: format(new Date(), 'yyyy-MM-dd'),
                attendances,
            };

            console.log('🚀 Sending to backend:', payload);
            await bulkCreateAttendance.mutateAsync(payload);

            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (error: any) {
            console.error("Error saving attendance:", error);

            // Mostrar mensaje específico si ya existe registro
            if (error?.response?.status === 400 || error?.response?.data?.message?.includes('registro')) {
                alert(`⚠️ Ya existe un registro de asistencia para este curso en la fecha ${format(new Date(), 'dd/MM/yyyy')}.\n\nNo se pueden duplicar registros para la misma fecha.`);
            } else {
                alert('❌ Error al guardar la asistencia. Por favor, intenta de nuevo.');
            }
        }
    };

    // Show loading state AFTER all hooks
    if (coursesLoading || studentsLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <Users className="w-12 h-12 text-muted-foreground animate-pulse mx-auto mb-4" />
                    <p className="text-muted-foreground">Cargando cursos y estudiantes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-coral/10 rounded-xl">
                    <Users className="w-8 h-8 text-coral" />
                </div>
                <div>
                    <h1 className="text-3xl font-display font-bold text-primary">Gestión de Asistencia</h1>
                    <p className="text-muted-foreground mt-1">Registra la asistencia diaria de tus estudiantes</p>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-card border rounded-2xl shadow-soft p-8 transition-smooth">
                {/* Course Selector */}
                <div className="mb-8">
                    <label className="block text-sm font-display font-semibold text-primary mb-3">
                        Seleccionar Curso
                    </label>
                    <select
                        value={selectedCourseId}
                        onChange={(e) => {
                            setSelectedCourseId(e.target.value);
                            setAbsentStudents(new Set());
                            setIsSaved(false);
                        }}
                        className="w-full md:w-96 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan focus:border-cyan bg-white transition-smooth"
                    >
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.name} - {course.grade} {course.section}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Display */}
                <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-lavender/20 rounded-full border border-lavender/40">
                    <span className="text-sm font-medium text-primary">
                        📅 {format(new Date(), "EEEE, dd 'de' MMMM yyyy", { locale: require('date-fns/locale/es') })}
                    </span>
                </div>

                {/* Students List */}
                <div className="space-y-2 mb-8">
                    {courseStudents.map(student => {
                        const isAbsent = absentStudents.has(student.id);
                        return (
                            <button
                                key={student.id}
                                onClick={() => toggleAttendance(student.id)}
                                className={cn(
                                    "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-smooth hover:shadow-md",
                                    isAbsent
                                        ? "bg-red-50 border-red-300 dark:bg-red-900/10 dark:border-red-800"
                                        : "bg-green-50 border-green-300 dark:bg-green-900/10 dark:border-green-800"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-white",
                                        isAbsent ? "bg-red-500" : "bg-green-500"
                                    )}>
                                    </div>
                                    );
                    })}
                                </div>

                                <div className="p-4 bg-muted/30 border-t flex justify-end">
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaved}
                                        className={cn(
                                            "px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all",
                                            isSaved ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"
                                        )}
                                    >
                                        {isSaved ? (
                                            <>
                                                <CheckCircle2 className="w-5 h-5" /> Registrado
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" /> Guardar Registro
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
        </div>
                );
}
