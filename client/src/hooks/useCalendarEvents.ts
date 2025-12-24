import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarEventService } from '../api/services/calendarEventService';
import type {
    CreateCalendarEventInput,
    UpdateCalendarEventInput,
} from '../api/types';

const QUERY_KEYS = {
    calendarEvents: ['calendar-events'] as const,
    calendarEvent: (id: string) => ['calendar-events', id] as const,
    upcoming: ['calendar-events', 'upcoming'] as const,
};

/**
 * Hook to fetch all calendar events with optional filters
 */
export const useCalendarEvents = (filters?: {
    eventType?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    courseId?: string;
    organizerEmail?: string;
}) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.calendarEvents, filters],
        queryFn: () => calendarEventService.getAll(filters),
    });
};

/**
 * Hook to fetch single calendar event by ID
 */
export const useCalendarEvent = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.calendarEvent(id),
        queryFn: () => calendarEventService.getById(id),
        enabled: !!id,
    });
};

/**
 * Hook to fetch upcoming events
 */
export const useUpcomingEvents = (limit: number = 10) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.upcoming, limit],
        queryFn: () => calendarEventService.getUpcoming(limit),
    });
};

/**
 * Hook to create new calendar event
 */
export const useCreateCalendarEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateCalendarEventInput) => calendarEventService.create(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendarEvents });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.upcoming });
        },
    });
};

/**
 * Hook to update calendar event
 */
export const useUpdateCalendarEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCalendarEventInput }) =>
            calendarEventService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendarEvents });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendarEvent(variables.id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.upcoming });
        },
    });
};

/**
 * Hook to delete calendar event
 */
export const useDeleteCalendarEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => calendarEventService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendarEvents });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.upcoming });
        },
    });
};
