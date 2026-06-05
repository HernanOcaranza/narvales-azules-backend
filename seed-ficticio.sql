-- ======================================================
-- Seed: Datos ficticios para Narvales Azules
-- 80 alumnos, 40 tutores, membresias ene-may 2026
-- ======================================================

USE narvales_azules;

-- ======================================================
-- 1. LIMPIEZA SEGURA
-- ======================================================
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM Asistencia;
DELETE FROM Clase_Empleado;
DELETE FROM Clase;
DELETE FROM Membrecia;
DELETE FROM Detalle_Pago;
DELETE FROM Pago;
DELETE FROM Alumno;
DELETE FROM Tutor;
DELETE FROM Grupo_Horario;
DELETE FROM Grupo_Empleado;

ALTER TABLE Tutor AUTO_INCREMENT = 1;
ALTER TABLE Alumno AUTO_INCREMENT = 1;
ALTER TABLE Pago AUTO_INCREMENT = 1;
ALTER TABLE Detalle_Pago AUTO_INCREMENT = 1;
ALTER TABLE Membrecia AUTO_INCREMENT = 1;
ALTER TABLE Clase AUTO_INCREMENT = 1;
ALTER TABLE Asistencia AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;

-- ======================================================
-- 2. GRUPO_HORARIO
-- ======================================================
INSERT INTO Grupo_Horario (id_grupo, dia_semana, hora_inicio, hora_fin) VALUES
(1, 1, '08:00:00', '09:00:00'),
(1, 3, '08:00:00', '09:00:00'),
(1, 5, '08:00:00', '09:00:00'),
(2, 2, '08:00:00', '09:00:00'),
(2, 4, '08:00:00', '09:00:00'),
(3, 1, '09:00:00', '10:00:00'),
(3, 3, '09:00:00', '10:00:00'),
(3, 5, '09:00:00', '10:00:00'),
(4, 1, '10:00:00', '11:00:00'),
(4, 3, '10:00:00', '11:00:00'),
(4, 5, '10:00:00', '11:00:00'),
(5, 1, '19:00:00', '20:00:00'),
(5, 3, '19:00:00', '20:00:00'),
(5, 5, '19:00:00', '20:00:00');

-- ======================================================
-- 3. TUTORES (40)
-- ======================================================
INSERT INTO Tutor (id_tutor, nombre, apellido, telefono, dni, fecha_registro) VALUES
(1, 'Carlos', 'García', '1123456780', '12345678', '2025-03-10'),
(2, 'María', 'Rodríguez', '1123456781', '23456789', '2025-03-12'),
(3, 'José', 'Martínez', '1123456782', '34567890', '2025-03-15'),
(4, 'Ana', 'López', '1123456783', '45678901', '2025-03-18'),
(5, 'Juan', 'González', '1123456784', '56789012', '2025-03-20'),
(6, 'Laura', 'Pérez', '1123456785', '67890123', '2025-03-22'),
(7, 'Diego', 'Fernández', '1123456786', '78901234', '2025-04-01'),
(8, 'Patricia', 'Sánchez', '1123456787', '89012345', '2025-04-03'),
(9, 'Martín', 'Romero', '1123456788', '90123456', '2025-04-05'),
(10, 'Andrea', 'Díaz', '1123456789', '01234567', '2025-04-08'),
(11, 'Pablo', 'Torres', '1123456790', '11223344', '2025-04-10'),
(12, 'Gabriela', 'Álvarez', '1123456791', '22334455', '2025-04-15'),
(13, 'Fernando', 'Ruiz', '1123456792', '33445566', '2025-04-18'),
(14, 'Silvia', 'Gómez', '1123456793', '44556677', '2025-04-20'),
(15, 'Alejandro', 'Silva', '1123456794', '55667788', '2025-05-01'),
(16, 'Verónica', 'Vázquez', '1123456795', '66778899', '2025-05-03'),
(17, 'Gustavo', 'Castro', '1123456796', '77889900', '2025-05-05'),
(18, 'Carolina', 'Ortiz', '1123456797', '88990011', '2025-05-08'),
(19, 'Ricardo', 'Medina', '1123456798', '99001122', '2025-05-12'),
(20, 'Marcela', 'Herrera', '1123456799', '00112233', '2025-05-15'),
(21, 'Eduardo', 'Pereyra', '1123456800', '11223300', '2025-06-01'),
(22, 'Luciana', 'Ríos', '1123456801', '22334411', '2025-06-05'),
(23, 'Sergio', 'Acosta', '1123456802', '33445522', '2025-06-10'),
(24, 'Florencia', 'Morales', '1123456803', '44556633', '2025-06-15'),
(25, 'Oscar', 'Campos', '1123456804', '55667744', '2025-06-20'),
(26, 'Natalia', 'Suárez', '1123456805', '66778855', '2025-07-01'),
(27, 'Adrián', 'Paz', '1123456806', '77889966', '2025-07-05'),
(28, 'Romina', 'Benítez', '1123456807', '88990077', '2025-07-10'),
(29, 'Matías', 'Vega', '1123456808', '99001188', '2025-08-01'),
(30, 'Soledad', 'Molina', '1123456809', '00112299', '2025-08-05'),
(31, 'Marcelo', 'Aguilar', '1123456810', '11223355', '2025-08-10'),
(32, 'Jimena', 'Navarro', '1123456811', '22334466', '2025-09-01'),
(33, 'Javier', 'Ramos', '1123456812', '33445577', '2025-09-05'),
(34, 'Belén', 'Castillo', '1123456813', '44556688', '2025-09-10'),
(35, 'Lucas', 'Domínguez', '1123456814', '55667799', '2025-10-01'),
(36, 'Candela', 'Giménez', '1123456815', '66778800', '2025-10-05'),
(37, 'Federico', 'Luna', '1123456816', '77889911', '2025-11-01'),
(38, 'Valeria', 'Rivas', '1123456817', '88990022', '2025-11-05'),
(39, 'Leandro', 'Arias', '1123456818', '99001133', '2025-12-01'),
(40, 'Julieta', 'Moreno', '1123456819', '00112244', '2026-01-10');
ALTER TABLE Tutor AUTO_INCREMENT = 41;

