import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    Headers,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiHeader,
} from '@nestjs/swagger';
import { CreateAttendanceInput } from '../../../application/attendance/dto/create-attendance.input';
import { UpdateAttendanceInput } from '../../../application/attendance/dto/update-attendance.input';
import { BulkAttendanceInput } from '../../../application/attendance/dto/bulk-attendance.input';
import {
    AttendanceOutput,
    AttendanceSummaryOutput,
} from '../../../application/attendance/dto/attendance.output';
import { CreateAttendanceUseCase } from '../../../application/attendance/use-case/create-attendance.usecase';
import { BulkRegisterAttendanceUseCase } from '../../../application/attendance/use-case/bulk-register-attendance.usecase';
import { ListAttendanceUseCase } from '../../../application/attendance/use-case/list-attendance.usecase';
import { GetAttendanceUseCase } from '../../../application/attendance/use-case/get-attendance.usecase';
import { UpdateAttendanceUseCase } from '../../../application/attendance/use-case/update-attendance.usecase';
import { DeleteAttendanceUseCase } from '../../../application/attendance/use-case/delete-attendance.usecase';
import { GetStudentSummaryUseCase } from '../../../application/attendance/use-case/get-student-summary.usecase';
import { GetCourseSummaryUseCase } from '../../../application/attendance/use-case/get-course-summary.usecase';

@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
    constructor(
        private readonly createAttendanceUseCase: CreateAttendanceUseCase,
        private readonly bulkRegisterAttendanceUseCase: BulkRegisterAttendanceUseCase,
        private readonly listAttendanceUseCase: ListAttendanceUseCase,
        private readonly getAttendanceUseCase: GetAttendanceUseCase,
        private readonly updateAttendanceUseCase: UpdateAttendanceUseCase,
        private readonly deleteAttendanceUseCase: DeleteAttendanceUseCase,
        private readonly getStudentSummaryUseCase: GetStudentSummaryUseCase,
        private readonly getCourseSummaryUseCase: GetCourseSummaryUseCase,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar asistencia' })
    @ApiResponse({
        status: 201,
        description: 'Asistencia registrada exitosamente',
        type: AttendanceOutput,
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos o duplicado',
    })
    @ApiHeader({
        name: 'x-user-email',
        description: 'Email del profesor que registra',
        required: true,
    })
    async create(
        @Body() input: CreateAttendanceInput,
        @Headers('x-user-email') userEmail: string = 'system@colegio.cl',
    ): Promise<AttendanceOutput> {
        return this.createAttendanceUseCase.execute(input, userEmail);
    }

    @Post('bulk')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar asistencia masiva (toda la clase)' })
    @ApiResponse({
        status: 201,
        description: 'Asistencias registradas',
        type: [AttendanceOutput],
    })
    @ApiHeader({
        name: 'x-user-email',
        description: 'Email del profesor',
        required: true,
    })
    async bulkRegister(
        @Body() input: BulkAttendanceInput,
        @Headers('x-user-email') userEmail: string = 'system@colegio.cl',
    ): Promise<AttendanceOutput[]> {
        return this.bulkRegisterAttendanceUseCase.execute(input, userEmail);
    }

    @Get()
    @ApiOperation({ summary: 'Listar asistencias' })
    @ApiResponse({
        status: 200,
        description: 'Lista de asistencias',
        type: [AttendanceOutput],
    })
    @ApiQuery({ name: 'studentId', required: false })
    @ApiQuery({ name: 'courseId', required: false })
    @ApiQuery({ name: 'dateFrom', required: false, description: 'Fecha desde (ISO)' })
    @ApiQuery({ name: 'dateTo', required: false, description: 'Fecha hasta (ISO)' })
    @ApiQuery({ name: 'status', required: false })
    async findAll(
        @Query('studentId') studentId?: string,
        @Query('courseId') courseId?: string,
        @Query('dateFrom') dateFrom?: string,
        @Query('dateTo') dateTo?: string,
        @Query('status') status?: string,
    ): Promise<AttendanceOutput[]> {
        return this.listAttendanceUseCase.execute({
            studentId,
            courseId,
            dateFrom,
            dateTo,
            status,
        });
    }

    @Get('student/:studentId/summary')
    @ApiOperation({ summary: 'Resumen de asistencia por estudiante' })
    @ApiResponse({
        status: 200,
        description: 'Resumen estadístico',
        type: AttendanceSummaryOutput,
    })
    @ApiParam({ name: 'studentId', description: 'ID del estudiante' })
    @ApiQuery({ name: 'dateFrom', required: false })
    @ApiQuery({ name: 'dateTo', required: false })
    async getStudentSummary(
        @Param('studentId') studentId: string,
        @Query('dateFrom') dateFrom?: string,
        @Query('dateTo') dateTo?: string,
    ): Promise<AttendanceSummaryOutput> {
        return this.getStudentSummaryUseCase.execute(studentId, {
            dateFrom,
            dateTo,
        });
    }

    @Get('course/:courseId/summary')
    @ApiOperation({ summary: 'Resumen de asistencia por curso' })
    @ApiResponse({
        status: 200,
        description: 'Resumen estadístico',
        type: AttendanceSummaryOutput,
    })
    @ApiParam({ name: 'courseId', description: 'ID del curso' })
    @ApiQuery({ name: 'date', required: false, description: 'Fecha específica' })
    @ApiQuery({ name: 'dateFrom', required: false })
    @ApiQuery({ name: 'dateTo', required: false })
    async getCourseSummary(
        @Param('courseId') courseId: string,
        @Query('date') date?: string,
        @Query('dateFrom') dateFrom?: string,
        @Query('dateTo') dateTo?: string,
    ): Promise<AttendanceSummaryOutput> {
        return this.getCourseSummaryUseCase.execute(courseId, {
            date,
            dateFrom,
            dateTo,
        });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener asistencia por ID' })
    @ApiResponse({
        status: 200,
        description: 'Asistencia encontrada',
        type: AttendanceOutput,
    })
    @ApiResponse({ status: 404, description: 'Asistencia no encontrada' })
    @ApiParam({ name: 'id', description: 'ID de la asistencia' })
    async findOne(@Param('id') id: string): Promise<AttendanceOutput> {
        return this.getAttendanceUseCase.execute(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar asistencia' })
    @ApiResponse({
        status: 200,
        description: 'Asistencia actualizada',
        type: AttendanceOutput,
    })
    @ApiResponse({ status: 404, description: 'Asistencia no encontrada' })
    @ApiParam({ name: 'id', description: 'ID de la asistencia' })
    @ApiHeader({
        name: 'x-user-email',
        description: 'Email del usuario',
        required: true,
    })
    async update(
        @Param('id') id: string,
        @Body() input: UpdateAttendanceInput,
        @Headers('x-user-email') userEmail: string = 'system@colegio.cl',
    ): Promise<AttendanceOutput> {
        return this.updateAttendanceUseCase.execute(id, input, userEmail);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar asistencia' })
    @ApiResponse({
        status: 204,
        description: 'Asistencia eliminada',
    })
    @ApiResponse({ status: 404, description: 'Asistencia no encontrada' })
    @ApiParam({ name: 'id', description: 'ID de la asistencia' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.deleteAttendanceUseCase.execute(id);
    }
}
