import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type {
    HollandTest,
    CreateHollandTestInput,
    UpdateHollandTestInput,
} from '../types';

export const hollandTestService = {
    /**
     * Get all Holland tests with optional filters
     */
    getAll: async (filters?: {
        studentId?: string;
        status?: string;
        dateFrom?: string;
        dateTo?: string;
        dominantType?: string;
    }) => {
        const { data } = await apiClient.get<HollandTest[]>(
            ENDPOINTS.HOLLAND_TEST,
            { params: filters }
        );
        return data;
    },

    /**
     * Get Holland test by ID
     */
    getById: async (id: string) => {
        const { data } = await apiClient.get<HollandTest>(
            ENDPOINTS.HOLLAND_TEST_BY_ID(id)
        );
        return data;
    },

    /**
     * Get latest test for a student
     */
    getLatestByStudent: async (studentId: string) => {
        const { data } = await apiClient.get<HollandTest | null>(
            ENDPOINTS.HOLLAND_TEST_LATEST(studentId)
        );
        return data;
    },

    /**
     * Create new Holland test
     */
    create: async (input: CreateHollandTestInput) => {
        const { data } = await apiClient.post<HollandTest>(
            ENDPOINTS.HOLLAND_TEST,
            input
        );
        return data;
    },

    /**
     * Update Holland test
     */
    update: async (id: string, input: UpdateHollandTestInput) => {
        const { data } = await apiClient.put<HollandTest>(
            ENDPOINTS.HOLLAND_TEST_BY_ID(id),
            input
        );
        return data;
    },

    /**
     * Delete Holland test
     */
    remove: async (id: string) => {
        await apiClient.delete(ENDPOINTS.HOLLAND_TEST_BY_ID(id));
    },
};
