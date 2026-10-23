import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de solicitud para limpiar campos vacíos
api.interceptors.request.use(
  (config) => {
    if (config.data && typeof config.data === 'object') {
      // Eliminar campos vacíos (string vacío, null, undefined)
      const cleanedData = Object.keys(config.data).reduce((acc, key) => {
        const value = config.data[key];
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, unknown>);
      config.data = cleanedData;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de respuesta para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = (error.response?.data as { message?: string })?.message || error.message || 'Error desconocido';

    console.error('Error de API:', {
      url: error.config?.url,
      status: error.response?.status,
      message,
      data: error.response?.data,
    });

    // Puedes agregar notificaciones toast aquí si deseas
    // Por ahora solo logeamos el error

    return Promise.reject(error);
  },
);

// Interfaces
export interface Actividad {
  id_actividad?: number;
  titulo: string;
  descripcion?: string;
  tipo_actividad: string;
  estado?: string;
  prioridad?: string;
  fecha_programada?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  id_cultivo_real?: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface ActividadHistorial {
  id_actividad_historial?: number;
  id_actividad: number;
  accion: string;
  estado_anterior?: string;
  estado_nuevo?: string;
  id_usuario: number;
  observaciones?: string;
  fecha_registro?: string;
}

export interface ActividadEvidencia {
  id_actividad_evidencia?: number;
  id_actividad: number;
  tipo_evidencia: string;
  archivo_url: string;
  descripcion?: string;
  observaciones?: string;
  fecha_registro?: string;
}

export interface ActividadHerramienta {
  id_herramienta?: number;
  id_actividad: number;
  nombre_herramienta: string;
  cantidad?: number;
}

export interface ActividadResponsable {
  id_responsable?: number;
  id_actividad: number;
  nombre_responsable: string;
  rol?: string;
}

export interface ActividadServicio {
  id_servicio?: number;
  id_actividad: number;
  nombre_servicio: string;
  proveedor?: string;
}

// Actividades
export const actividadesApi = {
  getAll: () => api.get<Actividad[]>('/actividades'),
  getById: (id: number) => api.get<Actividad>(`/actividades/${id}`),
  create: (data: Partial<Actividad>) => api.post<Actividad>('/actividades', data),
  update: (id: number, data: Partial<Actividad>) => api.patch<Actividad>(`/actividades/${id}`, data),
  delete: (id: number) => api.delete(`/actividades/${id}`),
};

// Actividad Historial
export const historialApi = {
  getAll: () => api.get<ActividadHistorial[]>('/actividad-historial'),
  getById: (id: number) => api.get<ActividadHistorial>(`/actividad-historial/${id}`),
  create: (data: Partial<ActividadHistorial>) => api.post<ActividadHistorial>('/actividad-historial', data),
  update: (id: number, data: Partial<ActividadHistorial>) => api.patch<ActividadHistorial>(`/actividad-historial/${id}`, data),
  delete: (id: number) => api.delete(`/actividad-historial/${id}`),
  getByActividad: (actividadId: number) => api.get<ActividadHistorial[]>(`/actividad-historial/actividad/${actividadId}`),
};

// Actividades Evidencias
export const evidenciasApi = {
  getAll: () => api.get<ActividadEvidencia[]>('/actividades-evidencias'),
  getById: (id: number) => api.get<ActividadEvidencia>(`/actividades-evidencias/${id}`),
  create: (data: Partial<ActividadEvidencia>) => api.post<ActividadEvidencia>('/actividades-evidencias', data),
  update: (id: number, data: Partial<ActividadEvidencia>) => api.patch<ActividadEvidencia>(`/actividades-evidencias/${id}`, data),
  delete: (id: number) => api.delete(`/actividades-evidencias/${id}`),
  getByActividad: (actividadId: number) => api.get<ActividadEvidencia[]>(`/actividades-evidencias/actividad/${actividadId}`),
};

// Actividades Herramientas
export const herramientasApi = {
  getAll: () => api.get<ActividadHerramienta[]>('/actividades-herramientas'),
  getById: (id: number) => api.get<ActividadHerramienta>(`/actividades-herramientas/${id}`),
  create: (data: Partial<ActividadHerramienta>) => api.post<ActividadHerramienta>('/actividades-herramientas', data),
  update: (id: number, data: Partial<ActividadHerramienta>) => api.patch<ActividadHerramienta>(`/actividades-herramientas/${id}`, data),
  delete: (id: number) => api.delete(`/actividades-herramientas/${id}`),
  getByActividad: (actividadId: number) => api.get<ActividadHerramienta[]>(`/actividades-herramientas/actividad/${actividadId}`),
};

// Actividades Responsables
export const responsablesApi = {
  getAll: () => api.get<ActividadResponsable[]>('/actividades-responsables'),
  getById: (id: number) => api.get<ActividadResponsable>(`/actividades-responsables/${id}`),
  create: (data: Partial<ActividadResponsable>) => api.post<ActividadResponsable>('/actividades-responsables', data),
  update: (id: number, data: Partial<ActividadResponsable>) => api.patch<ActividadResponsable>(`/actividades-responsables/${id}`, data),
  delete: (id: number) => api.delete(`/actividades-responsables/${id}`),
  getByActividad: (actividadId: number) => api.get<ActividadResponsable[]>(`/actividades-responsables/actividad/${actividadId}`),
};

// Actividades Servicios
export const serviciosApi = {
  getAll: () => api.get<ActividadServicio[]>('/actividades-servicios'),
  getById: (id: number) => api.get<ActividadServicio>(`/actividades-servicios/${id}`),
  create: (data: Partial<ActividadServicio>) => api.post<ActividadServicio>('/actividades-servicios', data),
  update: (id: number, data: Partial<ActividadServicio>) => api.patch<ActividadServicio>(`/actividades-servicios/${id}`, data),
  delete: (id: number) => api.delete(`/actividades-servicios/${id}`),
  getByActividad: (actividadId: number) => api.get<ActividadServicio[]>(`/actividades-servicios/actividad/${actividadId}`),
};

export default api;
