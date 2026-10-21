# Aula Clara — integración de API JSON

## Qué se integró
- El docente modifica notas desde la tabla.
- `js/app.js` envía los datos como JSON con `fetch()` y método `POST`.
- `api/guardar_matriz.php` lee el JSON, comprueba sesión/rol/pertenencia de la planilla, valida las notas y actualiza MySQL.
- La API devuelve JSON con `ok`, `mensaje` y `nota_regular`; la interfaz muestra el resultado sin recargar la página.
- Crear planilla y borrar siguen usando el flujo PHP tradicional.

## Estructura esperada
La carpeta contiene `index.php`, `config/`, `vistas/`, `includes/`, `css/`, `js/`, `acciones/` y `api/`.

## Puesta en marcha
1. Configurá `config/database.php` con los datos reales de tu MySQL.
2. Colocá la carpeta dentro del directorio servido por Apache/PHP (por ejemplo, `htdocs/aula_clara_api` en XAMPP).
3. Verificá que la base `sistema_estudiantes` tenga las tablas y columnas que el proyecto ya utiliza: `usuarios`, `materias`, `estudiantes` y `docente_materia`.
4. Abrí `http://localhost/aula_clara_api/` (ajustá la ruta al nombre de tu carpeta).
5. Iniciá sesión como docente, editá una o más notas y pulsá **Guardar**. La fila queda resaltada hasta guardar; luego aparece la confirmación y se actualiza la nota regular.

## Flujo
Navegador (JavaScript) → `POST` JSON → `api/guardar_matriz.php` → MySQL → respuesta JSON → mensaje en la página.

## Importante
Este paquete conserva la consulta de inicio de sesión original, que compara la contraseña directamente con la columna `password`. Para una instalación real conviene usar `password_hash()` y `password_verify()` y revisar los permisos de base de datos. No se incluye un volcado SQL porque no se adjuntó el esquema completo.
