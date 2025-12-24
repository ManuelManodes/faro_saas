import { Module } from '@nestjs/common';
import { HollandTestController } from './holland-test.controller';
import { HollandTestMongoModule } from '../../../infrastructure/persistence/mongodb/holland-test/holland-test.mongo.module';
import { StudentMongoModule } from '../../../infrastructure/persistence/mongodb/student/student.mongo.module';
import { CreateHollandTestUseCase } from '../../../application/holland-test/use-case/create-holland-test.usecase';
import { ListHollandTestUseCase } from '../../../application/holland-test/use-case/list-holland-test.usecase';
import { GetHollandTestUseCase } from '../../../application/holland-test/use-case/get-holland-test.usecase';
import { GetLatestTestByStudentUseCase } from '../../../application/holland-test/use-case/get-latest-test-by-student.usecase';
import { UpdateHollandTestUseCase } from '../../../application/holland-test/use-case/update-holland-test.usecase';
import { DeleteHollandTestUseCase } from '../../../application/holland-test/use-case/delete-holland-test.usecase';

@Module({
    imports: [HollandTestMongoModule, StudentMongoModule],
    controllers: [HollandTestController],
    providers: [
        CreateHollandTestUseCase,
        ListHollandTestUseCase,
        GetHollandTestUseCase,
        GetLatestTestByStudentUseCase,
        UpdateHollandTestUseCase,
        DeleteHollandTestUseCase,
    ],
})
export class HollandTestHttpModule { }
