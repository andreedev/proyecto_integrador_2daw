<?php

function abrirConexion() {
    global $conexion;

    $servidor = $_ENV['DB_SERVER'];
    $usuario  = $_ENV['DB_USER'];
    $password = $_ENV['DB_PASS'];
    $port     = $_ENV['DB_PORT'];

    $conexion = new mysqli($servidor, $usuario, $password, null, $port);

    if ($conexion->connect_error) {
        if (php_sapi_name() !== 'cli') {
            header("Content-Type: application/json; charset=UTF-8");
        }
        echo json_encode(["status" => "error", "message" => "Error de servidor: " . $conexion->connect_error]);
        exit;
    }
}

function seleccionarBaseDatos() {
    global $conexion;
    $db = $_ENV['DB_NAME'] ?? "festival_cortos";
    return $conexion->select_db($db);
}

function cerrarConexion() {
    global $conexion;
    if (isset($conexion) && $conexion instanceof mysqli) {
        $conexion->close();
    }
}