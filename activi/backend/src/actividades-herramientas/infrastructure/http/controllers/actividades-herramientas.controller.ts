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
  Logger,
} from '@nestjs/common';
import { CreateActividadHerramientaUseCase } from '../../../application/use-cases/create-actividad-herramienta.use-case';
import { GetActividadHerramientaUseCase } from '../../../application/use-cases/get-actividad-herramienta.use-case';
import { SaveActividadHerramientaUseCase } from '../../../application/use-cases/save-actividad-herramienta.use-case';
import { DeleteActividadHerramientaUseCase } from '../../../application/use-cases/delete-actividad-herramienta.use-case';
import { CreateActividadHerramientaDto } from '../dto/create-actividad-herramienta.dto';
import { SaveActividadHerramientaDto } from '../dto/save-actividad-herramienta.dto';

@Controller('actividades-herramientas')
export class ActividadesHerramientasController {
  private readonly logger = new Logger(ActividadesHerramientasController.name);

  constructor(
    private readonly createUseCase: CreateActividadHerramientaUseCase,
    private readonly getUseCase: GetActividadHerramientaUseCase,
    private readonly saveUseCase: SaveActividadHerramientaUseCase,
    private readonly deleteUseCase: DeleteActividadHerramientaUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateActividadHerramientaDto) {
    this.logger.log(`Creando herramienta: ${JSON.stringify(dto)}`);
    try {
      const result = await this.createUseCase.execute(dto);
      this.logger.log(
        `Herramienta creada exitosamente con ID: ${result.toPrimitives().id_actividad_herramienta}`,
      );
      return result.toPrimitives();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error al crear herramienta: ${message}`, stack);
      throw error;
    }
  }

  @Get()
  async findAll() {
    const results = await this.getUseCase.findAll();
    return results.map((r) => r.toPrimitives());
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
