import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  getRoot() {
    return {
      message: 'AGROSOFT API',
      version: '1.0',
      documentation: '/api/docs',
      endpoints: {
        actividades: '/actividades',
        historial: '/actividad-historial',
        evidencias: '/actividades-evidencias',
        herramientas: '/actividades-herramientas',
        responsables: '/actividades-responsables',
        servicios: '/actividades-servicios',
      },
    };
  }

  @Get('health')
  async getHealth() {
    try {
      await this.dataSource.query('SELECT 1');
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'up',
      };
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'down',
      });
    }
  }
}
