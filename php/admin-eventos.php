<?php
session_start();
require('./BBDD/connection.php');
require_once('./BBDD/BD.php');
header("Content-Type: application/json; charset=UTF-8");

if (!$conexion || !($conexion instanceof mysqli)) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = trim($_POST['nombre'] ?? '');
    $descripcion = trim($_POST['descripcion'] ?? '');
    $ubicacion = trim($_POST['ubicacion'] ?? '');
    $fecha = $_POST['fecha'] ?? date('Y-m-d');
    $hora_inicio = $_POST['hora_inicio'] ?? null;
    $hora_fin = $_POST['hora_fin'] ?? null;
    $id_archivo_imagen = !empty($_POST['id_archivo_imagen']) ? (int)$_POST['id_archivo_imagen'] : null;
    $id_organizador = $_SESSION['id_organizador'] ?? null;

    if ($id_organizador === null) {
        http_response_code(401);
        echo json_encode(["error" => "Usuario no autenticado"]);
        exit;
    }
}

// Insertar un evento
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($nombre)) {
    try {
        $stmt_crear = $conexion->prepare("INSERT INTO evento (nombre, descripcion, ubicacion, fecha, hora_inicio, hora_fin, id_archivo_imagen, id_organizador) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        if (!$stmt_crear) {
            throw new Exception("Error en la preparación: " . $conexion->error);
        }
        $stmt_crear->bind_param("ssssssii", $nombre, $descripcion, $ubicacion, $fecha, $hora_inicio, $hora_fin, $id_archivo_imagen, $id_organizador);
        $stmt_crear->execute();

        if ($stmt_crear->errno) {
            throw new Exception($stmt_crear->error);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Evento creado correctamente',
            'id_evento' => $conexion->insert_id
        ]);
        $stmt_crear->close();
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al guardar el evento: ' . $e->getMessage()]);
        exit;
    }
}

// Editar o eliminar requieren id_evento
$id_evento = $_POST['id_evento'] ?? null;

// Editar un evento
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $id_evento !== null && isset($_POST['editar'])) {
    try {
        $stmt_check = $conexion->prepare("SELECT id_organizador FROM evento WHERE id_evento = ?");
        $stmt_check->bind_param("i", $id_evento);
        $stmt_check->execute();
        $result = $stmt_check->get_result();
        $evento = $result->fetch_assoc();
        $stmt_check->close();

        if (!$evento) {
            http_response_code(404);
            echo json_encode(['error' => 'Evento no encontrado.']);
            exit;
        }
        if ((int)$evento['id_organizador'] !== (int)$id_organizador) {
            http_response_code(403);
            echo json_encode(['error' => 'No tienes permiso para editar este evento.']);
            exit;
        }

        $stmt_edit = $conexion->prepare("UPDATE evento SET nombre = ?, descripcion = ?, ubicacion = ?, fecha = ?, hora_inicio = ?, hora_fin = ?, id_archivo_imagen = ? WHERE id_evento = ?");
        $stmt_edit->bind_param("ssssssii", $nombre, $descripcion, $ubicacion, $fecha, $hora_inicio, $hora_fin, $id_archivo_imagen, $id_evento);
        $stmt_edit->execute();

        if ($stmt_edit->errno) {
            throw new Exception($stmt_edit->error);
        }

        echo json_encode(['success' => true, 'message' => 'Evento actualizado correctamente']);
        $stmt_edit->close();
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al actualizar: ' . $e->getMessage()]);
        exit;
    }
}

// Eliminar un evento
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $id_evento !== null && isset($_POST['eliminar'])) {
    try {
        $stmt_check = $conexion->prepare("SELECT id_organizador FROM evento WHERE id_evento = ?");
        $stmt_check->bind_param("i", $id_evento);
        $stmt_check->execute();
        $result = $stmt_check->get_result();
        $evento = $result->fetch_assoc();
        $stmt_check->close();

        if (!$evento) {
            http_response_code(404);
            echo json_encode(['error' => 'Evento no encontrado.']);
            exit;
        }
        if ((int)$evento['id_organizador'] !== (int)$id_organizador) {
            http_response_code(403);
            echo json_encode(['error' => 'No tienes permiso para eliminar este evento.']);
            exit;
        }

        $stmt_del = $conexion->prepare("DELETE FROM evento WHERE id_evento = ?");
        $stmt_del->bind_param("i", $id_evento);
        $stmt_del->execute();

        if ($stmt_del->errno) {
            throw new Exception($stmt_del->error);
        }

        echo json_encode(['success' => true, 'message' => 'Evento eliminado correctamente']);
        $stmt_del->close();
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al eliminar: ' . $e->getMessage()]);
        exit;
    }
}

http_response_code(400);
echo json_encode(['error' => 'Solicitud no válida. Proporcione los datos necesarios.']);
