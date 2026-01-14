<?php
session_start();
require('./BBDD/connection.php');
require_once('./BBDD/BD.php');
header("Content-Type: application/json; charset=UTF-8");

if (!$pdo) {
    echo json_encode(["error" => "Error de conexión"]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = trim($_POST['nombre'] ?? '');
    $descripcion = trim($_POST['descripcion'] ?? '');
    $fecha = $_POST['fecha'] ?? date('Y-m-d');
    $id_archivo_imagen = !empty($_POST['id_archivo_imagen']) ? (int)$_POST['id_archivo_imagen'] : null;
    $id_organizador = $_SESSION['id_organizador'] ?? null;

    if ($id_organizador === null) {
        http_response_code(401);
        echo json_encode(["error" => "Usuario no autenticado"]);
    }
}

// Insertar una noticia
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($nombre)) {
    try {
        $stmt_crear = $pdo->prepare("INSERT INTO noticia (nombre, descripcion, fecha, id_archivo_imagen, id_organizador) VALUES (?, ?, ?, ?, ?)");
        $stmt_crear->execute([$nombre, $descripcion, $fecha, $id_archivo_imagen, $id_organizador]);
        echo json_encode([
            'success' => true,
            'message' => 'Noticia creada correctamente',
            'id_noticia' => $pdo->lastInsertId()
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al guardar la noticia: ' . $e->getMessage()]);
    }
}

// Editar o eliminar requieren id_noticia
$id_noticia = $_POST['id_noticia'] ?? null;

// Editar una noticia
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $id_noticia !== null && isset($_POST['editar'])) {
    try {
        $stmt_confirmar = $pdo->prepare("SELECT id_organizador FROM noticia WHERE id_noticia = ?");
        $stmt_confirmar->execute([$id_noticia]);
        $noticia = $stmt_confirmar->fetch();

        if (!$noticia) {
            http_response_code(404);
            echo json_encode(['error' => 'Noticia no encontrada.']);
        }
        if ((int)$noticia['id_organizador'] !== (int)$id_organizador) {
            http_response_code(403);
            echo json_encode(['error' => 'No tienes permiso para editar esta noticia.']);
        }

        $stmt_editar = $pdo->prepare("UPDATE noticia SET nombre = ?, descripcion = ?, fecha = ?, id_archivo_imagen = ? WHERE id_noticia = ?");
        $stmt_editar->execute([$nombre, $descripcion, $fecha, $id_archivo_imagen, $id_noticia]);

        echo json_encode(['success' => true, 'message' => 'Noticia actualizada correctamente']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al actualizar: ' . $e->getMessage()]);
    }
}

// Eliminar una noticia
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $id_noticia !== null && isset($_POST['eliminar'])) {
    try {
        $stmt_confirmar = $pdo->prepare("SELECT id_organizador FROM noticia WHERE id_noticia = ?");
        $stmt_confirmar->execute([$id_noticia]);
        $noticia = $stmt_confirmar->fetch();

        if (!$noticia) {
            http_response_code(404);
            echo json_encode(['error' => 'Noticia no encontrada.']);
        }
        if ((int)$noticia['id_organizador'] !== (int)$id_organizador) {
            http_response_code(403);
            echo json_encode(['error' => 'No tienes permiso para eliminar esta noticia.']);
        }

        $stmt_borrar = $pdo->prepare("DELETE FROM noticia WHERE id_noticia = ?");
        $stmt_borrar->execute([$id_noticia]);

        echo json_encode(['success' => true, 'message' => 'Noticia eliminada correctamente']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al eliminar: ' . $e->getMessage()]);
    }
}

// Si llega aquí sin hacer nada, responder con error
http_response_code(400);
echo json_encode(['error' => 'Solicitud no válida. Proporcione los datos necesarios.']);
