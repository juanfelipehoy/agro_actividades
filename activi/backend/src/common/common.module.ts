import { Global, Module } from '@nestjs/common';
import { AppLogger } from './logger/logger.service';
import { FileStorageService } from './storage/file-storage.service';

@Global()
@Module({
  providers: [AppLogger, FileStorageService],
  exports: [AppLogger, FileStorageService],
})
export class CommonModule {}
