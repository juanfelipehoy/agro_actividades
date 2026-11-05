import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { ActividadesModule } from './actividades/actividades.module';
import { ActividadHistorialModule } from './actividad-historial/actividad-historial.module';
import { ActividadesEvidenciasModule } from './actividades-evidencias/actividades-evidencias.module';
import { ActividadesHerramientasModule } from './actividades-herramientas/actividades-herramientas.module';
import { ActividadesResponsablesModule } from './actividades-responsables/actividades-responsables.module';
import { ActividadesServiciosModule } from './actividades-servicios/actividades-servicios.module';
import { CommonModule } from './common/common.module';
import { AppController } from './common/controllers/app.controller';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CommonModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    TypeOrmModule.forRootAsync({
      useFactory: (): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'agrosoft',
        entities: [__dirname + '/**/*.orm-entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: false,
        migrationsRun: true,
        logging: process.env.DB_LOGGING === 'true',
      }),
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('TypeORM options no configuradas');
        }
        const dataSource = new DataSource(options);
        addTransactionalDataSource(dataSource);
        await dataSource.initialize();
        return dataSource;
      },
    }),
    ActividadesModule,
    ActividadHistorialModule,
    ActividadesEvidenciasModule,
    ActividadesHerramientasModule,
    ActividadesResponsablesModule,
    ActividadesServiciosModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
