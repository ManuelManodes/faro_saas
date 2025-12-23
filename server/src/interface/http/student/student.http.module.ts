import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentMongoModule } from '../../../infrastructure/persistence/mongodb/student/student.mongo.module';
import { CreateStudentUseCase } from '../../../application/student/use-case/create-student.usecase';
import { ListStudentUseCase } from '../../../application/student/use-case/list-student.usecase';
import { GetStudentUseCase } from '../../../application/student/use-case/get-student.usecase';
import { UpdateStudentUseCase } from '../../../application/student/use-case/update-student.usecase';
import { RemoveStudentUseCase } from '../../../application/student/use-case/remove-student.usecase';

@Module({
    imports: [StudentMongoModule],
    controllers: [StudentController],
    providers: [
        CreateStudentUseCase,
        ListStudentUseCase,
        GetStudentUseCase,
        UpdateStudentUseCase,
        RemoveStudentUseCase,
    ],
})
export class StudentHttpModule { }
