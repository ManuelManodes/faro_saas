import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hollandTestService } from '../api/services/hollandTestService';
import type {
    CreateHollandTestInput,
    UpdateHollandTestInput,
} from '../api/types';

const QUERY_KEYS = {
    hollandTests: ['holland-tests'] as const,
    hollandTest: (id: string) => ['holland-tests', id] as const,
    latestByStudent: (studentId: string) => ['holland-tests', 'latest', studentId] as const,
};

/**
 * Hook to fetch all Holland tests with optional filters
 */
export const useHollandTests = (filters?: {
    studentId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    dominantType?: string;
}) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.hollandTests, filters],
        queryFn: () => hollandTestService.getAll(filters),
    });
};

/**
 * Hook to fetch single Holland test by ID
 */
export const useHollandTest = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.hollandTest(id),
        queryFn: () => hollandTestService.getById(id),
        enabled: !!id,
    });
};

/**
 * Hook to fetch latest test for a student
 */
export const useLatestHollandTestByStudent = (studentId: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.latestByStudent(studentId),
        queryFn: () => hollandTestService.getLatestByStudent(studentId),
        enabled: !!studentId,
    });
};

/**
 * Hook to create new Holland test
 */
export const useCreateHollandTest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateHollandTestInput) => hollandTestService.create(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.hollandTests });
        },
    });
};

/**
 * Hook to update Holland test
 */
export const useUpdateHollandTest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateHollandTestInput }) =>
            hollandTestService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.hollandTests });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.hollandTest(variables.id) });
        },
    });
};

/**
 * Hook to delete Holland test
 */
export const useDeleteHollandTest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => hollandTestService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.hollandTests });
        },
    });
};
