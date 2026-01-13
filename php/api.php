<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "./BBDD/BD.php";
require_once "./BBDD/conection.php";

abrirConexion();
crearBaseDatosSiNoExiste();
session_start();

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
        case 'actualizarGaleriaEdicionActual':
            validarRol(['organizador']);
            actualizarGaleriaEdicionActual();
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

function cerrarSesion(){
    session_unset();
    session_destroy();
    echo json_encode([
        "status" => "success",
        "message" => "Sesión cerrada correctamente"
    ]);
}

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

    $sqlGallery = "SELECT a.id_archivo, a.ruta 
                   FROM archivo a
                   INNER JOIN edicion_archivos ea ON a.id_archivo = ea.id_archivo
                   INNER JOIN edicion e ON ea.id_edicion = e.id_edicion
                   WHERE e.tipo = 'actual'
                   ORDER BY ea.id ASC";

    $resultGallery = $conexion->query($sqlGallery);

    $archivosPostEvento = [];
    $videoExtensions = ['mp4', 'webm', 'ogg', 'mov'];

    if ($resultGallery) {
        while ($item = $resultGallery->fetch_assoc()) {
            $idArchivo = $item['id_archivo'];
            $rutaRelativa = $item['ruta'];
            $ext = strtolower(pathinfo($rutaRelativa, PATHINFO_EXTENSION));

            $tipo = in_array($ext, $videoExtensions) ? 'video' : 'imagen';

            $archivosPostEvento[] = [
                "id" => $idArchivo,
                "url" => $baseUrl . $rutaRelativa,
                "ruta_relativa" => $rutaRelativa,
                "tipo" => $tipo
            ];
        }
    }

    // obtener datos de la edicion actual
    $sqlEdicion = "SELECT * FROM edicion WHERE tipo = 'actual' LIMIT 1";
    $resultadoEdicion = $conexion->query($sqlEdicion);
    $edicionActual = null;
    if ($resultadoEdicion && $resultadoEdicion->num_rows > 0) {
        $edicionActual = $resultadoEdicion->fetch_assoc();
    }

    $configuracionCompleta = [
        "archivosPostEvento" => $archivosPostEvento,
        "configuracion" => $config,
        "edicionActual" => $edicionActual
    ];

    echo json_encode([
        "status" => "success",
        "data" => $configuracionCompleta
    ]);
}

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
 * Subir archivo, guardar en carpeta, guardar en BD y devolver id
 * Si es publico lo guarda en ./../uploads/public/
 * Si es privado lo guarda en ./../uploads/private/
 */
function subirArchivo(){
    $privado = isset($_POST['privado']) && $_POST['privado'] === 'true';
    $directorioSubida = $privado ? './../uploads/private/' : './../uploads/public/';

    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {

        $fileTmpPath = $_FILES['file']['tmp_name'];
        $fileName = $_FILES['file']['name'];

        // Crear el directorio si no existe
        if (!is_dir($directorioSubida)) {
            mkdir($directorioSubida, 0777, true);
        }

        $rutaArchivo = $directorioSubida . '_' . basename($fileName);


        if (move_uploaded_file($fileTmpPath, $rutaArchivo)) {
            // Limpiar la ruta para almacenar en la base de datos
            $rutaRelativa = str_replace('./..', '', $rutaArchivo);
            $rutaAbsoluta = __DIR__ . '/..' . $rutaRelativa;

            global $conexion;
            $stmt = $conexion->prepare("INSERT INTO archivo (ruta) VALUES (?)");
            $stmt->bind_param("s", $rutaRelativa);
            $stmt->execute();
            $idArchivo = $stmt->insert_id;

            echo json_encode([
                "status" => "success",
                "message" => "Archivo subido correctamente",
                "id" => $idArchivo,
                "ruta" => $rutaRelativa
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
function actualizarGaleriaEdicionActual(){
    global $conexion;

    if (!isset($_POST['archivos'])) {
        echo json_encode(["status" => "error", "message" => "No se recibieron archivos"]);
        return;
    }

    $queryEdicion = "SELECT id_edicion FROM edicion WHERE tipo = 'actual' LIMIT 1";
    $resEdicion = $conexion->query($queryEdicion);

    if (!$resEdicion || $resEdicion->num_rows === 0) {
        echo json_encode(["status" => "error", "message" => "No se encontró una edición actual"]);
        return;
    }
    $idEdicion = $resEdicion->fetch_assoc()['id_edicion'];

    $stmtDel = $conexion->prepare("DELETE FROM edicion_archivos WHERE id_edicion = ?");
    $stmtDel->bind_param("i", $idEdicion);
    $stmtDel->execute();

    $archivos = json_decode($_POST['archivos'], true);

    if (count($archivos) > 0) {
        $stmtInsertRel = $conexion->prepare("INSERT INTO edicion_archivos (id_archivo, id_edicion) VALUES (?, ?)");

        foreach ($archivos as $archivo) {
            $idArchivo = $archivo['id'];
            if ($idArchivo) {
                $stmtInsertRel->bind_param("ii", $idArchivo, $idEdicion);
                $stmtInsertRel->execute();
            }
        }
    }

    echo json_encode(["status" => "success", "message" => "Galería actualizada"]);
}


cerrarConexion();