import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceService } from '../api/services/attendanceService';
import type {
    CreateAttendanceInput,
    BulkAttendanceInput,
    UpdateAttendanceInput,
} from '../api/types';

const QUERY_KEYS = {
    attendance: ['attendance'] as const,
    attendanceById: (id: string) => ['attendance', id] as const,
    studentSummary: (studentId: string) => ['attendance', 'student-summary', studentId] as const,
    courseSummary: (courseId: string) => ['attendance', 'course-summary', courseId] as const,
};

/**
 * Hook to fetch all attendance records with optional filters
 */
export const useAttendance = (filters?: {
    studentId?: string;
    courseId?: string;
    date?: string;
    dateFrom?: string;
    dateTo?: string;
    status?: string;
}) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.attendance, filters],
        queryFn: () => attendanceService.getAll(filters),
    });
};

/**
 * Hook to fetch single attendance record by ID
 */
export const useAttendanceById = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.attendanceById(id),
        queryFn: () => attendanceService.getById(id),
        enabled: !!id,
    });
};

/**
 * Hook to get student attendance summary
 */
export const useStudentAttendanceSummary = (
    studentId: string,
    filters?: { dateFrom?: string; dateTo?: string }
) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.studentSummary(studentId), filters],
        queryFn: () => attendanceService.getStudentSummary(studentId, filters),
        enabled: !!studentId,
    });
};

/**
 * Hook to get course attendance summary
 */
export const useCourseAttendanceSummary = (
    courseId: string,
    filters?: { dateFrom?: string; dateTo?: string }
) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.courseSummary(courseId), filters],
        queryFn: () => attendanceService.getCourseSummary(courseId, filters),
        enabled: !!courseId,
    });
};

/**
 * Hook to create single attendance record
 */
export const useCreateAttendance = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateAttendanceInput) => attendanceService.create(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.attendance });
        },
    });
};

/**
 * Hook to bulk register attendance for multiple students
 */
export const useBulkCreateAttendance = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: BulkAttendanceInput) => attendanceService.createBulk(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.attendance });
        },
    });
};

/**
 * Hook to update attendance record
 */
export const useUpdateAttendance = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateAttendanceInput }) =>
            attendanceService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.attendance });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.attendanceById(variables.id) });
        },
    });
};

/**
 * Hook to delete attendance record
 */
export const useDeleteAttendance = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => attendanceService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.attendance });
        },
    });
};
