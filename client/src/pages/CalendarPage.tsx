import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, parseISO } from "date-fns";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { cn } from "../utils";
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon, Trash2 } from "lucide-react";

type EventType = "meeting" | "class" | "exam";

interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    type: EventType;
    description?: string;
}

const TYPE_COLORS: Record<EventType, string> = {
    meeting: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900",
    class: "bg-green-500/10 text-green-600 border-green-200 dark:border-green-900",
    exam: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900",
};


export function CalendarPage() {
    const { data: events, add, remove } = useLocalStorage<CalendarEvent>("calendar_events", []);
    const [currentDate, setCurrentDate] = useState(new Date());

    const [filter, setFilter] = useState<EventType | "all">("all");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Calendar Logic
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Navigation
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    // Filter Logic
    const filteredEvents = events.filter((e) => filter === "all" || e.type === filter);

    // Form State
    const [formState, setFormState] = useState<Partial<CalendarEvent>>({
        type: "meeting",
        startTime: "09:00",
        endTime: "10:00",
    });

    const handleDayClick = (day: Date) => {
        setFormState(prev => ({ ...prev, date: format(day, "yyyy-MM-dd") }));
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formState.title && formState.date && formState.type) {
            add(formState as Omit<CalendarEvent, "id">);
            setIsModalOpen(false);
            setFormState({ type: "meeting", startTime: "09:00", endTime: "10:00" });
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
                    <p className="text-muted-foreground">Gestiona tus actividades académicas.</p>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        className="input-field p-2 rounded-lg border bg-background text-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as EventType | "all")}
                    >
                        <option value="all">Todos los eventos</option>
                        <option value="meeting">Reuniones</option>
                        <option value="class">Clases</option>
                        <option value="exam">Evaluaciones</option>
                    </select>
                    <button
                        onClick={() => handleDayClick(new Date())}
                        className="btn bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Nuevo Evento
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col">
                {/* Calendar Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold capitalize font-mono">
                        {format(currentDate, "MMMM yyyy")}
                    </h2>
                    <div className="flex items-center gap-1">
                        <button onClick={prevMonth} className="p-2 hover:bg-muted rounded-full"><ChevronLeft className="w-5 h-5" /></button>
                        <button onClick={() => setCurrentDate(new Date())} className="text-sm font-medium px-3 py-1 hover:bg-muted rounded-md">Hoy</button>
                        <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-full"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 flex-1 min-h-[500px]">
                    {/* Weekday Headers */}
                    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                        <div key={day} className="p-2 text-center text-xs font-semibold text-muted-foreground border-b border-r last:border-r-0 bg-muted/30">
                            {day}
                        </div>
                    ))}

                    {/* Days */}
                    {/* Padding for start of month (simplified: assuming first day logic handled by css grid alignment if we knew offset, or just map placeholders) */}
                    {/* Actually let's do proper offset calculation */}
                    {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} className="border-b border-r last:border-r-0 bg-muted/10" />
                    ))}

                    {days.map((day) => {
                        const dayEvents = filteredEvents.filter(e => isSameDay(parseISO(e.date), day));
                        return (
                            <div
                                key={day.toString()}
                                onClick={() => handleDayClick(day)}
                                className={cn(
                                    "min-h-[100px] p-2 border-b border-r last:border-r-0 transition-colors hover:bg-muted/30 cursor-pointer relative group",
                                    isToday(day) && "bg-primary/5"
                                )}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={cn(
                                        "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                                        isToday(day) ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                                    )}>
                                        {format(day, "d")}
                                    </span>
                                    {dayEvents.length > 0 && <span className="text-[10px] text-muted-foreground font-mono">{dayEvents.length}</span>}
                                </div>

                                <div className="space-y-1">
                                    {dayEvents.slice(0, 3).map((event) => (
                                        <div
                                            key={event.id}
                                            onClick={(e) => { e.stopPropagation(); /* Maybe show details modal */ }}
                                            className={cn("text-[10px] px-1.5 py-0.5 rounded border truncate font-medium", TYPE_COLORS[event.type])}
                                            title={event.title}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <div className="text-[10px] text-muted-foreground pl-1">+ {dayEvents.length - 3} más</div>
                                    )}
                                </div>

                                {/* Hover Add Button */}
                                <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-opacity">
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Event Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-card w-full max-w-md rounded-xl shadow-2xl border flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-primary" />
                                {formState.date ? format(parseISO(formState.date), "dd/MM/yyyy") : "Nuevo Evento"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
                            <div>
                                <label className="block text-sm font-medium mb-1">Título</label>
                                <input
                                    autoFocus
                                    required
                                    className="w-full p-2 rounded-lg border bg-background input-field focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={formState.title || ""}
                                    onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Ej: Reunión de Apoderados"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tipo</label>
                                    <select
                                        className="w-full p-2 rounded-lg border bg-background input-field outline-none"
                                        value={formState.type}
                                        onChange={(e) => setFormState(prev => ({ ...prev, type: e.target.value as EventType }))}
                                    >
                                        <option value="meeting">Reunión</option>
                                        <option value="class">Clase</option>
                                        <option value="exam">Evaluación</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Fecha</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full p-2 rounded-lg border bg-background input-field outline-none"
                                        value={formState.date || ""}
                                        onChange={(e) => setFormState(prev => ({ ...prev, date: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Inicio</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full p-2 rounded-lg border bg-background input-field outline-none"
                                        value={formState.startTime || ""}
                                        onChange={(e) => setFormState(prev => ({ ...prev, startTime: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Fin</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full p-2 rounded-lg border bg-background input-field outline-none"
                                        value={formState.endTime || ""}
                                        onChange={(e) => setFormState(prev => ({ ...prev, endTime: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Descripción</label>
                                <textarea
                                    className="w-full p-2 rounded-lg border bg-background input-field outline-none min-h-[80px]"
                                    value={formState.description || ""}
                                    onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>

                            <div className="pt-2">
                                <button type="submit" className="w-full bg-primary text-primary-foreground font-medium py-2 rounded-lg hover:bg-primary/90 transition-colors">
                                    Guardar Evento
                                </button>
                            </div>
                        </form>

                        {/* List existing events for this day just for quick delete context */}
                        {formState.date && (
                            <div className="p-4 bg-muted/20 border-t max-h-[150px] overflow-y-auto">
                                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Eventos del día</h4>
                                <div className="space-y-2">
                                    {events.filter(e => e.date === formState.date).map(event => (
                                        <div key={event.id} className="flex items-center justify-between text-sm p-2 rounded bg-card border">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <div className={`w-2 h-2 rounded-full ${TYPE_COLORS[event.type].split(' ')[0].replace('/10', '')}`} />
                                                <span className="truncate">{event.title}</span>
                                                <span className="text-xs text-muted-foreground ml-auto">{event.startTime}</span>
                                            </div>
                                            <button onClick={() => remove(event.id)} className="text-destructive hover:bg-destructive/10 p-1 rounded">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {events.filter(e => e.date === formState.date).length === 0 && (
                                        <p className="text-xs text-muted-foreground italic">No hay eventos para este día.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
