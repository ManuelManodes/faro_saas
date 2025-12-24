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
import { CreateCalendarEventInput } from '../../../application/calendar-event/dto/create-calendar-event.input';
import { UpdateCalendarEventInput } from '../../../application/calendar-event/dto/update-calendar-event.input';
import { CalendarEventOutput } from '../../../application/calendar-event/dto/calendar-event.output';
import { CreateCalendarEventUseCase } from '../../../application/calendar-event/use-case/create-calendar-event.usecase';
import { ListCalendarEventUseCase } from '../../../application/calendar-event/use-case/list-calendar-event.usecase';
import { GetCalendarEventUseCase } from '../../../application/calendar-event/use-case/get-calendar-event.usecase';
import { GetUpcomingEventsUseCase } from '../../../application/calendar-event/use-case/get-upcoming-events.usecase';
import { UpdateCalendarEventUseCase } from '../../../application/calendar-event/use-case/update-calendar-event.usecase';
import { DeleteCalendarEventUseCase } from '../../../application/calendar-event/use-case/delete-calendar-event.usecase';

@ApiTags('Calendar Events')
@Controller('calendar-events')
export class CalendarEventController {
    constructor(
        private readonly createCalendarEventUseCase: CreateCalendarEventUseCase,
        private readonly listCalendarEventUseCase: ListCalendarEventUseCase,
        private readonly getCalendarEventUseCase: GetCalendarEventUseCase,
        private readonly getUpcomingEventsUseCase: GetUpcomingEventsUseCase,
        private readonly updateCalendarEventUseCase: UpdateCalendarEventUseCase,
        private readonly deleteCalendarEventUseCase: DeleteCalendarEventUseCase,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear evento en calendario' })
    @ApiResponse({
        status: 201,
        description: 'Evento creado exitosamente',
        type: CalendarEventOutput,
    })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiHeader({
        name: 'x-user-email',
        description: 'Email del creador',
        required: true,
    })
    async create(
        @Body() input: CreateCalendarEventInput,
        @Headers('x-user-email') userEmail: string = 'system@colegio.cl',
    ): Promise<CalendarEventOutput> {
        return this.createCalendarEventUseCase.execute(input, userEmail);
    }

    @Get()
    @ApiOperation({ summary: 'Listar eventos' })
    @ApiResponse({
        status: 200,
        description: 'Lista de eventos',
        type: [CalendarEventOutput],
    })
    @ApiQuery({ name: 'eventType', required: false })
    @ApiQuery({ name: 'status', required: false })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    @ApiQuery({ name: 'courseId', required: false })
    @ApiQuery({ name: 'organizerEmail', required: false })
    async findAll(
        @Query('eventType') eventType?: string,
        @Query('status') status?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('courseId') courseId?: string,
        @Query('organizerEmail') organizerEmail?: string,
    ): Promise<CalendarEventOutput[]> {
        return this.listCalendarEventUseCase.execute({
            eventType,
            status,
            startDate,
            endDate,
            courseId,
            organizerEmail,
        });
    }

    @Get('upcoming')
    @ApiOperation({ summary: 'Obtener próximos eventos' })
    @ApiResponse({
        status: 200,
        description: 'Próximos eventos',
        type: [CalendarEventOutput],
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Número de eventos',
        example: 10,
    })
    async getUpcoming(
        @Query('limit') limit?: string,
    ): Promise<CalendarEventOutput[]> {
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.getUpcomingEventsUseCase.execute(limitNum);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener evento por ID' })
    @ApiResponse({
        status: 200,
        description: 'Evento encontrado',
        type: CalendarEventOutput,
    })
    @ApiResponse({ status: 404, description: 'Evento no encontrado' })
    @ApiParam({ name: 'id', description: 'ID del evento' })
    async findOne(@Param('id') id: string): Promise<CalendarEventOutput> {
        return this.getCalendarEventUseCase.execute(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar evento' })
    @ApiResponse({
        status: 200,
        description: 'Evento actualizado',
        type: CalendarEventOutput,
    })
    @ApiResponse({ status: 404, description: 'Evento no encontrado' })
    @ApiParam({ name: 'id', description: 'ID del evento' })
    @ApiHeader({
        name: 'x-user-email',
        description: 'Email del usuario',
        required: true,
    })
    async update(
        @Param('id') id: string,
        @Body() input: UpdateCalendarEventInput,
        @Headers('x-user-email') userEmail: string = 'system@colegio.cl',
    ): Promise<CalendarEventOutput> {
        return this.updateCalendarEventUseCase.execute(id, input, userEmail);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar evento' })
    @ApiResponse({
        status: 204,
        description: 'Evento eliminado',
    })
    @ApiResponse({ status: 404, description: 'Evento no encontrado' })
    @ApiParam({ name: 'id', description: 'ID del evento' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.deleteCalendarEventUseCase.execute(id);
    }
}