-- ======================================================
-- 4. ALUMNOS (80)
-- id_categoria: 1=Principiante, 2=Intermedio, 3=Avanzado
-- id_condicion: 1=Normal, 2=Autismo
-- ======================================================
INSERT INTO Alumno (id_alumno, nombre, apellido, dni, fecha_nacimiento, direccion, fecha_registro, certificado, id_tutor, id_categoria, id_condicion) VALUES
-- Grupo 1: L-M-V 8:00 Principiantes (alumnos 1-15) → categoria 1
(1,  'Thiago',     'García',    '12345601', '2015-06-12', 'Av. Siempre Viva 123', '2025-03-15', 1, 1, 1, 1),
(2,  'Valentina',  'Rodríguez', '12345602', '2016-03-25', 'Calle Falsa 456',      '2025-03-15', 1, 1, 1, 1),
(3,  'Benjamín',   'Martínez',  '12345603', '2014-11-08', 'San Martín 789',       '2025-03-20', 0, 1, 1, 2),
(4,  'Isabella',   'López',     '12345604', '2017-02-14', 'Belgrano 321',         '2025-03-20', 1, 2, 1, 1),
(5,  'Santiago',   'González',  '12345605', '2015-09-30', 'Mitre 654',            '2025-04-01', 1, 2, 1, 1),
(6,  'Sofía',      'Pérez',     '12345606', '2016-07-22', 'Sarmiento 987',        '2025-04-01', 0, 2, 1, 1),
(7,  'Mateo',      'Fernández', '12345607', '2014-05-18', 'Rivadavia 147',        '2025-04-05', 1, 3, 1, 1),
(8,  'Camila',     'Sánchez',   '12345608', '2017-01-10', 'Pueyrredón 258',       '2025-04-05', 1, 3, 1, 1),
(9,  'Joaquín',    'Romero',    '12345609', '2015-12-03', 'Alem 369',             '2025-04-10', 0, 3, 1, 2),
(10, 'Luciana',    'Díaz',      '12345610', '2016-08-15', '9 de Julio 741',       '2025-04-10', 1, 4, 1, 1),
(11, 'Bautista',   'Torres',    '12345611', '2014-04-27', 'Maipú 852',            '2025-04-15', 1, 4, 1, 1),
(12, 'Martina',    'Álvarez',   '12345612', '2017-10-05', 'Corrientes 963',       '2025-04-15', 0, 4, 1, 1),
(13, 'Felipe',     'Ruiz',      '12345613', '2015-01-20', 'Córdoba 159',          '2025-05-01', 1, 5, 1, 1),
(14, 'Emma',       'Gómez',     '12345614', '2016-06-30', 'Santa Fe 753',         '2025-05-01', 1, 5, 1, 1),
(15, 'Lorenzo',    'Silva',     '12345615', '2014-09-14', 'Entre Ríos 951',       '2025-05-05', 0, 5, 1, 1),
-- Grupo 2: M-J 08:00 Principiantes (alumnos 16-30) → categoria 1
(16, 'Catalina',   'Vázquez',   '12345616', '2015-03-10', 'Buenos Aires 111',     '2025-05-05', 1, 6, 1, 1),
(17, 'Juan',       'Castro',    '12345617', '2016-11-22', 'Uruguay 222',          '2025-05-10', 1, 6, 1, 1),
(18, 'Emilia',     'Ortiz',     '12345618', '2014-08-05', 'Paraguay 333',         '2025-05-10', 0, 6, 1, 1),
(19, 'Santino',    'Medina',    '12345619', '2017-04-18', 'Chile 444',            '2025-05-15', 1, 7, 1, 2),
(20, 'Lola',       'Herrera',   '12345620', '2015-12-30', 'Perú 555',             '2025-05-15', 1, 7, 1, 1),
(21, 'Nicolás',    'Pereyra',   '12345621', '2016-09-14', 'Bolivia 666',          '2025-06-01', 0, 7, 1, 1),
(22, 'Juana',      'Ríos',      '12345622', '2014-07-08', 'Ecuador 777',          '2025-06-01', 1, 8, 1, 1),
(23, 'Bruno',      'Acosta',    '12345623', '2017-01-25', 'Venezuela 888',        '2025-06-05', 1, 8, 1, 1),
(24, 'Mía',        'Morales',   '12345624', '2015-10-12', 'Colombia 999',         '2025-06-05', 0, 8, 1, 1),
(25, 'Tomás',      'Campos',    '12345625', '2016-05-20', 'Panamá 101',           '2025-06-10', 1, 9, 1, 1),
(26, 'Delfina',    'Suárez',    '12345626', '2014-02-28', 'México 202',           '2025-06-10', 1, 9, 1, 1),
(27, 'Francisco',  'Paz',       '12345627', '2017-08-15', 'Cuba 303',             '2025-06-15', 0, 9, 1, 1),
(28, 'Pilar',      'Benítez',   '12345628', '2015-11-03', 'República 404',        '2025-06-15', 1, 10, 1, 1),
(29, 'Manuel',     'Vega',      '12345629', '2016-04-09', 'Dominicana 505',       '2025-07-01', 1, 10, 1, 2),
(30, 'Malena',     'Molina',    '12345630', '2014-10-21', 'Honduras 606',         '2025-07-01', 0, 10, 1, 1),
-- Grupo 3: L-M-V 9:00 Intermedios (alumnos 31-45) → categoria 2
(31, 'Simón',      'Aguilar',   '12345631', '2013-06-15', 'Nicaragua 707',        '2025-07-05', 1, 11, 2, 1),
(32, 'Guillermina','Navarro',   '12345632', '2014-03-22', 'Guatemala 808',        '2025-07-05', 1, 11, 2, 1),
(33, 'Noah',       'Ramos',     '12345633', '2012-11-10', 'El Salvador 909',      '2025-07-10', 0, 11, 2, 2),
(34, 'Morena',     'Castillo',  '12345634', '2015-08-30', 'Costa Rica 111',       '2025-07-10', 1, 12, 2, 1),
(35, 'Lucas',      'Domínguez', '12345635', '2013-05-14', 'Puerto Rico 222',      '2025-07-15', 1, 12, 2, 1),
(36, 'Margarita',  'Giménez',   '12345636', '2014-12-01', 'Bahamas 333',          '2025-07-15', 0, 12, 2, 2),
(37, 'Ignacio',    'Luna',      '12345637', '2012-09-18', 'Jamaica 444',          '2025-08-01', 1, 13, 2, 1),
(38, 'Ámbar',      'Rivas',     '12345638', '2015-04-05', 'Haití 555',            '2025-08-01', 1, 13, 2, 1),
(39, 'Dante',      'Arias',     '12345639', '2013-07-28', 'Trinidad 666',         '2025-08-05', 0, 13, 2, 1),
(40, 'Olivia',     'Moreno',    '12345640', '2014-01-15', 'Barbados 777',         '2025-08-05', 1, 14, 2, 1),
(41, 'León',       'García',    '12345641', '2012-10-08', 'Granada 888',          '2025-08-10', 1, 14, 2, 1),
(42, 'Azul',       'Rodríguez', '12345642', '2015-06-20', 'Antigua 999',          '2025-08-10', 0, 14, 2, 1),
(43, 'Alma',       'López',     '12345643', '2013-03-11', 'Santa Lucía 121',      '2025-09-01', 1, 15, 2, 1),
(44, 'Gael',       'Martínez',  '12345644', '2014-11-25', 'San Vicente 232',      '2025-09-01', 1, 15, 2, 2),
(45, 'Isabella',   'González',  '12345645', '2012-08-03', 'Dominica 343',         '2025-09-05', 1, 15, 2, 1),
-- Grupo 4: L-M-V 10:00 Avanzados (alumnos 46-60) → categoria 3
(46, 'Facundo',    'Pérez',     '12345646', '2011-04-18', 'Alabama 454',          '2025-09-05', 1, 16, 3, 1),
(47, 'Valentino',  'Fernández', '12345647', '2012-09-27', 'Texas 565',            '2025-09-10', 1, 16, 3, 1),
(48, 'Emilia',     'Sánchez',   '12345648', '2010-12-05', 'Ohio 676',             '2025-09-10', 0, 16, 3, 1),
(49, 'Benicio',    'Romero',    '12345649', '2013-07-14', 'Florida 787',          '2025-09-15', 1, 17, 3, 2),
(50, 'Martina',    'Díaz',      '12345650', '2011-11-30', 'Nevada 898',           '2025-09-15', 1, 17, 3, 1),
(51, 'Santino',    'Torres',    '12345651', '2012-05-22', 'Arizona 909',          '2025-10-01', 0, 17, 3, 1),
(52, 'Camila',     'Álvarez',   '12345652', '2010-10-08', 'Colorado 212',         '2025-10-01', 1, 18, 3, 1),
(53, 'Mateo',      'Ruiz',      '12345653', '2013-02-16', 'Oregón 323',           '2025-10-05', 1, 18, 3, 2),
(54, 'Sofía',      'Gómez',     '12345654', '2011-08-19', 'Utah 434',             '2025-10-05', 0, 18, 3, 1),
(55, 'Thiago',     'Silva',     '12345655', '2012-12-25', 'Montana 545',          '2025-10-10', 1, 19, 3, 1),
(56, 'Valentina',  'Vázquez',   '12345656', '2010-06-11', 'Idaho 656',            '2025-10-10', 1, 19, 3, 1),
(57, 'Bautista',   'Castro',    '12345657', '2013-09-03', 'Wyoming 767',          '2025-10-15', 0, 19, 3, 1),
(58, 'Isabella',   'Ortiz',     '12345658', '2011-01-28', 'Dakota 878',           '2025-10-15', 1, 20, 3, 1),
(59, 'Santiago',   'Medina',    '12345659', '2012-04-15', 'Nebraska 989',         '2025-11-01', 1, 20, 3, 1),
(60, 'Juana',      'Herrera',   '12345660', '2010-07-20', 'Kansas 131',           '2025-11-01', 0, 20, 3, 1),
-- Grupo 5: L-M-V 19:00 Aquagym (alumnos 61-75) → categoria 3 (Aquagym)
(61, 'Lorenzo',    'Pereyra',   '12345661', '1998-03-12', 'Iowa 242',             '2025-11-05', 1, 21, 3, 1),
(62, 'Emma',       'Ríos',      '12345662', '2002-08-25', 'Misuri 353',           '2025-11-05', 1, 21, 3, 1),
(63, 'Joaquín',    'Acosta',    '12345663', '2000-11-18', 'Arkansas 464',         '2025-11-10', 0, 21, 3, 1),
(64, 'Luciana',    'Morales',   '12345664', '1999-05-30', 'Luisiana 575',         '2025-11-10', 1, 22, 3, 1),
(65, 'Felipe',     'Campos',    '12345665', '2003-01-14', 'Misisipi 686',         '2025-11-15', 1, 22, 3, 2),
(66, 'Catalina',   'Suárez',    '12345666', '2001-09-07', 'Alaska 797',           '2025-11-15', 0, 22, 3, 1),
(67, 'Nicolás',    'Paz',       '12345667', '1997-12-22', 'Hawái 898',            '2025-12-01', 1, 23, 3, 1),
(68, 'Delfina',    'Benítez',   '12345668', '2004-04-10', 'Maine 909',            '2025-12-01', 1, 23, 3, 1),
(69, 'Bruno',      'Vega',      '12345669', '2000-10-05', 'Vermont 212',          '2025-12-05', 0, 23, 3, 1),
(70, 'Mía',        'Molina',    '12345670', '2002-06-18', 'Nuevo Hampshire 323',  '2025-12-05', 1, 24, 3, 1),
(71, 'Tomás',      'Aguilar',   '12345671', '1998-02-28', 'Massachusetts 434',    '2025-12-10', 1, 24, 3, 1),
(72, 'Pilar',      'Navarro',   '12345672', '2001-07-15', 'Connecticut 545',      '2025-12-10', 0, 24, 3, 1),
(73, 'Francisco',  'Ramos',     '12345673', '1999-11-08', 'Rhode Island 656',     '2025-12-15', 1, 25, 3, 1),
(74, 'Manuel',     'Castillo',  '12345674', '2003-03-22', 'Nueva York 767',       '2025-12-15', 1, 25, 3, 1),
(75, 'Malena',     'Domínguez', '12345675', '2000-09-14', 'Nueva Jersey 878',     '2026-01-05', 0, 25, 3, 1),
-- Sin membresía (alumnos 76-80): categoria 1, no asisten
(76, 'Simón',      'Giménez',   '12345676', '2016-01-20', 'Pensilvania 989',      '2026-01-10', 0, 26, 1, 1),
(77, 'Guillermina','Luna',      '12345677', '2015-07-08', 'Maryland 131',         '2026-01-15', 0, 26, 1, 1),
(78, 'Noah',       'Rivas',     '12345678', '2017-04-12', 'Delaware 242',         '2026-02-01', 0, 27, 1, 1),
(79, 'Morena',     'Arias',     '12345679', '2014-10-30', 'Virginia 353',         '2026-02-05', 0, 28, 1, 1),
(80, 'Lucas',      'Moreno',    '12345680', '2016-12-05', 'Carolina 464',         '2026-02-10', 0, 28, 1, 1);
ALTER TABLE Alumno AUTO_INCREMENT = 81;

