import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateHollandTestInput } from './create-holland-test.input';

export class UpdateHollandTestInput extends PartialType(
    OmitType(CreateHollandTestInput, ['studentId', 'testDate'] as const),
) { }
