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
import { CreateStudentInput } from '../../../application/student/dto/create-student.input';
import { UpdateStudentInput } from '../../../application/student/dto/update-student.input';
import { StudentOutput } from '../../../application/student/dto/student.output';
import { CreateStudentUseCase } from '../../../application/student/use-case/create-student.usecase';
import { ListStudentUseCase } from '../../../application/student/use-case/list-student.usecase';
import { GetStudentUseCase } from '../../../application/student/use-case/get-student.usecase';
import { UpdateStudentUseCase } from '../../../application/student/use-case/update-student.usecase';
import { RemoveStudentUseCase } from '../../../application/student/use-case/remove-student.usecase';

@ApiTags('Students')
@Controller('students')
export class StudentController {
    constructor(
        private readonly createStudentUseCase: CreateStudentUseCase,
        private readonly listStudentUseCase: ListStudentUseCase,
        private readonly getStudentUseCase: GetStudentUseCase,
        private readonly updateStudentUseCase: UpdateStudentUseCase,
        private readonly removeStudentUseCase: RemoveStudentUseCase,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear nuevo estudiante' })
    @ApiResponse({
        status: 201,
        description: 'Estudiante creado exitosamente',
        type: StudentOutput,
    })
    @ApiResponse({ status: 400, description: 'Datos inválidos o RUT/email duplicado' })
    @ApiHeader({
        name: 'x-user-email',
        description: 'Email del usuario que realiza la operación',
        required: true,
    })
    async create(
        @Body() input: CreateStudentInput,
        @Headers('x-user-email') userEmail: string = 'system@colegio.cl',
    ): Promise<StudentOutput> {
        try {
            console.log('Received input:', JSON.stringify(input, null, 2));
            console.log('User email:', userEmail);
            const result = await this.createStudentUseCase.execute(input, userEmail);
            console.log('Success! Created student:', result.id);
            return result;
        } catch (error) {
            console.error('ERROR in create student:', error);
            throw error;
        }
    }

    @Get()
    @ApiOperation({ summary: 'Listar estudiantes activos' })
    @ApiResponse({
        status: 200,
        description: 'Lista de estudiantes',
        type: [StudentOutput],
    })
    @ApiQuery({ name: 'status', required: false, description: 'Filtrar por estado' })
    @ApiQuery({ name: 'grade', required: false, description: 'Filtrar por grado' })
    @ApiQuery({ name: 'section', required: false, description: 'Filtrar por sección' })
    async findAll(
        @Query('status') status?: string,
        @Query('grade') grade?: string,
        @Query('section') section?: string,
    ): Promise<StudentOutput[]> {
        return this.listStudentUseCase.execute({ status, grade, section });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener estudiante por ID' })
    @ApiResponse({
        status: 200,
        description: 'Estudiante encontrado',
        type: StudentOutput,
    })
    @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
    @ApiParam({
        name: 'id',
        description: 'ID del estudiante (MongoDB ObjectId)',
        type: String,
    })
    async findOne(@Param('id') id: string): Promise<StudentOutput> {
        return this.getStudentUseCase.execute(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar estudiante' })
    @ApiResponse({
        status: 200,
        description: 'Estudiante actualizado',
        type: StudentOutput,
    })
    @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
    @ApiResponse({
        status: 400,
        description: 'No se puede actualizar estudiante retirado',
    })
    @ApiParam({
        name: 'id',
        description: 'ID del estudiante',
        type: String,
    })
    @ApiHeader({
        name: 'x-user-email',
        description: 'Email del usuario que realiza la operación',
        required: true,
    })
    async update(
        @Param('id') id: string,
        @Body() input: UpdateStudentInput,
        @Headers('x-user-email') userEmail: string = 'system@colegio.cl',
    ): Promise<StudentOutput> {
        return this.updateStudentUseCase.execute(id, input, userEmail);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Dar de baja estudiante (soft delete)' })
    @ApiResponse({
        status: 200,
        description: 'Estudiante dado de baja',
        type: StudentOutput,
    })
    @ApiResponse({ status: 404, description: 'Estudiante no encontrado' })
    @ApiResponse({
        status: 400,
        description: 'Estudiante ya está retirado',
    })
    @ApiParam({
        name: 'id',
        description: 'ID del estudiante',
        type: String,
    })
    @ApiHeader({
        name: 'x-user-email',
        description: 'Email del usuario que realiza la operación',
        required: true,
    })
    async remove(
        @Param('id') id: string,
        @Headers('x-user-email') userEmail: string = 'system@colegio.cl',
    ): Promise<StudentOutput> {
        return this.removeStudentUseCase.execute(id, userEmail);
    }
}
