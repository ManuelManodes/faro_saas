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
import { CreateHollandTestInput } from '../../../application/holland-test/dto/create-holland-test.input';
import { UpdateHollandTestInput } from '../../../application/holland-test/dto/update-holland-test.input';
import { HollandTestOutput } from '../../../application/holland-test/dto/holland-test.output';
import { CreateHollandTestUseCase } from '../../../application/holland-test/use-case/create-holland-test.usecase';
import { ListHollandTestUseCase } from '../../../application/holland-test/use-case/list-holland-test.usecase';
import { GetHollandTestUseCase } from '../../../application/holland-test/use-case/get-holland-test.usecase';
import { GetLatestTestByStudentUseCase } from '../../../application/holland-test/use-case/get-latest-test-by-student.usecase';
import { UpdateHollandTestUseCase } from '../../../application/holland-test/use-case/update-holland-test.usecase';
import { DeleteHollandTestUseCase } from '../../../application/holland-test/use-case/delete-holland-test.usecase';

@ApiTags('Holland Test')
@Controller('holland-test')
export class HollandTestController {
    constructor(
        private readonly createHollandTestUseCase: CreateHollandTestUseCase,
        private readonly listHollandTestUseCase: ListHollandTestUseCase,
        private readonly getHollandTestUseCase: GetHollandTestUseCase,
        private readonly getLatestTestByStudentUseCase: GetLatestTestByStudentUseCase,
        private readonly updateHollandTestUseCase: UpdateHollandTestUseCase,
        private readonly deleteHollandTestUseCase: DeleteHollandTestUseCase,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar test de Holland' })
    @ApiResponse({
        status: 201,
        description: 'Test registrado exitosamente',
        type: HollandTestOutput,
    })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiHeader({
        name: 'x-user-email',
        description: 'Email del orientador',
        required: true,
    })
    async create(
        @Body() input: CreateHollandTestInput,
        @Headers('x-user-email') userEmail: string = 'system@colegio.cl',
    ): Promise<HollandTestOutput> {
        return this.createHollandTestUseCase.execute(input, userEmail);
    }

    @Get()
    @ApiOperation({ summary: 'Listar tests de Holland' })
    @ApiResponse({
        status: 200,
        description: 'Lista de tests',
        type: [HollandTestOutput],
    })
    @ApiQuery({ name: 'studentId', required: false })
    @ApiQuery({ name: 'status', required: false })
    @ApiQuery({ name: 'dateFrom', required: false })
    @ApiQuery({ name: 'dateTo', required: false })
    @ApiQuery({
        name: 'dominantType',
        required: false,
        description: 'Filtrar por tipo dominante (R, I, A, S, E, C)',
    })
    async findAll(
        @Query('studentId') studentId?: string,
        @Query('status') status?: string,
        @Query('dateFrom') dateFrom?: string,
        @Query('dateTo') dateTo?: string,
        @Query('dominantType') dominantType?: string,
    ): Promise<HollandTestOutput[]> {
        return this.listHollandTestUseCase.execute({
            studentId,
            status,
            dateFrom,
            dateTo,
            dominantType,
        });
    }

    @Get('student/:studentId/latest')
    @ApiOperation({ summary: 'Obtener último test de un estudiante' })
    @ApiResponse({
        status: 200,
        description: 'Último test del estudiante',
        type: HollandTestOutput,
    })
    @ApiResponse({ status: 404, description: 'No hay tests registrados' })
    @ApiParam({ name: 'studentId', description: 'ID del estudiante' })
    async getLatestByStudent(
        @Param('studentId') studentId: string,
    ): Promise<HollandTestOutput | null> {
        return this.getLatestTestByStudentUseCase.execute(studentId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener test por ID' })
    @ApiResponse({
        status: 200,
        description: 'Test encontrado',
        type: HollandTestOutput,
    })
    @ApiResponse({ status: 404, description: 'Test no encontrado' })
    @ApiParam({ name: 'id', description: 'ID del test' })
    async findOne(@Param('id') id: string): Promise<HollandTestOutput> {
        return this.getHollandTestUseCase.execute(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar test' })
    @ApiResponse({
        status: 200,
        description: 'Test actualizado',
        type: HollandTestOutput,
    })
    @ApiResponse({ status: 404, description: 'Test no encontrado' })
    @ApiParam({ name: 'id', description: 'ID del test' })
    @ApiHeader({
        name: 'x-user-email',
        description: 'Email del usuario',
        required: true,
    })
    async update(
        @Param('id') id: string,
        @Body() input: UpdateHollandTestInput,
        @Headers('x-user-email') userEmail: string = 'system@colegio.cl',
    ): Promise<HollandTestOutput> {
        return this.updateHollandTestUseCase.execute(id, input, userEmail);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar test' })
    @ApiResponse({
        status: 204,
        description: 'Test eliminado',
    })
    @ApiResponse({ status: 404, description: 'Test no encontrado' })
    @ApiParam({ name: 'id', description: 'ID del test' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.deleteHollandTestUseCase.execute(id);
    }
}