-- ======================================================
-- 5. PAGOS, DETALLE_PAGO y MEMBRECIAS (75)
-- Una membresia por alumno (alumnos 1-75)
-- ======================================================
-- Tipo 1: Mensual (12 clases) 30d $80000
-- Tipo 2: Mensual (8 clases)  30d $60000
-- Tipo 3: Quincenal (6 Clases) 15d $45000
-- Tipo 4: Quincenal (4 Clases) 15d $35000

INSERT INTO Pago (id_pago, tipo, fecha_pago, estado, observaciones, id_empleado) VALUES
-- Grupo 1 (alumnos 1-15) → id_grupo=1
(1,  'ingreso', '2026-01-01', 'completado', 'Pago membresía Ene 2026', NULL),
(2,  'ingreso', '2026-01-01', 'completado', 'Pago membresía Ene 2026', NULL),
(3,  'ingreso', '2026-01-01', 'completado', 'Pago membresía Ene 2026', NULL),
(4,  'ingreso', '2026-02-01', 'completado', 'Pago membresía Feb 2026', NULL),
(5,  'ingreso', '2026-02-01', 'completado', 'Pago membresía Feb 2026', NULL),
(6,  'ingreso', '2026-02-01', 'completado', 'Pago membresía Feb 2026', NULL),
(7,  'ingreso', '2026-03-01', 'completado', 'Pago membresía Mar 2026', NULL),
(8,  'ingreso', '2026-03-01', 'completado', 'Pago membresía Mar 2026', NULL),
(9,  'ingreso', '2026-03-01', 'completado', 'Pago membresía Mar 2026', NULL),
(10, 'ingreso', '2026-04-01', 'completado', 'Pago membresía Abr 2026', NULL),
(11, 'ingreso', '2026-04-01', 'completado', 'Pago membresía Abr 2026', NULL),
(12, 'ingreso', '2026-04-01', 'completado', 'Pago membresía Abr 2026', NULL),
(13, 'ingreso', '2026-05-01', 'completado', 'Pago membresía May 2026', NULL),
(14, 'ingreso', '2026-05-01', 'completado', 'Pago membresía May 2026', NULL),
(15, 'ingreso', '2026-05-01', 'completado', 'Pago membresía May 2026', NULL),
-- Grupo 2 (alumnos 16-30) → id_grupo=2
(16, 'ingreso', '2026-01-01', 'completado', 'Pago membresía Ene 2026', NULL),
(17, 'ingreso', '2026-01-01', 'completado', 'Pago membresía Ene 2026', NULL),
(18, 'ingreso', '2026-01-01', 'completado', 'Pago membresía Ene 2026', NULL),
(19, 'ingreso', '2026-02-01', 'completado', 'Pago membresía Feb 2026', NULL),
(20, 'ingreso', '2026-02-01', 'completado', 'Pago membresía Feb 2026', NULL),
(21, 'ingreso', '2026-02-01', 'completado', 'Pago membresía Feb 2026', NULL),
(22, 'ingreso', '2026-03-01', 'completado', 'Pago membresía Mar 2026', NULL),
(23, 'ingreso', '2026-03-01', 'completado', 'Pago membresía Mar 2026', NULL),
(24, 'ingreso', '2026-03-01', 'completado', 'Pago membresía Mar 2026', NULL),
(25, 'ingreso', '2026-04-01', 'completado', 'Pago membresía Abr 2026', NULL),
(26, 'ingreso', '2026-04-01', 'completado', 'Pago membresía Abr 2026', NULL),
(27, 'ingreso', '2026-04-01', 'completado', 'Pago membresía Abr 2026', NULL),
(28, 'ingreso', '2026-05-01', 'completado', 'Pago membresía May 2026', NULL),
(29, 'ingreso', '2026-05-01', 'completado', 'Pago membresía May 2026', NULL),
(30, 'ingreso', '2026-05-01', 'completado', 'Pago membresía May 2026', NULL),
-- Grupo 3 (alumnos 31-45) → id_grupo=3
(31, 'ingreso', '2026-01-01', 'completado', 'Pago membresía Ene 2026', NULL),
(32, 'ingreso', '2026-01-01', 'completado', 'Pago membresía Ene 2026', NULL),
(33, 'ingreso', '2026-01-01', 'completado', 'Pago membresía Ene 2026', NULL),
(34, 'ingreso', '2026-02-01', 'completado', 'Pago membresía Feb 2026', NULL),
(35, 'ingreso', '2026-02-01', 'completado', 'Pago membresía Feb 2026', NULL),
(36, 'ingreso', '2026-02-01', 'completado', 'Pago membresía Feb 2026', NULL),
(37, 'ingreso', '2026-03-01', 'completado', 'Pago membresía Mar 2026', NULL),
(38, 'ingreso', '2026-03-01', 'completado', 'Pago membresía Mar 2026', NULL),
(39, 'ingreso', '2026-03-01', 'completado', 'Pago membresía Mar 2026', NULL),
(40, 'ingreso', '2026-04-01', 'completado', 'Pago membresía Abr 2026', NULL),
(41, 'ingreso', '2026-04-01', 'completado', 'Pago membresía Abr 2026', NULL),
(42, 'ingreso', '2026-04-01', 'completado', 'Pago membresía Abr 2026', NULL),
(43, 'ingreso', '2026-05-01', 'completado', 'Pago membresía May 2026', NULL),
(44, 'ingreso', '2026-05-01', 'completado', 'Pago membresía May 2026', NULL),
(45, 'ingreso', '2026-05-01', 'completado', 'Pago membresía May 2026', NULL),
-- Grupo 4 (alumnos 46-60) → id_grupo=4
(46, 'ingreso', '2026-01-15', 'completado', 'Pago membresía Ene 2026', NULL),
(47, 'ingreso', '2026-01-15', 'completado', 'Pago membresía Ene 2026', NULL),
(48, 'ingreso', '2026-01-15', 'completado', 'Pago membresía Ene 2026', NULL),
(49, 'ingreso', '2026-02-15', 'completado', 'Pago membresía Feb 2026', NULL),
(50, 'ingreso', '2026-02-15', 'completado', 'Pago membresía Feb 2026', NULL),
(51, 'ingreso', '2026-02-15', 'completado', 'Pago membresía Feb 2026', NULL),
(52, 'ingreso', '2026-03-01', 'completado', 'Pago membresía Mar 2026', NULL),
(53, 'ingreso', '2026-03-01', 'completado', 'Pago membresía Mar 2026', NULL),
(54, 'ingreso', '2026-03-01', 'completado', 'Pago membresía Mar 2026', NULL),
(55, 'ingreso', '2026-04-01', 'completado', 'Pago membresía Abr 2026', NULL),
(56, 'ingreso', '2026-04-01', 'completado', 'Pago membresía Abr 2026', NULL),
(57, 'ingreso', '2026-04-01', 'completado', 'Pago membresía Abr 2026', NULL),
(58, 'ingreso', '2026-05-15', 'completado', 'Pago membresía May 2026', NULL),
(59, 'ingreso', '2026-05-15', 'completado', 'Pago membresía May 2026', NULL),
(60, 'ingreso', '2026-05-15', 'completado', 'Pago membresía May 2026', NULL),
-- Grupo 5 (alumnos 61-75) → id_grupo=5
(61, 'ingreso', '2026-01-15', 'completado', 'Pago membresía Ene 2026', NULL),
(62, 'ingreso', '2026-01-15', 'completado', 'Pago membresía Ene 2026', NULL),
(63, 'ingreso', '2026-01-15', 'completado', 'Pago membresía Ene 2026', NULL),
(64, 'ingreso', '2026-03-15', 'completado', 'Pago membresía Mar 2026', NULL),
(65, 'ingreso', '2026-03-15', 'completado', 'Pago membresía Mar 2026', NULL),
(66, 'ingreso', '2026-03-15', 'completado', 'Pago membresía Mar 2026', NULL),
(67, 'ingreso', '2026-04-15', 'completado', 'Pago membresía Abr 2026', NULL),
(68, 'ingreso', '2026-04-15', 'completado', 'Pago membresía Abr 2026', NULL),
(69, 'ingreso', '2026-04-15', 'completado', 'Pago membresía Abr 2026', NULL),
(70, 'ingreso', '2026-05-01', 'completado', 'Pago membresía May 2026', NULL),
(71, 'ingreso', '2026-05-01', 'completado', 'Pago membresía May 2026', NULL),
(72, 'ingreso', '2026-05-01', 'completado', 'Pago membresía May 2026', NULL),
(73, 'ingreso', '2026-05-01', 'completado', 'Pago membresía May 2026', NULL),
(74, 'ingreso', '2026-05-01', 'completado', 'Pago membresía May 2026', NULL),
(75, 'ingreso', '2026-05-01', 'completado', 'Pago membresía May 2026', NULL);
ALTER TABLE Pago AUTO_INCREMENT = 76;

