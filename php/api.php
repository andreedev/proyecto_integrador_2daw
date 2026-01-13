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
        case 'procesarGaleriaPostEvento':
            validarRol(['organizador']);
            procesarGaleriaPostEvento();
            break;
        case 'subirArchivo':
            validarRol(['organizador', 'participante']);
            subirArchivo();
            break;
        case 'borrarArchivo':
            validarRol(['organizador', 'participante']);
            borrarArchivo();
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
 * Cerrar sesión
 */
function cerrarSesion(){
    session_unset();
    session_destroy();
    echo json_encode([
        "status" => "success",
        "message" => "Sesión cerrada correctamente"
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

    $sqlConfig = "SELECT nombre, valor FROM configuracion";
    $resultConfig = $conexion->query($sqlConfig);

    $config = [];
    $baseUrl = '';

    while ($row = $resultConfig->fetch_assoc()) {
        $config[$row['nombre']] = $row['valor'];
        if ($row['nombre'] === 'baseUrl') {
            $baseUrl = $row['valor'];
        }
    }

    $sqlGallery = "SELECT orden, tipo, ruta FROM post_evento_archivos ORDER BY orden ASC";
    $resultGallery = $conexion->query($sqlGallery);

    $galeriaImagenesPostEvento = [];
    $galeriaVideosPostEvento = [];

    while ($item = $resultGallery->fetch_assoc()) {
        $urlCompleta = $baseUrl . $item['ruta'];

        if ($item['tipo'] === 'imagen') {
            $galeriaImagenesPostEvento[] = $urlCompleta;
        } else {
            $galeriaVideosPostEvento[] = [
                "url" => $urlCompleta,
                "orden" => $item['orden']
            ];
        }
    }

    $configuracionCompleta = [
        "galeriaImagenesPostEvento" => $galeriaImagenesPostEvento,
        "galeriaVideosPostEvento" => $galeriaVideosPostEvento,
        "configuracion" => $config
    ];

    echo json_encode([
        "status" => "success",
        "data" => $configuracionCompleta
    ]);
}

/**
 * Actualiza la configuración web
 */
function actualizarConfiguracionWeb(){
    global $conexion;

    $camposPermitidos = [
        'modo',
        'minCandidaturas',
        'maxCandidaturas',
        'galaProximaFecha',
        'galaPreEventoTitulo',
        'galaPreEventoFecha',
        'galaPreEventoHora',
        'galaPreEventoUbicacion',
        'galaPreEventoDescripcion',
        'galaPreEventoStreamingActivo',
        'galaPreEventoStreamingUrl',
        'galaPostEventoResumen'
    ];

    try {
        $stmt = $conexion->prepare("UPDATE configuracion SET valor = ? WHERE nombre = ?");
        $actualizados = 0;

        foreach ($camposPermitidos as $campo) {
            if (isset($_POST[$campo])) {
                $valor = $_POST[$campo];

                $stmt->bind_param("ss", $valor, $campo);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    $actualizados++;
                }
            }
        }

        // Actualizar la fecha de última modificación si hubo cambios
        if($actualizados > 0){
            $stmtFecha = $conexion->prepare("UPDATE configuracion SET valor = ? WHERE nombre = ?");
            $fechaActual = date("d/m/Y H:i");
            $nombreCampoFecha = 'fechaUltimaModificacionConfiguracion';

            $stmtFecha->bind_param("ss", $fechaActual, $nombreCampoFecha);
            $stmtFecha->execute();
        }

        echo json_encode([
            "status" => "success",
            "message" => "Proceso finalizado",
            "camposActualizados" => $actualizados
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Error: " . $e->getMessage()
        ]);
    }
}

/**
 * Guarda un archivo en la tabla post_evento_archivos
 */
function procesarGaleriaPostEvento(){
    global $conexion;

    try{
        $conexion->query("TRUNCATE TABLE post_evento_archivos");

        if (!isset($_POST['archivos'])){
            echo json_encode(["status" => "error", "message" => "Faltan datos de archivos"]);
            return;
        }

        $archivos = json_decode($_POST['archivos'], true);

        $stmt = $conexion->prepare("INSERT INTO post_evento_archivos (tipo, ruta, orden) VALUES (?, ?, ?)");

        foreach ($archivos as $archivo) {
            $tipo = $archivo['tipo'];
            $ruta = $archivo['ruta'];
            $orden = $archivo['orden'];
            $stmt->bind_param("ssi", $tipo, $ruta, $orden);
            $stmt->execute();
        }

        echo json_encode([
            "status" => "success",
            "message" => "Galería actualizada correctamente"
        ]);

    } catch (Exception $e){
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Error en el servidor: " . $e->getMessage()
        ]);
    }
}

/**
 * Subir archivo, guardar en carpeta y devolver ruta
 * Si es publico lo guarda en ./../uploads/public/
 * Si es privado lo guarda en ./../uploads/private/
 */
function subirArchivo(){
    $privado = isset($_POST['privado']) && $_POST['privado'] === 'true';
    $directorioSubida = $privado ? './../uploads/private/' : './../uploads/public/';

    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {

        $fileTmpPath = $_FILES['file']['tmp_name'];
        $fileName = $_FILES['file']['name'];
        $fileSize = $_FILES['file']['size'];
        $fileType = $_FILES['file']['type'];

        // Crear el directorio si no existe
        if (!is_dir($directorioSubida)) {
            mkdir($directorioSubida, 0777, true);
        }

        $rutaArchivo = $directorioSubida . '_' . basename($fileName);


        if (move_uploaded_file($fileTmpPath, $rutaArchivo)) {
            $rutaRelativa = str_replace('./..', '', $rutaArchivo);

            echo json_encode([
                "status" => "success",
                "message" => "Archivo subido correctamente",
                "rutaArchivo" => $rutaRelativa
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al mover el archivo subido"]);
        }
    } else {
        $errorCode = $_FILES['file']['error'] ?? 'No file uploaded';
        echo json_encode([
            "status" => "error",
            "message" => "Error en la subida del archivo: " . $errorCode
        ]);
    }
}

function borrarArchivo(){
    $rutaArchivo = $_POST['rutaArchivo'] ?? '';

    if (empty($rutaArchivo)) {
        echo json_encode(["status" => "error", "message" => "Falta la ruta del archivo"]);
        return;
    }

    $rutaAbsoluta = __DIR__ . '/..' . $rutaArchivo;

    if (file_exists($rutaAbsoluta)) {
        if (unlink($rutaAbsoluta)) {
            echo json_encode(["status" => "success", "message" => "Archivo borrado"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al borrar el archivo"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "El archivo no existe"]);
    }
}


cerrarConexion();