<?php
require_once "./BBDD/BD.php";
require_once "./BBDD/conection.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

abrirConexion();
seleccionarBaseDatos();

session_start();

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

/**
 * Función para iniciar sesión en la aplicación
 */
function loginPHP(){
    global $conexion;

    $numExpediente = $_POST['numExpediente'];
    $passwd = $_POST['password'];

    $query = "SELECT * FROM participante WHERE nro_expediente = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("s", $numExpediente);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if(!$resultado){
        echo json_encode([
            "status" => "error",
            "message" => "Error en la consulta a la base de datos"
        ]);
        return;
    }

    if($resultado->num_rows > 0){
        $fila = $resultado->fetch_assoc();
        $hash_guardado = $fila['contrasena'];

        //verificar la contraseña
        if(password_verify($passwd, $hash_guardado)){
            $_SESSION['iniciada'] = true;
            $_SESSION['usuario'] = $numExpediente;

            echo json_encode([
                "status" => "success",
                "message" => "Sesión iniciada con éxito, redireccionando..."
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Usuario o contraseña incorrectos"
            ]);
        }
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Usuario o contraseña incorrectos"
        ]);
    }


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