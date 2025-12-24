import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type {
    Attendance,
    AttendanceSummary,
    CreateAttendanceInput,
    BulkAttendanceInput,
    UpdateAttendanceInput,
} from '../types';

export const attendanceService = {
    /**
     * Get all attendance records with optional filters
     */
    getAll: async (filters?: {
        studentId?: string;
        courseId?: string;
        date?: string;
        dateFrom?: string;
        dateTo?: string;
        status?: string;
    }) => {
        const { data } = await apiClient.get<Attendance[]>(ENDPOINTS.ATTENDANCE, {
            params: filters,
        });
        return data;
    },

    /**
     * Get attendance by ID
     */
    getById: async (id: string) => {
        const { data } = await apiClient.get<Attendance>(
            ENDPOINTS.ATTENDANCE_BY_ID(id)
        );
        return data;
    },

    /**
     * Create single attendance record
     */
    create: async (input: CreateAttendanceInput) => {
        const { data } = await apiClient.post<Attendance>(
            ENDPOINTS.ATTENDANCE,
            input
        );
        return data;
    },

    /**
     * Bulk register attendance for multiple students
     */
    createBulk: async (input: BulkAttendanceInput) => {
        const { data } = await apiClient.post<Attendance[]>(
            ENDPOINTS.ATTENDANCE_BULK,
            input
        );
        return data;
    },

    /**
     * Update attendance record
     */
    update: async (id: string, input: UpdateAttendanceInput) => {
        const { data } = await apiClient.put<Attendance>(
            ENDPOINTS.ATTENDANCE_BY_ID(id),
            input
        );
        return data;
    },

    /**
     * Delete attendance record
     */
    remove: async (id: string) => {
        await apiClient.delete(ENDPOINTS.ATTENDANCE_BY_ID(id));
    },

    /**
     * Get attendance summary for a student
     */
    getStudentSummary: async (
        studentId: string,
        filters?: { dateFrom?: string; dateTo?: string }
    ) => {
        const { data } = await apiClient.get<AttendanceSummary>(
            ENDPOINTS.ATTENDANCE_STUDENT_SUMMARY(studentId),
            { params: filters }
        );
        return data;
    },

    /**
     * Get attendance summary for a course
     */
    getCourseSummary: async (
        courseId: string,
        filters?: { dateFrom?: string; dateTo?: string }
    ) => {
        const { data } = await apiClient.get<AttendanceSummary>(
            ENDPOINTS.ATTENDANCE_COURSE_SUMMARY(courseId),
            { params: filters }
        );
        return data;
    },
};
