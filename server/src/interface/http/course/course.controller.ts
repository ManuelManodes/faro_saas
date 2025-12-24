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
import { CreateCourseInput } from '../../../application/course/dto/create-course.input';
import { UpdateCourseInput } from '../../../application/course/dto/update-course.input';
import { CourseOutput } from '../../../application/course/dto/course.output';
import { CreateCourseUseCase } from '../../../application/course/use-case/create-course.usecase';
import { ListCourseUseCase } from '../../../application/course/use-case/list-course.usecase';
import { GetCourseUseCase } from '../../../application/course/use-case/get-course.usecase';
import { UpdateCourseUseCase } from '../../../application/course/use-case/update-course.usecase';
import { RemoveCourseUseCase } from '../../../application/course/use-case/remove-course.usecase';

@ApiTags('Courses')
@Controller('courses')
export class CourseController {
    constructor(
        private readonly createCourseUseCase: CreateCourseUseCase,
        private readonly listCourseUseCase: ListCourseUseCase,
        private readonly getCourseUseCase: GetCourseUseCase,
        private readonly updateCourseUseCase: UpdateCourseUseCase,
        private readonly removeCourseUseCase: RemoveCourseUseCase,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear nuevo curso' })
    @ApiResponse({
        status: 201,
        description: 'Curso creado exitosamente',
        type: CourseOutput,
    })
    @ApiResponse({ status: 400, description: 'Datos inválidos o código duplicado' })
    @ApiHeader({
        name: 'x-user-email',
        description: 'Email del usuario que realiza la operación',
        required: true,
    })
    async create(
        @Body() input: CreateCourseInput,
        @Headers('x-user-email') userEmail: string = 'system@colegio.cl',
    ): Promise<CourseOutput> {
        return this.createCourseUseCase.execute(input, userEmail);
    }

    @Get()
    @ApiOperation({ summary: 'Listar cursos activos' })
    @ApiResponse({
        status: 200,
        description: 'Lista de cursos',
        type: [CourseOutput],
    })
    @ApiQuery({ name: 'grade', required: false, description: 'Filtrar por grado' })
    @ApiQuery({ name: 'section', required: false, description: 'Filtrar por sección' })
    @ApiQuery({ name: 'subject', required: false, description: 'Filtrar por asignatura' })
    @ApiQuery({ name: 'teacherEmail', required: false, description: 'Filtrar por email del profesor' })
    @ApiQuery({ name: 'academicYear', required: false, description: 'Filtrar por año académico', type: Number })
    @ApiQuery({ name: 'status', required: false, description: 'Filtrar por estado' })
    async findAll(
        @Query('grade') grade?: string,
        @Query('section') section?: string,
        @Query('subject') subject?: string,
        @Query('teacherEmail') teacherEmail?: string,
        @Query('academicYear') academicYear?: number,
        @Query('status') status?: string,
    ): Promise<CourseOutput[]> {
        return this.listCourseUseCase.execute({
            grade,
            section,
            subject,
            teacherEmail,
            academicYear,
            status,
        });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener curso por ID' })
    @ApiResponse({
        status: 200,
        description: 'Curso encontrado',
        type: CourseOutput,
    })
    @ApiResponse({ status: 404, description: 'Curso no encontrado' })
    @ApiParam({
        name: 'id',
        description: 'ID del curso (MongoDB ObjectId)',
        type: String,
    })
    async findOne(@Param('id') id: string): Promise<CourseOutput> {
        return this.getCourseUseCase.execute(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar curso' })
    @ApiResponse({
        status: 200,
        description: 'Curso actualizado',
        type: CourseOutput,
    })
    @ApiResponse({ status: 404, description: 'Curso no encontrado' })
    @ApiResponse({
        status: 400,
        description: 'No se puede actualizar curso finalizado',
    })
    @ApiParam({
        name: 'id',
        description: 'ID del curso',
        type: String,
    })
    @ApiHeader({
        name: 'x-user-email',
        description: 'Email del usuario que realiza la operación',
        required: true,
    })
    async update(
        @Param('id') id: string,
        @Body() input: UpdateCourseInput,
        @Headers('x-user-email') userEmail: string = 'system@colegio.cl',
    ): Promise<CourseOutput> {
        return this.updateCourseUseCase.execute(id, input, userEmail);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Finalizar curso (soft delete)' })
    @ApiResponse({
        status: 200,
        description: 'Curso finalizado',
        type: CourseOutput,
    })
    @ApiResponse({ status: 404, description: 'Curso no encontrado' })
    @ApiResponse({
        status: 400,
        description: 'Curso ya está finalizado',
    })
    @ApiParam({
        name: 'id',
        description: 'ID del curso',
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
    ): Promise<CourseOutput> {
        return this.removeCourseUseCase.execute(id, userEmail);
    }
}
