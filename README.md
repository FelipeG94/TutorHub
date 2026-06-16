# TaskFlow

## Descripción del Proyecto

TaskFlow es una aplicación web de gestión de tareas enfocada en estudiantes, docentes y administradores que necesitan organizar actividades, seguir el progreso y gestionar categorías de trabajo dentro de un flujo colaborativo.

La interfaz principal del proyecto se encuentra en `taskflow-frontend`, una aplicación construida con Vue 3, Pinia y Vite que usa Supabase para autenticación y persistencia de datos.

### Problemas que Resuelve

- **Organización de tareas personales**: Permite a cada usuario crear, editar, eliminar y marcar tareas como completadas.
- **Seguimiento de estado**: Filtrado por estado y categoría para encontrar tareas pendientes o completadas.
- **Gestión de categorías**: Admins pueden crear, editar y eliminar categorías de tareas.
- **Control de acceso**: Solo usuarios autenticados pueden acceder a las tareas y solo administradores pueden usar el panel de administración.
- **Dashboard administrativo**: Proporciona métricas globales y visualización de progreso por usuario.

---

## Perfiles de Usuario

### Usuario
- Iniciar sesión con credenciales válidas.
- Registrar una nueva cuenta.
- Ver la lista de tareas personales.
- Filtrar tareas por estado (`pendiente`, `completada`) y por categoría.
- Crear nuevas tareas.
- Editar tareas existentes.
- Eliminar tareas propias.
- Cambiar el estado de una tarea entre `pendiente` y `completada`.

### Administrador
- Todas las funcionalidades del usuario.
- Acceder al panel de administración.
- Ver estadísticas globales de tareas.
- Ver la cantidad de tareas completadas y pendientes.
- Ver la lista completa de tareas del sistema.
- Eliminar tareas desde el panel administrativo.
- Gestionar categorías de tareas.

---

## Reglas de Negocio

### Acceso y roles
- Solo los usuarios autenticados pueden ver y manipular tareas.
- Solo los usuarios con rol `admin` pueden acceder a las rutas `/admin` y `/admin/categorias`.
- El rol por defecto al registrarse es `lector`.

### Tareas
- Las tareas nuevas se crean con estado `pendiente`.
- El usuario puede alternar el estado de la tarea entre `pendiente` y `completada`.
- El título de la tarea es obligatorio para crear o actualizar.
- Las tareas se ordenan por fecha de creación descendente.

### Categorías
- Las categorías se gestionan desde el panel de administración.
- No se permite eliminar una categoría si tiene tareas asociadas.
- Las categorías se cargan ordenadas por nombre alfabéticamente.

---

## Arquitectura del Proyecto

```
TaskFlow/
├── README.md
└── taskflow-frontend/
    ├── package.json
    ├── vite.config.js
    ├── .env.example
    ├── public/
    ├── src/
    │   ├── main.js
    │   ├── App.vue
    │   ├── router/
    │   │   └── index.js
    │   ├── stores/
    │   │   ├── auth.store.js
    │   │   ├── taskStore.js
    │   │   └── categoryStore.js
    │   ├── services/
    │   │   ├── supabaseClient.js
    │   │   ├── auth.service.js
    │   │   ├── task.service.js
    │   │   └── category.service.js
    │   ├── composables/
    │   │   ├── useAuth.js
    │   │   └── useCategories.js
    │   ├── components/
    │   │   ├── common/
    │   │   ├── tasks/
    │   │   └── admin/
    │   └── views/
    │       ├── auth/
    │       │   ├── LoginView.vue
    │       │   └── RegisterView.vue
    │       ├── tasks/
    │       │   ├── TasksView.vue
    │       │   └── NewTaskView.vue
    │       └── admin/
    │           ├── AdminView.vue
    │           └── CategoriesView.vue
    └── style.css
```

### Flujo de Datos

- `src/main.js` inicializa la aplicación Vue, monta `Pinia` y configura el router.
- `src/router/index.js` protege rutas con guardas basadas en el estado de autenticación y el rol de usuario.
- `src/stores/auth.store.js` mantiene la sesión, el usuario y su rol.
- `src/stores/taskStore.js` maneja las tareas del usuario y las tareas globales del administrador.
- `src/stores/categoryStore.js` gestiona la lista de categorías.
- `src/services/*.js` se comunican con Supabase para autenticación, perfil, tareas y categorías.

---

## Guía de Funcionalidades

### 1. Autenticación
- Login con email y contraseña.
- Registro de nuevos usuarios.
- Verificación de sesión por `Supabase`.
- El frontend usa `auth.store.js` y `auth.service.js` para manejar el inicio/cierre de sesión.

### 2. Tareas
- Ver la lista de tareas personales.
- Crear una tarea nueva con título, descripción y categoría opcional.
- Editar título, descripción y categoría de una tarea.
- Eliminar tareas.
- Marcar tareas como completadas o volver a pendiente.
- Filtrar tareas por estado y categoría.

### 3. Administración
- Mostrar métricas globales: total de tareas, completadas, pendientes y categorías.
- Listar todas las tareas del sistema.
- Eliminar tareas desde el panel administrativo.
- Gestionar categorías: agregar, editar y eliminar.

---

## Requisitos

- Node.js 18 o superior.
- npm.
- Acceso a un proyecto Supabase válido.
- Variables de entorno definidas en `taskflow-frontend/.env`.
- Tablas esperadas en Supabase:
  - `profiles` con `id` y `role`.
  - `tasks` con `title`, `description`, `category_id`, `user_id`, `status`, `created_at`.
  - `categories` con `name`.

---

## Configuración e Instalación

1. Abrir el proyecto en `taskflow-frontend`.
2. Copiar `.env.example` a `.env`.
3. Configurar las variables de entorno:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

4. Instalar dependencias:

```bash
cd taskflow-frontend
npm install
```

5. Ejecutar en modo desarrollo:

```bash
npm run dev
```

6. Abrir la aplicación en el navegador en `http://localhost:5173`.

### Variables de Entorno

- `VITE_SUPABASE_URL`: URL del proyecto Supabase.
- `VITE_SUPABASE_ANON_KEY`: clave anónima para el cliente Supabase.

---

## Tech Stack

- **Frontend**: Vue.js 3
- **Routing**: Vue Router 5
- **Estado**: Pinia
- **Capa de datos**: Supabase JS
- **Build**: Vite
- **PWA**: `vite-plugin-pwa` (instalado en dependencias)
- **Estilos**: CSS modular dentro de componentes Vue

---

## Estructura de Datos

### Tarea
```json
{
  "id": "uuid",
  "title": "Título de la tarea",
  "description": "Descripción opcional",
  "category_id": 1,
  "user_id": "uuid_usuario",
  "status": "pendiente",
  "created_at": "2026-06-16T00:00:00.000Z"
}
```

### Categoría
```json
{
  "id": 1,
  "name": "Estudio"
}
```

### Perfil de Usuario
```json
{
  "id": "uuid_usuario",
  "email": "usuario@example.com",
  "role": "admin"
}
```

---

## Ejecución

```bash
cd taskflow-frontend
npm install
npm run dev
```

Acceso: `http://localhost:5173`

---

## Notas

- Si no configuras Supabase, la aplicación no podrá iniciar sesión ni leer/escribir datos.
- El registro asigna el rol `lector` de forma predeterminada y requiere que el backend de Supabase tenga la tabla `profiles` para resolver el rol del usuario.
- La eliminación de categorías está bloqueada cuando existen tareas asociadas a esa categoría.

