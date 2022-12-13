CREATE DATABASE IF NOT EXISTS escuela CHARACTER SET utf8 COLLATE utf8_general_ci;

USE escuela;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
USE escuela;
START TRANSACTION;
USE escuela;
SET time_zone = "+00:00";

USE escuela;

CREATE TABLE IF NOT EXISTS `alumnos` (
  `id` int PRIMARY KEY not null AUTO_INCREMENT,
  `nombres` text NOT NULL,
  `apellidos` text NOT NULL,
  `matricula` text NOT NULL,
  `promedio` float NOT NULL,
  `fotoPerfilUrl` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

USE escuela;

CREATE TABLE IF NOT EXISTS `profesores` (
  `id` int PRIMARY KEY not null AUTO_INCREMENT,
  `numeroEmpleado` int NOT NULL,
  `nombres` text NOT NULL,
  `apellidos` text NOT NULL,
  `horasClase` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;