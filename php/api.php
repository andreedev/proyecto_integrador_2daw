<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "./BBDD/BD.php";
require_once "./BBDD/connection.php";
require_once "./model/EstadosCandidatura.php";

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
            subirArchivo();
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
            listarNoticias();
            break;
        case 'obtenerNoticiaPorId':
            obtenerNoticiaPorId();
            break;
        case 'crearNoticia':
            validarRol(['organizador', 'participante']);
            crearNoticia();
            break;
        case 'actualizarNoticia':
            validarRol(['organizador']);
            actualizarNoticia();
            break;
        case 'eliminarNoticia':
            validarRol(['organizador']);
            eliminarNoticia();
            break;
        case 'listarEventos':
            listarEventos();
            break;
        case 'obtenerEventoPorId':
            obtenerEventoPorId();
            break;
        case 'crearEvento':
            validarRol(['organizador', 'participante']);
            crearEvento();
            break;
        case 'actualizarEvento':
            validarRol(['organizador']);
            actualizarEvento();
            break;
        case 'eliminarEvento':
            validarRol(['organizador']);
            eliminarEvento();
            break;
        case 'listarCandidaturasAdmin':
            validarRol(['organizador']);
            listarCandidaturasAdmin();
            break;
        case 'actualizarEstadoCandidatura':
            validarRol(['organizador']);
            actualizarEstadoCandidatura();
            break;
        case 'obtenerBasesLegales':
            obtenerBasesLegales();
            break;
        case 'guardarCandidatura':
            guardarCandidatura();
            break;
        case 'obtenerHistorialCandidatura':
            validarRol(['organizador', 'participante']);
            obtenerHistorialCandidatura();
            break;
        case 'listarCandidaturasParticipante':
            validarRol(['participante']);
            listarCandidaturasParticipante();
            break;
        case 'obtenerDatosGala':
            obtenerDatosGala();
            break;
        case 'actualizarCandidatura':
            validarRol(['participante']);
            actualizarCandidatura();
            break;
        case 'obtenerDatosHome':
            obtenerDatosHome();
            break;
        case 'obtenerFechasEventoPorMesAnio':
            obtenerFechasEventoPorMesAnio();
            break;
        default:
            break;
    }
}

/**
 * Revisa si la sesión está iniciada y devuelve el estado
 */
function revisarSesion() {
    if (!isset($_SESSION['iniciada']) || $_SESSION['iniciada'] !== true) {
        echo json_encode(["status" => "inactive",]);
        return;
    }

    echo json_encode(["status" => "active", "rol" => $_SESSION['rol'] ?? '', "id" => $_SESSION['id'] ?? '']);
}

function cerrarSesion() {
    session_unset();
    session_destroy();
    echo json_encode(["status" => "success", "message" => "Sesión cerrada correctamente"]);
}

/**
 * Verifica las credenciales de un usuario en la tabla especificada
 */
function verificarUsuario($tabla, $columnaId, $identificador, $password) {
    global $conexion;

    $query = "SELECT * FROM $tabla WHERE $columnaId = ?";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("s", $identificador);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado && $resultado->num_rows > 0) {
        $usuario = $resultado->fetch_assoc();
        if (password_verify($password, $usuario['contrasena'])) {
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

    if (empty($numIdentidad) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "Faltan datos de inicio de sesión"]);
        return;
    }

    // Intentar como Participante
    $datos = verificarUsuario('participante', 'nro_expediente', $numIdentidad, $password);
    $rol = 'participante';
    $redirect = './index.html';

    // Intentar como Organizador
    if (!$datos) {
        $datos = verificarUsuario('organizador', 'nro_empresa', $numIdentidad, $password);
        $rol = 'organizador';
        $redirect = './admin-candidaturas.html';
    }

    if ($datos) {
        $_SESSION['iniciada'] = true;
        $_SESSION['rol'] = $rol;
        $_SESSION['id'] = $datos[$rol === 'participante' ? 'id_participante' : 'id_organizador'];

        echo json_encode(["status" => "success", "message" => "Sesión iniciada como $rol, redireccionando...", "redirect" => $redirect]);
    } else {
        echo json_encode(["status" => "error", "message" => "Usuario o contraseña incorrectos"]);
    }
}

/**
 * Valida que el rol sea uno de los permitidos
 */
function validarRol($rolesPermitidos) {
    if (!isset($_SESSION['iniciada']) || $_SESSION['iniciada'] !== true) {
        echo json_encode(["status" => "error", "message" => "Sesión no iniciada"]);
        exit;
    }

    if (!in_array($_SESSION['rol'], $rolesPermitidos)) {
        echo json_encode(["status" => "error", "message" => "Acceso denegado para el rol actual"]);
        exit;
    }
}

/**
 * Obtener configuración, archivos de la edición actual, y datos de la edición actual
 */
function obtenerConfiguracion() {
    global $conexion;

    $sqlConfig = "SELECT nombre, valor FROM configuracion";
    $stmtConfig = $conexion->prepare($sqlConfig);
    $stmtConfig->execute();
    $resultConfig = $stmtConfig->get_result();

    $config = [];
    $baseUrl = '';
    while ($row = $resultConfig->fetch_assoc()) {
        $config[$row['nombre']] = $row['valor'];
        if ($row['nombre'] === 'baseUrl') {
            $baseUrl = $row['valor'];
        }
    }
    $stmtConfig->close();

    $sqlGallery = "SELECT a.id_archivo, a.ruta 
                   FROM archivo a
                   INNER JOIN edicion_archivos ea ON a.id_archivo = ea.id_archivo
                   INNER JOIN edicion e ON ea.id_edicion = e.id_edicion
                   WHERE e.tipo = 'actual'
                   ORDER BY ea.id ASC";

    $stmtGallery = $conexion->prepare($sqlGallery);
    $stmtGallery->execute();
    $resultGallery = $stmtGallery->get_result();

    $archivosPostEvento = [];
    $videoExtensions = ['mp4', 'webm', 'ogg', 'mov'];

    if ($resultGallery) {
        while ($item = $resultGallery->fetch_assoc()) {
            $idArchivo = $item['id_archivo'];
            $rutaRelativa = $item['ruta'];
            $ext = strtolower(pathinfo($rutaRelativa, PATHINFO_EXTENSION));

            $tipo = in_array($ext, $videoExtensions) ? 'video' : 'imagen';

            $archivosPostEvento[] = ["id" => $idArchivo, "url" => $baseUrl . $rutaRelativa, "ruta_relativa" => $rutaRelativa, "tipo" => $tipo];
        }
    }
    $stmtGallery->close();

    $configuracionCompleta = [
        "archivosPostEvento" => $archivosPostEvento,
        "configuracion" => $config,
        "edicionActual" => obtenerEdicionActual()
    ];

    echo json_encode(["status" => "success", "data" => $configuracionCompleta]);
}

/**
 * Actualiza datos de pre-evento
 */
function actualizarDatosPreEvento() {
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

    echo json_encode(["status" => "success", "message" => "Proceso finalizado"]);
}


/**
 * Actualiza datos de post-evento
 */
function actualizarDatosPostEvento() {
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

/**
 * Obtener el id de la edición actual
 */
function obtenerIdEdicionActual() {
    global $conexion;

    $sql = "SELECT id_edicion FROM edicion WHERE tipo = ? LIMIT 1";
    $result = $conexion->execute_query($sql, ['actual']);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return (int)$row['id_edicion'];
    }

    return null;
}


