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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { mkdirSync } from 'fs';
import { CreateActividadEvidenciaUseCase } from '../../../application/use-cases/create-actividad-evidencia.use-case';
import { GetActividadEvidenciaUseCase } from '../../../application/use-cases/get-actividad-evidencia.use-case';
import { SaveActividadEvidenciaUseCase } from '../../../application/use-cases/save-actividad-evidencia.use-case';
import { DeleteActividadEvidenciaUseCase } from '../../../application/use-cases/delete-actividad-evidencia.use-case';
import { CreateActividadEvidenciaDto } from '../dto/create-actividad-evidencia.dto';
import { SaveActividadEvidenciaDto } from '../dto/save-actividad-evidencia.dto';

const UPLOADS_DIR = './uploads';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Coincide con el atributo `accept` del input file del modal
const ALLOWED_MIME_PREFIXES = ['image/', 'video/'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const storage = diskStorage({
  destination: (_req, _file, cb) => {
    mkdirSync(UPLOADS_DIR, { recursive: true });
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    // Solo se conserva una extensión segura (sin separadores ni caracteres raros)
    const extension = extname(file.originalname).toLowerCase();
    const safeExtension = /^\.[a-z0-9]+$/.test(extension) ? extension : '';
    cb(null, `${randomName}${safeExtension}`);
  },
});

const uploadOptions = {
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (
    _req: unknown,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowed =
      ALLOWED_MIME_PREFIXES.some((prefix) =>
        file.mimetype.startsWith(prefix),
      ) || ALLOWED_MIME_TYPES.includes(file.mimetype);

    if (!allowed) {
      cb(
        new BadRequestException(
          `Tipo de archivo no permitido: ${file.mimetype}`,
        ),
        false,
      );
      return;
    }
    cb(null, true);
  },
};

@Controller('actividades-evidencias')
export class ActividadesEvidenciasController {
  constructor(
    private readonly createUseCase: CreateActividadEvidenciaUseCase,
    private readonly getUseCase: GetActividadEvidenciaUseCase,
    private readonly saveUseCase: SaveActividadEvidenciaUseCase,
    private readonly deleteUseCase: DeleteActividadEvidenciaUseCase,
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

    const result = await this.createUseCase.execute({
      ...dto,
      archivo_url: `/uploads/${file.filename}`,
    });
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
