-- ======================================================
-- Base de datos: Narvales Azules
-- ======================================================

-- Limpiar base de datos si existe
DROP DATABASE IF EXISTS narvales_azules;
CREATE DATABASE narvales_azules CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE narvales_azules;

-- ======================================================
-- TABLAS
-- ======================================================

CREATE TABLE Empleado(
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL,
    usuario VARCHAR(50) NOT NULL,
    contrasenia VARCHAR(250) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    dni CHAR(8),
    telefono CHAR(10) NOT NULL,
    fecha_alta DATE NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE Categoria(
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(20) NOT NULL,
    descripcion VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE Disciplina(
    id_disciplina INT AUTO_INCREMENT PRIMARY KEY,
    disciplina VARCHAR(20) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE Grupo(
    id_grupo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL,
    cupo_maximo INT NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    id_disciplina INT NOT NULL,
    id_categoria INT NOT NULL,
    FOREIGN KEY (id_disciplina) REFERENCES Disciplina(id_disciplina),
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria)
) ENGINE=InnoDB;

CREATE TABLE Tutor(
    id_tutor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    telefono CHAR(10),
    dni CHAR(8),
    fecha_registro DATE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE Alumno(
    id_alumno INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    dni CHAR(8),
    fecha_nacimiento DATE,
    direccion VARCHAR(80),
    fecha_registro DATE NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    id_tutor INT NOT NULL,
    id_categoria INT NOT NULL,
    FOREIGN KEY (id_tutor) REFERENCES Tutor(id_tutor),
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria)
) ENGINE=InnoDB;

CREATE TABLE Clase(
    id_clase INT AUTO_INCREMENT PRIMARY KEY,
    fecha_clase DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    id_grupo INT NOT NULL,
    FOREIGN KEY (id_grupo) REFERENCES Grupo(id_grupo)
) ENGINE=InnoDB;

CREATE TABLE Clase_Empleado(
    id_clase INT NOT NULL,
    id_empleado INT NOT NULL,
    presente TINYINT(1) NOT NULL DEFAULT 0,
    rol VARCHAR(20) NOT NULL,
    PRIMARY KEY (id_clase, id_empleado),
    FOREIGN KEY (id_clase) REFERENCES Clase(id_clase),
    FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado)
) ENGINE=InnoDB;

CREATE TABLE Asistencia(
    id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
    observacion VARCHAR(100),
    presente TINYINT(1) NOT NULL DEFAULT 0,
    id_clase INT NOT NULL,
    id_alumno INT NOT NULL,
    FOREIGN KEY (id_clase) REFERENCES Clase(id_clase),
    FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno)
) ENGINE=InnoDB;

CREATE TABLE Tipo_Membrecia(
    id_tipo_membrecia INT AUTO_INCREMENT PRIMARY KEY,
    tipo_membrecia VARCHAR(20) NOT NULL,
    frecuencia_semanal INT
) ENGINE=InnoDB;

CREATE TABLE Precio_Membrecia(
    id_precio_membrecia INT AUTO_INCREMENT PRIMARY KEY,
    fecha_inicio_vigencia DATE NOT NULL,
    fecha_fin_vigencia DATE,
    precio DECIMAL(10,2) NOT NULL,
    id_tipo_membrecia INT NOT NULL,
    FOREIGN KEY (id_tipo_membrecia) REFERENCES Tipo_Membrecia(id_tipo_membrecia)
) ENGINE=InnoDB;

CREATE TABLE Pago(
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(10) NOT NULL, -- ingreso o egreso
    fecha_pago DATE NOT NULL,
    estado VARCHAR(10) NOT NULL,
    observaciones VARCHAR(60),
    id_empleado INT NOT NULL,
    FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado)
) ENGINE=InnoDB;

CREATE TABLE Detalle_Pago(
    id_detalle_pago INT AUTO_INCREMENT PRIMARY KEY,
    metodo_pago VARCHAR(20) NOT NULL,
    monto_parcial DECIMAL(10,2) NOT NULL,
    fecha_detalle DATE NOT NULL,
    referencia_transferencia VARCHAR(50),
    id_pago INT NOT NULL,
    FOREIGN KEY (id_pago) REFERENCES Pago(id_pago)
) ENGINE=InnoDB;

CREATE TABLE Membrecia(
    id_membrecia INT AUTO_INCREMENT PRIMARY KEY,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    estado VARCHAR(10) NOT NULL,
    id_alumno INT NOT NULL,
    id_pago INT NOT NULL,
    id_tipo_membrecia INT NOT NULL,
    id_grupo INT NOT NULL,
    FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno),
    FOREIGN KEY (id_pago) REFERENCES Pago(id_pago),
    FOREIGN KEY (id_tipo_membrecia) REFERENCES Tipo_Membrecia(id_tipo_membrecia),
    FOREIGN KEY (id_grupo) REFERENCES Grupo(id_grupo)
) ENGINE=InnoDB;
