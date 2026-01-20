<?php

/**
 * descomentar para probar localmente
 * comentar esto para probar en una BD compartida
 */
$servidor = "localhost";
$usuario = "root";
$password = "";
$db = "festival_cortos";
$port = 3306;

/**
 * comentar esto para probar localmente
 * descomentar esto para probar en una BD compartida
 */
//   $servidor = "proyecto-integrador-db-aereodb.c.aivencloud.com";
//   $usuario = "avnadmin";
//   $password = "AVNS_Lh2lXbxWC0nSTMynXuH";
//   $db = "festival_cortos";
//   $port = 20236;

function abrirConexion() {
    global $conexion, $servidor, $usuario, $password, $port;

    $conexion = new mysqli($servidor, $usuario, $password, null, $port);

    if ($conexion->connect_error) {
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode(["status" => "error", "message" => "Error de servidor: " . $conexion->connect_error]);
        exit;
    }
}

function seleccionarBaseDatos() {
    global $conexion, $db;
    return $conexion->select_db($db);
}

function cerrarConexion() {
    global $conexion;
    if ($conexion) { $conexion->close(); }
}