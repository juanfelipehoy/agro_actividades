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
import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';
import { CreateActividadResponsableUseCase } from '../../../application/use-cases/create-actividad-responsable.use-case';
import { GetActividadResponsableUseCase } from '../../../application/use-cases/get-actividad-responsable.use-case';
import { SaveActividadResponsableUseCase } from '../../../application/use-cases/save-actividad-responsable.use-case';
import { DeleteActividadResponsableUseCase } from '../../../application/use-cases/delete-actividad-responsable.use-case';
import { CreateActividadResponsableDto } from '../dto/create-actividad-responsable.dto';
import { SaveActividadResponsableDto } from '../dto/save-actividad-responsable.dto';

@Controller('actividades-responsables')
export class ActividadesResponsablesController {
  constructor(
    private readonly createUseCase: CreateActividadResponsableUseCase,
    private readonly getUseCase: GetActividadResponsableUseCase,
    private readonly saveUseCase: SaveActividadResponsableUseCase,
    private readonly deleteUseCase: DeleteActividadResponsableUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateActividadResponsableDto) {
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
        `Responsable de actividad con id ${id} no encontrado`,
      );
    }
    return result.toPrimitives();
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SaveActividadResponsableDto,
  ) {
    const result = await this.saveUseCase.execute(id, dto);
    if (!result) {
      throw new NotFoundException(
        `Responsable de actividad con id ${id} no encontrado`,
      );
    }
    return result.toPrimitives();
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.deleteUseCase.execute(id);
    if (!deleted) {
      throw new NotFoundException(
        `Responsable de actividad con id ${id} no encontrado`,
      );
    }
    return { deleted };
  }
}
