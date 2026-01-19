<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "./BBDD/BD.php";
require_once "./BBDD/connection.php";

abrirConexion();
crearBaseDatosSiNoExiste();
session_start();

if (isset($_POST['action'])) {
    switch ($_POST['action']) {
        case 'revisarSesion':
            revisarSesion();
            break;
        case 'login':
            login();
            break;
        case 'cerrarSesion':
            cerrarSesion();
            break;
        case 'obtenerConfiguracion':
            validarRol(['organizador', 'participante']);
            obtenerConfiguracion();
            break;
        case 'actualizarDatosPreEvento':
            validarRol(['organizador']);
            actualizarDatosPreEvento();
            break;
        case 'actualizarDatosPostEvento':
            validarRol(['organizador']);
            actualizarDatosPostEvento();
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
        case 'obtenerCategorias':
            validarRol(['organizador']);
            obtenerCategoriasYSusPremios();
            break;
        case 'listarFinalistasNoGanadores':
            validarRol(['organizador']);
            listarFinalistasNoGanadores();
            break;
        case 'asignarGanador':
            validarRol(['organizador']);
            asignarGanador();
            break;
        case 'desasignarGanador':
            validarRol(['organizador']);
            desasignarGanador();
            break;
        case 'obtenerCategoriasConPremios':
            validarRol(['organizador']);
            obtenerCategoriasConPremios();
            break;

        case 'agregarCategoriaConPremios':
            validarRol(['organizador']);
            agregarCategoriaConPremios();
            break;

        case 'editarCategoriaConPremios':
            validarRol(['organizador']);
            editarCategoriaConPremios();
            break;

        case 'eliminarCategoria':
            validarRol(['organizador']);
            eliminarCategoria();
            break;
        case 'actualizarEdicion':
            validarRol(['organizador']);
            actualizarEdicion();
            break;
        case 'enviarEdicionAAnteriores':
            validarRol(['organizador']);
            enviarEdicionAAnteriores();
            break;
        case 'listarNoticias':
            validarRol(['organizador']);
            listarNoticias();
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

function cerrarSesion()
{
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
function verificarUsuario($tabla, $columnaId, $identificador, $password, $idEntidad)
{
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
function login()
{
    $numIdentidad = $_POST['numExpediente'] ?? '';
    $password = $_POST['password'] ?? '';
    $idEntidad = null;

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
function validarRol($rolesPermitidos)
{
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
 * Obtener configuración, archivos de la edición actual, y datos de la edición actual
 */
function obtenerConfiguracion()
{
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
    $sqlEdicion = "SELECT id_edicion as idEdicion, anio_edicion as anioEdicion, resumen_evento as resumenEvento, fecha_envio_email_informativo as fechaEnvioEmailInformativo, fecha_borrado_datos as fechaBorradoDatos
                    FROM edicion WHERE tipo = 'actual' LIMIT 1";
    $resultadoEdicion = $conexion->query($sqlEdicion);
    $edicionActual = null;
    if ($resultadoEdicion && $resultadoEdicion->num_rows > 0) {
        $edicionActual = $resultadoEdicion->fetch_assoc();
        $edicionActual['nroParticipantes'] = contarParticipantesEdicionActual();
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
 * Actualiza datos de pre-evento
 */
function actualizarDatosPreEvento()
{
    global $conexion;

    $fechaActual = date("d/m/Y H:i");

    $sqlUpdateModo = "UPDATE configuracion SET valor = 'pre-evento' WHERE nombre = 'modo'";
    $sqlUpdatePreEventoTitulo = "UPDATE configuracion SET valor = ? WHERE nombre = 'galaPreEventoTitulo'";
    $sqlUpdatePreEventoFecha = "UPDATE configuracion SET valor = ? WHERE nombre = 'galaPreEventoFecha'";
    $sqlUpdatePreEventoHora = "UPDATE configuracion SET valor = ? WHERE nombre = 'galaPreEventoHora'";
    $sqlUpdatePreEventoUbicacion = "UPDATE configuracion SET valor = ? WHERE nombre = 'galaPreEventoUbicacion'";
    $sqlUpdatePreEventoDescripcion = "UPDATE configuracion SET valor = ? WHERE nombre = 'galaPreEventoDescripcion'";
    $sqlUpdatePreEventoStreamingActivo = "UPDATE configuracion SET valor = ? WHERE nombre = 'galaPreEventoStreamingActivo'";
    $sqlUpdatePreEventoStreamingUrl = "UPDATE configuracion SET valor = ? WHERE nombre = 'galaPreEventoStreamingUrl'";
    $sqlUpdateFechaModificacion = "UPDATE configuracion SET valor = ? WHERE nombre = 'fechaUltimaModificacionConfiguracion'";

    $sqlUpdateModo = $conexion->prepare($sqlUpdateModo);
    $sqlUpdatePreEventoTitulo = $conexion->prepare($sqlUpdatePreEventoTitulo);
    $sqlUpdatePreEventoFecha = $conexion->prepare($sqlUpdatePreEventoFecha);
    $sqlUpdatePreEventoHora = $conexion->prepare($sqlUpdatePreEventoHora);
    $sqlUpdatePreEventoUbicacion = $conexion->prepare($sqlUpdatePreEventoUbicacion);
    $sqlUpdatePreEventoDescripcion = $conexion->prepare($sqlUpdatePreEventoDescripcion);
    $sqlUpdatePreEventoStreamingActivo = $conexion->prepare($sqlUpdatePreEventoStreamingActivo);
    $sqlUpdatePreEventoStreamingUrl = $conexion->prepare($sqlUpdatePreEventoStreamingUrl);
    $sqlUpdateFechaModificacion = $conexion->prepare($sqlUpdateFechaModificacion);


    $sqlUpdateModo->execute();
    $sqlUpdatePreEventoTitulo->bind_param("s", $_POST['galaPreEventoTitulo']);
    $sqlUpdatePreEventoTitulo->execute();
    $sqlUpdatePreEventoFecha->bind_param("s", $_POST['galaPreEventoFecha']);
    $sqlUpdatePreEventoFecha->execute();
    $sqlUpdatePreEventoHora->bind_param("s", $_POST['galaPreEventoHora']);
    $sqlUpdatePreEventoHora->execute();
    $sqlUpdatePreEventoUbicacion->bind_param("s", $_POST['galaPreEventoUbicacion']);
    $sqlUpdatePreEventoUbicacion->execute();
    $sqlUpdatePreEventoDescripcion->bind_param("s", $_POST['galaPreEventoDescripcion']);
    $sqlUpdatePreEventoDescripcion->execute();
    $sqlUpdatePreEventoStreamingActivo->bind_param("s", $_POST['galaPreEventoStreamingActivo']);
    $sqlUpdatePreEventoStreamingActivo->execute();
    $sqlUpdatePreEventoStreamingUrl->bind_param("s", $_POST['galaPreEventoStreamingUrl']);
    $sqlUpdatePreEventoStreamingUrl->execute();
    $sqlUpdateFechaModificacion->bind_param("s", $fechaActual);
    $sqlUpdateFechaModificacion->execute();

    echo json_encode([
        "status" => "success",
        "message" => "Proceso finalizado"
    ]);
}


/**
 * Actualiza datos de post-evento
 */
function actualizarDatosPostEvento()
{
    global $conexion;

    $resumenPostEvento = $_POST['resumenPostEvento'];
    $updateResumenSql = "UPDATE edicion SET resumen_evento = ? WHERE tipo = 'actual'";
    $stmtUpdateResumen = $conexion->prepare($updateResumenSql);
    $stmtUpdateResumen->bind_param("s", $resumenPostEvento);
    $stmtUpdateResumen->execute();

    $sqlUpdatModo = "UPDATE configuracion SET valor = 'post-evento' WHERE nombre = 'modo'";
    $stmtUpdateModo = $conexion->prepare($sqlUpdatModo);
    $stmtUpdateModo->execute();


    $archivos = json_decode($_POST['archivos'], true);
    if (count($archivos) > 0) {

        $idEdicion = obtenerIdEdicionActual();
        $stmtDel = $conexion->prepare("DELETE FROM edicion_archivos WHERE id_edicion = ?");
        $stmtDel->bind_param("i", $idEdicion);
        $stmtDel->execute();

        $stmtInsertRel = $conexion->prepare("INSERT INTO edicion_archivos (id_archivo, id_edicion) VALUES (?, ?)");

        foreach ($archivos as $idArchivo) {
            $idArchivoInt = (int)$idArchivo;
            $stmtInsertRel->bind_param("ii", $idArchivoInt, $idEdicion);
            $stmtInsertRel->execute();
        }
    }

    echo json_encode(["status" => "success", "message" => "Galería actualizada"]);
}

function obtenerIdEdicionActual()
{
    global $conexion;

    $query = "SELECT id_edicion FROM edicion WHERE tipo = 'actual' LIMIT 1";
    $result = $conexion->query($query);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return (int)$row['id_edicion'];
    }

    return null;
}


/**
 * Subir archivo, guardar en carpeta, guardar en BD y devolver id
 * Si es publico lo guarda en ./../uploads/public/
 * Si es privado lo guarda en ./../uploads/private/
 * Por defecto se guardaa de manera publica
 */
function subirArchivo()
{
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
function eliminarArchivoPorId($idArchivo)
{
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
function actualizarGaleriaEdicionActual()
{
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
function listarCandidaturas()
{
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
function listarPatrocinadores()
{
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
function agregarPatrocinador()
{
    global $conexion;

    $nombre = strtoupper($_POST['nombre']);
    $idArchivoLogo = (int) $_POST['idArchivoLogo'];

    // validar patrocinador no existe con ese nombre
    $queryCheck = "SELECT id_patrocinador FROM patrocinador WHERE UPPER(nombre) = ?";
    $stmtCheck = $conexion->prepare($queryCheck);
    $stmtCheck->bind_param("s", $nombre);
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
function actualizarPatrocinador()
{
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
function eliminarPatrocinador()
{
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
function obtenerBaseUrl()
{
    global $conexion;

    $query = "SELECT valor FROM configuracion WHERE nombre = 'baseUrl' LIMIT 1";
    $result = $conexion->query($query);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['valor'];
    }

    return null;
}

/**
 * Obtener categorías y sus premios asociados
 */
function obtenerCategoriasYSusPremios()
{
    global $conexion;

    $queryCategorias = "SELECT * FROM categoria";
    $resultCategorias = $conexion->query($queryCategorias);

    $categorias = [];
    while ($categoria = $resultCategorias->fetch_assoc()) {
        $idCategoria = $categoria['id_categoria'];

        $queryPremios = "SELECT c.id_categoria as idCategoria, p.id_premio as idPremio, p.nombre as nombrePremio, p.cantidad_dinero as cantidadDinero, IF(pm.id_candidatura IS NOT NULL, 1, 0) as tieneGanador, pa.nombre as nombreGanador, pm.id_candidatura as idCandidaturaGanador 
            FROM categoria c 
            RIGHT JOIN premio p on p.id_categoria = c.id_categoria
            LEFT JOIN premio_candidatura pm on pm.id_premio = p.id_premio
            LEFT JOIN candidatura ca on ca.id_candidatura = pm.id_candidatura
            LEFT JOIN participante pa on pa.id_participante = ca.id_participante
            where c.id_categoria = ?";

        $stmtPremios = $conexion->prepare($queryPremios);
        $stmtPremios->bind_param("i", $idCategoria);
        $stmtPremios->execute();
        $resultPremios = $stmtPremios->get_result();

        $premios = [];
        while ($premio = $resultPremios->fetch_assoc()) {
            $premio['tieneGanador'] = $premio['tieneGanador'] == 1;
            $premios[] = $premio;
        }

        $categoria['premios'] = $premios;
        $categorias[] = $categoria;
    }

    echo json_encode([
        "status" => "success",
        "data" => $categorias
    ]);
}


/**
 * Listar finalistas que no son ganadores
 */
function listarFinalistasNoGanadores()
{
    global $conexion;

    $query = "SELECT c.id_candidatura as idCandidatura, c.sinopsis, c.estado, c.fecha_presentacion as fechaPresentacion, pc.nombre AS nombreParticipante, pc.correo as correoParticipante
              FROM candidatura c
              INNER JOIN participante pc ON c.id_participante = pc.id_participante
              INNER JOIN archivo a ON c.id_archivo_video = a.id_archivo
              WHERE c.estado = 'Finalista' AND c.id_candidatura NOT IN (
                  SELECT pm.id_candidatura
                  FROM premio_candidatura pm
              )";

    $stmt = $conexion->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();

    $finalistas = [];
    while ($row = $result->fetch_assoc()) {
        $finalistas[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "data" => $finalistas
    ]);
}

/**
 * Asignar ganador a un premio
 */
function asignarGanador()
{
    global $conexion;

    $idPremio = (int)$_POST['idPremio'];
    $idCandidatura = (int)$_POST['idCandidatura'];

    $stmt = $conexion->prepare("INSERT INTO premio_candidatura (id_premio, id_candidatura) VALUES (?, ?)");
    $stmt->bind_param("ii", $idPremio, $idCandidatura);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Ganador asignado correctamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al asignar el ganador"]);
    }
}

/**
 * Deasignar ganador de un premio
 */
function desasignarGanador()
{
    global $conexion;
    $idPremio = (int)$_POST['idPremio'];
    $idCandidatura = (int)$_POST['idCandidatura'];

    $stmt = $conexion->prepare("DELETE FROM premio_candidatura WHERE id_premio = ? AND id_candidatura = ?");
    $stmt->bind_param("ii", $idPremio, $idCandidatura);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Ganador desasignado correctamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al desasignar el ganador"]);
    }
}

/**
<<<<<<< HEAD
 * Obtener todas las categorías con sus premios
 */
function obtenerCategoriasConPremios()
{
    global $conexion;
    $queryCategorias = "SELECT * FROM categoria";
    $resultCategorias = $conexion->query($queryCategorias);

    $categorias = [];

    while ($categoria = $resultCategorias->fetch_assoc()) {
        $idCategoria = $categoria['id_categoria'];
        $queryPremios = "
            SELECT id_premio, nombre, incluye_dinero, cantidad_dinero
            FROM premio
            WHERE id_categoria = ?
        ";
        $stmt = $conexion->prepare($queryPremios);
        $stmt->bind_param("i", $idCategoria);
        $stmt->execute();
        $resultPremios = $stmt->get_result();

        $premios = [];
        while ($premio = $resultPremios->fetch_assoc()) {
            $premio['incluye_dinero'] = (bool)$premio['incluye_dinero'];
            $premios[] = $premio;
        }

        $categoria['premios'] = $premios;
        $categorias[] = $categoria;
    }

    echo json_encode([
        "status" => "success",
        "data" => $categorias
    ]);
}

/**
 * Agregar categoría con premios
 */
function agregarCategoriaConPremios()
{
    global $conexion;

    // Leer datos desde FormData
    $nombreCategoria = $_POST['nombreCategoria'] ?? null;
    $premios = isset($_POST['premios']) ? json_decode($_POST['premios'], true) : [];

    if (!$nombreCategoria || empty($premios)) {
        echo json_encode(["status" => "error", "message" => "Faltan datos"]);
        return;
    }

    $conexion->begin_transaction();

    try {
        $queryCategoria = "INSERT INTO categoria (nombre) VALUES (?)";
        $stmtCategoria = $conexion->prepare($queryCategoria);
        $stmtCategoria->bind_param("s", $nombreCategoria);
        if (!$stmtCategoria->execute()) throw new Exception("No se pudo agregar categoría");

        $idCategoria = $conexion->insert_id;
        $premiosInsertados = [];

        $queryPremio = "INSERT INTO premio (nombre, incluye_dinero, cantidad_dinero, id_categoria) VALUES (?, ?, ?, ?)";
        $stmtPremio = $conexion->prepare($queryPremio);

        foreach ($premios as $premio) {
            $nombre = $premio['nombre'];
            $incluye = isset($premio['incluye_dinero']) ? 1 : 0;
            $cantidad = $premio['cantidad_dinero'] ?? 0;

            $stmtPremio->bind_param("sidi", $nombre, $incluye, $cantidad, $idCategoria);
            if (!$stmtPremio->execute()) throw new Exception("No se pudo agregar premio: $nombre");

            $premiosInsertados[] = [
                "id_premio" => $conexion->insert_id,
                "nombre" => $nombre,
                "incluye_dinero" => (bool)$incluye,
                "cantidad_dinero" => $cantidad
            ];
        }

        $conexion->commit();

        echo json_encode([
            "status" => "success",
            "data" => [
                "id_categoria" => $idCategoria,
                "nombre" => $nombreCategoria,
                "premios" => $premiosInsertados
            ]
        ]);
    } catch (Exception $e) {
        $conexion->rollback();
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}

/**
 * Editar categoría con premios
 */
function editarCategoriaConPremios()
{
    global $conexion;

    $idCategoria = $_POST['idCategoria'] ?? null;
    $nombreCategoria = $_POST['nombreCategoria'] ?? null;
    $premios = isset($_POST['premios']) ? json_decode($_POST['premios'], true) : [];

    if (!$idCategoria || !$nombreCategoria || empty($premios)) {
        echo json_encode(["status" => "error", "message" => "Faltan datos"]);
        return;
    }

    $conexion->begin_transaction();

    try {
        $queryCategoria = "UPDATE categoria SET nombre = ? WHERE id_categoria = ?";
        $stmtCategoria = $conexion->prepare($queryCategoria);
        $stmtCategoria->bind_param("si", $nombreCategoria, $idCategoria);
        if (!$stmtCategoria->execute()) throw new Exception("Error al actualizar categoría");

        // Actualizar o insertar premios
        foreach ($premios as $premio) {
            $nombre = $premio['nombre'];
            $incluye = isset($premio['incluye_dinero']) ? 1 : 0;
            $cantidad = $premio['cantidad_dinero'] ?? 0;

            if (isset($premio['id_premio'])) {
                $idPremio = $premio['id_premio'];
                $queryUpdate = "UPDATE premio SET nombre = ?, incluye_dinero = ?, cantidad_dinero = ? WHERE id_premio = ? AND id_categoria = ?";
                $stmtUpdate = $conexion->prepare($queryUpdate);
                $stmtUpdate->bind_param("sidii", $nombre, $incluye, $cantidad, $idPremio, $idCategoria);
                if (!$stmtUpdate->execute()) throw new Exception("Error al actualizar premio: $nombre");
            } else {
                $queryInsert = "INSERT INTO premio (nombre, incluye_dinero, cantidad_dinero, id_categoria) VALUES (?, ?, ?, ?)";
                $stmtInsert = $conexion->prepare($queryInsert);
                $stmtInsert->bind_param("sidi", $nombre, $incluye, $cantidad, $idCategoria);
                if (!$stmtInsert->execute()) throw new Exception("Error al agregar premio: $nombre");
            }
        }

        $conexion->commit();

        echo json_encode([
            "status" => "success",
            "data" => [
                "id_categoria" => $idCategoria,
                "nombre" => $nombreCategoria,
                "premios" => $premios
            ]
        ]);
    } catch (Exception $e) {
        $conexion->rollback();
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}

/**
 * Eliminar categoría con premios
 */
function eliminarCategoria()
{
    global $conexion;

    $idCategoria = $_POST['id_categoria'] ?? null;
    if (!$idCategoria) {
        echo json_encode(["status" => "error", "message" => "No se recibió id_categoria"]);
        return;
    }

    $conexion->begin_transaction();

    try {
        $queryPremios = "DELETE FROM premio WHERE id_categoria = ?";
        $stmtPremios = $conexion->prepare($queryPremios);
        $stmtPremios->bind_param("i", $idCategoria);
        if (!$stmtPremios->execute()) throw new Exception("No se pudieron eliminar los premios");

        $queryCategoria = "DELETE FROM categoria WHERE id_categoria = ?";
        $stmtCategoria = $conexion->prepare($queryCategoria);
        $stmtCategoria->bind_param("i", $idCategoria);
        if (!$stmtCategoria->execute()) throw new Exception("No se pudo eliminar la categoría");

        $conexion->commit();

        echo json_encode(["status" => "success", "message" => "Categoría eliminada correctamente", "id_categoria_eliminada" => $idCategoria]);
    } catch (Exception $e) {
        $conexion->rollback();
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
    /*
         * Actualizar edición
 */
    function actualizarEdicion()
    {
        global $conexion;

        $idEdicion = (int) $_POST['idEdicion'];
        $anioEdicion = (int) $_POST['anioEdicion'];
        $resumenEvento = $_POST['resumenEvento'];
        $nroParticipantes = (int) $_POST['nroParticipantes'];
        $fechaEnvioEmailInformativo = $_POST['fechaEnvioEmailInformativo'];
        $fechaBorradoDatos = $_POST['fechaBorradoDatos'];

        $stmt = $conexion->prepare("UPDATE edicion SET anio_edicion = ?, resumen_evento = ?, nro_participantes = ?, fecha_envio_email_informativo = ?, fecha_borrado_datos = ? WHERE id_edicion = ?");
        $stmt->bind_param("isisss", $anioEdicion, $resumenEvento, $nroParticipantes, $fechaEnvioEmailInformativo, $fechaBorradoDatos, $idEdicion);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Edición actualizada correctamente"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al actualizar la edición"]);
        }
    }

    /**
     * Contar participantes de la edición actual
     */
    function contarParticipantesEdicionActual()
    {
        global $conexion;

        $nroParticipantes = 0;
        $nroParticipantesSql = "SELECT COUNT(*) as total FROM candidatura";
        $resultNroParticipantes = $conexion->query($nroParticipantesSql);
        if ($resultNroParticipantes && $row = $resultNroParticipantes->fetch_assoc()) {
            $nroParticipantes = (int)$row['total'];
        }
        return $nroParticipantes;
    }


/**
 * Enviar edicion actual a ediciones anteriores
 * Cambia el tipo de la edicion actual a 'anterior'
 * Mueve los ganadores a la tabla histórica ganadores_edicion
 * Elimina candidaturas no ganadoras, historial asociado y relaciones entre premios y candidaturas
 * en el orden correcto para mantener la integridad referencial
 * Crea una nueva edicion actual para el proximo año
 * Actualiza el modo a 'pre-evento'
 */
function enviarEdicionAAnteriores(){
    global $conexion;

        $idEdicionActual = obtenerIdEdicionActual();

        $anioEdicion = (int) $_POST['anioEdicion'];
        $fechaEnvioEmailInformativo = $_POST['fechaEnvioEmailInformativo'];
        $fechaBorradoDatos = $_POST['fechaBorradoDatos'];
        $nroParticipantes = contarParticipantesEdicionActual();


        $stmtTipo = $conexion->prepare("UPDATE edicion SET tipo = 'anterior', anio_edicion = ?, nro_participantes = ?, fecha_envio_email_informativo = ?, fecha_borrado_datos = ? WHERE tipo = 'actual'");
        $stmtTipo->bind_param("iiss", $anioEdicion, $nroParticipantes, $fechaEnvioEmailInformativo, $fechaBorradoDatos);

        if ($stmtTipo->execute()) {

            // mover de tabla premio_candidatura a tabla ganadores_edicion
            $queryGanadores = "SELECT c.id_candidatura, part.nombre AS nombreParticipante, cat.nombre AS categoria, p.nombre AS premio, c.id_archivo_video FROM premio_candidatura pc
                           INNER JOIN premio p ON pc.id_premio = p.id_premio
                           INNER JOIN categoria cat ON p.id_categoria = cat.id_categoria
                           INNER JOIN candidatura c ON pc.id_candidatura = c.id_candidatura
                           INNER JOIN participante part ON c.id_participante = part.id_participante";

            $resultGanadores = $conexion->query($queryGanadores);

            $stmtInsertGanador = $conexion->prepare("INSERT INTO ganadores_edicion (id_edicion, categoria, nombre, premio, id_archivo_video) VALUES (?, ?, ?, ?, ?)");

            // insertar cada ganador
            while ($ganador = $resultGanadores->fetch_assoc()) {
                $stmtInsertGanador->bind_param(
                    "isssi",
                    $idEdicionActual,
                    $ganador['categoria'],
                    $ganador['nombreParticipante'],
                    $ganador['premio'],
                    $ganador['id_archivo_video']
                );
                $stmtInsertGanador->execute();
            }

        // eliminar historial_candidatura y candidaturas no ganadores
        $eliminarHistorialSql = "DELETE hc FROM historial_candidatura hc
                             INNER JOIN candidatura c ON hc.id_candidatura = c.id_candidatura
                             LEFT JOIN premio_candidatura pc ON c.id_candidatura = pc.id_candidatura
                             WHERE pc.id_candidatura IS NULL";

            $conexion->query($eliminarHistorialSql);

        // eliminar candidaturas no ganadores
        $eliminarCandidaturasSql = "DELETE c FROM candidatura c
                                    LEFT JOIN premio_candidatura pc ON c.id_candidatura = pc.id_candidatura
                                    WHERE pc.id_candidatura IS NULL";
            $conexion->query($eliminarCandidaturasSql);

        // eliminar premios asociados a candidaturas
        $eliminarPremiosSql = "DELETE pc FROM premio_candidatura pc
                              INNER JOIN candidatura c ON pc.id_candidatura = c.id_candidatura";
        $conexion->query($eliminarPremiosSql);


            // crear nueva edicion actual del proximo año
            $nuevoAnioEdicion = $anioEdicion + 1;
            $nuevoResumen = 'Resumen del año ' . $nuevoAnioEdicion;
            $stmtNuevaEdicion = $conexion->prepare("INSERT INTO edicion (anio_edicion, resumen_evento, nro_participantes, fecha_envio_email_informativo, fecha_borrado_datos, tipo, id_organizador) VALUES (?, ?, 0, CURDATE(), CURDATE(), 'actual', 1)");
            $stmtNuevaEdicion->bind_param("is", $nuevoAnioEdicion, $nuevoResumen);
            $stmtNuevaEdicion->execute();

            // actualizar modo a pre-evento
            $stmtModo = $conexion->prepare("UPDATE configuracion SET valor = 'pre-evento' WHERE nombre = 'modo'");
            $stmtModo->execute();

            echo json_encode(["status" => "success", "message" => "Edición enviada a anteriores correctamente"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al enviar la edición a anteriores"]);
        }
    }

/**
 * Listar noticias
 */
function listarNoticias(){
    global $conexion;

    $query = "SELECT n.id_noticia as idNoticia, n.nombre as nombreNoticia, n.descripcion as descripcionNoticia,
                n.fecha as fechaNoticia, a.ruta as rutaImagenNoticia
              FROM noticia n
              LEFT JOIN archivo a ON n.id_archivo_imagen = a.id_archivo ORDER BY n.fecha DESC";

    $stmt = $conexion->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();

    $noticias = [];
    while ($row = $result->fetch_assoc()) {
        $noticias[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "data" => $noticias
    ]);
}




    cerrarConexion();
}
