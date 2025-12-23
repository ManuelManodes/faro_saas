import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateStudentInput } from './create-student.input';

export class UpdateStudentInput extends PartialType(
    OmitType(CreateStudentInput, ['rut'] as const),
) { }
