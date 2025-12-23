import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentSchema } from './student.schema';
import { STUDENT_REPOSITORY } from '../../../../domain/student/repository.port';
import { StudentMongoRepository } from './student.mongo.repository';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Student', schema: StudentSchema }]),
    ],
    providers: [
        {
            provide: STUDENT_REPOSITORY,
            useClass: StudentMongoRepository,
        },
    ],
    exports: [STUDENT_REPOSITORY],
})
export class StudentMongoModule { }
