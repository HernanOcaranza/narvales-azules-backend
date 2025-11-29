-- ======================================================
-- Migración: Agregar campo estado a la tabla Clase
-- ======================================================
-- Este script agrega el campo 'estado' a la tabla Clase
-- con valores posibles: 'pendiente', 'realizada', 'suspendida'
-- Valor por defecto: 'pendiente'
-- ======================================================

USE narvales_azules;

-- Agregar columna estado a la tabla Clase
ALTER TABLE Clase 
ADD COLUMN estado ENUM('pendiente', 'realizada', 'suspendida') 
NOT NULL DEFAULT 'pendiente';

-- Opcional: Si quieres actualizar registros existentes a un estado específico
-- UPDATE Clase SET estado = 'pendiente' WHERE estado IS NULL;

