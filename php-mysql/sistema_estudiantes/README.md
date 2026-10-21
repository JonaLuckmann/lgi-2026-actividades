# Sistema académico

Sistema web para gestionar notas. Los docentes cargan y editan notas
(parciales y recuperatorios) y los estudiantes ven sus calificaciones.

## Tecnologías

- PHP (lógica del servidor)
- MySQL / MariaDB (con PDO)
- HTML y CSS

Sin frameworks ni librerías externas.

## Funcionalidades

- Inicio de sesión con DNI o correo electrónico.
- Panel docente: registrar alumnos en materias, cargar y editar notas,
  cálculo automático de la nota regular (si hay recuperatorio reemplaza
  al parcial), buscar alumnos y eliminar registros.
- Panel estudiante: ver sus notas y el promedio general.

## Estructura

```text
index.php                  entrada: login y redirección según rol
acciones/                  crear, actualizar y borrar registros
logout.php
config/database.php        conexión a MySQL con PDO
includes/header.php        cabecera común
includes/footer.php        pie común
vistas/login.php
vistas/dashboard_docente.php
vistas/dashboard_estudiante.php
css/estilos.css
js/app.js
```

## Cómo usarlo

1. Copiar la carpeta dentro de `htdocs` (XAMPP) o `/var/www/html` (Linux).
2. Crear la base `sistema_estudiantes` e importar `sql/sistema_estudiantes.sql`.
3. Copiar `config/database.example.php` a `config/database.php` y completar los datos.
4. Abrir `http://localhost/sistema_estudiantes/`.

Según el rol del usuario se muestra el panel de docente (edición) o el de
estudiante (solo visualización).
