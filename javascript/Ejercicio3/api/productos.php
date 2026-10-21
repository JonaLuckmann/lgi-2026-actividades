<?php

$productos = [

    [
        "id" => 1,
        "nombre" => "Mouse",
        "precio" => 15000
    ],

    [
        "id" => 2,
        "nombre" => "Teclado",
        "precio" => 25000
    ],

    [
        "id" => 3,
        "nombre" => "Monitor",
        "precio" => 180000
    ],

    [
        "id" => 4,
        "nombre" => "Auriculares",
        "precio" => 30000
    ]

];

header("Content-Type: application/json");

echo json_encode($productos);

?>
