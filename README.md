# narvales-azules-backend

Este repositorio es para el desarrollo de el backend para el sistema de narvales azules

---

# 📚 Guía de Estructura del Proyecto

Esta guía está diseñada para ayudar a los desarrolladores principiantes a entender la estructura del proyecto y saber dónde crear nuevos archivos.

---

## 📁 Estructura Visual del Proyecto

```
narvales-azules-backend/
│
├── 📄 package.json          # Configuración del proyecto y dependencias
├── 📄 README.md             # Documentación del proyecto
├── 📄 script.sql            # Scripts SQL (si los hay)
│
└── 📂 src/                  # ⭐ TODO EL CÓDIGO FUENTE AQUÍ
    │
    ├── 🚀 server.js         # Punto de entrada - Inicia el servidor
    ├── ⚙️ app.js            # Configuración de Express y rutas principales
    │
    ├── 📂 config/           # ⚙️ CONFIGURACIONES
    │   ├── database.js      # Configuración de la base de datos (Sequelize)
    │   ├── env.js           # Variables de entorno
    │   └── swagger.js       # Configuración de documentación API
    │
    ├── 📂 routes/           # 🛣️ RUTAS (Endpoints HTTP)
    │   ├── categoria.routes.js
    │   ├── disciplina.routes.js
    │   ├── empleado.routes.js
    │   └── grupo.routes.js
    │
    ├── 📂 controllers/      # 🎮 CONTROLADORES (Lógica de peticiones HTTP)
    │   ├── categoria.controller.js
    │   ├── disciplina.controller.js
    │   ├── empleado.controller.js
    │   └── grupo.controller.js
    │
    ├── 📂 services/         # 💼 SERVICIOS (Lógica de negocio)
    │   ├── categoria.service.js
    │   ├── disciplina.service.js
    │   ├── empleado.service.js
    │   └── grupo.service.js
    │
    ├── 📂 repositories/     # 🗄️ REPOSITORIOS (Acceso a datos)
    │   ├── categoria.repository.js
    │   ├── disciplina.repository.js
    │   ├── empleado.repository.js
    │   └── grupo.repository.js
    │
    ├── 📂 models/           # 📊 MODELOS (Estructura de datos)
    │   ├── Categoria.js
    │   ├── Disciplina.js
    │   ├── Empleado.js
    │   ├── Grupo.js
    │   └── index.js         # Exporta todos los modelos y relaciones
    │
    ├── 📂 middlewares/      # 🔒 MIDDLEWARES (Autenticación, validación, etc.)
    │   └── auth.middleware.js
    │
    ├── 📂 utils/            # 🛠️ UTILIDADES (Funciones auxiliares)
    │   └── response.js      # Funciones para respuestas estandarizadas
    │
    └── 📂 docs/             # 📚 DOCUMENTACIÓN (Swagger/OpenAPI)
        ├── categoria.yaml
        ├── disciplina.yaml
        ├── empleado.yaml
        ├── grupo.yaml
        └── health.yaml
```

---

## 🔄 Flujo de una Petición HTTP

Cuando un cliente hace una petición HTTP, esta sigue el siguiente flujo:

```
Cliente (Frontend/Postman)
    ↓
    GET /api/categorias
    ↓
📂 routes/categoria.routes.js  → Define la ruta y llama al controlador
    ↓
📂 controllers/categoria.controller.js  → Recibe req/res, maneja errores HTTP
    ↓
📂 services/categoria.service.js  → Lógica de negocio, validaciones
    ↓
📂 repositories/categoria.repository.js  → Consultas a la base de datos
    ↓
📂 models/Categoria.js  → Interactúa con Sequelize/Base de datos
    ↓
Base de Datos (MySQL)
    ↓
    (Respuesta vuelve por el mismo camino)
```

**Ejemplo práctico:**
1. Cliente hace `GET /api/categorias`
2. `app.js` redirige a `routes/categoria.routes.js`
3. La ruta llama a `controllers/categoria.controller.js` → método `getAll()`
4. El controlador llama a `services/categoria.service.js` → método `getAllCategorias()`
5. El servicio llama a `repositories/categoria.repository.js` → método `findAll()`
6. El repositorio usa `models/Categoria.js` para consultar la BD
7. La respuesta vuelve por todas las capas hasta llegar al cliente

