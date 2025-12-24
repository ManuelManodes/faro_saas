import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../api/services/courseService';
import type { CreateCourseInput, UpdateCourseInput } from '../api/types';

const QUERY_KEYS = {
    courses: ['courses'] as const,
    course: (id: string) => ['courses', id] as const,
};

/**
 * Hook to fetch all courses with optional filters
 */
export const useCourses = (filters?: {
    grade?: string;
    section?: string;
    subject?: string;
    teacherEmail?: string;
    academicYear?: number;
    status?: string;
}) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.courses, filters],
        queryFn: () => courseService.getAll(filters),
    });
};

/**
 * Hook to fetch single course by ID
 */
export const useCourse = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.course(id),
        queryFn: () => courseService.getById(id),
        enabled: !!id,
    });
};

/**
 * Hook to create new course
 */
export const useCreateCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateCourseInput) => courseService.create(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses });
        },
    });
};

/**
 * Hook to update existing course
 */
export const useUpdateCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCourseInput }) =>
            courseService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.course(variables.id) });
        },
    });
};

/**
 * Hook to finalize course (status → FINALIZADO)
 */
export const useDeleteCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => courseService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses });
        },
    });
};
