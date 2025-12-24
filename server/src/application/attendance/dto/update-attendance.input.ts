import { PartialType } from '@nestjs/swagger';
import { CreateAttendanceInput } from './create-attendance.input';

export class UpdateAttendanceInput extends PartialType(CreateAttendanceInput) { }
