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

const authDocs = loadYamlFile(path.join(__dirname, '../docs/auth.yaml'));
const categoriaDocs = loadYamlFile(path.join(__dirname, '../docs/categoria.yaml'));
const condicionDocs = loadYamlFile(path.join(__dirname, '../docs/condicion.yaml'));
const disciplinaDocs = loadYamlFile(path.join(__dirname, '../docs/disciplina.yaml'));
const empleadoDocs = loadYamlFile(path.join(__dirname, '../docs/empleado.yaml'));
const grupoDocs = loadYamlFile(path.join(__dirname, '../docs/grupo.yaml'));
const grupoHorarioDocs = loadYamlFile(path.join(__dirname, '../docs/grupo_horario.yaml'));
const tutorDocs = loadYamlFile(path.join(__dirname, '../docs/tutor.yaml'));
const alumnoDocs = loadYamlFile(path.join(__dirname, '../docs/alumno.yaml'));
const claseDocs = loadYamlFile(path.join(__dirname, '../docs/clase.yaml'));
const claseEmpleadoDocs = loadYamlFile(path.join(__dirname, '../docs/clase_empleado.yaml'));
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
    ...authDocs,
    ...categoriaDocs,
    ...condicionDocs,
    ...disciplinaDocs,
    ...empleadoDocs,
    ...grupoDocs,
    ...grupoHorarioDocs,
    ...tutorDocs,
    ...alumnoDocs,
    ...claseDocs,
    ...claseEmpleadoDocs,
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
      Condicion: {
        type: 'object',
        required: ['condicion', 'atencion'],
        properties: {
          id_condicion: {
            type: 'integer',
            example: 1
          },
          condicion: {
            type: 'string',
            maxLength: 50,
            example: 'Discapacidad motriz',
            description: 'Nombre de la condición'
          },
          atencion: {
            type: 'integer',
            example: 1,
            description: 'Nivel de atención requerido'
          },
          descripcion: {
            type: 'string',
            maxLength: 100,
            example: 'Requiere atención especial en movilidad',
            description: 'Descripción de la condición'
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
          },
          horarios: {
            type: 'array',
            description: 'Array de horarios del grupo',
            items: {
              $ref: '#/components/schemas/GrupoHorario'
            }
          }
        }
      },
      GrupoHorario: {
        type: 'object',
        required: ['id_grupo', 'dia_semana', 'hora_inicio', 'hora_fin'],
        properties: {
          id_grupo_horario: {
            type: 'integer',
            example: 1
          },
          id_grupo: {
            type: 'integer',
            example: 1,
            description: 'ID del grupo'
          },
          dia_semana: {
            type: 'integer',
            minimum: 0,
            maximum: 6,
            example: 1,
            description: 'Día de la semana (0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado)'
          },
          hora_inicio: {
            type: 'string',
            format: 'time',
            example: '10:00:00',
            description: 'Hora de inicio de la clase'
          },
          hora_fin: {
            type: 'string',
            format: 'time',
            example: '11:00:00',
            description: 'Hora de fin de la clase'
          },
          activo: {
            type: 'integer',
            minimum: 0,
            maximum: 1,
            example: 1,
            description: 'Estado del horario (1 activo, 0 inactivo)'
          },
          grupo: {
            $ref: '#/components/schemas/Grupo'
          }
        }
      },
      Tutor: {
        type: 'object',
        required: ['nombre', 'apellido', 'fecha_registro'],
        properties: {
          id_tutor: {
            type: 'integer',
            example: 1
          },
          nombre: {
            type: 'string',
            maxLength: 50,
            example: 'Juan',
            description: 'Nombre del tutor'
          },
          apellido: {
            type: 'string',
            maxLength: 50,
            example: 'Pérez',
            description: 'Apellido del tutor'
          },
          telefono: {
            type: 'string',
            maxLength: 10,
            example: '1234567890',
            description: 'Teléfono del tutor'
          },
          dni: {
            type: 'string',
            maxLength: 8,
            example: '12345678',
            description: 'DNI del tutor'
          },
          fecha_registro: {
            type: 'string',
            format: 'date',
            example: '2024-01-15',
            description: 'Fecha de registro del tutor'
          }
        }
      },
      Alumno: {
        type: 'object',
        required: ['nombre', 'apellido', 'fecha_registro', 'id_tutor', 'id_categoria', 'id_condicion'],
        properties: {
          id_alumno: {
            type: 'integer',
            example: 1
          },
          nombre: {
            type: 'string',
            maxLength: 50,
            example: 'María',
            description: 'Nombre del alumno'
          },
          apellido: {
            type: 'string',
            maxLength: 50,
            example: 'González',
            description: 'Apellido del alumno'
          },
          dni: {
            type: 'string',
            maxLength: 8,
            example: '12345678',
            description: 'DNI del alumno'
          },
          fecha_nacimiento: {
            type: 'string',
            format: 'date',
            example: '2010-05-15',
            description: 'Fecha de nacimiento del alumno'
          },
          direccion: {
            type: 'string',
            maxLength: 80,
            example: 'Calle Principal 123',
            description: 'Dirección del alumno'
          },
          fecha_registro: {
            type: 'string',
            format: 'date',
            example: '2024-01-15',
            description: 'Fecha de registro del alumno'
          },
          estado: {
            type: 'integer',
            minimum: 0,
            maximum: 1,
            example: 1,
            description: 'Estado del alumno (1 activo, 0 inactivo)'
          },
          id_tutor: {
            type: 'integer',
            example: 1,
            description: 'ID del tutor del alumno'
          },
          id_categoria: {
            type: 'integer',
            example: 1,
            description: 'ID de la categoría del alumno'
          },
          id_condicion: {
            type: 'integer',
            example: 1,
            description: 'ID de la condición del alumno'
          },
          tutor: {
            $ref: '#/components/schemas/Tutor'
          },
          categoria: {
            $ref: '#/components/schemas/Categoria'
          },
          condicion: {
            $ref: '#/components/schemas/Condicion'
          }
        }
      },
      Clase: {
        type: 'object',
        required: ['fecha_clase', 'hora_inicio', 'hora_fin', 'id_grupo'],
        properties: {
          id_clase: {
            type: 'integer',
            example: 1
          },
          fecha_clase: {
            type: 'string',
            format: 'date',
            example: '2024-01-15',
            description: 'Fecha de la clase'
          },
          hora_inicio: {
            type: 'string',
            format: 'time',
            example: '09:00:00',
            description: 'Hora de inicio de la clase'
          },
          hora_fin: {
            type: 'string',
            format: 'time',
            example: '10:30:00',
            description: 'Hora de fin de la clase'
          },
          id_grupo: {
            type: 'integer',
            example: 1,
            description: 'ID del grupo de la clase'
          },
          estado: {
            type: 'string',
            enum: ['pendiente', 'realizada', 'suspendida'],
            example: 'pendiente',
            description: 'Estado de la clase (pendiente, realizada, suspendida)'
          },
          grupo: {
            $ref: '#/components/schemas/Grupo'
          }
        }
      },
      ClaseEmpleado: {
        type: 'object',
        required: ['id_clase', 'id_empleado', 'rol'],
        properties: {
          id_clase: {
            type: 'integer',
            example: 1,
            description: 'ID de la clase'
          },
          id_empleado: {
            type: 'integer',
            example: 1,
            description: 'ID del empleado'
          },
          presente: {
            type: 'integer',
            minimum: 0,
            maximum: 1,
            example: 0,
            description: 'Estado de presencia (1 presente, 0 ausente)'
          },
          rol: {
            type: 'string',
            maxLength: 20,
            example: 'Instructor',
            description: 'Rol del empleado en la clase'
          },
          clase: {
            $ref: '#/components/schemas/Clase'
          },
          empleado: {
            $ref: '#/components/schemas/Empleado'
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
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingresa el token JWT obtenido del endpoint de autenticación. Formato: Bearer <token>'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  tags: [
    {
      name: 'Autenticación',
      description: 'Endpoints de autenticación y autorización'
    },
    {
      name: 'Categorías',
      description: 'Endpoints para gestionar categorías'
    },
    {
      name: 'Condiciones',
      description: 'Endpoints para gestionar condiciones'
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
      name: 'Tutores',
      description: 'Endpoints para gestionar tutores'
    },
    {
      name: 'Alumnos',
      description: 'Endpoints para gestionar alumnos'
    },
    {
      name: 'Clases',
      description: 'Endpoints para gestionar clases'
    },
    {
      name: 'Clase-Empleados',
      description: 'Endpoints para gestionar relaciones clase-empleado'
    },
    {
      name: 'Health',
      description: 'Endpoints de salud del servidor'
    }
  ]
};

export default swaggerSpec;

