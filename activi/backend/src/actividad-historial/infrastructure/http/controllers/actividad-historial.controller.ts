import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { CreateActividadHistorialUseCase } from '../../../application/use-cases/create-actividad-historial.use-case';
import { GetActividadHistorialUseCase } from '../../../application/use-cases/get-actividad-historial.use-case';
import { SaveActividadHistorialUseCase } from '../../../application/use-cases/save-actividad-historial.use-case';
import { DeleteActividadHistorialUseCase } from '../../../application/use-cases/delete-actividad-historial.use-case';
import { CreateActividadHistorialDto } from '../dto/create-actividad-historial.dto';
import { SaveActividadHistorialDto } from '../dto/save-actividad-historial.dto';

@Controller('actividad-historial')
export class ActividadHistorialController {
  constructor(
    private readonly createUseCase: CreateActividadHistorialUseCase,
    private readonly getUseCase: GetActividadHistorialUseCase,
    private readonly saveUseCase: SaveActividadHistorialUseCase,
    private readonly deleteUseCase: DeleteActividadHistorialUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateActividadHistorialDto) {
    const result = await this.createUseCase.execute(dto);
    return result.toPrimitives();
  }

  @Get()
  async findAll() {
    const results = await this.getUseCase.findAll();
    return results.map((r) => r.toPrimitives());
  }

  @Get('actividad/:actividadId')
  async findByActividad(
    @Param('actividadId', ParseIntPipe) actividadId: number,
  ) {
    const results = await this.getUseCase.findByActividad(actividadId);
    return results.map((result) => result.toPrimitives());
  }
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.getUseCase.findById(id);
    if (!result) {
      throw new NotFoundException(
        `Historial de actividad con id ${id} no encontrado`,
      );
    }
    return result.toPrimitives();
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SaveActividadHistorialDto,
  ) {
    const result = await this.saveUseCase.execute(id, dto);
    if (!result) {
      throw new NotFoundException(
        `Historial de actividad con id ${id} no encontrado`,
      );
    }
    return result.toPrimitives();
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.deleteUseCase.execute(id);
    if (!deleted) {
      throw new NotFoundException(
        `Historial de actividad con id ${id} no encontrado`,
      );
    }
    return { deleted };
  }
}
