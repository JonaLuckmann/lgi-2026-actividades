
<?php

session_start();
header("Content-Type: application/json; charset=utf-8");

if (!isset($_SESSION["estudiantes"])) {
    $_SESSION["estudiantes"] = [
        ["id" => 1, "nombre" => "Juan", "notas" => [7, 8, 6]],
        ["id" => 2, "nombre" => "Maria", "notas" => [4, 5, 6]],
        ["id" => 3, "nombre" => "Pedro", "notas" => [9, 8, 10]],
        ["id" => 4, "nombre" => "Lucia", "notas" => [6, 7, 8]],
        ["id" => 5, "nombre" => "Carlos", "notas" => [3, 4, 5]]
    ];
}

if (!isset($_SESSION["siguiente_id"])) {
    $ultimoId = 0;
    foreach ($_SESSION["estudiantes"] as $estudiante) {
        if (isset($estudiante["id"])) {
            $ultimoId = max($ultimoId, (int) $estudiante["id"]);
        }
    }
    foreach ($_SESSION["estudiantes"] as $indice => $estudiante) {
        if (!isset($estudiante["id"])) {
            $_SESSION["estudiantes"][$indice]["id"] = ++$ultimoId;
        }
    }
    $_SESSION["siguiente_id"] = $ultimoId + 1;
}

function validarDatosEstudiante($datos)
{
    if (!is_array($datos) || !is_string($datos["nombre"] ?? null)) {
        return false;
    }

    $nombre = trim($datos["nombre"]);
    $notas = $datos["notas"] ?? null;
    if ($nombre === "" || !is_array($notas) || count($notas) !== 3) {
        return false;
    }

    foreach ($notas as $nota) {
        if (!is_numeric($nota) || $nota < 0 || $nota > 10) {
            return false;
        }
    }

    return [
        "nombre" => $nombre,
        "notas" => array_map("floatval", $notas)
    ];
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $termino = trim($_GET["q"] ?? "");
    $estudiantes = $_SESSION["estudiantes"];

    if ($termino !== "") {
        $estudiantes = array_values(array_filter($estudiantes, function ($estudiante) use ($termino) {
            return stripos($estudiante["nombre"], $termino) !== false;
        }));
    }

    echo json_encode($estudiantes, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $datos = json_decode(file_get_contents("php://input"), true);
    $estudiante = validarDatosEstudiante($datos);
    if ($estudiante === false) {
        http_response_code(400);
        echo json_encode(["error" => "Indica un nombre y tres notas entre 0 y 10."], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $estudiante["id"] = $_SESSION["siguiente_id"]++;
    $_SESSION["estudiantes"][] = $estudiante;

    http_response_code(201);
    echo json_encode($estudiante, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "PUT") {
    $id = filter_var($_GET["id"] ?? null, FILTER_VALIDATE_INT);
    $datos = json_decode(file_get_contents("php://input"), true);
    $estudiante = validarDatosEstudiante($datos);

    if ($id === false || $id === null || $estudiante === false) {
        http_response_code(400);
        echo json_encode(["error" => "Indica un ID válido, un nombre y tres notas entre 0 y 10."], JSON_UNESCAPED_UNICODE);
        exit;
    }

    foreach ($_SESSION["estudiantes"] as $indice => $actual) {
        if ((int) $actual["id"] === $id) {
            $estudiante["id"] = $id;
            $_SESSION["estudiantes"][$indice] = $estudiante;
            echo json_encode($estudiante, JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    http_response_code(404);
    echo json_encode(["error" => "No se encontró el estudiante."], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $id = filter_var($_GET["id"] ?? null, FILTER_VALIDATE_INT);
    if ($id === false || $id === null) {
        http_response_code(400);
        echo json_encode(["error" => "Indica un ID válido."], JSON_UNESCAPED_UNICODE);
        exit;
    }

    foreach ($_SESSION["estudiantes"] as $indice => $estudiante) {
        if ((int) $estudiante["id"] === $id) {
            array_splice($_SESSION["estudiantes"], $indice, 1);
            echo json_encode(["mensaje" => "Estudiante eliminado."], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    http_response_code(404);
    echo json_encode(["error" => "No se encontró el estudiante."], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
header("Allow: GET, POST, PUT, DELETE");
echo json_encode(["error" => "Método no permitido."], JSON_UNESCAPED_UNICODE);