/**
 * Subir archivo, guardar en directorio de archivos, guardar en BD y devolver id
 */
function subirArchivo() {
    $directorioSubida = './../uploads/public/';

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

            echo json_encode(["status" => "success", "message" => "Archivo subido correctamente", "data" => ["idArchivo" => $idArchivo, "rutaRelativa" => $rutaRelativa]]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al mover el archivo subido"]);
        }
    } else {
        $errorCode = $_FILES['file']['error'] ?? 'No file uploaded';
        echo json_encode(["status" => "error", "message" => "Error en la subida del archivo: " . $errorCode]);
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
 * Listar patrocinadores con su logo
 * Agrega la URL base de archivos a la ruta del logo
 */
function listarPatrocinadores() {
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

    echo json_encode(["status" => "success", "data" => $patrocinadores]);
}

/**
 * Agregar un nuevo patrocinador
 * Verifica que no exista otro con el mismo nombre
 */
function agregarPatrocinador() {
    global $conexion;

    $nombre = strtoupper($_POST['nombre']);
    $idArchivoLogo = (int)$_POST['idArchivoLogo'];

    // validar patrocinador no existe con ese nombre
    $queryCheck = "SELECT id_patrocinador FROM patrocinador WHERE UPPER(nombre) = ?";
    $stmtCheck = $conexion->prepare($queryCheck);
    $stmtCheck->bind_param("s", $nombre);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();
    if ($resultCheck && $resultCheck->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Ya existe un patrocinador con ese nombre"]);
        return;
    }

    $stmt = $conexion->prepare("INSERT INTO patrocinador (nombre, id_archivo_logo) VALUES (?, ?)");
    $stmt->bind_param("si", $nombre, $idArchivoLogo);
    $stmt->execute();

    if ($stmt->affected_rows === 0) {
        echo json_encode(["status" => "error", "message" => "Error al agregar el patrocinador"]);
        return;
    }

    echo json_encode(["status" => "success", "message" => "Patrocinador agregado correctamente"]);
}


/**
 * Actualizar patrocinador
 * Maneja la lógica de no duplicar archivos si la ruta es la misma
 */
function actualizarPatrocinador() {
    global $conexion;

    $idPatrocinador = (int)$_POST['idPatrocinador'];
    $nombre = $_POST['nombre'];
    $idArchivoNuevo = (int)$_POST['idArchivoLogo'];

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
            $conexion->prepare("DELETE FROM archivo WHERE id_archivo = ?")
                ->bind_param("i", $idArchivoNuevo)
                ->execute();
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
function eliminarPatrocinador() {
    global $conexion;
    $idPatrocinador = (int)$_POST['idPatrocinador'];

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
function obtenerBaseUrl() {
    global $conexion;

    $query = "SELECT valor FROM configuracion WHERE nombre = 'baseUrl' LIMIT 1";
    $conexion->prepare($query);
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
function obtenerCategoriasYSusPremios() {
    global $conexion;

    $queryCategorias = "SELECT * FROM categoria";
    $conexion->query($queryCategorias);
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

    echo json_encode(["status" => "success", "data" => $categorias]);
}


/**
 * Listar finalistas que no son ganadores
 */
function listarFinalistasNoGanadores() {
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

    echo json_encode(["status" => "success", "data" => $finalistas]);
}

/**
 * Asignar ganador a un premio
 */
function asignarGanador() {
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
function desasignarGanador() {
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
 * Obtener todas las categorías con sus premios
 */
function obtenerCategoriasConPremios() {
    global $conexion;
    $queryCategorias = "SELECT * FROM categoria";
    $conexion->query($queryCategorias);
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

    echo json_encode(["status" => "success", "data" => $categorias]);
}

/**
 * Agregar categoría con premios
 */
function agregarCategoriaConPremios() {
    global $conexion;

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

            $premiosInsertados[] = ["id_premio" => $conexion->insert_id, "nombre" => $nombre, "incluye_dinero" => (bool)$incluye, "cantidad_dinero" => $cantidad];
        }

        $conexion->commit();

        echo json_encode(["status" => "success", "data" => ["id_categoria" => $idCategoria, "nombre" => $nombreCategoria, "premios" => $premiosInsertados]]);
    } catch (Exception $e) {
        $conexion->rollback();
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}

/**
 * Editar categoría con premios
 */
function editarCategoriaConPremios() {
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

        echo json_encode(["status" => "success", "data" => ["id_categoria" => $idCategoria, "nombre" => $nombreCategoria, "premios" => $premios]]);
    } catch (Exception $e) {
        $conexion->rollback();
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}

/**
 * Eliminar categoría con premios
 */
function eliminarCategoria() {
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
}

/**
 * Actualizar una edición
 */
function actualizarEdicion() {
    global $conexion;

    $idEdicion = (int)$_POST['idEdicion'];
    $anioEdicion = (int)$_POST['anioEdicion'];
    $resumenEvento = $_POST['resumenEvento'];
    $nroParticipantes = (int)$_POST['nroParticipantes'];
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
function contarParticipantesEdicionActual() {
    global $conexion;

    $nroParticipantes = 0;
    $nroParticipantesSql = "SELECT COUNT(*) as total FROM candidatura";
    $resultNroParticipantes = $conexion->prepare($nroParticipantesSql);
    $resultNroParticipantes->execute();
    $res = $resultNroParticipantes->get_result();
    if ($row = $res->fetch_assoc()) {
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
function enviarEdicionAAnteriores() {
    global $conexion;

    $idEdicionActual = obtenerIdEdicionActual();

    $anioEdicion = (int)$_POST['anioEdicion'];
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

        $conexion->prepare($queryGanadores);
        $resultGanadores = $conexion->query($queryGanadores);
        $resultGanadores = $resultGanadores->get_result();

        $stmtInsertGanador = $conexion->prepare("INSERT INTO ganadores_edicion (id_edicion, categoria, nombre, premio, id_archivo_video) VALUES (?, ?, ?, ?, ?)");

        // insertar cada ganador
        while ($ganador = $resultGanadores->fetch_assoc()) {
            $stmtInsertGanador->bind_param("isssi", $idEdicionActual, $ganador['categoria'], $ganador['nombreParticipante'], $ganador['premio'], $ganador['id_archivo_video']);
            $stmtInsertGanador->execute();
        }

        // eliminar historial_candidatura y candidaturas no ganadores
        $eliminarHistorialSql = "DELETE hc FROM historial_candidatura hc
                             INNER JOIN candidatura c ON hc.id_candidatura = c.id_candidatura
                             LEFT JOIN premio_candidatura pc ON c.id_candidatura = pc.id_candidatura
                             WHERE pc.id_candidatura IS NULL";

        $conexion->prepare($eliminarHistorialSql);
        $conexion->query($eliminarHistorialSql);

        // eliminar candidaturas no ganadores
        $eliminarCandidaturasSql = "DELETE c FROM candidatura c
                                    LEFT JOIN premio_candidatura pc ON c.id_candidatura = pc.id_candidatura
                                    WHERE pc.id_candidatura IS NULL";
        $conexion->prepare($eliminarCandidaturasSql);
        $conexion->query($eliminarCandidaturasSql);

        // eliminar premios asociados a candidaturas
        $eliminarPremiosSql = "DELETE pc FROM premio_candidatura pc
                              INNER JOIN candidatura c ON pc.id_candidatura = c.id_candidatura";
        $conexion->prepare($eliminarPremiosSql);
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
function listarNoticias() {
    global $conexion;

    $filtroNombre = isset($_POST['filtroNombre']) && !empty($_POST['filtroNombre']) ? $_POST['filtroNombre'] : null;
    $filtrosSql = "";
    if ($filtroNombre) {
        $filtrosSql .= " AND n.nombre LIKE '%" . $conexion->real_escape_string($filtroNombre) . "%' ";
    }

    $baseUrl = obtenerBaseUrl();
    $query = "SELECT n.id_noticia as idNoticia, n.nombre as nombreNoticia, n.descripcion as descripcionNoticia,
                n.fecha as fechaNoticia, a.ruta as rutaImagenNoticia, a.id_archivo as idArchivoImagenNoticia
              FROM noticia n
              LEFT JOIN archivo a ON n.id_archivo_imagen = a.id_archivo WHERE true " . $filtrosSql . " ORDER BY n.fecha DESC";

    $stmt = $conexion->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();

    $noticias = [];
    while ($row = $result->fetch_assoc()) {
        if ($row['rutaImagenNoticia']) {
            $row['rutaImagenNoticia'] = $baseUrl . $row['rutaImagenNoticia'];
        }
        $noticias[] = $row;
    }

    echo json_encode(["status" => "success", "data" => $noticias]);
}

/**
 * Obtener una noticia por id
 */
function obtenerNoticiaPorId() {
    global $conexion;

    $idNoticia = (int)$_POST['idNoticia'];

    $query = "SELECT n.id_noticia as idNoticia, n.nombre as nombreNoticia, n.descripcion as descripcionNoticia,
                n.fecha as fechaNoticia, a.ruta as rutaImagenNoticia, a.id_archivo as idArchivoImagenNoticia
              FROM noticia n
              LEFT JOIN archivo a ON n.id_archivo_imagen = a.id_archivo
              WHERE n.id_noticia = ?";

    $stmt = $conexion->prepare($query);
    $stmt->bind_param("i", $idNoticia);
    $stmt->execute();
    $result = $stmt->get_result();

    $baseUrl = obtenerBaseUrl();
    $noticia = null;
    if ($row = $result->fetch_assoc()) {
        if ($row['rutaImagenNoticia']) {
            $row['rutaImagenNoticia'] = $baseUrl . $row['rutaImagenNoticia'];
        }
        $noticia = $row;
    }

    echo json_encode(["status" => "success", "data" => $noticia]);
}

/**
 * Crear una nueva noticia
 */
function crearNoticia() {
    global $conexion;

    $nombre = $_POST['nombreNoticia'];
    $descripcion = $_POST['descripcionNoticia'];
    $fecha = $_POST['fechaPublicacionNoticia'];
    $idArchivoImagen = isset($_POST['idArchivoImagen']) ? (int)$_POST['idArchivoImagen'] : null;

    $stmt = $conexion->prepare("INSERT INTO noticia (nombre, descripcion, fecha, id_archivo_imagen) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $nombre, $descripcion, $fecha, $idArchivoImagen);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Noticia creada correctamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al crear la noticia"]);
    }
}

/**
 * Actualizar una noticia
 */
function actualizarNoticia() {
    global $conexion;

    $idNoticia = (int)$_POST['idNoticia'];
    $nombre = $_POST['nombreNoticia'];
    $descripcion = $_POST['descripcionNoticia'];
    $fecha = $_POST['fechaPublicacionNoticia'];
    $idArchivoNuevo = isset($_POST['idArchivoImagen']) ? (int)$_POST['idArchivoImagen'] : null;

    $idArchivoAnterior = null;
    $stmtArchivo = $conexion->prepare("SELECT id_archivo_imagen FROM noticia WHERE id_noticia = ?");
    $stmtArchivo->bind_param("i", $idNoticia);
    $stmtArchivo->execute();
    $res = $stmtArchivo->get_result();
    if ($row = $res->fetch_assoc()) {
        $idArchivoAnterior = (int)$row['id_archivo_imagen'];
    }

    if ($idArchivoAnterior !== null && $idArchivoAnterior !== $idArchivoNuevo) {
        $stmtRutas = $conexion->prepare("
            SELECT 
                (SELECT ruta FROM archivo WHERE id_archivo = ?) as rutaVieja,
                (SELECT ruta FROM archivo WHERE id_archivo = ?) as rutaNueva
        ");
        $stmtRutas->bind_param("ii", $idArchivoAnterior, $idArchivoNuevo);
        $stmtRutas->execute();
        $rutas = $stmtRutas->get_result()->fetch_assoc();

        if ($rutas['rutaVieja'] === $rutas['rutaNueva']) {
            $conexion->prepare("DELETE FROM archivo WHERE id_archivo = ?")
                ->bind_param("i", $idArchivoNuevo)
                ->execute();
            $idArchivoNuevo = $idArchivoAnterior;
            $idArchivoAnterior = null;
        }
    }

    $stmt = $conexion->prepare("UPDATE noticia SET nombre = ?, descripcion = ?, fecha = ?, id_archivo_imagen = ? WHERE id_noticia = ?");
    $stmt->bind_param("sssii", $nombre, $descripcion, $fecha, $idArchivoNuevo, $idNoticia);

    if ($stmt->execute()) {
        // Solo eliminamos el anterior si realmente es un archivo distinto
        if ($idArchivoAnterior !== null && $idArchivoAnterior !== $idArchivoNuevo) {
            eliminarArchivoPorId($idArchivoAnterior);
        }
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al actualizar"]);
    }
}

/**
 * Eliminar una noticia
 */
function eliminarNoticia() {
    global $conexion;
    $idNoticia = (int)$_POST['idNoticia'];

    $stmt = $conexion->prepare("SELECT id_archivo_imagen FROM noticia WHERE id_noticia = ?");
    $stmt->bind_param("i", $idNoticia);
    $stmt->execute();
    $idArchivo = $stmt->get_result()->fetch_assoc()['id_archivo_imagen'] ?? null;

    $stmtDel = $conexion->prepare("DELETE FROM noticia WHERE id_noticia = ?");
    $stmtDel->bind_param("i", $idNoticia);

    if ($stmtDel->execute()) {
        if ($idArchivo) {
            eliminarArchivoPorId($idArchivo);
        }
        echo json_encode(["status" => "success", "message" => "Noticia eliminada"]);
    } else {
        echo json_encode(["status" => "error"]);
    }
}

/**
 * Listar eventos
 */
function listarEventos() {
    global $conexion;

    $filtroFecha = isset($_POST['filtroFecha']) && !empty($_POST['filtroFecha']) ? $_POST['filtroFecha'] : null;
    $filtrosSql = "";
    if ($filtroFecha) {
        $filtrosSql .= " AND e.fecha = '" . $conexion->real_escape_string($filtroFecha) . "' ";
    }

    $query = "SELECT e.id_evento as idEvento, e.nombre as nombreEvento, e.descripcion as descripcionEvento,
                e.ubicacion as ubicacionEvento, e.fecha as fechaEvento, e.hora_inicio as horaInicioEvento,
                e.hora_fin as horaFinEvento, a.ruta as rutaImagenEvento, a.id_archivo as idArchivoImagenEvento
              FROM evento e
              LEFT JOIN archivo a ON e.id_archivo_imagen = a.id_archivo WHERE true " . $filtrosSql . "ORDER BY e.fecha DESC, e.hora_inicio ASC";

    $stmt = $conexion->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();

    $baseUrl = obtenerBaseUrl();
    $eventos = [];
    while ($row = $result->fetch_assoc()) {
        if ($row['rutaImagenEvento']) {
            $row['rutaImagenEvento'] = $baseUrl . $row['rutaImagenEvento'];
        }
        $eventos[] = $row;
    }

    echo json_encode(["status" => "success", "data" => $eventos]);
}


/**
 * Obtener un evento por id
 */
function obtenerEventoPorId() {
    global $conexion;

    $idEvento = (int)$_POST['idEvento'];

    $query = "SELECT e.id_evento as idEvento, e.nombre as nombreEvento, e.descripcion as descripcionEvento,
                e.ubicacion as ubicacionEvento, e.fecha as fechaEvento, e.hora_inicio as horaInicioEvento,
                e.hora_fin as horaFinEvento, a.ruta as rutaImagenEvento, a.id_archivo as idArchivoImagenEvento
              FROM evento e
              LEFT JOIN archivo a ON e.id_archivo_imagen = a.id_archivo
              WHERE e.id_evento = ?";

    $stmt = $conexion->prepare($query);
    $stmt->bind_param("i", $idEvento);
    $stmt->execute();
    $result = $stmt->get_result();

    $baseUrl = obtenerBaseUrl();
    $evento = null;
    if ($row = $result->fetch_assoc()) {
        if ($row['rutaImagenEvento']) {
            $row['rutaImagenEvento'] = $baseUrl . $row['rutaImagenEvento'];
        }
        $evento = $row;
    }

    echo json_encode(["status" => "success", "data" => $evento]);
}

/**
 * Crear evento
 */
function crearEvento() {
    global $conexion;

    $nombre = $_POST['nombreEvento'];
    $descripcion = $_POST['descripcionEvento'];
    $ubicacion = $_POST['ubicacionEvento'];
    $fecha = $_POST['fechaEvento'];
    $horaInicio = $_POST['horaInicioEvento'];
    $horaFin = $_POST['horaFinEvento'];
    $idArchivoImagen = isset($_POST['idArchivoImagen']) ? (int)$_POST['idArchivoImagen'] : null;

    $stmt = $conexion->prepare("INSERT INTO evento (nombre, descripcion, ubicacion, fecha, hora_inicio, hora_fin, id_archivo_imagen) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssi", $nombre, $descripcion, $ubicacion, $fecha, $horaInicio, $horaFin, $idArchivoImagen);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Evento creado correctamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al crear el evento"]);
    }
}

/**
 *  Actualizar evento
 */
function actualizarEvento() {
    global $conexion;

    $idEvento = (int)$_POST['idEvento'];
    $nombre = $_POST['nombreEvento'];
    $descripcion = $_POST['descripcionEvento'];
    $ubicacion = $_POST['ubicacionEvento'];
    $fecha = $_POST['fechaEvento'];
    $horaInicio = $_POST['horaInicioEvento'];
    $horaFin = $_POST['horaFinEvento'];
    $idArchivoNuevo = isset($_POST['idArchivoImagen']) ? (int)$_POST['idArchivoImagen'] : null;

    $idArchivoAnterior = null;
    $stmtArchivo = $conexion->prepare("SELECT id_archivo_imagen FROM evento WHERE id_evento = ?");
    $stmtArchivo->bind_param("i", $idEvento);
    $stmtArchivo->execute();
    $res = $stmtArchivo->get_result();
    if ($row = $res->fetch_assoc()) {
        $idArchivoAnterior = (int)$row['id_archivo_imagen'];
    }

    if ($idArchivoAnterior !== null && $idArchivoAnterior !== $idArchivoNuevo) {
        $stmtRutas = $conexion->prepare("
            SELECT 
                (SELECT ruta FROM archivo WHERE id_archivo = ?) as rutaVieja,
                (SELECT ruta FROM archivo WHERE id_archivo = ?) as rutaNueva
        ");
        $stmtRutas->bind_param("ii", $idArchivoAnterior, $idArchivoNuevo);
        $stmtRutas->execute();
        $rutas = $stmtRutas->get_result()->fetch_assoc();

        if ($rutas['rutaVieja'] === $rutas['rutaNueva']) {
            $conexion->prepare("DELETE FROM archivo WHERE id_archivo = $idArchivoNuevo");
            $conexion->execute();
            $idArchivoNuevo = $idArchivoAnterior;
            $idArchivoAnterior = null;
        }
    }

    $stmt = $conexion->prepare("UPDATE evento SET nombre = ?, descripcion = ?, ubicacion = ?, fecha = ?, hora_inicio = ?, hora_fin = ?, id_archivo_imagen = ? WHERE id_evento = ?");
    $stmt->bind_param("ssssssii", $nombre, $descripcion, $ubicacion, $fecha, $horaInicio, $horaFin, $idArchivoNuevo, $idEvento);
    if ($stmt->execute()) {
        // Solo eliminamos el anterior si realmente es un archivo distinto
        if ($idArchivoAnterior !== null && $idArchivoAnterior !== $idArchivoNuevo) {
            eliminarArchivoPorId($idArchivoAnterior);
        }
        echo json_encode(["status" => "success", "message" => "Evento actualizado correctamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al actualizar el evento"]);
    }
}

/**
 * Eliminar evento
 */
function eliminarEvento() {
    global $conexion;
    $idEvento = (int)$_POST['idEvento'];

    $stmt = $conexion->prepare("SELECT id_archivo_imagen FROM evento WHERE id_evento = ?");
    $stmt->bind_param("i", $idEvento);
    $stmt->execute();
    $idArchivo = $stmt->get_result()->fetch_assoc()['id_archivo_imagen'] ?? null;

    $stmtDel = $conexion->prepare("DELETE FROM evento WHERE id_evento = ?");
    $stmtDel->bind_param("i", $idEvento);

    if ($stmtDel->execute()) {
        if ($idArchivo) {
            eliminarArchivoPorId($idArchivo);
        }
        echo json_encode(["status" => "success", "message" => "Evento eliminado"]);
    } else {
        echo json_encode(["status" => "error"]);
    }
}


/**
 * Listar candidaturas con filtros y paginación
 */
function listarCandidaturasAdmin() {
    global $conexion;

    $limit  = 10;
    $pagina = (isset($_POST['pagina']) && is_numeric($_POST['pagina'])) ? (int)$_POST['pagina'] : 1;
    $offset = ($pagina - 1) * $limit;

    $filtroTexto  = $_POST['filtroTexto'] ?? '';
    $filtroTipo   = $_POST['filtroTipo'] ?? '';
    $filtroEstado = $_POST['filtroEstado'] ?? '';
    $filtroFecha  = $_POST['filtroFecha'] ?? '';

    $whereSql = " WHERE 1=1 ";
    $params = [];
    $types = "";

    if ($filtroTexto) {
        $whereSql .= " AND (LOWER(p.nombre) LIKE LOWER(?) OR LOWER(c.titulo) LIKE LOWER(?) OR LOWER(c.sinopsis) LIKE LOWER(?)) ";
        $likeTexto = "%" . $filtroTexto . "%";
        $params[] = $likeTexto;
        $params[] = $likeTexto;
        $params[] = $likeTexto;
        $types .= "sss";
    }

    if ($filtroTipo) {
        $whereSql .= " AND c.tipo_candidatura = ? ";
        $params[] = $filtroTipo;
        $types .= "s";
    }

    if ($filtroEstado) {
        $whereSql .= " AND c.estado = ? ";
        $params[] = $filtroEstado;
        $types .= "s";
    }

    if ($filtroFecha) {
        $whereSql .= " AND DATE(c.fecha_presentacion) = ? ";
        $params[] = $filtroFecha;
        $types .= "s";
    }

    $countSql = "SELECT COUNT(*) as total FROM candidatura c 
                 INNER JOIN participante p ON c.id_participante = p.id_participante 
                 $whereSql";

    $stmtCount = $conexion->prepare($countSql);
    if ($types) {
        $stmtCount->bind_param($types, ...$params);
    }
    $stmtCount->execute();
    $totalRecords = $stmtCount->get_result()->fetch_assoc()['total'] ?? 0;

    $dataSql = "SELECT c.*, p.nombre AS participante, p.dni, p.nro_expediente as nroExpediente, 
                       a1.ruta AS video, a2.ruta AS ficha, a3.ruta AS cartel, a4.ruta AS trailer
                FROM candidatura c
                INNER JOIN participante p ON c.id_participante = p.id_participante
                LEFT JOIN archivo a1 ON c.id_archivo_video = a1.id_archivo
                LEFT JOIN archivo a2 ON c.id_archivo_ficha = a2.id_archivo
                LEFT JOIN archivo a3 ON c.id_archivo_cartel = a3.id_archivo
                LEFT JOIN archivo a4 ON c.id_archivo_trailer = a4.id_archivo
                $whereSql
                ORDER BY c.id_candidatura DESC
                LIMIT ? OFFSET ?";

    $stmtData = $conexion->prepare($dataSql);

    $finalTypes = $types . "ii";
    $finalParams = array_merge($params, [$limit, $offset]);

    $stmtData->bind_param($finalTypes, ...$finalParams);
    $stmtData->execute();
    $result = $stmtData->get_result();

    $baseUrl = obtenerBaseUrl();
    $candidaturas = [];

    while ($row = $result->fetch_assoc()) {
        // Concatenamos la URL base a las rutas si existen
        if ($row['video']) {
            $row['rutaVideo'] = $baseUrl . $row['video'];
        }
        if ($row['ficha']) {
            $row['rutaFicha'] = $baseUrl . $row['ficha'];
        }
        if ($row['cartel']) {
            $row['rutaCartel'] = $baseUrl . $row['cartel'];
        }
        if ($row['trailer']) {
            $row['rutaTrailer'] = $baseUrl . $row['trailer'];
        }
        $candidaturas[] = $row;
    }

    $totalPaginas = ceil($totalRecords / $limit);

    echo json_encode([
        "status"       => "success",
        "totalRecords"        => (int)$totalRecords,
        "totalPages"        => $totalPaginas,
        "currentPage" => $pagina,
        "data"         => $candidaturas
    ]);
}

/**
 * Editar la candidatura
 */
function actualizarEstadoCandidatura() {
    global $conexion;

    $idCandidatura = (int)($_POST['idCandidatura'] ?? 0);
    $nuevoEstadoCandidatura = $_POST['nuevoEstadoCandidatura'] ?? '';
    $motivoCambioEstado = $_POST['motivoCambioEstado'];

    $stmt = $conexion->prepare("UPDATE candidatura SET estado = ? WHERE id_candidatura = ?");
    $stmt->bind_param("si", $nuevoEstadoCandidatura, $idCandidatura);

    if ($stmt->execute()) {
        $sqlInsertHistorial = $conexion->prepare("INSERT INTO historial_candidatura (id_candidatura, estado, motivo)
VALUES (?, ?, ?)");

        $sqlInsertHistorial->bind_param("iss", $idCandidatura, $nuevoEstadoCandidatura, $motivoCambioEstado);
        $sqlInsertHistorial->execute();

        echo json_encode(["status" => "success", "message" => "Estado actualizado correctamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al cambiar el estado de la candidatura: " . $stmt->error]);
    }
}

/**
 * Obtener historial de una candidatura
 */
function obtenerHistorialCandidatura() {
    global $conexion;

    $idCandidatura = (int)($_POST['idCandidatura'] ?? 0);

    $query = "SELECT id_historial as idHistorial, id_candidatura as idCandidatura, estado, motivo, estado_correo_enviado as estadoCorreoEnviado, fecha_hora as fechaHora
              FROM historial_candidatura
              WHERE id_candidatura = ?
              ORDER BY fecha_hora DESC";

    $stmt = $conexion->prepare($query);
    $stmt->bind_param("i", $idCandidatura);
    $stmt->execute();
    $result = $stmt->get_result();

    $historial = [];
    while ($row = $result->fetch_assoc()) {
        $historial[] = $row;
    }

    echo json_encode(["status" => "success", "data" => $historial]);
}

/**
 * Obtener bases legales
 */
function obtenerBasesLegales() {
    global $conexion;

    $query = "SELECT valor FROM configuracion WHERE nombre = 'basesLegales' LIMIT 1";
    $stmt = $conexion->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        echo json_encode(["status" => "success", "data" => $row['valor']]);
    } else {
        echo json_encode(["status" => "error", "message" => "No se encontraron las bases legales"]);
    }
}


/**
 * Crear candidatura
 */
function guardarCandidatura() {
    global $conexion;

    $nombre = isset($_POST['nombre']) ? $_POST['nombre'] : null;
    $correo = isset($_POST['correo']) ? $_POST['correo'] : null;
    $password = isset($_POST['password']) ? $_POST['password'] : null;
    $dni = isset($_POST['dni']) ? $_POST['dni'] : null;
    $nroExpediente = $_POST['nroExpediente'];
    $idVideo = isset($_POST['idVideo']) ? (int)$_POST['idVideo'] : null;
    $idPoster = isset($_POST['idPoster']) ? (int)$_POST['idPoster'] : null;
    $titulo = isset($_POST['titulo']) ? $_POST['titulo'] : null;
    $sinopsis = isset($_POST['sinopsis']) ? $_POST['sinopsis'] : null;
    $idFichaTecnica = isset($_POST['idFichaTecnica']) ? (int)$_POST['idFichaTecnica'] : null;
    $tipoCandidatura = isset($_POST['tipoCandidatura']) ? $_POST['tipoCandidatura'] : null;

    // si hay sesion, usar el id de la sesion, sino crear participante nuevo
    $idParticipante = null;
    if ($_SESSION['iniciada']){
        $idParticipante = (int)$_SESSION['id'];

    } else {
        $sqlInsert = $conexion->prepare("INSERT INTO participante (nombre, correo, contrasena, dni, nro_expediente) VALUES (?, ?, ?, ?, ?)");
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $sqlInsert->bind_param("sssss", $nombre, $correo, $hashedPassword, $dni, $nroExpediente);
        if (!$sqlInsert->execute()) {
            echo json_encode(["status" => "error", "message" => "Error al crear el participante: " . $sqlInsert->error]);
            return;
        }
        $idParticipante = $conexion->insert_id;

        // crear sesion
        $_SESSION['iniciada'] = true;
        $_SESSION['rol'] = 'participante';
        $_SESSION['id'] = $idParticipante;
    }

    $sqlInsertCandidatura = $conexion->prepare("INSERT INTO candidatura (id_participante, tipo_candidatura, titulo, sinopsis, id_archivo_video, id_archivo_ficha, id_archivo_cartel) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $sqlInsertCandidatura->bind_param("isssiii", $idParticipante, $tipoCandidatura, $titulo, $sinopsis, $idVideo, $idFichaTecnica, $idPoster);

    if (!$sqlInsertCandidatura->execute()) {
        echo json_encode(["status" => "error", "message" => "Error al crear la candidatura: " . $sqlInsertCandidatura->error]);
    }

    echo json_encode(["status" => "success", "message" => "Candidatura creada correctamente"]);

}


/**
 * Listar candidaturas de un participante
 */
function listarCandidaturasParticipante() {
    global $conexion;

    $idParticipante = (int)$_SESSION['id'];
    $pagina = (isset($_POST['page']) && is_numeric($_POST['page'])) ? (int)$_POST['page'] : 1;
    $limit  = (isset($_POST['pageSize']) && is_numeric($_POST['pageSize'])) ? (int)$_POST['pageSize'] : 3;

    $offset = ($pagina - 1) * $limit;

    $countSql = "SELECT COUNT(*) as total FROM candidatura WHERE id_participante = ?";
    $stmtCount = $conexion->prepare($countSql);
    $stmtCount->bind_param("i", $idParticipante);
    $stmtCount->execute();
    $totalRecords = $stmtCount->get_result()->fetch_assoc()['total'] ?? 0;

    $query = "
        SELECT 
            c.id_candidatura as idCandidatura,
            c.estado,
            c.tipo_candidatura as tipoCandidatura,
            c.fecha_presentacion as fechaPresentacion,
            c.fecha_ultima_modificacion as fechaUltimaModificacion,
            c.titulo as titulo,
            c.sinopsis as sinopsis,
            a1.ruta as rutaVideo,
            a2.ruta as rutaFichaTecnica,
            a3.ruta as rutaCartel,
            a4.ruta as rutaTrailer,
            a1.id_archivo as idArchivoVideo,
            a2.id_archivo as idArchivoFichaTecnica,
            a3.id_archivo as idArchivoCartel,
            a4.id_archivo as idArchivoTrailer,
            IF(c.estado = 'Rechazada', (SELECT motivo FROM historial_candidatura WHERE id_candidatura = c.id_candidatura AND estado = 'Rechazada' ORDER BY fecha_hora DESC LIMIT 1), NULL) AS motivoRechazo
        FROM candidatura c
        LEFT JOIN archivo a1 ON c.id_archivo_video = a1.id_archivo
        LEFT JOIN archivo a2 ON c.id_archivo_ficha = a2.id_archivo
        LEFT JOIN archivo a3 ON c.id_archivo_cartel = a3.id_archivo
        LEFT JOIN archivo a4 ON c.id_archivo_trailer = a4.id_archivo
        WHERE c.id_participante = ?
        ORDER BY c.id_candidatura DESC
        LIMIT ? OFFSET ?
    ";

    $stmt = $conexion->prepare($query);

    $stmt->bind_param("iii", $idParticipante, $limit, $offset);

    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Error al preparar la consulta: " . $conexion->error]);
        return;
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $baseUrl = obtenerBaseUrl();
    $candidaturas = [];

    while ($row = $result->fetch_assoc()) {
        if ($row['rutaVideo']) {
            $row['rutaVideo'] = $baseUrl . $row['rutaVideo'];
        }
        if ($row['rutaFichaTecnica']) {
            $row['rutaFichaTecnica'] = $baseUrl . $row['rutaFichaTecnica'];
        }
        if ($row['rutaCartel']) {
            $row['rutaCartel'] = $baseUrl . $row['rutaCartel'];
        }
        if ($row['rutaTrailer']) {
            $row['rutaTrailer'] = $baseUrl . $row['rutaTrailer'];
        }
        $candidaturas[] = $row;
    }

    $totalPages = ceil($totalRecords / $limit);

    $pageContext = [
        "totalRecords"   => (int)$totalRecords,
        "totalPages"     => (int)$totalPages,
        "currentPage"    => $pagina,
        "pageSize"       => $limit,
        "list"           => $candidaturas
    ];

    echo json_encode([
        "status"  => "success",
        "data"    => $pageContext,
        "message" => "ok"
    ]);
}

/**
 * Obtener datos de la gala
 */
function obtenerDatosGala() {
    global $conexion;

    $queryModo = "SELECT valor FROM configuracion WHERE nombre = 'modo' LIMIT 1";
    $stmtModo = $conexion->prepare($queryModo);
    $stmtModo->execute();
    $resModo = $stmtModo->get_result();
    $modo = $resModo->fetch_assoc()['valor'];

    $datos=[];
    $datos['modo'] = $modo;

    $baseUrl = obtenerBaseUrl();

    if ($modo == 'pre-evento'){
        $queryTitulo =  "SELECT valor FROM configuracion WHERE nombre = 'galaPreEventoTitulo' LIMIT 1";
        $stmtPreEvento = $conexion->prepare($queryTitulo);
        $stmtPreEvento->execute();
        $resPreEvento = $stmtPreEvento->get_result();
        $datos['titulo'] = $resPreEvento->fetch_assoc()['valor'];

        $queryFecha =  "SELECT valor FROM configuracion WHERE nombre = 'galaPreEventoFecha' LIMIT 1";
        $stmtPreEvento = $conexion->prepare($queryFecha);
        $stmtPreEvento->execute();
        $resPreEvento = $stmtPreEvento->get_result();
        $datos['fecha'] = $resPreEvento->fetch_assoc()['valor'];

        $queryHora =  "SELECT valor FROM configuracion WHERE nombre = 'galaPreEventoHora' LIMIT 1";
        $stmtPreEvento = $conexion->prepare($queryHora);
        $stmtPreEvento->execute();
        $resPreEvento = $stmtPreEvento->get_result();
        $datos['hora'] = $resPreEvento->fetch_assoc()['valor'];

        $queryUbicacion =  "SELECT valor FROM configuracion WHERE nombre = 'galaPreEventoUbicacion' LIMIT 1";
        $stmtPreEvento = $conexion->prepare($queryUbicacion);
        $stmtPreEvento->execute();
        $resPreEvento = $stmtPreEvento->get_result();
        $datos['ubicacion'] = $resPreEvento->fetch_assoc()['valor'];

        $queryDescripcion =  "SELECT valor FROM configuracion WHERE nombre = 'galaPreEventoDescripcion' LIMIT 1";
        $stmtPreEvento = $conexion->prepare($queryDescripcion);
        $stmtPreEvento->execute();
        $resPreEvento = $stmtPreEvento->get_result();
        $datos['descripcion'] = $resPreEvento->fetch_assoc()['valor'];

        $queryStreamingActivo =  "SELECT valor FROM configuracion WHERE nombre = 'galaPreEventoStreamingActivo' LIMIT 1";
        $stmtPreEvento = $conexion->prepare($queryStreamingActivo);
        $stmtPreEvento->execute();
        $resPreEvento = $stmtPreEvento->get_result();
        $datos['streamingActivo'] = $resPreEvento->fetch_assoc()['valor'] == 'true' ? true : false;

        $queryStreamingUrl =  "SELECT valor FROM configuracion WHERE nombre = 'galaPreEventoStreamingUrl' LIMIT 1";
        $stmtPreEvento = $conexion->prepare($queryStreamingUrl);
        $stmtPreEvento->execute();
        $resPreEvento = $stmtPreEvento->get_result();
        $datos['streamingUrl'] = $resPreEvento->fetch_assoc()['valor'];

        $datos['eventosDiaGala'] = obtenerEventosDiaGala($datos['fecha']);
    } else if ($modo == 'post-evento'){

        $edicionActual = obtenerEdicionActual();
        $galeriaEdicionActual = obtenerGaleriaEdicionActual();
        $candidaturasGanadoras = obtenerCandidaturasGanadoras();

        $datos['titulo'] = "El cine cobró vida: Así fue la Gala " . $edicionActual['anioEdicion'];
        $datos['descripcion'] = $edicionActual['resumenEvento'];
        $datos['galeria'] = $galeriaEdicionActual;
        $datos['candidaturasGanadoras'] = $candidaturasGanadoras;

    }

    echo json_encode([
        "status" => "success",
        "data" => $datos
    ]);
}

/**
 * Obtener eventos del día de la gala
 */
function obtenerEventosDiaGala($fechaGala) {
    global $conexion;

    $fechaGala = formatToSqlDate($fechaGala);

    $queryEventosDiaGala = "SELECT e.id_evento as idEvento, e.nombre as nombreEvento, e.descripcion as descripcionEvento,
            e.ubicacion as ubicacionEvento, e.fecha as fechaEvento, e.hora_inicio as horaInicioEvento,
            e.hora_fin as horaFinEvento, a.ruta as rutaImagenEvento, a.id_archivo as idArchivoImagenEvento
          FROM evento e
          LEFT JOIN archivo a ON e.id_archivo_imagen = a.id_archivo 
          WHERE e.fecha = ?
          ORDER BY e.hora_inicio ASC";
    $stmtEventos = $conexion->prepare($queryEventosDiaGala);
    $stmtEventos->bind_param("s", $fechaGala);
    $stmtEventos->execute();
    $resultEventos = $stmtEventos->get_result();

    $baseUrl = obtenerBaseUrl();
    $eventosDiaGala = [];
    while ($row = $resultEventos->fetch_assoc()) {
        if ($row['rutaImagenEvento']) {
            $row['rutaImagenEvento'] = $baseUrl . $row['rutaImagenEvento'];
        }
        $eventosDiaGala[] = $row;
    }

    return $eventosDiaGala;
}

/**
 * Formatear fecha de d/m/Y a Y-m-d
 */
function formatToSqlDate($fechaString) {
    // Creamos el objeto desde el formato específico
    $date = DateTime::createFromFormat('d/m/Y', $fechaString);

    // Verificamos si la fecha es válida
    if ($date && $date->format('d/m/Y') === $fechaString) {
        return $date->format('Y-m-d');
    }

    return false;
}

/**
 * Obtener edición actual
 * @throws Exception
 */
function obtenerEdicionActual() {
    global $conexion;

    $queryEdicion = "SELECT id_edicion as idEdicion, anio_edicion as anioEdicion, resumen_evento as resumenEvento, fecha_envio_email_informativo as fechaEnvioEmailInformativo, fecha_borrado_datos as fechaBorradoDatos FROM edicion WHERE tipo = ? LIMIT 1";
    $stmtEdicion = $conexion->prepare($queryEdicion);
    $tipoEdicion = 'actual';
    $stmtEdicion->bind_param("s", $tipoEdicion);
    $stmtEdicion->execute();
    $resultEdicion = $stmtEdicion->get_result();
    $result = $resultEdicion->fetch_assoc();
    $stmtEdicion->close();
    if ($result) {
        $result['nroParticipantes'] = contarParticipantesEdicionActual();
        return $result;

    } else {
        throw new Exception("No se encontró la edición actual");
    }
}

/**
 * Contar participantes de la edición actual
 */
function obtenerGaleriaEdicionActual(){
    global $conexion;

    $edicionActual = obtenerEdicionActual();
    $idEdicionActual = (int)$edicionActual['idEdicion'];

    $queryGaleria = "SELECT a.id_archivo as idArchivo, a.ruta as rutaArchivo
                     FROM edicion_archivos ea
                     INNER JOIN archivo a ON ea.id_archivo = a.id_archivo
                     WHERE ea.id_edicion = ?";
    $stmtGaleria = $conexion->prepare($queryGaleria);
    $stmtGaleria->bind_param("i", $idEdicionActual);
    $stmtGaleria->execute();
    $resultGaleria = $stmtGaleria->get_result();

    $baseUrl = obtenerBaseUrl();
    $galeria = [];
    while ($row = $resultGaleria->fetch_assoc()) {
        $row['tipoArchivo'] = obtenerTipoArchivoPorExtension($row['rutaArchivo']);
        if ($row['rutaArchivo']) {
            $row['rutaArchivo'] = $baseUrl . $row['rutaArchivo'];
        }
        $galeria[] = $row;
    }
    return $galeria;
}

/**
 * Función auxiliar para obtener el tipo de archivo (imagen o video) según su extensión
 */
function obtenerTipoArchivoPorExtension($rutaArchivo) {
    $extension = pathinfo($rutaArchivo, PATHINFO_EXTENSION);
    $extension = strtolower($extension);

    $tiposImagen = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    $tiposVideo = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];

    if (in_array($extension, $tiposImagen)) {
        return 'imagen';
    } elseif (in_array($extension, $tiposVideo)) {
        return 'video';
    } else {
        return 'otro';
    }
}

/**
 * Obtener candidaturas ganadoras
 */
function obtenerCandidaturasGanadoras() {
    global $conexion;

    $query = "SELECT 
            c.id_candidatura,
            c.titulo,
            c.sinopsis,
            p.nombre as nombreParticipante,
            pr.nombre as nombrePremio,
            cat.nombre as nombreCategoria,
            av.ruta as rutaVideo,
            at.ruta as rutaTrailer,
            ac.ruta as rutaCartel
        FROM premio_candidatura pc
        INNER JOIN candidatura c ON pc.id_candidatura = c.id_candidatura
        INNER JOIN participante p ON c.id_participante = p.id_participante
        INNER JOIN premio pr ON pc.id_premio = pr.id_premio
        INNER JOIN categoria cat ON pr.id_categoria = cat.id_categoria
        LEFT JOIN archivo av ON c.id_archivo_video = av.id_archivo
        LEFT JOIN archivo at ON c.id_archivo_trailer = at.id_archivo
        LEFT JOIN archivo ac ON c.id_archivo_cartel = ac.id_archivo
        ORDER BY cat.nombre, pr.nombre";

    $stmt = $conexion->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();

    $baseUrl = obtenerBaseUrl();
    $candidaturasGanadoras = [];
    while ($row = $result->fetch_assoc()) {
        if ($row['rutaVideo']) {
            $row['rutaVideo'] = $baseUrl . $row['rutaVideo'];
        }
        if ($row['rutaTrailer']) {
            $row['rutaTrailer'] = $baseUrl . $row['rutaTrailer'];
        }
        if ($row['rutaCartel']) {
            $row['rutaCartel'] = $baseUrl . $row['rutaCartel'];
        }
        $candidaturasGanadoras[] = $row;
    }

    return $candidaturasGanadoras;
}

/**
 * Actualizar candidatura
 */
function actualizarCandidatura(){
    global $conexion;

    $idCandidatura      = limpiarDatoInput($_POST['idCandidatura'], true);
    $titulo             = limpiarDatoInput($_POST['titulo']);
    $sinopsis           = limpiarDatoInput($_POST['sinopsis']);
    $idPoster           = limpiarDatoInput($_POST['idPoster'], true);
    $idFichaTecnica     = limpiarDatoInput($_POST['idFichaTecnica'], true);
    $idTrailer          = limpiarDatoInput($_POST['idTrailer'], true);
    $mensajeSubsanacion = limpiarDatoInput($_POST['mensajeSubsanacion']);


    $estadoActual = obtenerEstadoCandidaturaPorId($idCandidatura);
    $nuevoEstado  = $estadoActual;

    /**
     * Si hay mensaje, siempre vuelve a revisión
     */
    if (!empty($mensajeSubsanacion) || $estadoActual === EstadosCandidatura::RECHAZADA) {
        $nuevoEstado = EstadosCandidatura::EN_REVISION;
    }

    /**
     * Si es finalista, solo se permite cambiar el trailer
     */
    if ($estadoActual === EstadosCandidatura::FINALISTA) {
        $sql = "UPDATE candidatura SET id_archivo_trailer = ? WHERE id_candidatura = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("ii", $idTrailer, $idCandidatura);

    } else {
        /**
         * Si está en revisión o finalista, se pueden cambiar todos los campos
         */
        $sql = "UPDATE candidatura SET 
                    titulo = ?, 
                    sinopsis = ?, 
                    id_archivo_cartel = ?, 
                    id_archivo_ficha = ?, 
                    id_archivo_trailer = ?,
                    estado = ?
                WHERE id_candidatura = ?";

        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("ssiiisi", $titulo, $sinopsis, $idPoster, $idFichaTecnica, $idTrailer, $nuevoEstado, $idCandidatura);
    }

    if ($stmt->execute()) {
        $stmt->close();

        if (!empty($mensajeSubsanacion)) {
            insertarHistorialCandidatura($idCandidatura, $nuevoEstado, $mensajeSubsanacion);
        }

        echo json_encode(["status" => "success", "message" => "Candidatura actualizada correctamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al actualizar: " . $conexion->error]);
    }
}

/**
 * Registra un movimiento en el historial de la candidatura
 */
function insertarHistorialCandidatura($id, $estado, $mensaje) {
    global $conexion;
    if (empty($mensaje)) return;

    $sql = "INSERT INTO historial_candidatura (id_candidatura, estado, motivo) VALUES (?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("iss", $id, $estado, $mensaje);
    $stmt->execute();
    $stmt->close();
}

/*
 * Obtener estado de una candidatura por id
 */
function obtenerEstadoCandidaturaPorId($idCandidatura){
    global $conexion;

    $query = "SELECT estado FROM candidatura WHERE id_candidatura = ? LIMIT 1";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("i", $idCandidatura);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        return $row['estado'];
    } else {
        return null;
    }
}

/**
 * Limpia datos de inputs provenientes de javascript
 */
function limpiarDatoInput($valor, $esNumero = false) {
    if ($valor === null || $valor === 'null' || $valor === 'undefined' || trim($valor) === '') {
        return null;
    }
    return $esNumero ? (int)$valor : $valor;
}


function obtenerDatosHome(){
    $edicionesAnteriores = obtenerEdicionesAnteriores();
    $noticiasDestacadas = obtenerNoticiasDestacadas();
    $premios = obtenerPremios();

    echo json_encode([
        "status" => "success",
        "data" => [
            "edicionesAnteriores" => $edicionesAnteriores,
            "noticiasDestacadas" => $noticiasDestacadas,
            "premios" => $premios
        ]
    ]);
}


/**
 * Obtener ediciones anteriores,
 * Por cada edición:
 * Sus datos básicos, una imagen representativa de cada una, el total de ganandores
 */
function obtenerEdicionesAnteriores(){
    global $conexion;

    $query = "SELECT 
                e.id_edicion as idEdicion,
                e.anio_edicion as anioEdicion,
                e.resumen_evento as resumenEvento,
                e.nro_participantes as nroParticipantes,
                (SELECT a.ruta 
                 FROM edicion_archivos ea 
                 INNER JOIN archivo a ON ea.id_archivo = a.id_archivo 
                 WHERE ea.id_edicion = e.id_edicion 
                 AND a.ruta NOT LIKE '%.mp4' 
                 AND a.ruta NOT LIKE '%.mov'
                 LIMIT 1) as rutaImagenRepresentativa,
                (SELECT COUNT(*) 
                 FROM ganadores_edicion ge 
                 WHERE ge.id_edicion = e.id_edicion) as nroGanadores
              FROM edicion e
              WHERE e.tipo = 'anterior' 
              ORDER BY e.anio_edicion DESC";

    $stmt = $conexion->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();

    $ediciones = [];
    $baseUrl = obtenerBaseUrl();
    while ($row = $result->fetch_assoc()) {
        if ($row['rutaImagenRepresentativa']) {
            $row['rutaImagenRepresentativa'] = $baseUrl . $row['rutaImagenRepresentativa'];
        }
        $ediciones[] = $row;
    }

    return $ediciones;
}

/**
 * CREATE TABLE noticia (
 * id_noticia INT AUTO_INCREMENT PRIMARY KEY,
 * nombre VARCHAR(150),
 * descripcion TEXT,
 * fecha DATE,
 * id_archivo_imagen INT comment 'Imagen de la noticia',
 * id_organizador INT,
 * FOREIGN KEY (id_organizador) REFERENCES organizador(id_organizador),
 * FOREIGN KEY (id_archivo_imagen) REFERENCES archivo(id_archivo)
 * );
 */
function obtenerNoticiasDestacadas(){
    global $conexion;
    $query = "SELECT 
                n.id_noticia as idNoticia,
                n.nombre as nombreNoticia,
                n.descripcion as descripcionNoticia,
                n.fecha as fechaNoticia,
                a.ruta as rutaImagenNoticia,
                o.nombre as nombreOrganizador
              FROM noticia n
              LEFT JOIN archivo a ON n.id_archivo_imagen = a.id_archivo
              LEFT JOIN organizador o ON n.id_organizador = o.id_organizador
              ORDER BY n.fecha DESC
              LIMIT 8";
    $stmt = $conexion->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();
    $noticias = [];
    $baseUrl = obtenerBaseUrl();
    while ($row = $result->fetch_assoc()) {
        if ($row['rutaImagenNoticia']) {
            $row['rutaImagenNoticia'] = $baseUrl . $row['rutaImagenNoticia'];
        }
        $noticias[] = $row;
    }
    return $noticias;
}

/**
 * Obtener premios y su categoria como campo adicional
 */
function obtenerPremios(){
    global $conexion;
    $query = "SELECT 
                p.id_premio as idPremio,
                p.nombre as nombrePremio,
                p.incluye_dinero as incluyeDinero,
                p.cantidad_dinero as cantidadDinero,
                c.nombre as nombreCategoria
              FROM premio p
              INNER JOIN categoria c ON p.id_categoria = c.id_categoria
              ORDER BY c.nombre, p.nombre";
    $stmt = $conexion->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();
    $premios = [];
    while ($row = $result->fetch_assoc()) {
        $premios[] = $row;
    }
    return $premios;
}

function obtenerFechasEventoPorMesAnio(){
    global $conexion;

    $mes = (int)$_POST['mes'];
    $anio = (int)$_POST['anio'];

    $query = "SELECT DISTINCT fecha FROM evento WHERE MONTH(fecha) = ? AND YEAR(fecha) = ? ORDER BY fecha ASC";
    $stmt = $conexion->prepare($query);
    $stmt->bind_param("ii", $mes, $anio);
    $stmt->execute();
    $result = $stmt->get_result();

    $fechas = [];
    while ($row = $result->fetch_assoc()) {
        $fechas[] = $row['fecha'];
    }

    echo json_encode([
        "status" => "success",
        "data" => $fechas
    ]);
}

cerrarConexion();