---

## 📖 Explicación Detallada de Cada Carpeta

### 1. 📂 `config/` - Configuraciones del Sistema

**Propósito:** Contiene todas las configuraciones del proyecto.

**Archivos:**
- `database.js`: Configuración de la conexión a MySQL usando Sequelize
- `env.js`: Manejo de variables de entorno (puerto, URL de BD, etc.)
- `swagger.js`: Configuración de la documentación API con Swagger

**Cuándo crear archivos aquí:**
- Cuando necesites agregar nuevas configuraciones (email, Redis, servicios externos, etc.)

**Ejemplo de uso:**
```javascript
// En cualquier archivo del proyecto
import env from './config/env.js';
console.log(env.PORT); // Accede a variables de entorno
```

---

### 2. 📂 `routes/` - Definición de Rutas HTTP

**Propósito:** Define los endpoints (URLs) de la API y qué controlador maneja cada ruta.

**Convención de nombres:** `[recurso].routes.js` (ej: `categoria.routes.js`)

**Estructura típica:**
- `GET /` → Obtener todos los recursos
- `GET /:id` → Obtener un recurso por ID
- `POST /` → Crear un nuevo recurso
- `PUT /:id` → Actualizar un recurso
- `DELETE /:id` → Eliminar un recurso

**Cuándo crear archivos aquí:**
- Cuando crees un nuevo recurso (ej: `producto.routes.js`)
- Cuando necesites agregar nuevas rutas a un recurso existente

**Ejemplo:**
```javascript
import express from 'express';
import categoriaController from '../controllers/categoria.controller.js';

const router = express.Router();

router.get('/', categoriaController.getAll.bind(categoriaController));
router.get('/:id', categoriaController.getById.bind(categoriaController));
router.post('/', categoriaController.create.bind(categoriaController));
router.put('/:id', categoriaController.update.bind(categoriaController));
router.delete('/:id', categoriaController.delete.bind(categoriaController));

export default router;
```

**⚠️ Importante:** Después de crear una nueva ruta, debes registrarla en `src/app.js`:
```javascript
import productoRoutes from './routes/producto.routes.js';
app.use('/api/productos', productoRoutes);
```

---

### 3. 📂 `controllers/` - Controladores HTTP

**Propósito:** Maneja las peticiones HTTP entrantes. Recibe `req` y `res`, llama al servicio correspondiente y devuelve la respuesta.

**Convención de nombres:** `[recurso].controller.js` (ej: `categoria.controller.js`)

**Responsabilidades:**
- Recibir la petición HTTP (`req`)
- Extraer parámetros, query strings, body
- Llamar al servicio correspondiente
- Manejar errores HTTP
- Devolver la respuesta (`res`)

**Cuándo crear archivos aquí:**
- Cuando crees un nuevo recurso (ej: `producto.controller.js`)

**Ejemplo:**
```javascript
import categoriaService from '../services/categoria.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class CategoriaController {
  async getAll(req, res) {
    try {
      const categorias = await categoriaService.getAllCategorias();
      return successResponse(res, categorias, 'Categorías obtenidas correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const categoria = await categoriaService.getCategoriaById(id);
      return successResponse(res, categoria, 'Categoría obtenida correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrada') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new CategoriaController();
```

---

### 4. 📂 `services/` - Lógica de Negocio

**Propósito:** Contiene toda la lógica de negocio, validaciones y reglas del dominio.

**Convención de nombres:** `[recurso].service.js` (ej: `categoria.service.js`)

**Responsabilidades:**
- Validar datos de entrada
- Aplicar reglas de negocio
- Orquestar llamadas a repositorios
- Transformar datos si es necesario
- Manejar errores de negocio

**Cuándo crear archivos aquí:**
- Cuando crees un nuevo recurso (ej: `producto.service.js`)

