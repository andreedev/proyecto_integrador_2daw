<?php
session_start();
require('./BBDD/connection.php'); // Debe definir $conn como mysqli
require_once('./BBDD/BD.php');
header("Content-Type: application/json; charset=UTF-8");

if (!$conexion || !($conexion instanceof mysqli)) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión"]);
    exit;
}

// Verificar autenticación (asumiendo que solo organizadores pueden gestionar ganadores)
if (!isset($_SESSION['id_organizador'])) {
    http_response_code(401);
    echo json_encode(["error" => "Usuario no autenticado"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit;
}

// Datos comunes
$id_edicion = $_POST['id_edicion'] ?? null;
$categoria = trim($_POST['categoria'] ?? '');
$nombre_ganador = trim($_POST['nombre'] ?? '');
$premio_nombre = trim($_POST['premio'] ?? '');
$id_archivo_video = !empty($_POST['id_archivo_video']) ? (int)$_POST['id_archivo_video'] : null;

// Validar edición existente (opcional, pero recomendado)
if ($id_edicion !== null) {
    $check_edicion = $conexion->prepare("SELECT id_edicion FROM edicion WHERE id_edicion = ?");
    $check_edicion->bind_param("i", $id_edicion);
    $check_edicion->execute();
    $res_ed = $check_edicion->get_result();
    if (!$res_ed->fetch_assoc()) {
        http_response_code(400);
        echo json_encode(["error" => "Edición no válida"]);
        exit;
    }
    $check_edicion->close();
}

// 1. Registrar un nuevo ganador
if (!empty($categoria) && !empty($nombre_ganador) && !empty($premio_nombre) && $id_edicion !== null) {
    try {
        $stmt = $conexion->prepare("INSERT INTO ganadores_edicion (id_edicion, categoria, nombre, premio, id_archivo_video) VALUES (?, ?, ?, ?, ?)");
        if (!$stmt) throw new Exception("Error al preparar: " . $conexion->error);
        
        $stmt->bind_param("isssi", $id_edicion, $categoria, $nombre_ganador, $premio_nombre, $id_archivo_video);
        $stmt->execute();

        if ($stmt->errno) throw new Exception($stmt->error);

        echo json_encode([
            'success' => true,
            'message' => 'Ganador anunciado correctamente',
            'id_ganador_edicion' => $conexion->insert_id
        ]);
        $stmt->close();
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al registrar ganador: ' . $e->getMessage()]);
        exit;
    }
}

// 2. Editar un ganador existente
$id_ganador_edicion = $_POST['id_ganador_edicion'] ?? null;
if ($id_ganador_edicion !== null && isset($_POST['editar'])) {
    try {
        // Verificar que exista
        $check = $conexion->prepare("SELECT id_ganador_edicion FROM ganadores_edicion WHERE id_ganador_edicion = ?");
        $check->bind_param("i", $id_ganador_edicion);
        $check->execute();
        $exists = $check->get_result()->fetch_assoc();
        $check->close();

        if (!$exists) {
            http_response_code(404);
            echo json_encode(['error' => 'Ganador no encontrado']);
            exit;
        }

        $stmt = $conexion->prepare("UPDATE ganadores_edicion SET id_edicion = ?, categoria = ?, nombre = ?, premio = ?, id_archivo_video = ? WHERE id_ganador_edicion = ?");
        if (!$stmt) throw new Exception("Error al preparar actualización");

        $stmt->bind_param("isssii", $id_edicion, $categoria, $nombre_ganador, $premio_nombre, $id_archivo_video, $id_ganador_edicion);
        $stmt->execute();

        if ($stmt->errno) throw new Exception($stmt->error);

        echo json_encode(['success' => true, 'message' => 'Ganador actualizado correctamente']);
        $stmt->close();
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al actualizar ganador: ' . $e->getMessage()]);
        exit;
    }
}

// 3. Eliminar un ganador
if ($id_ganador_edicion !== null && isset($_POST['eliminar'])) {
    try {
        $stmt = $conexion->prepare("DELETE FROM ganadores_edicion WHERE id_ganador_edicion = ?");
        $stmt->bind_param("i", $id_ganador_edicion);
        $stmt->execute();

        if ($stmt->errno) {
            if ($stmt->errno == 1451) {
                throw new Exception("No se puede eliminar: existen referencias asociadas.");
            }
            throw new Exception($stmt->error);
        }

        if ($stmt->affected_rows === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Ganador no encontrado']);
        } else {
            echo json_encode(['success' => true, 'message' => 'Ganador eliminado correctamente']);
        }
        $stmt->close();
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al eliminar ganador: ' . $e->getMessage()]);
        exit;
    }
}

// Si no coincide ninguna operación
http_response_code(400);
echo json_encode(['error' => 'Solicitud incompleta. Proporcione los datos necesarios para registrar, editar o eliminar un ganador.']);
?>