// ==================== Student Types ====================
export interface Student {
    id: string;
    rut: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string;
    birthDate: string;
    age: number;
    grade: string;
    section: string;
    address: string;
    emergencyContact: {
        name: string;
        phone: string;
        relationship: string;
    };
    status: 'ACTIVO' | 'INACTIVO' | 'RETIRADO';
    enrollmentDate: string;
    createdAt: string;
    createdBy: string;
    updatedAt?: string;
    updatedBy?: string;
}

export interface CreateStudentInput {
    rut: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    grade: string;
    section: string;
    address: string;
    emergencyContact: {
        name: string;
        phone: string;
        relationship: string;
    };
}

export type UpdateStudentInput = Partial<Omit<CreateStudentInput, 'rut'>>;

// ==================== Course Types ====================
export interface CourseSchedule {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}

export interface Course {
    id: string;
    code: string;
    name: string;
    grade: string;
    section: string;
    subject: string;
    teacherName: string;
    teacherEmail: string;
    schedule: CourseSchedule[];
    capacity: number;
    enrolledCount: number;
    availableSeats: number;
    academicYear: number;
    semester: number;
    status: 'ACTIVO' | 'INACTIVO' | 'FINALIZADO';
    createdAt: string;
    createdBy: string;
    updatedAt?: string;
    updatedBy?: string;
}

export interface CreateCourseInput {
    code: string;
    name: string;
    grade: string;
    section: string;
    subject: string;
    teacherName: string;
    teacherEmail: string;
    schedule: CourseSchedule[];
    capacity: number;
    academicYear: number;
    semester: number;
}

export type UpdateCourseInput = Partial<CreateCourseInput>;

// ==================== Attendance Types ====================
export interface Attendance {
    id: string;
    studentId: string;
    courseId: string;
    date: string;
    status: 'PRESENTE' | 'AUSENTE' | 'TARDE' | 'JUSTIFICADO';
    arrivalTime?: string;
    notes?: string;
    isPresent: boolean;
    isAbsent: boolean;
    isJustified: boolean;
    createdAt: string;
    createdBy: string;
    updatedAt?: string;
    updatedBy?: string;
}

export interface AttendanceSummary {
    total: number;
    presente: number;
    ausente: number;
    tarde: number;
    justificado: number;
    attendanceRate: number;
}

export interface CreateAttendanceInput {
    studentId: string;
    courseId: string;
    date: string;
    status: 'PRESENTE' | 'AUSENTE' | 'TARDE' | 'JUSTIFICADO';
    arrivalTime?: string;
    notes?: string;
}

export interface BulkAttendanceInput {
    courseId: string;
    date: string;
    attendances: Array<{
        studentId: string;
        status: 'PRESENTE' | 'AUSENTE' | 'TARDE' | 'JUSTIFICADO';
        arrivalTime?: string;
        notes?: string;
    }>;
}

export type UpdateAttendanceInput = Partial<CreateAttendanceInput>;

// ==================== Holland Test Types ====================
export interface RIASECScores {
    realistic: number;
    investigative: number;
    artistic: number;
    social: number;
    enterprising: number;
    conventional: number;
}

export interface HollandTest {
    id: string;
    studentId: string;
    testDate: string;
    scores: RIASECScores;
    dominantTypes: string[];
    hollandCode: string;
    interpretation: string;
    recommendations: string[];
    status: 'COMPLETADO' | 'INCOMPLETO' | 'INVALIDADO';
    administeredBy: string;
    createdAt: string;
    createdBy: string;
    updatedAt?: string;
    updatedBy?: string;
}

export interface CreateHollandTestInput {
    studentId: string;
    testDate: string;
    scores: RIASECScores;
    dominantTypes: string[];
    interpretation: string;
    recommendations: string[];
    status: 'COMPLETADO' | 'INCOMPLETO' | 'INVALIDADO';
    administeredBy: string;
}

export type UpdateHollandTestInput = Partial<Omit<CreateHollandTestInput, 'studentId' | 'testDate'>>;

// ==================== Calendar Event Types ====================
export interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    eventType: 'FERIADO' | 'EVALUACION' | 'REUNION' | 'EVENTO_INSTITUCIONAL' | 'ACTIVIDAD_EXTRACURRICULAR' | 'VACACIONES';
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    courseId?: string;
    isAllDay: boolean;
    status: 'PROGRAMADO' | 'CONFIRMADO' | 'CANCELADO' | 'COMPLETADO';
    organizerEmail: string;
    attendees: string[];
    durationInDays: number;
    isActive: boolean;
    isPast: boolean;
    isFuture: boolean;
    isOngoing: boolean;
    createdAt: string;
    createdBy: string;
    updatedAt?: string;
    updatedBy?: string;
}

export interface CreateCalendarEventInput {
    title: string;
    description: string;
    eventType: 'FERIADO' | 'EVALUACION' | 'REUNION' | 'EVENTO_INSTITUCIONAL' | 'ACTIVIDAD_EXTRACURRICULAR' | 'VACACIONES';
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    courseId?: string;
    isAllDay: boolean;
    status: 'PROGRAMADO' | 'CONFIRMADO' | 'CANCELADO' | 'COMPLETADO';
    organizerEmail: string;
    attendees?: string[];
}

export type UpdateCalendarEventInput = Partial<CreateCalendarEventInput>;
