# AGROSOFT

Sistema de gestión agrícola con frontend en React y backend en NestJS + PostgreSQL.

## Estructura del proyecto

```
activi/
├── backend/     # API REST - NestJS, TypeORM, PostgreSQL
├── frontend/    # SPA - React, Vite, Tailwind CSS, TanStack Query
└── docker-compose.yml  # Orquestación de PostgreSQL
```

## Requisitos

- Node.js 20 o superior
- Docker y Docker Compose (para la base de datos)
- Git

## Inicio rápido

### 1. Base de datos

```bash
docker-compose up -d
```

Esto levanta PostgreSQL 15 en el puerto `5433` (configurable con `DB_PORT`).

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # ajustar credenciales si es necesario
npm run start:dev
```

La API queda disponible en `http://localhost:3000` y la documentación Swagger en `http://localhost:3000/api/docs`.

Las migraciones de base de datos se ejecutan automáticamente al iniciar (`migrationsRun: true`).

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda en `http://localhost:5173`.

## Scripts útiles

Desde la raíz:

```bash
npm run backend:dev    # backend en modo desarrollo
npm run frontend:dev   # frontend en modo desarrollo
npm run dev            # ambos en paralelo (concurrently)
npm run build          # compila backend y frontend
```

En `backend/`:

```bash
npm run lint           # ESLint con corrección automática
npm test               # tests unitarios (Jest)
npm run build          # compila a dist/
```

En `frontend/`:

```bash
npm run lint           # ESLint
npm run build          # typecheck (tsc) + build de Vite
```

## Variables de entorno

### Backend (`backend/.env`)

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5433` |
| `DB_USERNAME` | Usuario de base de datos | `backend_user` |
| `DB_PASSWORD` | Contraseña de base de datos | `backend123` |
| `DB_DATABASE` | Nombre de la base de datos | `db_agrosoft` |
| `PORT` | Puerto del servidor | `3000` |
| `CORS_ORIGIN` | Orígenes permitidos (separados por coma) | `http://localhost:5173` |
| `LOG_LEVEL` | Nivel de logs Winston | `info` |

### Frontend (`frontend/.env`)

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API (ej. `http://localhost:3000`) |

## Arquitectura

### Backend

Arquitectura hexagonal por módulos. Cada módulo sigue la misma estructura:

```
src/<modulo>/
├── domain/
│   ├── entities/       # Entidades de dominio puras
│   └── ports/          # Interfaces (puertos) del repositorio
├── application/
│   └── use-cases/      # Casos de uso (lógica de aplicación)
└── infrastructure/
    ├── http/           # Controllers y DTOs
    └── persistence/    # Entidades TypeORM y repositorios
```

Módulos disponibles:

- `actividades` - CRUD de actividades agrícolas, con historial automático y estadísticas por estado
- `actividad-historial` - Registro de cambios (creación, edición, cambio de estado)
- `actividades-evidencias` - Fotos, videos y documentos adjuntos (subida con validación de contenido)
- `actividades-herramientas` - Herramientas usadas por actividad
- `actividades-responsables` - Personas asignadas por actividad
- `actividades-servicios` - Servicios contratados por actividad

Características transversales:

- Validación global de DTOs con `class-validator`
- Filtro global de excepciones con formato de error consistente
- Rate limiting global (100 req/min por IP) con `@nestjs/throttler`
- Logs estructurados con Winston en `backend/logs/`
- Paginación en todos los endpoints de listado (`?page=&limit=`)
- Endpoint de salud en `GET /health` (verifica conexión a la base de datos)
- Swagger/OpenAPI en `/api/docs`
- Transacciones en creación/actualización de actividades + historial

### Frontend

- React 19 + TypeScript + Vite
- React Router para navegación
- TanStack Query para fetching, caché e invalidación
- Tailwind CSS para estilos
- Cliente axios centralizado con interceptores de error y timeout

## Base de datos

- PostgreSQL 15
- Migraciones con TypeORM en `backend/src/migrations/` (se ejecutan al arrancar)
- Claves foráneas con `ON DELETE CASCADE` entre actividades y sus entidades hijas
- Los archivos subidos se guardan en `backend/uploads/` y se eliminan del disco al borrar la evidencia o la actividad

## Desarrollo

### Flujo de trabajo recomendado

1. `git checkout -b feature/nombre-de-la-mejora` desde `main`
2. Hacer los cambios y verificar con `npm run lint`, `npm test` (backend) y `npm run build`
3. Abrir un Pull Request hacia `main`

### Convenciones

- Backend: kebab-case para archivos, PascalCase para clases, snake_case para columnas de base de datos
- Frontend: componentes en `src/components/`, páginas en `src/pages/`, hooks de datos en `src/hooks/`
- No commitear archivos `.env` ni credenciales

## CI

El repositorio incluye GitHub Actions (`.github/workflows/ci.yml`) que ejecuta lint, tests y builds en cada push y pull request.
