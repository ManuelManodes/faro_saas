import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from './course.schema';
import { COURSE_REPOSITORY } from '../../../../domain/course/repository.port';
import { CourseMongoRepository } from './course.mongo.repository';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
    ],
    providers: [
        {
            provide: COURSE_REPOSITORY,
            useClass: CourseMongoRepository,
        },
    ],
    exports: [COURSE_REPOSITORY],
})
export class CourseMongoModule { }
