import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useHollandTests, useCreateHollandTest } from "../hooks/useHollandTest";
import { useStudents } from "../hooks/useStudents";
import { BrainCircuit, CheckCircle, ChevronRight, Save, User } from "lucide-react";
import { cn } from "../utils";

const QUESTIONS = [
    { id: "R", text: "¿Te gusta trabajar con herramientas, máquinas o construir cosas?", type: "Realista" },
    { id: "I", text: "¿Disfrutas resolviendo problemas matemáticos, científicos o complejos?", type: "Investigativo" },
    { id: "A", text: "¿Te atraen las actividades creativas como pintar, escribir o la música?", type: "Artístico" },
    { id: "S", text: "¿Te gusta enseñar, ayudar, curar o servir a otros?", type: "Social" },
    { id: "E", text: "¿Te sientes cómodo liderando, persuadiendo o vendiendo ideas?", type: "Emprendedor" },
    { id: "C", text: "¿Prefieres trabajar de manera ordenada, con datos, archivos o reglas claras?", type: "Convencional" },
];



export function HollandTestPage() {
    const { user } = useAuth();
    const { data: results = [] } = useHollandTests();
    const createHollandTest = useCreateHollandTest();
    const { data: allStudents = [] } = useStudents({ status: 'ACTIVO' });

    const [step, setStep] = useState(1);
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [answers, setAnswers] = useState<Record<string, number>>({});

    const selectedStudent = allStudents.find(s => s.id === selectedStudentId);

    const handleAnswer = (questionId: string, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const calculateResult = () => {
        // Simple logic: highest score. In a real test, this would be more complex summation.
        const entries = Object.entries(answers);
        if (entries.length === 0) return "N/A";

        // Sort by value descending
        const sorted = entries.sort(([, a], [, b]) => b - a);
        const topTypeKey = sorted[0][0];
        return QUESTIONS.find(q => q.id === topTypeKey)?.type || "Indefinido";
    };

    const handleSave = async () => {
        if (!selectedStudent || !user) return;

        const dominant = calculateResult();

        // Map answers (R,I,A,S,E,C) to RIASEC scores (0-100)
        const riasecScores = {
            realistic: (answers['R'] || 0) * 20,      // Convert 1-5 to 0-100
            investigative: (answers['I'] || 0) * 20,
            artistic: (answers['A'] || 0) * 20,
            social: (answers['S'] || 0) * 20,
            enterprising: (answers['E'] || 0) * 20,
            conventional: (answers['C'] || 0) * 20,
        };

        // Get top 3 dominant types
        const sortedTypes = Object.entries(answers)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([key]) => key);

        try {
            await createHollandTest.mutateAsync({
                studentId: selectedStudent.id,
                testDate: new Date().toISOString().split('T')[0],
                scores: riasecScores,
                dominantTypes: sortedTypes.length === 3 ? sortedTypes : ['R', 'I', 'A'], // Fallback
                interpretation: `Perfil vocacional dominante: ${dominant}. Puntuaciones: ${Object.entries(answers).map(([k, v]) => `${k}=${v}`).join(', ')}.`,
                recommendations: [`Carreras relacionadas con perfil ${dominant}`],
                status: 'COMPLETADO',
                administeredBy: user.email,
            });

            setStep(3); // Result view
        } catch (error) {
            console.error("Error saving Holland test:", error);
            alert('❌ Error al guardar el test. Por favor, intenta de nuevo.');
        }
    };

    const reset = () => {
        setStep(1);
        setSelectedStudentId("");
        setAnswers({});
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-600">
                    <BrainCircuit className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Test Vocacional de Holland</h1>
                    <p className="text-muted-foreground">Evaluación de intereses y habilidades para orientación vocacional.</p>
                </div>
            </div>

            {step === 1 && (
                <div className="card bg-card border rounded-xl p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                    <h2 className="text-xl font-semibold mb-6">Paso 1: Seleccionar Alumno</h2>
                    <div className="space-y-4">
                        <label className="text-sm font-medium">Busque el alumno a evaluar</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <select
                                className="w-full input-field pl-10 py-3 rounded-lg border bg-background"
                                value={selectedStudentId}
                                onChange={(e) => setSelectedStudentId(e.target.value)}
                            >
                                <option value="">Seleccione un alumno...</option>
                                {allStudents.map(s => (
                                    <option key={s.id} value={s.id}>{s.fullName} ({s.grade} {s.section})</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end mt-8">
                            <button
                                disabled={!selectedStudentId}
                                onClick={() => setStep(2)}
                                className="btn bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                Continuar <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="card bg-card border rounded-xl p-8 shadow-sm animate-in fade-in slide-in-from-right-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-semibold">Evaluando a: <span className="text-primary">{selectedStudent?.fullName}</span></h2>
                        <span className="text-sm text-muted-foreground">Pregunta {Object.keys(answers).length} / {QUESTIONS.length}</span>
                    </div>

                    <div className="space-y-8">
                        {QUESTIONS.map((q) => (
                            <div key={q.id} className="space-y-3 pb-6 border-b last:border-0 border-dashed">
                                <p className="font-medium text-lg">{q.text}</p>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-muted-foreground font-medium uppercase w-12 text-right">No me gusta</span>
                                    <div className="flex-1 flex justify-between px-4 bg-muted/30 py-3 rounded-full relative">
                                        {[1, 2, 3, 4, 5].map((val) => (
                                            <button
                                                key={val}
                                                onClick={() => handleAnswer(q.id, val)}
                                                className={cn(
                                                    "w-8 h-8 rounded-full text-sm font-bold transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50",
                                                    answers[q.id] === val
                                                        ? "bg-primary text-primary-foreground scale-110 shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background"
                                                        : "bg-background text-muted-foreground hover:bg-muted-foreground/10"
                                                )}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground font-medium uppercase w-12">Me encanta</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between mt-8 pt-4">
                        <button
                            onClick={() => setStep(1)}
                            className="text-muted-foreground hover:text-foreground font-medium px-4 py-2"
                        >
                            Atrás
                        </button>
                        <button
                            disabled={Object.keys(answers).length < QUESTIONS.length}
                            onClick={handleSave}
                            className="btn bg-green-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-green-600/20"
                        >
                            <Save className="w-4 h-4" /> Finalizar y Guardar
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="card bg-card border rounded-xl p-8 shadow-sm text-center animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">¡Test Completado!</h2>
                    <p className="text-muted-foreground mb-8">El perfil vocacional ha sido registrado exitosamente.</p>

                    <div className="bg-muted/30 p-6 rounded-xl max-w-md mx-auto mb-8 border border-dashed">
                        <p className="text-sm text-muted-foreground uppercase font-semibold mb-2">Resultado Dominante</p>
                        <p className="text-4xl font-bold text-primary mb-2">{calculateResult()}</p>
                        <p className="text-sm text-muted-foreground">Alumno: {selectedStudent?.fullName}</p>
                    </div>

                    <button
                        onClick={reset}
                        className="btn bg-secondary text-secondary-foreground px-8 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-all"
                    >
                        Realizar Otro Test
                    </button>
                </div>
            )}

            {/* Recent Tests Table (Mini Dashboard within module) */}
            <div className="mt-12">
                <h3 className="font-semibold text-lg mb-4">Evaluaciones Recientes</h3>
                <div className="bg-card border rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="p-4 font-medium">Fecha</th>
                                <th className="p-4 font-medium">Alumno</th>
                                <th className="p-4 font-medium">Resultado</th>
                                <th className="p-4 font-medium">Evaluador</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {results.slice().reverse().map((res) => {
                                const student = allStudents.find(s => s.id === res.studentId);
                                return (
                                    <tr key={res.id}>
                                        <td className="p-4">{new Date(res.testDate).toLocaleDateString()}</td>
                                        <td className="p-4 font-medium">{student?.fullName || 'Estudiante no encontrado'}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                                {res.dominantTypes[0] || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-muted-foreground">{res.administeredBy}</td>
                                    </tr>
                                );
                            })}
                            {results.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-muted-foreground italic">No hay registros aún.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
