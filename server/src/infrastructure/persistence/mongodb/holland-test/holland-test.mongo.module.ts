import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HollandTestSchema } from './holland-test.schema';
import { HOLLAND_TEST_REPOSITORY } from '../../../../domain/holland-test/repository.port';
import { HollandTestMongoRepository } from './holland-test.mongo.repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'HollandTest', schema: HollandTestSchema },
        ]),
    ],
    providers: [
        {
            provide: HOLLAND_TEST_REPOSITORY,
            useClass: HollandTestMongoRepository,
        },
    ],
    exports: [HOLLAND_TEST_REPOSITORY],
})
export class HollandTestMongoModule { }
