<?php
$servidor = "localhost";
$usuario = "root";
$password = "";
$db = "festival_cortos";


$conexion = new mysqli($servidor,$usuario,$password,$db);
// Verifica conexión
if ($conn->connect_error) {
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode(["status" => "error", "message" => "Conexión fallida: " . $conn->connect_error]);
    exit;
}

?>