**Ejemplo:**
```javascript
import categoriaRepository from '../repositories/categoria.repository.js';

class CategoriaService {
  async createCategoria(data) {
    // Validaciones de negocio
    if (!data.categoria || !data.descripcion) {
      throw new Error('Los campos categoria y descripcion son obligatorios');
    }

    // Verificar si ya existe
    const existingCategoria = await categoriaRepository.findByCategoria(data.categoria);
    if (existingCategoria) {
      throw new Error('Ya existe una categoría con ese nombre');
    }

    // Validar longitud
    if (data.categoria.length > 20) {
      throw new Error('El campo categoria no puede exceder 20 caracteres');
    }

    return await categoriaRepository.create(data);
  }
}

export default new CategoriaService();
```

---

### 5. 📂 `repositories/` - Acceso a Datos

**Propósito:** Capa de acceso a datos. Interactúa directamente con los modelos de Sequelize para realizar operaciones CRUD.

**Convención de nombres:** `[recurso].repository.js` (ej: `categoria.repository.js`)

**Responsabilidades:**
- Realizar consultas a la base de datos
- Usar los modelos de Sequelize
- No debe contener lógica de negocio, solo acceso a datos

**Cuándo crear archivos aquí:**
- Cuando crees un nuevo recurso (ej: `producto.repository.js`)

**Ejemplo:**
```javascript
import db from '../models/index.js';
const { Categoria } = db;

class CategoriaRepository {
  async findAll() {
    return await Categoria.findAll({
      order: [['categoria', 'ASC']]
    });
  }

  async findById(id) {
    return await Categoria.findByPk(id);
  }

  async create(data) {
    return await Categoria.create(data);
  }

  async update(id, data) {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) return null;
    return await categoria.update(data);
  }

  async delete(id) {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) return false;
    await categoria.destroy();
    return true;
  }
}

export default new CategoriaRepository();
```

---

### 6. 📂 `models/` - Modelos de Datos

**Propósito:** Define la estructura de las tablas de la base de datos usando Sequelize ORM.

**Convención de nombres:** `[Modelo].js` con primera letra mayúscula (ej: `Categoria.js`)

**Archivos importantes:**
- `[Modelo].js`: Define cada modelo individual
- `index.js`: Exporta todos los modelos y define las relaciones entre ellos

**Cuándo crear archivos aquí:**
- Cuando crees una nueva tabla en la base de datos (ej: `Producto.js`)
- **IMPORTANTE:** También debes actualizar `index.js` para importar y exportar el nuevo modelo

**Ejemplo de modelo:**
```javascript
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Categoria = sequelize.define('Categoria', {
  id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_categoria'
  },
  categoria: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'Categoria',
  timestamps: false
});

export default Categoria;
```

**Ejemplo de `index.js` (después de agregar un nuevo modelo):**
```javascript
import Categoria from './Categoria.js';
import Disciplina from './Disciplina.js';
import Empleado from './Empleado.js';
import Grupo from './Grupo.js';
import Producto from './Producto.js'; // ← Nuevo modelo

// Definir relaciones aquí
// ...

const db = {
  sequelize,
  Sequelize,
  Categoria,
  Disciplina,
  Empleado,
  Grupo,
  Producto, // ← Exportar nuevo modelo
};

export default db;
```

---

### 7. 📂 `middlewares/` - Middlewares

**Propósito:** Funciones que se ejecutan antes de que la petición llegue al controlador. Útiles para autenticación, validación, logging, etc.

**Convención de nombres:** `[funcionalidad].middleware.js` (ej: `auth.middleware.js`)

**Cuándo crear archivos aquí:**
- Cuando necesites autenticación/autorización
- Cuando necesites validar datos antes de llegar al controlador
- Cuando necesites logging de peticiones
- Cuando necesites transformar datos de entrada

**Ejemplo de uso en rutas:**
```javascript
import authMiddleware from '../middlewares/auth.middleware.js';

// Proteger todas las rutas
router.use(authMiddleware);

// O proteger rutas específicas
router.post('/', authMiddleware, categoriaController.create);
```

---

### 8. 📂 `utils/` - Utilidades

