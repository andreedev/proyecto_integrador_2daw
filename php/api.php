<?php
require_once "./BBDD/conection.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

abrirConexion();
seleccionarBaseDatos();

global $conexion;

session_start();

global $conexion;

if(isset($_POST['action'])){
    switch($_POST['action']){
        case 'revisarSesion':
            revisarSesionIniciada();
            break;
        case 'login':
            loginPHP();
            break;
        case 'cerrarSesion':
            cerrarSesion(); 
            break;
        default:
            break;
    }
}

function revisarSesionIniciada(){

}


function loginPHP(){
    global $conexion;

    $usuario = $_POST['usuario'];
    $passwd = $_POST['passwd'];

    //cifrar la contraseña
    $hash = password_hash($passwd, PASSWORD_DEFAULT);

    $query = "SELECT"

}

function cerrarSesion(){
    session_unset();
    session_destroy();
    echo json_encode([
        "status" => "success",
        "message" => "Sesión cerrada correctamente"
    ]);
}
?>