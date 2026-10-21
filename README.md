# LGI 2026 — Actividades de PHP, HTML, CSS y JavaScript

Repositorio de entrega de las actividades de la materia.

- **Alumno:** JonaLuckmann
- **Materia:** LGI 2026
- **Profesor:** Profesor de PHP

## Contenido

| Carpeta | Actividad | Tecnologías |
|---|---|---|
| `php-mysql/sistema_estudiantes/` | Sistema académico con login, roles docente/estudiante y carga de notas | PHP, MySQL, PDO, HTML, CSS |
| `php-mysql/sistema_estudiantes-v1/` | Primera versión del sistema académico (para ver la evolución) | PHP, MySQL, PDO |
| `php-mysql/aula_clara_api/` | Integración de API JSON para guardar notas sin recargar la página | PHP, MySQL, JSON, JavaScript |
| `javascript/Ejercicio1/` | Ejercicio de formulario y procesamiento con JavaScript | HTML, CSS, JS, PHP |
| `javascript/Ejercicio2/` | ABM de estudiantes con búsqueda y promedio | HTML, CSS, JS, PHP |
| `javascript/Ejercicio3/` | ABM de productos | HTML, CSS, JS, PHP |
| `unidad2/` | Ejercicio de Git | PHP |

## Cómo probarlo

1. Copiar cada carpeta dentro del directorio que sirve Apache (`/var/www/html` o `htdocs`).
2. Crear la base `sistema_estudiantes` e importar `sql/sistema_estudiantes.sql`.
3. Copiar `config/database.example.php` a `config/database.php` y completar usuario y clave.
4. Abrir en el navegador la carpeta correspondiente, por ejemplo:
   `http://localhost/php-mysql/sistema_estudiantes/`

## Configuración

Los archivos `config/database.php` **no se suben** al repositorio porque contienen credenciales.
Cada proyecto incluye `config/database.example.php` con los datos de ejemplo.

## Notas

- La API del aula conserva la comparación directa de contraseña del código original.
  Para un entorno real conviene usar `password_hash()` y `password_verify()`.
- Las fechas de entrega de cada actividad están en `HISTORIAL.md`.
