import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { Course, CreateCourseInput, UpdateCourseInput } from '../types';

export const courseService = {
    /**
     * Get all courses with optional filters
     */
    getAll: async (filters?: {
        grade?: string;
        section?: string;
        subject?: string;
        teacherEmail?: string;
        academicYear?: number;
        status?: string;
    }) => {
        const { data } = await apiClient.get<Course[]>(ENDPOINTS.COURSES, {
            params: filters,
        });
        return data;
    },

    /**
     * Get course by ID
     */
    getById: async (id: string) => {
        const { data } = await apiClient.get<Course>(ENDPOINTS.COURSE_BY_ID(id));
        return data;
    },

    /**
     * Create new course
     */
    create: async (input: CreateCourseInput) => {
        const { data } = await apiClient.post<Course>(ENDPOINTS.COURSES, input);
        return data;
    },

    /**
     * Update existing course
     */
    update: async (id: string, input: UpdateCourseInput) => {
        const { data } = await apiClient.put<Course>(
            ENDPOINTS.COURSE_BY_ID(id),
            input
        );
        return data;
    },

    /**
     * Finalize course (status → FINALIZADO)
     */
    remove: async (id: string) => {
        await apiClient.delete(ENDPOINTS.COURSE_BY_ID(id));
    },
};