INSERT INTO Detalle_Pago (id_detalle_pago, metodo_pago, monto_parcial, fecha_detalle, referencia_transferencia, id_pago) VALUES
-- Grupo 1 (alumnos 1-15)
(1,  'efectivo',      80000.00, '2026-01-01', NULL, 1),
(2,  'transferencia', 80000.00, '2026-01-01', 'TRF-001-ENE', 2),
(3,  'tarjeta',       80000.00, '2026-01-01', NULL, 3),
(4,  'efectivo',      60000.00, '2026-02-01', NULL, 4),
(5,  'transferencia', 60000.00, '2026-02-01', 'TRF-002-FEB', 5),
(6,  'tarjeta',       60000.00, '2026-02-01', NULL, 6),
(7,  'efectivo',      45000.00, '2026-03-01', NULL, 7),
(8,  'transferencia', 45000.00, '2026-03-01', 'TRF-003-MAR', 8),
(9,  'tarjeta',       45000.00, '2026-03-01', NULL, 9),
(10, 'efectivo',      35000.00, '2026-04-01', NULL, 10),
(11, 'transferencia', 35000.00, '2026-04-01', 'TRF-004-ABR', 11),
(12, 'tarjeta',       35000.00, '2026-04-01', NULL, 12),
(13, 'efectivo',      80000.00, '2026-05-01', NULL, 13),
(14, 'transferencia', 80000.00, '2026-05-01', 'TRF-005-MAY', 14),
(15, 'tarjeta',       80000.00, '2026-05-01', NULL, 15),
-- Grupo 2 (alumnos 16-30)
(16, 'transferencia', 60000.00, '2026-01-01', 'TRF-006-ENE', 16),
(17, 'tarjeta',       60000.00, '2026-01-01', NULL, 17),
(18, 'efectivo',      60000.00, '2026-01-01', NULL, 18),
(19, 'tarjeta',       80000.00, '2026-02-01', NULL, 19),
(20, 'efectivo',      80000.00, '2026-02-01', NULL, 20),
(21, 'transferencia', 80000.00, '2026-02-01', 'TRF-007-FEB', 21),
(22, 'efectivo',      35000.00, '2026-03-01', NULL, 22),
(23, 'transferencia', 35000.00, '2026-03-01', 'TRF-008-MAR', 23),
(24, 'tarjeta',       35000.00, '2026-03-01', NULL, 24),
(25, 'efectivo',      45000.00, '2026-04-01', NULL, 25),
(26, 'transferencia', 45000.00, '2026-04-01', 'TRF-009-ABR', 26),
(27, 'tarjeta',       45000.00, '2026-04-01', NULL, 27),
(28, 'efectivo',      60000.00, '2026-05-01', NULL, 28),
(29, 'transferencia', 60000.00, '2026-05-01', 'TRF-010-MAY', 29),
(30, 'tarjeta',       60000.00, '2026-05-01', NULL, 30),
-- Grupo 3 (alumnos 31-45)
(31, 'efectivo',      45000.00, '2026-01-01', NULL, 31),
(32, 'transferencia', 45000.00, '2026-01-01', 'TRF-011-ENE', 32),
(33, 'tarjeta',       45000.00, '2026-01-01', NULL, 33),
(34, 'efectivo',      35000.00, '2026-02-01', NULL, 34),
(35, 'transferencia', 35000.00, '2026-02-01', 'TRF-012-FEB', 35),
(36, 'tarjeta',       35000.00, '2026-02-01', NULL, 36),
(37, 'efectivo',      80000.00, '2026-03-01', NULL, 37),
(38, 'transferencia', 80000.00, '2026-03-01', 'TRF-013-MAR', 38),
(39, 'tarjeta',       80000.00, '2026-03-01', NULL, 39),
(40, 'efectivo',      60000.00, '2026-04-01', NULL, 40),
(41, 'transferencia', 60000.00, '2026-04-01', 'TRF-014-ABR', 41),
(42, 'tarjeta',       60000.00, '2026-04-01', NULL, 42),
(43, 'efectivo',      45000.00, '2026-05-01', NULL, 43),
(44, 'transferencia', 45000.00, '2026-05-01', 'TRF-015-MAY', 44),
(45, 'tarjeta',       45000.00, '2026-05-01', NULL, 45),
-- Grupo 4 (alumnos 46-60)
(46, 'efectivo',      35000.00, '2026-01-15', NULL, 46),
(47, 'transferencia', 35000.00, '2026-01-15', 'TRF-016-ENE', 47),
(48, 'tarjeta',       35000.00, '2026-01-15', NULL, 48),
(49, 'efectivo',      45000.00, '2026-02-15', NULL, 49),
(50, 'transferencia', 45000.00, '2026-02-15', 'TRF-017-FEB', 50),
(51, 'tarjeta',       45000.00, '2026-02-15', NULL, 51),
(52, 'efectivo',      60000.00, '2026-03-01', NULL, 52),
(53, 'transferencia', 60000.00, '2026-03-01', 'TRF-018-MAR', 53),
(54, 'tarjeta',       60000.00, '2026-03-01', NULL, 54),
(55, 'efectivo',      80000.00, '2026-04-01', NULL, 55),
(56, 'transferencia', 80000.00, '2026-04-01', 'TRF-019-ABR', 56),
(57, 'tarjeta',       80000.00, '2026-04-01', NULL, 57),
(58, 'efectivo',      35000.00, '2026-05-15', NULL, 58),
(59, 'transferencia', 35000.00, '2026-05-15', 'TRF-020-MAY', 59),
(60, 'tarjeta',       35000.00, '2026-05-15', NULL, 60),
-- Grupo 5 (alumnos 61-75)
(61, 'efectivo',      80000.00, '2026-01-15', NULL, 61),
(62, 'transferencia', 80000.00, '2026-01-15', 'TRF-021-ENE', 62),
(63, 'tarjeta',       80000.00, '2026-01-15', NULL, 63),
(64, 'efectivo',      60000.00, '2026-03-15', NULL, 64),
(65, 'transferencia', 60000.00, '2026-03-15', 'TRF-022-MAR', 65),
(66, 'tarjeta',       60000.00, '2026-03-15', NULL, 66),
(67, 'efectivo',      45000.00, '2026-04-15', NULL, 67),
(68, 'transferencia', 45000.00, '2026-04-15', 'TRF-023-ABR', 68),
(69, 'tarjeta',       45000.00, '2026-04-15', NULL, 69),
(70, 'efectivo',      35000.00, '2026-05-01', NULL, 70),
(71, 'transferencia', 35000.00, '2026-05-01', 'TRF-024-MAY', 71),
(72, 'tarjeta',       35000.00, '2026-05-01', NULL, 72),
(73, 'efectivo',      80000.00, '2026-05-01', NULL, 73),
(74, 'transferencia', 80000.00, '2026-05-01', 'TRF-025-MAY', 74),
(75, 'tarjeta',       80000.00, '2026-05-01', NULL, 75);
ALTER TABLE Detalle_Pago AUTO_INCREMENT = 76;

