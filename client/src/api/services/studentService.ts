import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { Student, CreateStudentInput, UpdateStudentInput } from '../types';

export const studentService = {
    /**
     * Get all students with optional filters
     */
    getAll: async (filters?: {
        status?: string;
        grade?: string;
        section?: string;
    }) => {
        const { data } = await apiClient.get<Student[]>(ENDPOINTS.STUDENTS, {
            params: filters
        });
        return data;
    },

    /**
     * Get student by ID
     */
    getById: async (id: string) => {
        const { data } = await apiClient.get<Student>(ENDPOINTS.STUDENT_BY_ID(id));
        return data;
    },

    /**
     * Create new student
     */
    create: async (input: CreateStudentInput) => {
        const { data } = await apiClient.post<Student>(ENDPOINTS.STUDENTS, input);
        return data;
    },

    /**
     * Update existing student
     */
    update: async (id: string, input: UpdateStudentInput) => {
        const { data } = await apiClient.put<Student>(
            ENDPOINTS.STUDENT_BY_ID(id),
            input
        );
        return data;
    },

    /**
     * Soft delete student (status → RETIRADO)
     */
    remove: async (id: string) => {
        await apiClient.delete(ENDPOINTS.STUDENT_BY_ID(id));
    },
};
