import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../api/services/studentService';
import type { CreateStudentInput, UpdateStudentInput } from '../api/types';

// Query keys for cache management
const QUERY_KEYS = {
    students: ['students'] as const,
    student: (id: string) => ['students', id] as const,
};

/**
 * Hook to fetch all students with optional filters
 */
export const useStudents = (filters?: {
    status?: string;
    grade?: string;
    section?: string;
}) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.students, filters],
        queryFn: () => studentService.getAll(filters),
    });
};

/**
 * Hook to fetch single student by ID
 */
export const useStudent = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.student(id),
        queryFn: () => studentService.getById(id),
        enabled: !!id, // Only fetch if ID is provided
    });
};

/**
 * Hook to create new student
 */
export const useCreateStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateStudentInput) => studentService.create(input),
        onSuccess: () => {
            // Invalidate students list to trigger refetch
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.students });
        },
    });
};

/**
 * Hook to update existing student
 */
export const useUpdateStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateStudentInput }) =>
            studentService.update(id, data),
        onSuccess: (_, variables) => {
            // Invalidate both list and specific student cache
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.students });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.student(variables.id) });
        },
    });
};

/**
 * Hook to soft delete student (status → RETIRADO)
 */
export const useDeleteStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => studentService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.students });
        },
    });
};
