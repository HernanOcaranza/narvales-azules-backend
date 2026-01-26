-- ======================================================
-- Script para calcular fechas de fin de membresía automáticamente
-- Base de datos: Narvales Azules
-- ======================================================
-- 
-- Este script calcula la fecha_fin para todas las membresías
-- que tienen fecha_fin NULL, basándose en:
-- - fecha_inicio de la membresía
-- - duracion_dias del tipo de membresía
--
-- Lógica:
-- - Si duracion_dias = 30: calcula como un mes calendario exacto
-- - Si duracion_dias != 30: suma (duracion_dias - 1) días
--   (el día de inicio cuenta como día 1)
--
-- IMPORTANTE: Hacer backup de la base de datos antes de ejecutar
-- ======================================================

USE narvales_azules;

-- Desactivar verificación de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- ======================================================
-- ACTUALIZAR MEMBRESÍAS CON fecha_fin NULL
-- ======================================================
-- 
-- Para duracion_dias = 30: usar mes calendario exacto
-- Para otros valores: sumar (duracion_dias - 1) días
-- ======================================================

UPDATE Membrecia m
INNER JOIN Tipo_Membrecia tm ON m.id_tipo_membrecia = tm.id_tipo_membrecia
SET m.fecha_fin = CASE
    -- Si duracion_dias es 30, calcular como mes calendario exacto
    WHEN tm.duracion_dias = 30 THEN 
        -- Sumar 1 mes y ajustar si el día no existe en el mes siguiente
        -- (ej: 31 de enero -> 28/29 de febrero, dependiendo del año)
        -- Lógica: obtener el día original, sumar 1 mes, y usar el mínimo entre
        -- el día original y el último día del mes resultante
        DATE_ADD(
            DATE_ADD(m.fecha_inicio, INTERVAL 1 MONTH),
            INTERVAL (
                LEAST(
                    DAY(m.fecha_inicio),
                    DAY(LAST_DAY(DATE_ADD(m.fecha_inicio, INTERVAL 1 MONTH)))
                ) - DAY(DATE_ADD(m.fecha_inicio, INTERVAL 1 MONTH))
            ) DAY
        )
    -- Para otros valores, sumar (duracion_dias - 1) días
    -- (el día de inicio cuenta como día 1)
    WHEN tm.duracion_dias IS NOT NULL AND tm.duracion_dias > 0 THEN
        DATE_ADD(m.fecha_inicio, INTERVAL (tm.duracion_dias - 1) DAY)
    -- Si no hay duracion_dias, dejar NULL
    ELSE NULL
END
WHERE m.fecha_fin IS NULL 
  AND tm.duracion_dias IS NOT NULL 
  AND tm.duracion_dias > 0;

-- Reactivar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- ======================================================
-- VERIFICACIÓN (opcional - descomentar para verificar)
-- ======================================================
-- 
-- Ver cuántas membresías se actualizaron y cuáles quedan con NULL
-- ======================================================

-- SELECT 
--     COUNT(*) as total_membresias,
--     SUM(CASE WHEN fecha_fin IS NULL THEN 1 ELSE 0 END) as con_fecha_fin_null,
--     SUM(CASE WHEN fecha_fin IS NOT NULL THEN 1 ELSE 0 END) as con_fecha_fin_calculada
-- FROM Membrecia;

-- Ver membresías que quedaron con fecha_fin NULL (sin duracion_dias)
-- SELECT 
--     m.id_membrecia,
--     m.fecha_inicio,
--     m.fecha_fin,
--     tm.tipo_membrecia,
--     tm.duracion_dias
-- FROM Membrecia m
-- INNER JOIN Tipo_Membrecia tm ON m.id_tipo_membrecia = tm.id_tipo_membrecia
-- WHERE m.fecha_fin IS NULL
-- ORDER BY m.id_membrecia;

SELECT '✅ Cálculo de fechas de fin completado' as resultado;
