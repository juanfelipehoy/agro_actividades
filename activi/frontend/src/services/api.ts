import axios, { AxiosInstance, AxiosError } from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de solicitud
api.interceptors.request.use(
  (config) => {
    // Subida de archivos: FormData no se puede limpiar ni serializar a JSON.
    // Se elimina el Content-Type por defecto (application/json) para que el
    // navegador defina el boundary correcto de multipart/form-data.
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      config.data.forEach((value, key) => {
        if (value === '' || value === null || value === undefined) {
          config.data.delete(key);
        }
      });
      config.headers.delete('Content-Type');
      return config;
    }

    if (config.data && typeof config.data === 'object') {
      const method = (config.method ?? 'get').toLowerCase();
      const isUpdate = method === 'patch' || method === 'put';

      config.data = Object.keys(config.data).reduce<Record<string, unknown>>(
        (acc, key) => {
          const value = config.data[key];
          if (value === undefined) return acc;
          // En creaciones los campos vacíos se omiten; en actualizaciones
          // se envían como null para poder limpiar el valor en el servidor.
          if (value === '' && !isUpdate) return acc;
          acc[key] = value === '' ? null : value;
          return acc;
        },
        {},
      );
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de respuesta para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const responseData = error.response?.data as unknown;
    let message = error.message || 'Error desconocido';

    if (!error.response) {
      message = 'No se pudo conectar con el servidor. Verifica que el backend esté activo.';
    } else if (responseData) {
      if (typeof responseData === 'string') {
        message = responseData;
      } else if (typeof responseData === 'object') {
        const data = responseData as Record<string, unknown>;
        if (Array.isArray(data.message)) {
          message = String(data.message[0]);
        } else if (typeof data.message === 'string') {
          message = data.message;
        } else if (typeof data.error === 'string') {
          message = data.error;
        }
      }
    }

    return Promise.reject({
      ...error,
      response: {
        ...error.response,
        data: { message },
      },
    });
  },
);

// Interfaces
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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
  id_actividad_herramienta?: number;
  id_actividad: number;
  nombre_herramienta: string;
  cantidad?: number;
}

export interface ActividadResponsable {
  id_actividad_responsable?: number;
  id_actividad: number;
  nombre_responsable: string;
  rol?: string;
  estado_asignacion?: string;
  id_usuario?: number;
}

export interface ActividadServicio {
  id_actividad_servicio?: number;
  id_actividad: number;
  nombre_servicio: string;
  descripcion?: string;
  costo?: number;
  proveedor?: string;
}

// Helpers de paginación
const paginatedGet = <T>(path: string) =>
  (page = 1, limit = 20) =>
    api.get<PaginatedResponse<T>>(path, { params: { page, limit } });

export interface EstadoCount {
  estado: string;
  total: number;
}

// Actividades
export const actividadesApi = {
  getAll: paginatedGet<Actividad>('/actividades'),
  getStats: () => api.get<EstadoCount[]>('/actividades/stats'),
  getById: (id: number) => api.get<Actividad>(`/actividades/${id}`),
  create: (data: Partial<Actividad>) => api.post<Actividad>('/actividades', data),
  update: (id: number, data: Partial<Actividad>) => api.patch<Actividad>(`/actividades/${id}`, data),
  delete: (id: number) => api.delete(`/actividades/${id}`),
};

// Actividad Historial
export const historialApi = {
  getAll: paginatedGet<ActividadHistorial>('/actividad-historial'),
  getById: (id: number) => api.get<ActividadHistorial>(`/actividad-historial/${id}`),
  create: (data: Partial<ActividadHistorial>) => api.post<ActividadHistorial>('/actividad-historial', data),
  update: (id: number, data: Partial<ActividadHistorial>) => api.patch<ActividadHistorial>(`/actividad-historial/${id}`, data),
  delete: (id: number) => api.delete(`/actividad-historial/${id}`),
  getByActividad: (actividadId: number) => api.get<ActividadHistorial[]>(`/actividad-historial/actividad/${actividadId}`),
};

// Actividades Evidencias
export const evidenciasApi = {
  getAll: paginatedGet<ActividadEvidencia>('/actividades-evidencias'),
  getById: (id: number) => api.get<ActividadEvidencia>(`/actividades-evidencias/${id}`),
  create: (data: Partial<ActividadEvidencia> | FormData) =>
    api.post<ActividadEvidencia>('/actividades-evidencias', data),
  update: (id: number, data: Partial<ActividadEvidencia>) => api.patch<ActividadEvidencia>(`/actividades-evidencias/${id}`, data),
  delete: (id: number) => api.delete(`/actividades-evidencias/${id}`),
  getByActividad: (actividadId: number) => api.get<ActividadEvidencia[]>(`/actividades-evidencias/actividad/${actividadId}`),
};

// Actividades Herramientas
export const herramientasApi = {
  getAll: paginatedGet<ActividadHerramienta>('/actividades-herramientas'),
  getById: (id: number) => api.get<ActividadHerramienta>(`/actividades-herramientas/${id}`),
  create: (data: Partial<ActividadHerramienta>) => api.post<ActividadHerramienta>('/actividades-herramientas', data),
  update: (id: number, data: Partial<ActividadHerramienta>) => api.patch<ActividadHerramienta>(`/actividades-herramientas/${id}`, data),
  delete: (id: number) => api.delete(`/actividades-herramientas/${id}`),
  getByActividad: (actividadId: number) => api.get<ActividadHerramienta[]>(`/actividades-herramientas/actividad/${actividadId}`),
};

// Actividades Responsables
export const responsablesApi = {
  getAll: paginatedGet<ActividadResponsable>('/actividades-responsables'),
  getById: (id: number) => api.get<ActividadResponsable>(`/actividades-responsables/${id}`),
  create: (data: Partial<ActividadResponsable>) => api.post<ActividadResponsable>('/actividades-responsables', data),
  update: (id: number, data: Partial<ActividadResponsable>) => api.patch<ActividadResponsable>(`/actividades-responsables/${id}`, data),
  delete: (id: number) => api.delete(`/actividades-responsables/${id}`),
  getByActividad: (actividadId: number) => api.get<ActividadResponsable[]>(`/actividades-responsables/actividad/${actividadId}`),
};

// Actividades Servicios
export const serviciosApi = {
  getAll: paginatedGet<ActividadServicio>('/actividades-servicios'),
  getById: (id: number) => api.get<ActividadServicio>(`/actividades-servicios/${id}`),
  create: (data: Partial<ActividadServicio>) => api.post<ActividadServicio>('/actividades-servicios', data),
  update: (id: number, data: Partial<ActividadServicio>) => api.patch<ActividadServicio>(`/actividades-servicios/${id}`, data),
  delete: (id: number) => api.delete(`/actividades-servicios/${id}`),
  getByActividad: (actividadId: number) => api.get<ActividadServicio[]>(`/actividades-servicios/actividad/${actividadId}`),
};

export default api;
