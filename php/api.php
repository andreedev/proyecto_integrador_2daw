<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "./BBDD/BD.php";
require_once "./BBDD/connection.php";

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
        case 'listarCandidaturas':
            validarRol(['organizador', 'participante']);
            listarCandidaturas();
            break;
        case 'listarPatrocinadores':
            validarRol(['organizador', 'participante']);
            listarPatrocinadores();
            break;
        case 'agregarPatrocinador':
            validarRol(['organizador']);
            agregarPatrocinador();
            break;
        case 'actualizarPatrocinador':
            validarRol(['organizador']);
            actualizarPatrocinador();
            break;
        case 'eliminarPatrocinador':
            validarRol(['organizador']);
            eliminarPatrocinador();
            break;
        default:
            break;
    }
}

/**
 * Revisa si la sesión está iniciada y devuelve el estado
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

function cerrarSesion(){
    session_unset();
    session_destroy();
    echo json_encode([
        "status" => "success",
        "message" => "Sesión cerrada correctamente"
    ]);
}

/**
 * Verifica las credenciales de un usuario en la tabla especificada
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
 * Iniciar sesión como Participante u Organizador
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
 * Valida que el rol sea uno de los permitidos
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

/**
 * Obtener configuración web y archivos de la edición actual
 */
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

/**
 * Actualiza los parámetros de configuración web
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
 * Subir archivo, guardar en carpeta, guardar en BD y devolver id
 * Si es publico lo guarda en ./../uploads/public/
 * Si es privado lo guarda en ./../uploads/private/
 * Por defecto se guardaa de manera publica
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
                "data" => [
                    "idArchivo" => $idArchivo,
                    "rutaRelativa" => $rutaRelativa
                ]
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

/**
 * Eliminar archivo por id, solo si no hay otras referencias a él
 * Omite la eliminación del archivo físico si hay otras referencias
 *
 */
function eliminarArchivoPorId($idArchivo) {
    global $conexion;

    $stmt = $conexion->prepare("SELECT ruta FROM archivo WHERE id_archivo = ?");
    $stmt->bind_param("i", $idArchivo);
    $stmt->execute();
    $archivoData = $stmt->get_result()->fetch_assoc();

    if (!$archivoData) return false;

    $ruta = $archivoData['ruta'];
    $rutaAbsoluta = __DIR__ . '/..' . $ruta;

    $stmtCheck = $conexion->prepare("SELECT COUNT(*) as total FROM archivo WHERE ruta = ? AND id_archivo != ?");
    $stmtCheck->bind_param("si", $ruta, $idArchivo);
    $stmtCheck->execute();
    $totalOtrasRutas = $stmtCheck->get_result()->fetch_assoc()['total'];

    try {
        $stmtDel = $conexion->prepare("DELETE FROM archivo WHERE id_archivo = ?");
        $stmtDel->bind_param("i", $idArchivo);

        if ($stmtDel->execute()) {
            if ((int)$totalOtrasRutas === 0) {
                if (file_exists($rutaAbsoluta)) {
                    unlink($rutaAbsoluta);
                }
            }
            return true;
        }
    } catch (Throwable $e) {
        // Omisión: si hay una restricción de clave foránea (FK)
        return false;
    }

    return false;
}

/**
 * Elimina todos los archivos de una edición actual y los vuelve a insertar según el array recibido
 */
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

/**
 * Incompleto
 */
function listarCandidaturas(){
    global $conexion;

    $query = "SELECT c.id_candidatura as idCandidatura, c.sinopsis, c.estado, c.fecha_presentacion as fechaPresentacion, c.fecha_ultima_modificacion as fechaUltimaModificacion, a.ruta AS ruta_archivo_video as rutaArchivoVideo, pc.nombre AS nombre_participante, pc.correo as correoParticipante
              FROM candidatura c
              INNER JOIN participante pc ON c.id_participante = pc.id_participante
              INNER JOIN archivo a ON c.id_archivo_video = a.id_archivo";

    $stmt = $conexion->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();

    $candidaturas = [];
    while ($row = $result->fetch_assoc()) {
        $candidaturas[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "data" => $candidaturas
    ]);
}

/**
 * Listar patrocinadores con su logo
 * Agrega la URL base de archivos a la ruta del logo
 */
function listarPatrocinadores(){
    global $conexion;

    $query = "SELECT p.id_patrocinador as idPatrocinador, p.nombre as nombrePatrocinador, a.ruta as rutaArchivoLogo, a.id_archivo as idArchivoLogo FROM patrocinador p LEFT JOIN archivo a ON p.id_archivo_logo = a.id_archivo";

    $stmt = $conexion->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();

    $baseUrl = obtenerBaseUrl();
    $patrocinadores = [];
    while ($row = $result->fetch_assoc()) {
        $row['rutaArchivoLogo'] = $baseUrl . $row['rutaArchivoLogo'];
        $patrocinadores[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "data" => $patrocinadores
    ]);
}

