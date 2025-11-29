-- ======================================================
-- Migración: Crear tabla Grupo_Horario
-- ======================================================
-- Este script crea la tabla Grupo_Horario para almacenar
-- los horarios de cada grupo (días de la semana y horas)
-- ======================================================

USE narvales_azules;

-- Crear tabla Grupo_Horario
CREATE TABLE Grupo_Horario(
    id_grupo_horario INT AUTO_INCREMENT PRIMARY KEY,
    id_grupo INT NOT NULL,
    dia_semana TINYINT NOT NULL COMMENT '0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado',
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
    FOREIGN KEY (id_grupo) REFERENCES Grupo(id_grupo) ON DELETE CASCADE,
    UNIQUE KEY unique_grupo_dia_hora (id_grupo, dia_semana, hora_inicio),
    CHECK (dia_semana BETWEEN 0 AND 6),
    CHECK (hora_fin > hora_inicio)
) ENGINE=InnoDB;

-- Índice para mejorar consultas por grupo
CREATE INDEX idx_grupo_horario_grupo ON Grupo_Horario(id_grupo);

-- Índice para mejorar consultas por día de la semana
CREATE INDEX idx_grupo_horario_dia ON Grupo_Horario(dia_semana);

