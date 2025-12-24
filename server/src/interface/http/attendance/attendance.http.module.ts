import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceMongoModule } from '../../../infrastructure/persistence/mongodb/attendance/attendance.mongo.module';
import { StudentMongoModule } from '../../../infrastructure/persistence/mongodb/student/student.mongo.module';
import { CourseMongoModule } from '../../../infrastructure/persistence/mongodb/course/course.mongo.module';
import { CreateAttendanceUseCase } from '../../../application/attendance/use-case/create-attendance.usecase';
import { BulkRegisterAttendanceUseCase } from '../../../application/attendance/use-case/bulk-register-attendance.usecase';
import { ListAttendanceUseCase } from '../../../application/attendance/use-case/list-attendance.usecase';
import { GetAttendanceUseCase } from '../../../application/attendance/use-case/get-attendance.usecase';
import { UpdateAttendanceUseCase } from '../../../application/attendance/use-case/update-attendance.usecase';
import { DeleteAttendanceUseCase } from '../../../application/attendance/use-case/delete-attendance.usecase';
import { GetStudentSummaryUseCase } from '../../../application/attendance/use-case/get-student-summary.usecase';
import { GetCourseSummaryUseCase } from '../../../application/attendance/use-case/get-course-summary.usecase';

@Module({
    imports: [AttendanceMongoModule, StudentMongoModule, CourseMongoModule],
    controllers: [AttendanceController],
    providers: [
        CreateAttendanceUseCase,
        BulkRegisterAttendanceUseCase,
        ListAttendanceUseCase,
        GetAttendanceUseCase,
        UpdateAttendanceUseCase,
        DeleteAttendanceUseCase,
        GetStudentSummaryUseCase,
        GetCourseSummaryUseCase,
    ],
})
export class AttendanceHttpModule { }
