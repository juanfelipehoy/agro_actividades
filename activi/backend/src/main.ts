import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppLogger } from './common/logger/logger.service';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

// Debe ejecutarse antes de crear la aplicación para que las
// transacciones de typeorm-transactional funcionen correctamente.
initializeTransactionalContext({
  storageDriver: StorageDriver.ASYNC_LOCAL_STORAGE,
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = app.get(AppLogger);

  // CORS: orígenes permitidos configurables por variable de entorno.
  // CORS_ORIGIN admite una lista separada por comas. En desarrollo,
  // si no está definida se permite el frontend local de Vite.
  const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  // En desarrollo se refleja cualquier origen (previews, túneles, etc.).
  // En producción solo se permiten los orígenes de CORS_ORIGIN.
  const isProduction = process.env.NODE_ENV === 'production';

  app.enableCors({
    origin: isProduction ? corsOrigins : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Servir archivos estáticos de la carpeta uploads
  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('AGROSOFT API')
    .setDescription('Sistema de gestión agrícola - API RESTful')
    .setVersion('1.0')
    .addTag('actividades', 'Gestión de actividades agrícolas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(
    `Application is running on: http://localhost:${port}`,
    'Bootstrap',
  );
  logger.log(
    `API Documentation: http://localhost:${port}/api/docs`,
    'Bootstrap',
  );
}
void bootstrap();
