<?php

$datos = json_decode(file_get_contents("php://input"), true);

$respuesta = [
    "mensaje" => "Alumno recibido correctamente",
    "alumno" => [
        "nombre" => $datos["nombre"],
        "edad" => $datos["edad"],
        "carrera" => $datos["carrera"]
    ]
];

header("Content-Type: application/json");

echo json_encode($respuesta);

?>