**Propósito:** Funciones auxiliares reutilizables en todo el proyecto.

**Cuándo crear archivos aquí:**
- Cuando crees funciones que se usen en múltiples lugares
- Funciones de formateo (fechas, números, etc.)
- Validaciones genéricas
- Helpers de transformación de datos

**Ejemplo:**
```javascript
// utils/response.js
export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};
```

---

### 9. 📂 `docs/` - Documentación API

**Propósito:** Archivos YAML que definen la documentación de la API usando Swagger/OpenAPI.

**Convención de nombres:** `[recurso].yaml` (ej: `categoria.yaml`)

**Cuándo crear archivos aquí:**
- Cuando documentes un nuevo endpoint
- Cuando documentes un nuevo recurso completo

**Acceso a la documentación:**
Una vez que el servidor esté corriendo, puedes ver la documentación en:
```
http://localhost:[PUERTO]/api-docs
```

---

## 🎯 Guía Paso a Paso: Crear un Nuevo Recurso

Supongamos que quieres crear un nuevo recurso llamado **"Producto"**. Sigue estos pasos en orden:

### Paso 1: Crear el Modelo
**Archivo:** `src/models/Producto.js`

```javascript
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Producto = sequelize.define('Producto', {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_producto'
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'Producto',
  timestamps: false
});

export default Producto;
```

**Actualizar:** `src/models/index.js` - Agregar import y export del nuevo modelo

---

### Paso 2: Crear el Repositorio
**Archivo:** `src/repositories/producto.repository.js`

```javascript
import db from '../models/index.js';
const { Producto } = db;

class ProductoRepository {
  async findAll() {
    return await Producto.findAll({
      order: [['nombre', 'ASC']]
    });
  }

  async findById(id) {
    return await Producto.findByPk(id);
  }

  async create(data) {
    return await Producto.create(data);
  }

  async update(id, data) {
    const producto = await Producto.findByPk(id);
    if (!producto) return null;
    return await producto.update(data);
  }

  async delete(id) {
    const producto = await Producto.findByPk(id);
    if (!producto) return false;
    await producto.destroy();
    return true;
  }
}

export default new ProductoRepository();
```

---

### Paso 3: Crear el Servicio
**Archivo:** `src/services/producto.service.js`

```javascript
import productoRepository from '../repositories/producto.repository.js';

class ProductoService {
  async getAllProductos() {
    try {
      return await productoRepository.findAll();
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  async getProductoById(id) {
    try {
      const producto = await productoRepository.findById(id);
      if (!producto) {
        throw new Error('Producto no encontrado');
      }
      return producto;
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  async createProducto(data) {
    try {
      // Validaciones
      if (!data.nombre || !data.precio) {
        throw new Error('Los campos nombre y precio son obligatorios');
      }
      return await productoRepository.create(data);
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  async updateProducto(id, data) {
    try {
      const producto = await productoRepository.update(id, data);
      if (!producto) {
        throw new Error('Producto no encontrado');
      }
      return producto;
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  async deleteProducto(id) {
    try {
      const deleted = await productoRepository.delete(id);
      if (!deleted) {
        throw new Error('Producto no encontrado');
      }
      return { message: 'Producto eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }
}

export default new ProductoService();
```

---

### Paso 4: Crear el Controlador
**Archivo:** `src/controllers/producto.controller.js`

```javascript
import productoService from '../services/producto.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

class ProductoController {
  async getAll(req, res) {
    try {
      const productos = await productoService.getAllProductos();
      return successResponse(res, productos, 'Productos obtenidos correctamente');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const producto = await productoService.getProductoById(id);
      return successResponse(res, producto, 'Producto obtenido correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async create(req, res) {
    try {
      const producto = await productoService.createProducto(req.body);
      return successResponse(res, producto, 'Producto creado correctamente', 201);
    } catch (error) {
      const statusCode = error.message.includes('obligatorio') ? 400 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const producto = await productoService.updateProducto(id, req.body);
      return successResponse(res, producto, 'Producto actualizado correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await productoService.deleteProducto(id);
      return successResponse(res, result, 'Producto eliminado correctamente');
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      return errorResponse(res, error.message, statusCode);
    }
  }
}

export default new ProductoController();
```

