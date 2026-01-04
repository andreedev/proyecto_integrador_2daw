<?php
$servidor = "localhost";
$usuario = "root";
$password = "";
$db = "festival_cortos";

// Conectar
$conexion = new mysqli($servidor, $usuario, $password);
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Comprobar si la base de datos existe
$sql = "SHOW DATABASES LIKE '$db'";
$comprobar = $conexion->query($sql);
if ($conexion->connect_error) {
    die("Error al comprobar la base de datos: " . $conexion->error);
}

if ($comprobar->num_rows <= 0) {
    // Crear base de datos
    $sql_database = "CREATE DATABASE $db";
    $conexion->query($sql_database) or die("Error al crear la base de datos");
    $conexion->select_db($db);

    // Crear tablas e insertar datos
    $sql_tables = "

    -- CATEGORIA
CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150),
    nro_expediente VARCHAR(50)
);

-- PREMIO
CREATE TABLE premio (
    id_premio INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(150),
    video_recorrido TEXT,
    cantidad_dinero DECIMAL(10,2),
    id_categoria INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

-- PARTICIPANTE
CREATE TABLE participante (
    id_participante INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    dni VARCHAR(15) UNIQUE,
    correo VARCHAR(150),
    contrasena VARCHAR(255),
    nro_expediente VARCHAR(50)
);

-- CANDIDATURA
CREATE TABLE candidatura (
    id_candidatura INT AUTO_INCREMENT PRIMARY KEY,
    id_participante INT NOT NULL,
    estado VARCHAR(50),
    fecha_presentacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizada TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    sinopsis TEXT,
    url_video TEXT,
    url_ficha TEXT,
    url_cartel TEXT,
    FOREIGN KEY (id_participante) REFERENCES participante(id_participante)
);

-- HISTORIAL CANDIDATURA
CREATE TABLE historial_candidatura (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    id_candidatura INT NOT NULL,
    estado VARCHAR(50),
    motivo TEXT,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_candidatura) REFERENCES candidatura(id_candidatura)
);

-- PREMIO_CANDIDATURA
CREATE TABLE premio_candidatura (
    id_premio INT NOT NULL,
    id_candidatura INT NOT NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_premio, id_candidatura),
    FOREIGN KEY (id_premio) REFERENCES premio(id_premio),
    FOREIGN KEY (id_candidatura) REFERENCES candidatura(id_candidatura)
);

-- ORGANIZADOR
CREATE TABLE organizador (
    id_organizador INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    correo VARCHAR(150),
    contrasena VARCHAR(255),
    dni VARCHAR(15),
    nro_empresa VARCHAR(50)
);

-- CONFIGURACION
CREATE TABLE configuracion (
    id_configuracion INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    valor TEXT,
    id_organizador INT,
    FOREIGN KEY (id_organizador) REFERENCES organizador(id_organizador)
);

-- NOTICIA
CREATE TABLE noticia (
    id_noticia INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150),
    descripcion TEXT,
    fecha DATE,
    url_imagen TEXT,
    id_organizador INT,
    FOREIGN KEY (id_organizador) REFERENCES organizador(id_organizador)
);

-- EVENTO
CREATE TABLE evento (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150),
    descripcion TEXT,
    ubicacion VARCHAR(150),
    fecha DATE,
    hora_inicio TIME,
    hora_fin TIME,
    url_imagen TEXT,
    id_organizador INT,
    FOREIGN KEY (id_organizador) REFERENCES organizador(id_organizador)
);

-- EDICION
CREATE TABLE edicion (
    id_edicion INT AUTO_INCREMENT PRIMARY KEY,
    anio_edicion INT,
    nro_participantes INT,
    nombre_ganadores TEXT,
    titulo_corto VARCHAR(100),
    url_video TEXT,
    id_evento INT,
    FOREIGN KEY (id_evento) REFERENCES evento(id_evento)
);

-- =========================
-- INSERTS

INSERT INTO categoria (nombre, correo, nro_expediente) VALUES
('Documental', 'docu@cine.com', 'CAT-001'),
('Cortometraje', 'corto@cine.com', 'CAT-002'),
('Animación', 'anim@cine.com', 'CAT-003'),
('Ficción', 'fic@cine.com', 'CAT-004'),
('Experimental', 'exp@cine.com', 'CAT-005');

