import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';
import { CreateActividadUseCase } from '../../../application/use-cases/create-actividad.use-case';
import { GetActividadUseCase } from '../../../application/use-cases/get-actividad.use-case';
import { SaveActividadUseCase } from '../../../application/use-cases/save-actividad.use-case';
import { DeleteActividadUseCase } from '../../../application/use-cases/delete-actividad.use-case';
import { CreateActividadDto } from '../dto/create-actividad.dto';
import { SaveActividadDto } from '../dto/save-actividad.dto';

@ApiTags('actividades')
@Controller('actividades')
export class ActividadController {
  constructor(
    private readonly createActividadUseCase: CreateActividadUseCase,
    private readonly getActividadUseCase: GetActividadUseCase,
    private readonly saveActividadUseCase: SaveActividadUseCase,
    private readonly deleteActividadUseCase: DeleteActividadUseCase,
  ) {}

  @Post()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Crear una nueva actividad' })
  @ApiResponse({ status: 201, description: 'Actividad creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createActividadDto: CreateActividadDto) {
    const actividad =
      await this.createActividadUseCase.execute(createActividadDto);
    return actividad.toPrimitives();
  }

  @Get()
  @ApiOperation({ summary: 'Obtener actividades paginadas' })
  @ApiResponse({ status: 200, description: 'Lista paginada de actividades' })
  async findAll(@Query() query: PaginationQueryDto) {
    const result = await this.getActividadUseCase.findAll(query);
    return {
      ...result,
      data: result.data.map((actividad) => actividad.toPrimitives()),
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Contar actividades agrupadas por estado' })
  @ApiResponse({ status: 200, description: 'Conteo por estado' })
  async getStats() {
    return this.getActividadUseCase.countByEstado();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una actividad por ID' })
  @ApiResponse({ status: 200, description: 'Actividad encontrada' })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const actividad = await this.getActividadUseCase.execute(id);
    if (!actividad) {
      throw new NotFoundException(`Actividad con id ${id} no encontrada`);
    }
    return actividad.toPrimitives();
  }

  @Patch(':id')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOperation({ summary: 'Actualizar una actividad' })
  @ApiResponse({ status: 200, description: 'Actividad actualizada' })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() saveActividadDto: SaveActividadDto,
  ) {
    const actividad = await this.saveActividadUseCase.execute(
      id,
      saveActividadDto,
    );
    if (!actividad) {
      throw new NotFoundException(`Actividad con id ${id} no encontrada`);
    }
    return actividad.toPrimitives();
  }

  @Delete(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Eliminar una actividad' })
  @ApiResponse({ status: 200, description: 'Actividad eliminada' })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.deleteActividadUseCase.execute(id);
    if (!deleted) {
      throw new NotFoundException(`Actividad con id ${id} no encontrada`);
    }
    return { deleted };
  }
}
