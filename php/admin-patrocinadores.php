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

$nombre = trim($_POST['nombre'] ?? '');
$id_archivo_logo = !empty($_POST['id_archivo_logo']) ? (int)$_POST['id_archivo_logo'] : null;


// 1. Añadir patrocinador
if (!empty($nombre)) {
    try {
        $stmt = $conexion->prepare("INSERT INTO patrocinador (nombre, id_archivo_logo) VALUES (?, ?)");
        if (!$stmt) {
            throw new Exception("Error al preparar inserción: " . $conexion->error);
        }
        $stmt->bind_param("si", $nombre, $id_archivo_logo);
        $stmt->execute();

        if ($stmt->errno) {
            throw new Exception($stmt->error);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Patrocinador añadido correctamente',
            'id_patrocinador' => $conexion->insert_id
        ]);
        $stmt->close();
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al guardar patrocinador: ' . $e->getMessage()]);
        exit;
    }
}

// 2. Editar patrocinador
$id_patrocinador = $_POST['id_patrocinador'] ?? null;
if ($id_patrocinador !== null && isset($_POST['editar'])) {
    try {
        // Verificar que exista
        $check = $conexion->prepare("SELECT id_patrocinador FROM patrocinador WHERE id_patrocinador = ?");
        $check->bind_param("i", $id_patrocinador);
        $check->execute();
        $exists = $check->get_result()->fetch_assoc();
        $check->close();

        if (!$exists) {
            http_response_code(404);
            echo json_encode(['error' => 'Patrocinador no encontrado']);
            exit;
        }

        $stmt = $conexion->prepare("UPDATE patrocinador SET nombre = ?, id_archivo_logo = ? WHERE id_patrocinador = ?");
        if (!$stmt) {
            throw new Exception("Error al preparar actualización: " . $conexion->error);
        }
        $stmt->bind_param("sii", $nombre, $id_archivo_logo, $id_patrocinador);
        $stmt->execute();

        if ($stmt->errno) {
            throw new Exception($stmt->error);
        }

        echo json_encode(['success' => true, 'message' => 'Patrocinador actualizado correctamente']);
        $stmt->close();
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al actualizar patrocinador: ' . $e->getMessage()]);
        exit;
    }
}

// 3. Eliminar patrocinador
if ($id_patrocinador !== null && isset($_POST['eliminar'])) {
    try {
        $stmt = $conexion->prepare("DELETE FROM patrocinador WHERE id_patrocinador = ?");
        $stmt->bind_param("i", $id_patrocinador);
        $stmt->execute();

        if ($stmt->errno) {
            //No puede eliminarlo porque hay una FK que lo intercepta
            if ($stmt->errno == 1451) {
                throw new Exception("No se puede eliminar: el patrocinador está en uso.");
            }
            throw new Exception($stmt->error);
        }

        if ($stmt->affected_rows === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Patrocinador no encontrado']);
        } else {
            echo json_encode(['success' => true, 'message' => 'Patrocinador eliminado correctamente']);
        }
        $stmt->close();
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al eliminar patrocinador: ' . $e->getMessage()]);
        exit;
    }
}

// Si no se cumplió ninguna operación
http_response_code(400);
echo json_encode(['error' => 'Solicitud no válida. Proporcione los datos necesarios.']);
?>