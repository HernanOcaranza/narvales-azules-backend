import swaggerJsdoc from 'swagger-jsdoc';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import env from './env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar archivos YAML de documentación
const loadYamlFile = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContent);
  } catch (error) {
    console.error(`Error loading YAML file ${filePath}:`, error);
    return {};
  }
};

const categoriaDocs = loadYamlFile(path.join(__dirname, '../docs/categoria.yaml'));
const disciplinaDocs = loadYamlFile(path.join(__dirname, '../docs/disciplina.yaml'));
const empleadoDocs = loadYamlFile(path.join(__dirname, '../docs/empleado.yaml'));
const grupoDocs = loadYamlFile(path.join(__dirname, '../docs/grupo.yaml'));
const healthDocs = loadYamlFile(path.join(__dirname, '../docs/health.yaml'));

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Narvales Azules API',
    version: '1.0.0',
    description: 'API REST para el sistema de gestión de Narvales Azules',
    contact: {
      name: 'Soporte API',
      email: 'soporte@narvalesazules.com'
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC'
    }
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}`,
      description: 'Servidor de desarrollo'
    },
    {
      url: 'https://api.narvalesazules.com',
      description: 'Servidor de producción'
    }
  ],
  paths: {
    ...categoriaDocs,
    ...disciplinaDocs,
    ...empleadoDocs,
    ...grupoDocs,
    ...healthDocs
  },
  components: {
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            example: 'Error message'
          }
        }
      },
      Success: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          message: {
            type: 'string',
            example: 'Operación exitosa'
          },
          data: {
            type: 'object'
          }
        }
      },
      Categoria: {
        type: 'object',
        required: ['categoria', 'descripcion'],
        properties: {
          id_categoria: {
            type: 'integer',
            example: 1
          },
          categoria: {
            type: 'string',
            maxLength: 20,
            example: 'Infantil',
            description: 'Nombre de la categoría'
          },
          descripcion: {
            type: 'string',
            maxLength: 50,
            example: 'Categoría para niños',
            description: 'Descripción de la categoría'
          }
        }
      },
      Disciplina: {
        type: 'object',
        required: ['disciplina'],
        properties: {
          id_disciplina: {
            type: 'integer',
            example: 1
          },
          disciplina: {
            type: 'string',
            maxLength: 20,
            example: 'Natación',
            description: 'Nombre de la disciplina'
          }
        }
      },
      Empleado: {
        type: 'object',
        required: ['tipo', 'usuario', 'contrasenia', 'nombre', 'apellido', 'telefono', 'fecha_alta'],
        properties: {
          id_empleado: {
            type: 'integer',
            example: 1
          },
          tipo: {
            type: 'string',
            maxLength: 20,
            example: 'Administrador',
            description: 'Tipo de empleado'
          },
          usuario: {
            type: 'string',
            maxLength: 50,
            example: 'jperez',
            description: 'Nombre de usuario único'
          },
          nombre: {
            type: 'string',
            maxLength: 50,
            example: 'Juan',
            description: 'Nombre del empleado'
          },
          apellido: {
            type: 'string',
            maxLength: 50,
            example: 'Pérez',
            description: 'Apellido del empleado'
          },
          dni: {
            type: 'string',
            maxLength: 8,
            example: '12345678',
            description: 'DNI del empleado'
          },
          telefono: {
            type: 'string',
            maxLength: 10,
            example: '1234567890',
            description: 'Teléfono del empleado'
          },
          fecha_alta: {
            type: 'string',
            format: 'date',
            example: '2024-01-15',
            description: 'Fecha de alta del empleado'
          },
          estado: {
            type: 'integer',
            minimum: 0,
            maximum: 1,
            example: 1,
            description: 'Estado del empleado (1 activo, 0 inactivo)'
          }
        }
      },
      Grupo: {
        type: 'object',
        required: ['nombre', 'cupo_maximo', 'id_disciplina', 'id_categoria'],
        properties: {
          id_grupo: {
            type: 'integer',
            example: 1
          },
          nombre: {
            type: 'string',
            maxLength: 40,
            example: 'Grupo A - Natación Infantil',
            description: 'Nombre del grupo'
          },
          cupo_maximo: {
            type: 'integer',
            example: 20,
            description: 'Cupo máximo de alumnos'
          },
          estado: {
            type: 'integer',
            minimum: 0,
            maximum: 1,
            example: 1,
            description: 'Estado del grupo (1 activo, 0 inactivo)'
          },
          id_disciplina: {
            type: 'integer',
            example: 1,
            description: 'ID de la disciplina'
          },
          id_categoria: {
            type: 'integer',
            example: 1,
            description: 'ID de la categoría'
          },
          disciplina: {
            $ref: '#/components/schemas/Disciplina'
          },
          categoria: {
            $ref: '#/components/schemas/Categoria'
          }
        }
      }
    },
    responses: {
      NotFound: {
        description: 'Recurso no encontrado',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              success: false,
              message: 'Recurso no encontrado'
            }
          }
        }
      },
      BadRequest: {
        description: 'Solicitud inválida',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              success: false,
              message: 'Error de validación'
            }
          }
        }
      },
      Conflict: {
        description: 'Conflicto - Recurso ya existe',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              success: false,
              message: 'El recurso ya existe'
            }
          }
        }
      },
      InternalServerError: {
        description: 'Error interno del servidor',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              success: false,
              message: 'Error interno del servidor'
            }
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Categorías',
      description: 'Endpoints para gestionar categorías'
    },
    {
      name: 'Disciplinas',
      description: 'Endpoints para gestionar disciplinas'
    },
    {
      name: 'Empleados',
      description: 'Endpoints para gestionar empleados'
    },
    {
      name: 'Grupos',
      description: 'Endpoints para gestionar grupos'
    },
    {
      name: 'Health',
      description: 'Endpoints de salud del servidor'
    }
  ]
};

export default swaggerSpec;

