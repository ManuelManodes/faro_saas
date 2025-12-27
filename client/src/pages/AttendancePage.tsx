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
    const selectedCourse = coursesWithStudents.find(c => c.id === selectedCourseId);
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
            }));

            await bulkCreateAttendance.mutateAsync({
                courseId: selectedCourse.id,
                date: format(new Date(), 'yyyy-MM-dd'),
                attendances,
            });

            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (error) {
            console.error("Error saving attendance:", error);
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
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Registro de Asistencia</h1>
                    <p className="text-muted-foreground">
                        {format(new Date(), "dd 'de' MMMM, yyyy")} • {format(new Date(), "HH:mm")}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-card border rounded-lg px-3 py-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <select
                            className="bg-transparent outline-none text-sm font-medium w-full md:w-48"
                            value={selectedCourseId}
                            onChange={(e) => {
                                setSelectedCourseId(e.target.value);
                                setAbsentStudents(new Set());
                                setIsSaved(false);
                            }}
                        >
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.grade} {course.section} - {course.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                    <h2 className="font-semibold text-lg">Lista de Estudiantes</h2>
                    <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{courseStudents.length}</span> estudiantes matriculados
                    </div>
                </div>

                <div className="divide-y">
                    {courseStudents.map((student) => {
                        const isAbsent = absentStudents.has(student.id);
                        return (
                            <div
                                key={student.id}
                                className={cn(
                                    "p-4 flex items-center justify-between transition-colors hover:bg-muted/20",
                                    isAbsent ? "bg-destructive/5" : "bg-background"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                                        isAbsent ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                                    )}>
                                        {student.firstName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium">{student.fullName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {isAbsent ? "Ausente" : "Presente"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleAttendance(student.id)}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border",
                                            isAbsent
                                                ? "bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90"
                                                : "bg-background text-muted-foreground hover:bg-muted"
                                        )}
                                    >
                                        <X className="w-4 h-4" /> Ausente
                                    </button>
                                    <button
                                        onClick={() => {
                                            const newAbsent = new Set(absentStudents);
                                            newAbsent.delete(student.id);
                                            setAbsentStudents(newAbsent);
                                        }}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border",
                                            !isAbsent
                                                ? "bg-green-600 text-white border-green-600 shadow-sm"
                                                : "bg-background text-muted-foreground hover:bg-muted"
                                        )}
                                    >
                                        <Check className="w-4 h-4" /> Presente
                                    </button>
                                </div>
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