---

### Paso 5: Crear las Rutas
**Archivo:** `src/routes/producto.routes.js`

```javascript
import express from 'express';
import productoController from '../controllers/producto.controller.js';
// import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas - Documentación en src/docs/producto.yaml
router.get('/', productoController.getAll.bind(productoController));
router.get('/:id', productoController.getById.bind(productoController));
router.post('/', productoController.create.bind(productoController));
router.put('/:id', productoController.update.bind(productoController));
router.delete('/:id', productoController.delete.bind(productoController));

export default router;
```

---

### Paso 6: Registrar las Rutas en `app.js`
**Archivo:** `src/app.js`

Agregar al inicio del archivo (con los otros imports):
```javascript
import productoRoutes from './routes/producto.routes.js';
```

Agregar después de las otras rutas:
```javascript
app.use('/api/productos', productoRoutes);
```

---

### Paso 7: (Opcional) Crear Documentación
**Archivo:** `src/docs/producto.yaml`

Crear el archivo YAML con la documentación de los endpoints. Puedes usar como referencia los archivos existentes en `src/docs/`.

---

## 📝 Archivos Principales del Proyecto

### `server.js` - Punto de Entrada
- Inicia el servidor Express
- Conecta a la base de datos
- Sincroniza modelos (solo en desarrollo)
- Maneja el cierre graceful del servidor

### `app.js` - Configuración de Express
- Configura middlewares globales (CORS, JSON parser, etc.)
- Registra todas las rutas de la API
- Configura Swagger para documentación
- Maneja errores globales
- Define rutas de health check y 404

---

## ✅ Resumen para Principiantes

### ¿Qué hace cada capa?

1. **Routes** → Define las URLs (`/api/categorias`)
2. **Controllers** → Maneja las peticiones HTTP (req, res)
3. **Services** → Contiene la lógica de negocio y validaciones
4. **Repositories** → Accede a la base de datos
5. **Models** → Representa las tablas de la base de datos

### Flujo de datos (de arriba hacia abajo):

```
Cliente
  ↓
Routes (URLs)
  ↓
Controllers (HTTP)
  ↓
Services (Lógica)
  ↓
Repositories (Datos)
  ↓
Models (BD)
  ↓
Base de Datos
```

### Regla de oro:
- **Routes** solo llama a **Controllers**
- **Controllers** solo llama a **Services**
- **Services** solo llama a **Repositories**
- **Repositories** solo usa **Models**
- **Models** interactúa con la **Base de Datos**

**❌ NO saltes capas** (ej: Controller llamando directamente a Repository)

---

## 🔍 Convenciones de Nomenclatura

- **Modelos:** PascalCase (ej: `Categoria.js`, `Producto.js`)
- **Rutas:** camelCase con `.routes.js` (ej: `categoria.routes.js`)
- **Controladores:** camelCase con `.controller.js` (ej: `categoria.controller.js`)
- **Servicios:** camelCase con `.service.js` (ej: `categoria.service.js`)
- **Repositorios:** camelCase con `.repository.js` (ej: `categoria.repository.js`)
- **Middlewares:** camelCase con `.middleware.js` (ej: `auth.middleware.js`)

---

## 🚀 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo (con nodemon)
npm run dev

# Ejecutar en producción
npm start

# Ver documentación API
# Abrir en navegador: http://localhost:[PUERTO]/api-docs
```

---

## 📞 ¿Necesitas Ayuda?

Si tienes dudas sobre:
- **¿Dónde crear un archivo?** → Revisa la sección "Explicación Detallada de Cada Carpeta"
- **¿Cómo crear un nuevo recurso?** → Revisa la sección "Guía Paso a Paso: Crear un Nuevo Recurso"
- **¿Cómo funciona el flujo?** → Revisa la sección "Flujo de una Petición HTTP"

---

**Última actualización:** Diciembre 2024
**Versión del proyecto:** 1.0.0