INSERT INTO Membrecia (id_membrecia, fecha_inicio, fecha_fin, estado, id_alumno, id_pago, id_tipo_membrecia, id_grupo) VALUES
-- Grupo 1 (alumnos 1-15, grupo 1)
(1,  '2026-01-01', '2026-01-30', 'vencida', 1,  1,  1, 1),
(2,  '2026-01-01', '2026-01-30', 'vencida', 2,  2,  1, 1),
(3,  '2026-01-01', '2026-01-30', 'vencida', 3,  3,  1, 1),
(4,  '2026-02-01', '2026-03-02', 'vencida', 4,  4,  2, 1),
(5,  '2026-02-01', '2026-03-02', 'vencida', 5,  5,  2, 1),
(6,  '2026-02-01', '2026-03-02', 'vencida', 6,  6,  2, 1),
(7,  '2026-03-01', '2026-03-15', 'vencida', 7,  7,  3, 1),
(8,  '2026-03-01', '2026-03-15', 'vencida', 8,  8,  3, 1),
(9,  '2026-03-01', '2026-03-15', 'vencida', 9,  9,  3, 1),
(10, '2026-04-01', '2026-04-15', 'vencida', 10, 10, 4, 1),
(11, '2026-04-01', '2026-04-15', 'vencida', 11, 11, 4, 1),
(12, '2026-04-01', '2026-04-15', 'vencida', 12, 12, 4, 1),
(13, '2026-05-01', '2026-05-30', 'activa',  13, 13, 1, 1),
(14, '2026-05-01', '2026-05-30', 'activa',  14, 14, 1, 1),
(15, '2026-05-01', '2026-05-30', 'activa',  15, 15, 1, 1),
-- Grupo 2 (alumnos 16-30, grupo 2)
(16, '2026-01-01', '2026-01-30', 'vencida', 16, 16, 2, 2),
(17, '2026-01-01', '2026-01-30', 'vencida', 17, 17, 2, 2),
(18, '2026-01-01', '2026-01-30', 'vencida', 18, 18, 2, 2),
(19, '2026-02-01', '2026-03-02', 'vencida', 19, 19, 1, 2),
(20, '2026-02-01', '2026-03-02', 'vencida', 20, 20, 1, 2),
(21, '2026-02-01', '2026-03-02', 'vencida', 21, 21, 1, 2),
(22, '2026-03-01', '2026-03-15', 'vencida', 22, 22, 4, 2),
(23, '2026-03-01', '2026-03-15', 'vencida', 23, 23, 4, 2),
(24, '2026-03-01', '2026-03-15', 'vencida', 24, 24, 4, 2),
(25, '2026-04-01', '2026-04-15', 'vencida', 25, 25, 3, 2),
(26, '2026-04-01', '2026-04-15', 'vencida', 26, 26, 3, 2),
(27, '2026-04-01', '2026-04-15', 'vencida', 27, 27, 3, 2),
(28, '2026-05-01', '2026-05-30', 'activa',  28, 28, 2, 2),
(29, '2026-05-01', '2026-05-30', 'activa',  29, 29, 2, 2),
(30, '2026-05-01', '2026-05-30', 'activa',  30, 30, 2, 2),
-- Grupo 3 (alumnos 31-45, grupo 3)
(31, '2026-01-01', '2026-01-15', 'vencida', 31, 31, 3, 3),
(32, '2026-01-01', '2026-01-15', 'vencida', 32, 32, 3, 3),
(33, '2026-01-01', '2026-01-15', 'vencida', 33, 33, 3, 3),
(34, '2026-02-01', '2026-02-15', 'vencida', 34, 34, 4, 3),
(35, '2026-02-01', '2026-02-15', 'vencida', 35, 35, 4, 3),
(36, '2026-02-01', '2026-02-15', 'vencida', 36, 36, 4, 3),
(37, '2026-03-01', '2026-03-30', 'vencida', 37, 37, 1, 3),
(38, '2026-03-01', '2026-03-30', 'vencida', 38, 38, 1, 3),
(39, '2026-03-01', '2026-03-30', 'vencida', 39, 39, 1, 3),
(40, '2026-04-01', '2026-04-30', 'vencida', 40, 40, 2, 3),
(41, '2026-04-01', '2026-04-30', 'vencida', 41, 41, 2, 3),
(42, '2026-04-01', '2026-04-30', 'vencida', 42, 42, 2, 3),
(43, '2026-05-01', '2026-05-15', 'vencida', 43, 43, 3, 3),
(44, '2026-05-01', '2026-05-15', 'vencida', 44, 44, 3, 3),
(45, '2026-05-01', '2026-05-15', 'vencida', 45, 45, 3, 3),
-- Grupo 4 (alumnos 46-60, grupo 4)
(46, '2026-01-15', '2026-01-29', 'vencida', 46, 46, 4, 4),
(47, '2026-01-15', '2026-01-29', 'vencida', 47, 47, 4, 4),
(48, '2026-01-15', '2026-01-29', 'vencida', 48, 48, 4, 4),
(49, '2026-02-15', '2026-02-28', 'vencida', 49, 49, 3, 4),
(50, '2026-02-15', '2026-02-28', 'vencida', 50, 50, 3, 4),
(51, '2026-02-15', '2026-02-28', 'vencida', 51, 51, 3, 4),
(52, '2026-03-01', '2026-03-30', 'vencida', 52, 52, 2, 4),
(53, '2026-03-01', '2026-03-30', 'vencida', 53, 53, 2, 4),
(54, '2026-03-01', '2026-03-30', 'vencida', 54, 54, 2, 4),
(55, '2026-04-01', '2026-04-30', 'vencida', 55, 55, 1, 4),
(56, '2026-04-01', '2026-04-30', 'vencida', 56, 56, 1, 4),
(57, '2026-04-01', '2026-04-30', 'vencida', 57, 57, 1, 4),
(58, '2026-05-15', '2026-05-29', 'activa',  58, 58, 4, 4),
(59, '2026-05-15', '2026-05-29', 'activa',  59, 59, 4, 4),
(60, '2026-05-15', '2026-05-29', 'activa',  60, 60, 4, 4),
-- Grupo 5 (alumnos 61-75, grupo 5)
(61, '2026-01-15', '2026-02-13', 'vencida', 61, 61, 1, 5),
(62, '2026-01-15', '2026-02-13', 'vencida', 62, 62, 1, 5),
(63, '2026-01-15', '2026-02-13', 'vencida', 63, 63, 1, 5),
(64, '2026-03-15', '2026-04-13', 'vencida', 64, 64, 2, 5),
(65, '2026-03-15', '2026-04-13', 'vencida', 65, 65, 2, 5),
(66, '2026-03-15', '2026-04-13', 'vencida', 66, 66, 2, 5),
(67, '2026-04-15', '2026-04-29', 'vencida', 67, 67, 3, 5),
(68, '2026-04-15', '2026-04-29', 'vencida', 68, 68, 3, 5),
(69, '2026-04-15', '2026-04-29', 'vencida', 69, 69, 3, 5),
(70, '2026-05-01', '2026-05-15', 'vencida', 70, 70, 4, 5),
(71, '2026-05-01', '2026-05-15', 'vencida', 71, 71, 4, 5),
(72, '2026-05-01', '2026-05-15', 'vencida', 72, 72, 4, 5),
(73, '2026-05-01', '2026-05-30', 'activa',  73, 73, 1, 5),
(74, '2026-05-01', '2026-05-30', 'activa',  74, 74, 1, 5),
(75, '2026-05-01', '2026-05-30', 'activa',  75, 75, 1, 5);
ALTER TABLE Membrecia AUTO_INCREMENT = 76;

