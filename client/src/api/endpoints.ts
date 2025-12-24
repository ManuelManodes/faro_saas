export const ENDPOINTS = {
    // Students
    STUDENTS: '/students',
    STUDENT_BY_ID: (id: string) => `/students/${id}`,

    // Courses
    COURSES: '/courses',
    COURSE_BY_ID: (id: string) => `/courses/${id}`,

    // Attendance
    ATTENDANCE: '/attendance',
    ATTENDANCE_BY_ID: (id: string) => `/attendance/${id}`,
    ATTENDANCE_BULK: '/attendance/bulk',
    ATTENDANCE_STUDENT_SUMMARY: (studentId: string) => `/attendance/student/${studentId}/summary`,
    ATTENDANCE_COURSE_SUMMARY: (courseId: string) => `/attendance/course/${courseId}/summary`,

    // Holland Test
    HOLLAND_TEST: '/holland-test',
    HOLLAND_TEST_BY_ID: (id: string) => `/holland-test/${id}`,
    HOLLAND_TEST_LATEST: (studentId: string) => `/holland-test/student/${studentId}/latest`,

    // Calendar Events
    CALENDAR_EVENTS: '/calendar-events',
    CALENDAR_EVENT_BY_ID: (id: string) => `/calendar-events/${id}`,
    CALENDAR_EVENTS_UPCOMING: '/calendar-events/upcoming',
} as const;
