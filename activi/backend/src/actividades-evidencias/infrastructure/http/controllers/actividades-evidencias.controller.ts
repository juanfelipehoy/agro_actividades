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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CreateActividadEvidenciaUseCase } from '../../../application/use-cases/create-actividad-evidencia.use-case';
import { GetActividadEvidenciaUseCase } from '../../../application/use-cases/get-actividad-evidencia.use-case';
import { SaveActividadEvidenciaUseCase } from '../../../application/use-cases/save-actividad-evidencia.use-case';
import { DeleteActividadEvidenciaUseCase } from '../../../application/use-cases/delete-actividad-evidencia.use-case';
import { CreateActividadEvidenciaDto } from '../dto/create-actividad-evidencia.dto';
import { SaveActividadEvidenciaDto } from '../dto/save-actividad-evidencia.dto';
import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto';
import { FileStorageService } from '../../../../common/storage/file-storage.service';
import { isAllowedFile } from '../../../../common/utils/file-signatures';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const uploadOptions = {
  storage: memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
};

@Controller('actividades-evidencias')
export class ActividadesEvidenciasController {
  constructor(
    private readonly createUseCase: CreateActividadEvidenciaUseCase,
    private readonly getUseCase: GetActividadEvidenciaUseCase,
    private readonly saveUseCase: SaveActividadEvidenciaUseCase,
    private readonly deleteUseCase: DeleteActividadEvidenciaUseCase,
    private readonly fileStorage: FileStorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  async create(
    @Body() dto: CreateActividadEvidenciaDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Validación real del contenido por firma binaria: el mimetype
    // declarado por el cliente no es confiable.
    if (!isAllowedFile(file.buffer)) {
      throw new BadRequestException(
        'El contenido del archivo no corresponde a un tipo permitido (imagen, video o documento)',
      );
    }

    const archivoUrl = await this.fileStorage.saveFile(
      file.buffer,
      file.originalname,
    );

    const result = await this.createUseCase.execute({
      ...dto,
      archivo_url: archivoUrl,
    });
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
