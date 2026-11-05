# AGROSOFT - Sistema de Gestión Agrícola

Sistema completo para la gestión de actividades agrícolas, desarrollado con arquitectura hexagonal en el backend y React con TypeScript en el frontend.

##  Pasos para Ejecutar el Proyecto

### Requisitos Previos
- Node.js >= 18.0.0
- npm >= 9.0.0
- **Docker Desktop** (requerido para PostgreSQL - debe estar ejecutándose)

---

### Paso 1: Instalar Dependencias

Instalar todas las dependencias del proyecto (raíz, backend y frontend):

```bash
npm run install:all
```

**Nota:** Si ya instalaste las dependencias anteriormente, puedes saltar este paso.

---

### Paso 2: Configurar Variables de Entorno

**Backend:**
```bash
cd backend
cp .env.example .env
```

El archivo `.env` ya está configurado con las credenciales por defecto:
- DB_HOST=localhost
- DB_PORT=5433
- DB_USERNAME=backend_user
- DB_PASSWORD=backend123
- DB_DATABASE=db_agrosoft

**Frontend:**
```bash
cd frontend
cp .env.example .env
```

El archivo `.env` ya está configurado con:
- VITE_API_URL=http://localhost:3000

**Volver a la raíz:**
```bash
cd ..
```

---

### Paso 3: Iniciar Docker Desktop

**MUY IMPORTANTE:** Antes de ejecutar el siguiente comando, asegúrate de que:

1. **Docker Desktop esté abierto y corriendo** en tu computadora
2. Espera a que Docker Desktop termine de iniciarse (verás el icono en la barra de tareas con estado "Running")

En Windows, Docker Desktop debe estar iniciado completamente antes de ejecutar comandos de Docker.

---

### Paso 4: Iniciar Base de Datos

Desde la raíz del proyecto, ejecuta:

```bash
npm run docker:up
```

Esto iniciará PostgreSQL en el puerto 5433.

**Para verificar que el contenedor está corriendo:**
```bash
docker ps
```

Deberías ver un contenedor llamado `agrosoft_postgres` con estado "Up".

**Si ves un error como "Cannot connect to the Docker daemon":**
- Cierra Docker Desktop y ábrelo nuevamente
- Espera a que esté completamente iniciado
- Intenta ejecutar `npm run docker:up` nuevamente

---

### Paso 5: Iniciar el Proyecto

Desde la raíz del proyecto, ejecuta:

```bash
npm run dev
```

Esto iniciará:
- **Backend** en http://localhost:3000
- **Frontend** en http://localhost:5173

Verás dos terminales abiertas simultáneamente, una para el backend y otra para el frontend.

---

### Paso 6: Verificar Funcionamiento

1. Abre tu navegador en http://localhost:5173
2. Deberías ver la aplicación de AGROSOFT con el módulo de actividades
3. Intenta crear una actividad para verificar la conexión con el backend

---

## 🛑 Cómo Detener el Proyecto

### Para detener el backend y frontend:
- Presiona `Ctrl + C` en la terminal donde ejecutaste `npm run dev

### Para detener la base de datos:
```bash
npm run docker:down
```

---

##  Instrucciones Adicionales

### Ejecutar Proyectos por Separado

Si prefieres ejecutar backend y frontend en terminales separadas:

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

### Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run install:all` | Instala todas las dependencias |
| `npm run dev` | Inicia backend y frontend juntos |
| `npm run dev:backend` | Inicia solo el backend |
| `npm run dev:frontend` | Inicia solo el frontend |
| `npm run docker:up` | Inicia PostgreSQL con Docker |
| `npm run docker:down` | Detiene PostgreSQL con Docker |
o simplemente vas e inicias docker manualmente y el sistema lo correra normalmente 
| `npm run build` | Compila ambos proyectos |
| `npm run lint` | Ejecuta ESLint en ambos proyectos |

---

## Tecnologías

### Backend
- **NestJS** v11.0.1 - Framework de Node.js
- **TypeScript** v5.7.3 - Tipado estático
- **TypeORM** v0.3.20 - ORM para PostgreSQL
- **PostgreSQL** v15 - Base de datos
- **Arquitectura Hexagonal** - Separación de capas

### Frontend
- **React** v19.2.8 - Biblioteca UI
- **TypeScript** v7.0.2 - Tipado estático
- **Vite** v8.3.0 - Build tool
- **Tailwind CSS** v3.4.19 - Framework CSS
- **React Router** v7.18.4 - Enrutamiento

---

##  Solución de Problemas

### Docker no está ejecutándose

**Error típico:**
```
failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine
```

**Solución:**
1. Abre Docker Desktop en tu computadora
2. Espera a que esté completamente iniciado (icono verde en la barra de tareas)
3. Vuelve a ejecutar `npm run docker:up
```

**Solución:**
1. Verifica que Docker Desktop esté ejecutándose
2. Ejecuta `docker ps` para verificar que el contenedor esté activo
3. Si el contenedor no está activo, ejecuta `npm run docker:up`
4. Verifica que el puerto 5433 no esté en uso por otra aplicación

### Puerto ya en uso

**Error típico:**
```
EADDRINUSE: address already in use :::3000
```

**Solución:**
- Si el puerto 3000 está en uso, cambia `PORT` en `backend/.env`
- Si el puerto 5173 está en uso, Vite automáticamente buscará otro puerto disponible

### Errores de TypeScript en el frontend

**Solución:**
- Ejecuta `cd frontend && npm run build` para ver errores específicos
- Asegúrate de que todas las dependencias estén instaladas
- Verifica que no haya errores de sintaxis en los archivos `.tsx`

---

##  Estructura del Proyecto

```
agrosoft/
├── backend/              # API RESTful con NestJS
│   ├── src/
│   │   ├── actividades/              # Módulo de actividades
│   │   ├── actividad-historial/     # Módulo de historial
│   │   ├── actividades-evidencias/  # Módulo de evidencias
│   │   ├── actividades-herramientas/# Módulo de herramientas
│   │   ├── actividades-responsables/# Módulo de responsables
│   │   ├── actividades-servicios/   # Módulo de servicios
│   │   └── migrations/              # Migraciones de TypeORM
│   ├── docker-compose.yml
│   └── package.json
├── frontend/             # Aplicación React con TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   └── services/
│   └── package.json
└── package.json          # Scripts para ejecutar todo el proyecto
```

---

##   Licencia

Este proyecto es privado de juan y no está licenciado.

