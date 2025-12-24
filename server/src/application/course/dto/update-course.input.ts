import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCourseInput } from './create-course.input';

export class UpdateCourseInput extends PartialType(
    OmitType(CreateCourseInput, ['code'] as const),
) { }
