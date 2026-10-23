import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
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
}
