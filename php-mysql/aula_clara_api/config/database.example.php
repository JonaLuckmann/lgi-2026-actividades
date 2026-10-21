<?php
// Copiar este archivo como config/database.php y completar los datos reales.
// El archivo database.php no se sube al repositorio.
$host = 'localhost';
$db   = 'sistema_estudiantes';
$user = 'TU_USUARIO';
$pass = 'TU_CLAVE';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8mb4",
        $user,
        $pass
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $error) {
    http_response_code(500);
    error_log($error->getMessage());
    die('No se pudo conectar con la base de datos. Revisa la configuración.');
}
