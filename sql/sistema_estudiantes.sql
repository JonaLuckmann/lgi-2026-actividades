-- phpMyAdmin SQL Dump
-- version 5.2.3deb1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 21-10-2026 a las 17:18:00
-- Versión del servidor: 11.8.6-MariaDB-5ubuntu0.1 from Ubuntu
-- Versión de PHP: 8.5.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistema_estudiantes`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docente_materia`
--

CREATE TABLE `docente_materia` (
  `id` int(11) NOT NULL,
  `docente_id` int(11) NOT NULL,
  `nombre_materia` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `docente_materia`
--

INSERT INTO `docente_materia` (`id`, `docente_id`, `nombre_materia`) VALUES
(1, 1, 'Programación Web'),
(2, 1, 'Bases de Datos'),
(3, 4, 'Sistemas Operativos'),
(4, 4, 'Redes de Computadoras'),
(5, 5, 'Análisis de Sistemas'),
(6, 5, 'Diseño de Software');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiantes`
--

CREATE TABLE `estudiantes` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `estudiantes`
--

INSERT INTO `estudiantes` (`id`, `nombre`, `apellido`, `email`, `fecha_nacimiento`, `activo`) VALUES
(2, 'Ana', 'Gómez', 'ana@email.com', '2001-05-15', 1),
(3, 'Luis', 'Martínez', 'luis@email.com', '2000-08-20', 1),
(6, 'Sofía', 'Fernández', 'sofia@email.com', '2002-03-10', 1),
(7, 'Mateo', 'Benítez', 'mateo@email.com', '2001-11-05', 1),
(8, 'Lucía', 'Romero', 'lucia@email.com', '2000-01-25', 1),
(9, 'Tomas', 'Silva', 'tomas@email.com', '2002-07-18', 1);

-- --------------------------------------------------------

--

--
-- Estructura de tabla para la tabla `materias`
--

CREATE TABLE `materias` (
  `id` int(11) NOT NULL,
  `estudiante_id` int(11) NOT NULL,
  `docente_id` int(11) NOT NULL,
  `nombre_materia` varchar(100) NOT NULL,
  `cuatrimestre` varchar(20) DEFAULT '1er Cuatrimestre',
  `p1` decimal(4,2) DEFAULT NULL,
  `p2` decimal(4,2) DEFAULT NULL,
  `p3` decimal(4,2) DEFAULT NULL,
  `rec1` decimal(4,2) DEFAULT NULL,
  `rec2` decimal(4,2) DEFAULT NULL,
  `rec3` decimal(4,2) DEFAULT NULL,
  `global` decimal(4,2) DEFAULT NULL,
  `nota_regular` decimal(4,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `materias`
--

INSERT INTO `materias` (`id`, `estudiante_id`, `docente_id`, `nombre_materia`, `cuatrimestre`, `p1`, `p2`, `p3`, `rec1`, `rec2`, `rec3`, `global`, `nota_regular`) VALUES
(1, 7, 1, 'Programación Web', '1er Cuatrimestre', 4.00, 9.00, NULL, 2.00, NULL, NULL, NULL, 5.50),
(2, 7, 1, 'Bases de Datos', '1er Cuatrimestre', 6.00, 4.00, NULL, NULL, 5.00, NULL, NULL, 4.50),
(3, 7, 4, 'Sistemas Operativos', '1er Cuatrimestre', 8.00, 7.50, NULL, NULL, NULL, NULL, NULL, 7.75),
(4, 2, 1, 'Programación Web', '1er Cuatrimestre', 7.00, 8.00, NULL, NULL, NULL, NULL, NULL, 7.50),
(8, 6, 1, 'Bases de Datos', '2do Cuatrimestre', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(20) NOT NULL DEFAULT 'estudiante',
  `fecha_creacion` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `dni`, `nombre`, `email`, `password`, `rol`, `fecha_creacion`) VALUES
(1, '11111111', 'Prof. Carlos Rossi', 'profesor@email.com', '1234', 'docente', '2026-09-02 14:02:49'),
(2, '22222222', 'Ana Gómez', 'ana@email.com', '1234', 'estudiante', '2026-09-02 14:02:49'),
(3, '33333333', 'Luis Martínez', 'luis@email.com', '1234', 'estudiante', '2026-09-02 14:02:49'),
(4, '44444444', 'Dra. Elena Vega', 'elena@email.com', '1234', 'docente', '2026-09-02 14:02:49'),
(5, '55555555', 'Ing. Martin Paez', 'martin@email.com', '1234', 'docente', '2026-09-02 14:02:49'),
(6, '66666666', 'Sofía Fernández', 'sofia@email.com', '1234', 'estudiante', '2026-09-02 14:02:49'),
(7, '77777777', 'Mateo Benítez', 'mateo@email.com', '1234', 'estudiante', '2026-09-02 14:02:49'),
(8, '88888888', 'Lucía Romero', 'lucia@email.com', '1234', 'estudiante', '2026-09-02 14:02:49'),
(9, '99999999', 'Tomas Silva', 'tomas@email.com', '1234', 'estudiante', '2026-09-02 14:02:49');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `docente_materia`
--
ALTER TABLE `docente_materia`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD PRIMARY KEY (`id`);

--
