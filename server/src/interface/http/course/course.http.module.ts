import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseMongoModule } from '../../../infrastructure/persistence/mongodb/course/course.mongo.module';
import { CreateCourseUseCase } from '../../../application/course/use-case/create-course.usecase';
import { ListCourseUseCase } from '../../../application/course/use-case/list-course.usecase';
import { GetCourseUseCase } from '../../../application/course/use-case/get-course.usecase';
import { UpdateCourseUseCase } from '../../../application/course/use-case/update-course.usecase';
import { RemoveCourseUseCase } from '../../../application/course/use-case/remove-course.usecase';

@Module({
    imports: [CourseMongoModule],
    controllers: [CourseController],
    providers: [
        CreateCourseUseCase,
        ListCourseUseCase,
        GetCourseUseCase,
        UpdateCourseUseCase,
        RemoveCourseUseCase,
    ],
})
export class CourseHttpModule { }
