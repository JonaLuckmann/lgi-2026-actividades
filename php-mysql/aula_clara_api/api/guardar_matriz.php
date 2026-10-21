<?php
// Endpoint API: recibe JSON, valida la sesión y guarda notas en MySQL.
session_start();
header('Content-Type: application/json; charset=utf-8');

function responder(int $codigo, array $datos): void {
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    responder(405, ['ok' => false, 'mensaje' => 'Este endpoint acepta solicitudes POST.']);
}

if (!isset($_SESSION['usuario_id'])) {
    responder(401, ['ok' => false, 'mensaje' => 'La sesión venció. Iniciá sesión nuevamente.']);
}

$rol = strtolower(trim($_SESSION['rol'] ?? ''));
if (!in_array($rol, ['docente', 'profesor'], true)) {
    responder(403, ['ok' => false, 'mensaje' => 'No tenés permiso para modificar notas.']);
}

require_once __DIR__ . '/../config/database.php';

$contenido = file_get_contents('php://input');
$datos = json_decode($contenido, true);
if (!is_array($datos)) {
    responder(400, ['ok' => false, 'mensaje' => 'El cuerpo de la solicitud no contiene JSON válido.']);
}

$materia_id = filter_var($datos['materia_id'] ?? null, FILTER_VALIDATE_INT);
if (!$materia_id || $materia_id < 1) {
    responder(422, ['ok' => false, 'mensaje' => 'Falta un identificador de planilla válido.']);
}

$campos = ['p1', 'p2', 'p3', 'rec1', 'rec2', 'rec3'];
$notas = [];

foreach ($campos as $campo) {
    $valor = $datos[$campo] ?? null;
    if ($valor === '' || $valor === null) {
        $notas[$campo] = null;
        continue;
    }

    if (!is_numeric($valor)) {
        responder(422, ['ok' => false, 'mensaje' => "La nota $campo debe ser numérica."]);
    }

    $numero = (float)$valor;
    if ($numero < 1 || $numero > 10 || fmod($numero * 2, 1.0) !== 0.0) {
        responder(422, ['ok' => false, 'mensaje' => "La nota $campo debe estar entre 1 y 10, en incrementos de 0,5."]);
    }
    $notas[$campo] = $numero;
}

$prof_id = (int)$_SESSION['usuario_id'];

// Comprobar propiedad antes de actualizar: un docente no puede modificar
// una planilla que pertenezca a otro docente.
$comprobar = $pdo->prepare('SELECT id FROM materias WHERE id = ? AND docente_id = ?');
$comprobar->execute([$materia_id, $prof_id]);
if (!$comprobar->fetch()) {
    responder(404, ['ok' => false, 'mensaje' => 'No se encontró esa planilla para este docente.']);
}

// El recuperatorio reemplaza al parcial de la misma posición para el promedio.
$nota_1 = $notas['rec1'] ?? $notas['p1'];
$nota_2 = $notas['rec2'] ?? $notas['p2'];
$nota_3 = $notas['rec3'] ?? $notas['p3'];
$notas_validas = array_values(array_filter(
    [$nota_1, $nota_2, $nota_3],
    fn($nota) => $nota !== null
));
$nota_regular = count($notas_validas) > 0
    ? number_format(array_sum($notas_validas) / count($notas_validas), 2, '.', '')
    : null;

$actualizar = $pdo->prepare(
    'UPDATE materias
     SET p1 = ?, p2 = ?, p3 = ?, rec1 = ?, rec2 = ?, rec3 = ?, nota_regular = ?
     WHERE id = ? AND docente_id = ?'
);
$actualizar->execute([
    $notas['p1'], $notas['p2'], $notas['p3'],
    $notas['rec1'], $notas['rec2'], $notas['rec3'],
    $nota_regular, $materia_id, $prof_id
]);

responder(200, [
    'ok' => true,
    'mensaje' => 'Las notas se guardaron correctamente.',
    'materia_id' => $materia_id,
    'nota_regular' => $nota_regular
]);
