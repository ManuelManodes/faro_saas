import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type {
    CalendarEvent,
    CreateCalendarEventInput,
    UpdateCalendarEventInput,
} from '../types';

export const calendarEventService = {
    /**
     * Get all calendar events with optional filters
     */
    getAll: async (filters?: {
        eventType?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
        courseId?: string;
        organizerEmail?: string;
    }) => {
        const { data } = await apiClient.get<CalendarEvent[]>(
            ENDPOINTS.CALENDAR_EVENTS,
            { params: filters }
        );
        return data;
    },

    /**
     * Get calendar event by ID
     */
    getById: async (id: string) => {
        const { data } = await apiClient.get<CalendarEvent>(
            ENDPOINTS.CALENDAR_EVENT_BY_ID(id)
        );
        return data;
    },

    /**
     * Get upcoming events
     */
    getUpcoming: async (limit: number = 10) => {
        const { data } = await apiClient.get<CalendarEvent[]>(
            ENDPOINTS.CALENDAR_EVENTS_UPCOMING,
            { params: { limit } }
        );
        return data;
    },

    /**
     * Create new calendar event
     */
    create: async (input: CreateCalendarEventInput) => {
        const { data } = await apiClient.post<CalendarEvent>(
            ENDPOINTS.CALENDAR_EVENTS,
            input
        );
        return data;
    },

    /**
     * Update calendar event
     */
    update: async (id: string, input: UpdateCalendarEventInput) => {
        const { data } = await apiClient.put<CalendarEvent>(
            ENDPOINTS.CALENDAR_EVENT_BY_ID(id),
            input
        );
        return data;
    },

    /**
     * Delete calendar event
     */
    remove: async (id: string) => {
        await apiClient.delete(ENDPOINTS.CALENDAR_EVENT_BY_ID(id));
    },
};