/**
 * Agregar un nuevo patrocinador
 * Verifica que no exista otro con el mismo nombre
 */
function agregarPatrocinador(){
    global $conexion;

    $nombre = $_POST['nombre'] ?? '';
    $idArchivoLogo =(int) $_POST['idArchivoLogo'];

    // validar patrocinador no existe con ese nombre
    $queryCheck = "SELECT id_patrocinador FROM patrocinador WHERE UPPER(nombre) = ?";
    $stmtCheck = $conexion->prepare($queryCheck);
    $stmtCheck->bind_param("s", strtoupper($nombre));
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();
    if ($resultCheck && $resultCheck->num_rows > 0) {
        echo json_encode([
            "status" => "error",
            "message" => "Ya existe un patrocinador con ese nombre"
        ]);
        return;
    }

    $stmt = $conexion->prepare("INSERT INTO patrocinador (nombre, id_archivo_logo) VALUES (?, ?)");
    $stmt->bind_param("si", $nombre, $idArchivoLogo);
    $stmt->execute();

    if ($stmt->affected_rows === 0) {
        echo json_encode([
            "status" => "error",
            "message" => "Error al agregar el patrocinador"
        ]);
        return;
    }

    echo json_encode([
        "status" => "success",
        "message" => "Patrocinador agregado correctamente"
    ]);
}


/**
 * Actualizar patrocinador
 * Maneja la lógica de no duplicar archivos si la ruta es la misma
 */
function actualizarPatrocinador() {
    global $conexion;

    $idPatrocinador = (int) $_POST['idPatrocinador'];
    $nombre = $_POST['nombre'];
    $idArchivoNuevo = (int) $_POST['idArchivoLogo'];

    $idLogoAnterior = null;
    $stmtLogo = $conexion->prepare("SELECT id_archivo_logo FROM patrocinador WHERE id_patrocinador = ?");
    $stmtLogo->bind_param("i", $idPatrocinador);
    $stmtLogo->execute();
    $res = $stmtLogo->get_result();
    if ($row = $res->fetch_assoc()) {
        $idLogoAnterior = (int)$row['id_archivo_logo'];
    }

    if ($idLogoAnterior !== null && $idLogoAnterior !== $idArchivoNuevo) {
        $stmtRutas = $conexion->prepare("
            SELECT 
                (SELECT ruta FROM archivo WHERE id_archivo = ?) as rutaVieja,
                (SELECT ruta FROM archivo WHERE id_archivo = ?) as rutaNueva
        ");
        $stmtRutas->bind_param("ii", $idLogoAnterior, $idArchivoNuevo);
        $stmtRutas->execute();
        $rutas = $stmtRutas->get_result()->fetch_assoc();

        if ($rutas['rutaVieja'] === $rutas['rutaNueva']) {
            $conexion->query("DELETE FROM archivo WHERE id_archivo = $idArchivoNuevo");
            $idArchivoNuevo = $idLogoAnterior;
            $idLogoAnterior = null;
        }
    }

    $stmt = $conexion->prepare("UPDATE patrocinador SET nombre = ?, id_archivo_logo = ? WHERE id_patrocinador = ?");
    $stmt->bind_param("sii", $nombre, $idArchivoNuevo, $idPatrocinador);

    if ($stmt->execute()) {
        // Solo eliminamos el anterior si realmente es un archivo distinto
        if ($idLogoAnterior !== null && $idLogoAnterior !== $idArchivoNuevo) {
            eliminarArchivoPorId($idLogoAnterior);
        }
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al actualizar"]);
    }
}

/**
 * Eliminar un patrocinador
 */
function eliminarPatrocinador(){
    global $conexion;
    $idPatrocinador = (int) $_POST['idPatrocinador'];

    $stmt = $conexion->prepare("SELECT id_archivo_logo FROM patrocinador WHERE id_patrocinador = ?");
    $stmt->bind_param("i", $idPatrocinador);
    $stmt->execute();
    $idArchivo = $stmt->get_result()->fetch_assoc()['id_archivo_logo'] ?? null;

    $stmtDel = $conexion->prepare("DELETE FROM patrocinador WHERE id_patrocinador = ?");
    $stmtDel->bind_param("i", $idPatrocinador);

    if ($stmtDel->execute()) {
        if ($idArchivo) {
            eliminarArchivoPorId($idArchivo);
        }
        echo json_encode(["status" => "success", "message" => "Patrocinador eliminado"]);
    } else {
        echo json_encode(["status" => "error"]);
    }
}

/**
 * Obtener la baseUrl desde la configuración
 * Esto se usa para construir las URLs completas de los archivos
 */
function obtenerBaseUrl(){
    global $conexion;

    $query = "SELECT valor FROM configuracion WHERE nombre = 'baseUrl' LIMIT 1";
    $result = $conexion->query($query);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['valor'];
    }

    return null;
}


cerrarConexion();