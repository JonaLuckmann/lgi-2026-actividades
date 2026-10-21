# Base de datos

Incluido: `sistema_estudiantes.sql`, con la estructura y datos de ejemplo
de las tablas que usa el sistema:

- `usuarios`: login y rol (docente/estudiante)
- `estudiantes`: datos de los alumnos
- `materias`: materias y notas
- `docente_materia`: relación docente-materia

## Importar

```bash
mariadb -u TU_USUARIO -p sistema_estudiantes < sistema_estudiantes.sql
```

Si la base no existe:

```sql
CREATE DATABASE sistema_estudiantes CHARACTER SET utf8mb4;
```

Los datos incluidos son de ejemplo (`@email.com`, contraseña `1234`).
No hay datos personales reales.

La tabla `java_estudiantes` se quitó de este volcado porque pertenece
al proyecto Java, no a la entrega de PHP.
