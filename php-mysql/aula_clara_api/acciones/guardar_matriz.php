<?php
session_start();
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_SESSION['usuario_id'])) {
    header('Location: ../index.php');
    exit;
}

$rol = strtolower(trim($_SESSION['rol'] ?? ''));
if (!in_array($rol, ['docente', 'profesor'], true)) {
    http_response_code(403);
    exit('No tenés permiso para realizar esta acción.');
}

$prof_id = (int)$_SESSION['usuario_id'];
$accion = $_POST['accion'] ?? '';

if ($accion === 'crear') {
    $alum_id = filter_input(INPUT_POST, 'estudiante_id', FILTER_VALIDATE_INT);
    $asig = trim($_POST['nombre_materia'] ?? '');
    $cuat = $_POST['cuatrimestre'] ?? '1er Cuatrimestre';

    if ($alum_id && $asig !== '') {
        $stmt = $pdo->prepare(
            'INSERT INTO materias (estudiante_id, docente_id, nombre_materia, cuatrimestre) VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([$alum_id, $prof_id, $asig, $cuat]);
    }
}

if ($accion === 'borrar' && isset($_POST['materia_id'])) {
    $stmt = $pdo->prepare('DELETE FROM materias WHERE id=? AND docente_id=?');
    $stmt->execute([(int)$_POST['materia_id'], $prof_id]);
}

header('Location: ../index.php');
exit;
