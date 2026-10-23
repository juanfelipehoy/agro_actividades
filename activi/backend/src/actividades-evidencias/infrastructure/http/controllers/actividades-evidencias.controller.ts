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
import { CreateActividadEvidenciaUseCase } from '../../../application/use-cases/create-actividad-evidencia.use-case';
import { GetActividadEvidenciaUseCase } from '../../../application/use-cases/get-actividad-evidencia.use-case';
import { SaveActividadEvidenciaUseCase } from '../../../application/use-cases/save-actividad-evidencia.use-case';
import { DeleteActividadEvidenciaUseCase } from '../../../application/use-cases/delete-actividad-evidencia.use-case';
import { CreateActividadEvidenciaDto } from '../dto/create-actividad-evidencia.dto';
import { SaveActividadEvidenciaDto } from '../dto/save-actividad-evidencia.dto';

@Controller('actividades-evidencias')
export class ActividadesEvidenciasController {
  constructor(
    private readonly createUseCase: CreateActividadEvidenciaUseCase,
    private readonly getUseCase: GetActividadEvidenciaUseCase,
    private readonly saveUseCase: SaveActividadEvidenciaUseCase,
    private readonly deleteUseCase: DeleteActividadEvidenciaUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateActividadEvidenciaDto) {
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
        `Evidencia de actividad con id ${id} no encontrada`,
      );
    }
    return result.toPrimitives();
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SaveActividadEvidenciaDto,
  ) {
    const result = await this.saveUseCase.execute(id, dto);
    if (!result) {
      throw new NotFoundException(
        `Evidencia de actividad con id ${id} no encontrada`,
      );
    }
    return result.toPrimitives();
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.deleteUseCase.execute(id);
    if (!deleted) {
      throw new NotFoundException(
        `Evidencia de actividad con id ${id} no encontrada`,
      );
    }
    return { deleted };
  }
}
