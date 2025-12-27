<?php
$servidor = "localhost";
$usuario = "root";
$password = "";
$db = "festival_cortos";


function abrirConexion(){
    global $conexion, $servidor, $usuario, $password, $db;
    
    $conexion = new mysqli($servidor,$usuario,$password,$db);
    // Verifica conexión
    if ($conexion->connect_error) {
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode(["status" => "error", "message" => "Conexión fallida: " . $conexion->connect_error]);
        exit;
    }
}

function seleccionarBaseDatos(){
    global $conexion, $db;
    $conexion->select_db($db);
}

function cerrarConexion(){
    global $conexion;
    $conexion->close();
}

?>