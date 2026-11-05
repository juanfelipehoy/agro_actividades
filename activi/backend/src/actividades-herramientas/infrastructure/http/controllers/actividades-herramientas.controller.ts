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
import { CreateActividadHerramientaUseCase } from '../../../application/use-cases/create-actividad-herramienta.use-case';
import { GetActividadHerramientaUseCase } from '../../../application/use-cases/get-actividad-herramienta.use-case';
import { SaveActividadHerramientaUseCase } from '../../../application/use-cases/save-actividad-herramienta.use-case';
import { DeleteActividadHerramientaUseCase } from '../../../application/use-cases/delete-actividad-herramienta.use-case';
import { CreateActividadHerramientaDto } from '../dto/create-actividad-herramienta.dto';
import { SaveActividadHerramientaDto } from '../dto/save-actividad-herramienta.dto';
import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';

@Controller('actividades-herramientas')
export class ActividadesHerramientasController {
  constructor(
    private readonly createUseCase: CreateActividadHerramientaUseCase,
    private readonly getUseCase: GetActividadHerramientaUseCase,
    private readonly saveUseCase: SaveActividadHerramientaUseCase,
    private readonly deleteUseCase: DeleteActividadHerramientaUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateActividadHerramientaDto) {
    const result = await this.createUseCase.execute(dto);
    return result.toPrimitives();
  }

  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    const result = await this.getUseCase.findAll(query);
    return {
      ...result,
      data: result.data.map((r) => r.toPrimitives()),
    };
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
        `Herramienta de actividad con id ${id} no encontrada`,
      );
    }
    return result.toPrimitives();
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SaveActividadHerramientaDto,
  ) {
    const result = await this.saveUseCase.execute(id, dto);
    if (!result) {
      throw new NotFoundException(
        `Herramienta de actividad con id ${id} no encontrada`,
      );
    }
    return result.toPrimitives();
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.deleteUseCase.execute(id);
    if (!deleted) {
      throw new NotFoundException(
        `Herramienta de actividad con id ${id} no encontrada`,
      );
    }
    return { deleted };
  }
}
