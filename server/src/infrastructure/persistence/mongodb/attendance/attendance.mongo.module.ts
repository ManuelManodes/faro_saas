import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceSchema } from './attendance.schema';
import { ATTENDANCE_REPOSITORY } from '../../../../domain/attendance/repository.port';
import { AttendanceMongoRepository } from './attendance.mongo.repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Attendance', schema: AttendanceSchema },
        ]),
    ],
    providers: [
        {
            provide: ATTENDANCE_REPOSITORY,
            useClass: AttendanceMongoRepository,
        },
    ],
    exports: [ATTENDANCE_REPOSITORY],
})
export class AttendanceMongoModule { }