INSERT INTO premio (nombre_completo, telefono, correo, cantidad_dinero, id_categoria) VALUES
('Mejor Documental', '600111111', 'docu@cine.com', 5000, 1),
('Mejor Cortometraje', '600222222', 'corto@cine.com', 3000, 2),
('Mejor Animación', '600333333', 'anim@cine.com', 4000, 3),
('Mejor Ficción', '600444444', 'fic@cine.com', 6000, 4),
('Premio Especial', '600555555', 'exp@cine.com', 2000, 5);

INSERT INTO participante (nombre, dni, correo, contrasena, nro_expediente) VALUES
('Juan Pérez', '11111111A', 'juan@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-001'),
('María López', '22222222B', 'maria@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-002'),
('Carlos Ruiz', '33333333C', 'carlos@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-003'),
('Laura Gómez', '44444444D', 'laura@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-004'),
('Ana Torres', '55555555E', 'ana@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-005');
INSERT INTO candidatura (id_participante, estado, fecha_presentacion, sinopsis) VALUES
(1, 'En revisión', NOW(), 'Documental sobre el océano'),
(2, 'Aceptada', NOW(), 'Corto social'),
(3, 'Rechazada', NOW(), 'Animación abstracta'),
(4, 'Aceptada', NOW(), 'Drama histórico'),
(5, 'En revisión', NOW(), 'Obra experimental');

INSERT INTO historial_candidatura (id_candidatura, estado, motivo) VALUES
(1, 'En revisión', 'Pendiente jurado'),
(2, 'Aceptada', 'Alta calidad'),
(3, 'Rechazada', 'No cumple bases'),
(4, 'Aceptada', 'Excelente guion'),
(5, 'En revisión', 'Documentación incompleta');

INSERT INTO organizador (nombre, correo, contrasena, dni, nro_empresa) VALUES
('admin', 'admin@uem.org', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', '99999991Z', 'EMP-001'),
('Asoc. Cultural', 'info@cultura.org', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', '99999992Z', 'EMP-002'),
('Cine Madrid', 'info@cinemad.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', '99999993Z', 'EMP-003'),
('Festival Films', 'info@films.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', '99999994Z', 'EMP-004'),
('Arte Visual', 'info@arte.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', '99999995Z', 'EMP-005');

INSERT INTO configuracion (nombre, valor, id_organizador) VALUES
('max_candidaturas', '5', 1),
('fecha_cierre', '2025-05-01', 1),
('idioma', 'ES', 2),
('publico', 'true', 3),
('modo_revision', 'manual', 4);

INSERT INTO noticia (nombre, descripcion, fecha, id_organizador) VALUES
('Inicio inscripciones', 'Se abre el plazo', CURRENT_DATE, 1),
('Recordatorio', 'Últimos días', CURRENT_DATE, 1),
('Nuevo jurado', 'Jurados confirmados', CURRENT_DATE, 2),
('Programa oficial', 'Programa publicado', CURRENT_DATE, 3),
('Clausura', 'Evento de cierre', CURRENT_DATE, 4);

INSERT INTO evento (nombre, descripcion, ubicacion, fecha, hora_inicio, hora_fin, id_organizador) VALUES
('Festival Cine 2025', 'Evento anual', 'Madrid', '2025-06-10', '18:00', '23:00', 1),
('Muestra Cortos', 'Cortometrajes', 'Barcelona', '2025-07-01', '17:00', '22:00', 2),
('Animafest', 'Animación', 'Valencia', '2025-08-15', '16:00', '21:00', 3),
('Ficción Fest', 'Cine ficción', 'Sevilla', '2025-09-20', '18:00', '00:00', 4),
('Arte Visual', 'Experimental', 'Bilbao', '2025-10-05', '19:00', '22:00', 5);

INSERT INTO edicion (anio_edicion, nro_participantes, nombre_ganadores, titulo_corto, id_evento) VALUES
(2025, 120, 'Juan Pérez', 'Edición 2025', 1),
(2024, 98, 'María López', 'Edición 2024', 2),
(2023, 110, 'Carlos Ruiz', 'Edición 2023', 3),
(2022, 87, 'Laura Gómez', 'Edición 2022', 4),
(2021, 75, 'Ana Torres', 'Edición 2021', 5);

INSERT INTO premio_candidatura (id_premio, id_candidatura) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

    ";

    if ($conexion->multi_query($sql_tables)) {
        while ($conexion->next_result()) {;
        }
        // echo "Base de datos creada y tablas inicializadas correctamente.";
    } else {
        // echo "Error: {$conexion->error}";
    }
}

$conexion->close();
