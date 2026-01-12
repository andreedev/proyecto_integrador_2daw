<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "./BBDD/BD.php";
require_once "./BBDD/conection.php";

abrirConexion();

crearBaseDatosSiNoExiste();

session_start();

/**
 * Manejo de acciones enviadas por POST
 */
if(isset($_POST['action'])){
    switch($_POST['action']){
        case 'revisarSesion':
            revisarSesion();
            break;
        case 'login':
            login();
            break;
        case 'cerrarSesion':
            cerrarSesion(); 
            break;
        case 'obtenerConfiguracionWeb':
            validarRol(['organizador', 'participante']);
            obtenerConfiguracionWeb();
            break;
        case 'actualizarConfiguracionWeb':
            validarRol(['organizador']);
            actualizarConfiguracionWeb();
            break;
        default:
            break;
    }
}


/**
 * Funcion para revisar si la sesión está iniciada
 */
function revisarSesion()
{
    if (!isset($_SESSION['iniciada']) || $_SESSION['iniciada'] !== true) {
        echo json_encode([
            "status" => "inactive",
        ]);
        return;
    }

    echo json_encode([
        "status" => "active",
        "rol" => $_SESSION['rol'] ?? '',
        "id" => $_SESSION['id'] ?? ''
    ]);
}

/**
 * Intenta validar las credenciales en una tabla específica
 */
function verificarUsuario($tabla, $columnaId, $identificador, $password, $idEntidad) {
    global $conexion;

    $query = "SELECT * FROM $tabla WHERE $columnaId = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("s", $identificador);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado && $resultado->num_rows > 0) {
        $usuario = $resultado->fetch_assoc();
        if (password_verify($password, $usuario['contrasena'])) {
            if ($tabla === 'participante') {
                $idEntidad = $usuario['id_participante'];
            } elseif ($tabla === 'organizador') {
                $idEntidad = $usuario['id_organizador'];
            }
            return $usuario;
        }
    }
    return false;
}

/**
 * Función principal de inicio de sesión
 * Intenta autenticar al usuario como Participante o Organizador
 */
function login() {
    $numIdentidad = $_POST['numExpediente'] ?? '';
    $password = $_POST['password'] ?? '';
    $idEntidad=null;

    if (empty($numIdentidad) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "Faltan datos de inicio de sesión"]);
        return;
    }

    // Intentar como Participante
    $datos = verificarUsuario('participante', 'nro_expediente', $numIdentidad, $password, $idEntidad);
    $rol = 'participante';
    $redirect = './index.html';

    // Intentar como Organizador
    if (!$datos) {
        $datos = verificarUsuario('organizador', 'nro_empresa', $numIdentidad, $password, $idEntidad);
        $rol = 'organizador';
        $redirect = './admin-candidaturas.html';
    }

    if ($datos) {
        $_SESSION['iniciada'] = true;
        $_SESSION['rol'] = $rol;
        $_SESSION['id'] = $idEntidad;

        echo json_encode([
            "status" => "success",
            "message" => "Sesión iniciada como $rol, redireccionando...",
            "redirect" => $redirect
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Usuario o contraseña incorrectos"
        ]);
    }
}


/**
 * Valida si el rol de la sesión actual está permitido
 */
function validarRol($rolesPermitidos) {
    if (!isset($_SESSION['iniciada']) || $_SESSION['iniciada'] !== true) {
        echo json_encode([
            "status" => "error",
            "message" => "Sesión no iniciada"
        ]);
        exit;
    }

    if (!in_array($_SESSION['rol'], $rolesPermitidos)) {
        echo json_encode([
            "status" => "error",
            "message" => "Acceso denegado para el rol actual"
        ]);
        exit;
    }
}

function obtenerConfiguracionWeb(){
    global $conexion;

    $query = "SELECT nombre, valor FROM configuracion";
    $resultado = $conexion->query($query);
    $configuracion = [];
    if ($resultado && $resultado->num_rows > 0) {
        while ($fila = $resultado->fetch_assoc()) {
            $configuracion[$fila['nombre']] = $fila['valor'];
        }
    }
    echo json_encode([
        "status" => "success",
        "data" => $configuracion
    ]);
}

function actualizarConfiguracionWeb(){
    global $conexion;

    $configuracion = $_POST['configuracion'] ?? null;

    echo json_encode([
        "status" => "success",
        "message" => "Configuración actualizada correctamente"
    ]);
}

function cerrarSesion(){
    session_unset();
    session_destroy();
    echo json_encode([
        "status" => "success",
        "message" => "Sesión cerrada correctamente"
    ]);
}


cerrarConexion();