-- ======================================================
-- 6. CLASES (ene-may 2026)
-- Generadas desde Grupo_Horario con CTE recursiva
-- ======================================================
WITH RECURSIVE calendar AS (
    SELECT '2026-01-01' AS fecha
    UNION ALL
    SELECT fecha + INTERVAL 1 DAY FROM calendar WHERE fecha < '2026-05-31'
)
INSERT INTO Clase (fecha_clase, hora_inicio, hora_fin, id_grupo, estado)
SELECT c.fecha, gh.hora_inicio, gh.hora_fin, gh.id_grupo,
       CASE WHEN c.fecha < CURDATE() THEN 'realizada' ELSE 'pendiente' END
FROM calendar c
CROSS JOIN Grupo_Horario gh
WHERE gh.dia_semana = DAYOFWEEK(c.fecha) - 1
  AND c.fecha BETWEEN '2026-01-01' AND '2026-05-31'
ORDER BY c.fecha, gh.id_grupo;

-- ======================================================
-- 7. ASISTENCIA
-- Para cada alumno con membresía, registra asistencia
-- en las clases de su grupo durante el período de la membresía
-- ======================================================
INSERT INTO Asistencia (observacion, presente, es_recuperacion, id_clase, id_alumno)
SELECT
    CASE
        WHEN RAND() < 0.20 THEN 'Llegó tarde'
        WHEN RAND() < 0.35 THEN 'Se retiró temprano'
        WHEN RAND() < 0.40 THEN 'Falta justificada'
        ELSE NULL
    END,
    CASE WHEN RAND() < 0.75 THEN 1 ELSE 0 END,
    CASE WHEN RAND() < 0.08 THEN 1 ELSE 0 END,
    c.id_clase,
    m.id_alumno
FROM Membrecia m
JOIN Clase c ON c.id_grupo = m.id_grupo
WHERE c.fecha_clase BETWEEN m.fecha_inicio AND COALESCE(m.fecha_fin, DATE_ADD(m.fecha_inicio, INTERVAL 30 DAY))
  AND c.fecha_clase <= CURDATE()
  AND c.estado = 'realizada';
