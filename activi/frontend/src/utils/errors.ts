interface ErrorConRespuesta {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
  message?: string;
}

/**
 * Extrae un mensaje legible de un error de API.
 * El interceptor de axios ya normaliza el formato del backend.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  const err = error as ErrorConRespuesta;
  const message = err?.response?.data?.message;

  if (Array.isArray(message) && message.length > 0) return message[0];
  if (typeof message === 'string' && message.length > 0) return message;
  if (typeof err?.message === 'string' && err.message.length > 0) {
    return err.message;
  }
  return fallback;
}
