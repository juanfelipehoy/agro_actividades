import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { extname, join, normalize, resolve, sep } from 'path';

@Injectable()
export class FileStorageService {
  private readonly logger = new Logger(FileStorageService.name);
  private readonly uploadsDir = resolve(process.cwd(), 'uploads');

  /**
   * Guarda un archivo en disco con un nombre aleatorio seguro.
   * Devuelve la URL pública relativa (ej: /uploads/<uuid>.<ext>).
   */
  async saveFile(buffer: Buffer, originalName: string): Promise<string> {
    await mkdir(this.uploadsDir, { recursive: true });

    const extension = extname(originalName).toLowerCase();
    const safeExtension = /^\.[a-z0-9]{1,10}$/.test(extension) ? extension : '';
    const filename = `${randomUUID()}${safeExtension}`;

    await writeFile(join(this.uploadsDir, filename), buffer);
    return `/uploads/${filename}`;
  }

  /**
   * Elimina un archivo físico a partir de su URL pública (/uploads/archivo.ext).
   * Ignora silenciosamente URLs externas o rutas inválidas.
   */
  async deleteFile(publicUrl: string): Promise<void> {
    const filename = this.resolveFilename(publicUrl);
    if (!filename) return;

    const filePath = join(this.uploadsDir, filename);
    try {
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (error) {
      this.logger.warn(
        `No se pudo eliminar el archivo ${filename}: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  private resolveFilename(publicUrl: string): string | null {
    if (!publicUrl || !publicUrl.startsWith('/uploads/')) return null;

    const filename = normalize(publicUrl.slice('/uploads/'.length));
    // Evita path traversal: el nombre debe ser un archivo simple dentro de uploads
    if (
      !filename ||
      filename.includes('..') ||
      filename.includes(sep) ||
      filename.includes('/') ||
      filename.includes('\\')
    ) {
      return null;
    }
    return filename;
  }
}
