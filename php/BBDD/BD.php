<?php
require_once "connection.php";

function crearBaseDatosSiNoExiste() {
    global $conexion, $db;

    $sql = "SHOW DATABASES LIKE '$db'";
    $resultado = $conexion->query($sql);

    if ($resultado->num_rows <= 0) {
        $conexion->query("CREATE DATABASE $db") or die("Error creando BD: " . $conexion->error);

        seleccionarBaseDatos();

        $sql_tables = "
                CREATE TABLE archivo(
                    id_archivo INT AUTO_INCREMENT PRIMARY KEY,
                    ruta TEXT
                ); 
        
                CREATE TABLE categoria (
                    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL
                );
                
                CREATE TABLE premio (
                    id_premio INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(150) NOT NULL,
                    incluye_dinero BOOLEAN DEFAULT TRUE,
                    cantidad_dinero DECIMAL(10,2),
                    id_categoria INT NOT NULL,
                    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
                );
                
                CREATE TABLE participante (
                    id_participante INT AUTO_INCREMENT PRIMARY KEY,
                    dni VARCHAR(15) UNIQUE,
                    nro_expediente VARCHAR(50),
                    nombre VARCHAR(100),
                    correo VARCHAR(150),
                    contrasena VARCHAR(255)
                );
                
                CREATE TABLE candidatura (
                    id_candidatura INT AUTO_INCREMENT PRIMARY KEY,
                    id_participante INT NOT NULL,
                    estado VARCHAR(50),
                    fecha_presentacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    fecha_ultima_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    sinopsis TEXT,
                    id_archivo_video INT comment 'Archivo del video del cortometraje',
                    id_archivo_ficha INT comment 'Archivo de la ficha técnica del cortometraje',
                    id_archivo_cartel INT comment 'Archivo del cartel del cortometraje',
                    id_archivo_trailer INT comment 'Archivo del trailer del cortometraje',
                    FOREIGN KEY (id_participante) REFERENCES participante(id_participante),
                    FOREIGN KEY (id_archivo_video) REFERENCES archivo(id_archivo),
                    FOREIGN KEY (id_archivo_ficha) REFERENCES archivo(id_archivo),
                    FOREIGN KEY (id_archivo_cartel) REFERENCES archivo(id_archivo),
                    FOREIGN KEY (id_archivo_trailer) REFERENCES archivo(id_archivo)
                );
                
                CREATE TABLE historial_candidatura (
                    id_historial INT AUTO_INCREMENT PRIMARY KEY,
                    id_candidatura INT NOT NULL,
                    estado VARCHAR(50),
                    motivo TEXT,
                    estado_correo_enviado BOOLEAN DEFAULT FALSE,
                    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (id_candidatura) REFERENCES candidatura(id_candidatura)
                );
                
                CREATE TABLE premio_candidatura (
                    id_premio INT NOT NULL,
                    id_candidatura INT NOT NULL,
                    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (id_premio, id_candidatura),
                    FOREIGN KEY (id_premio) REFERENCES premio(id_premio),
                    FOREIGN KEY (id_candidatura) REFERENCES candidatura(id_candidatura)
                );
                
                CREATE TABLE organizador (
                    id_organizador INT AUTO_INCREMENT PRIMARY KEY,
                    nro_empresa VARCHAR(50),
                    nombre VARCHAR(100),
                    correo VARCHAR(150),
                    contrasena VARCHAR(255),
                    dni VARCHAR(15)
                );
                
                CREATE TABLE configuracion (
                    id_configuracion INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100),
                    valor TEXT,
                    id_organizador INT,
                    FOREIGN KEY (id_organizador) REFERENCES organizador(id_organizador)
                );
                
                CREATE TABLE noticia (
                    id_noticia INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(150),
                    descripcion TEXT,
                    fecha DATE,
                    id_archivo_imagen INT comment 'Imagen de la noticia',
                    id_organizador INT,
                    FOREIGN KEY (id_organizador) REFERENCES organizador(id_organizador),
                    FOREIGN KEY (id_archivo_imagen) REFERENCES archivo(id_archivo)
                );
                
                CREATE TABLE evento (
                    id_evento INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(150),
                    descripcion TEXT,
                    ubicacion VARCHAR(150),
                    fecha DATE,
                    hora_inicio TIME,
                    hora_fin TIME,
                    id_archivo_imagen INT comment 'Imagen del evento',
                    id_organizador INT,
                    FOREIGN KEY (id_organizador) REFERENCES organizador(id_organizador),
                    FOREIGN KEY (id_archivo_imagen) REFERENCES archivo(id_archivo)
                );
                
                CREATE TABLE edicion (
                    id_edicion INT AUTO_INCREMENT PRIMARY KEY,
                    anio_edicion INT,
                    resumen_evento TEXT,
                    nro_participantes INT,
                    fecha_envio_email_informativo DATE,
                    fecha_borrado_datos DATE,
                    tipo ENUM('anterior', 'actual') DEFAULT 'actual'
                );
                
                CREATE TABLE edicion_archivos (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    id_archivo INT NOT NULL,
                    id_edicion INT NOT NULL,
                    FOREIGN KEY (id_edicion) REFERENCES edicion(id_edicion),
                    FOREIGN KEY (id_archivo) REFERENCES archivo(id_archivo)
                );
                
                CREATE TABLE ganadores_edicion (
                    id_ganador_edicion INT AUTO_INCREMENT PRIMARY KEY,
                    id_edicion INT NOT NULL,
                    categoria VARCHAR(100),
                    nombre VARCHAR(100),
                    premio VARCHAR(100),
                    id_archivo_video INT comment 'Video del cortometraje de un ganador',
                    FOREIGN KEY (id_edicion) REFERENCES edicion(id_edicion),
                    FOREIGN KEY (id_archivo_video) REFERENCES archivo(id_archivo)
                );
                
                CREATE TABLE patrocinador (
                    id_patrocinador INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100),
                    id_archivo_logo INT,
                    FOREIGN KEY (id_archivo_logo) REFERENCES archivo(id_archivo)
                );
                
                -- =========================
                -- INSERTS
                
                INSERT INTO archivo (ruta) VALUES
                ('uploads/public/_FESTIVAL_CORTOS_CABACERA_GENERAL_2_s3Edkcr.width-800.jpg'),
                ('uploads/public/file_example_MP4_480_1_5MG.mp4'),
                ('uploads/public/_FESTIVAL_CORTOS_CABACERA_GENERAL_2_s3Edkcr.width-800.jpg'),
                ('uploads/public/file_example_MP4_480_1_5MG.mp4'),
                ('uploads/public/_FESTIVAL_CORTOS_CABACERA_GENERAL_2_s3Edkcr.width-800.jpg'),
                ('uploads/public/file_example_MP4_480_1_5MG.mp4'),
                ('uploads/public/_FESTIVAL_CORTOS_CABACERA_GENERAL_2_s3Edkcr.width-800.jpg'),
                ('uploads/public/file_example_MP4_480_1_5MG.mp4'),
                ('uploads/public/_FESTIVAL_CORTOS_CABACERA_GENERAL_2_s3Edkcr.width-800.jpg'),
                ('uploads/public/file_example_MP4_480_1_5MG.mp4'),
                ('uploads/public/_FESTIVAL_CORTOS_CABACERA_GENERAL_2_s3Edkcr.width-800.jpg'),
                ('uploads/public/file_example_MP4_480_1_5MG.mp4');
                
                INSERT INTO categoria (nombre) VALUES
                ('Mejor cortometraje UE (alumno)'),
                ('Mejor cortometraje alumni'),
                ('Premio honorífico');
                
                INSERT INTO participante (nombre, dni, correo, contrasena, nro_expediente) VALUES
                ('Juan Pérez', '11111111A', 'juan@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-001'),
                ('María López', '22222222B', 'maria@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-002'),
                ('Carlos Ruiz', '33333333C', 'carlos@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-003'),
                ('Laura Gómez', '44444444D', 'laura@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-004'),
                ('Ana Torres', '55555555E', 'ana@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-005');
                
                INSERT INTO candidatura (id_participante, estado, sinopsis, id_archivo_video, id_archivo_ficha, id_archivo_cartel, id_archivo_trailer) VALUES
                (1, 'En revisión', 'Cortometraje sobre la vida urbana.', 1, 2, 3, NULL),
                (2, 'En revisión', 'Documental sobre la naturaleza.', 4, 5, 6, NULL),
                (3, 'En revisión', 'Cortometraje de animación.', 7, 8, 9, NULL),
                (4, 'En revisión', 'Cortometraje de ficción dramática.', 10, 11, 12, NULL),
                (5, 'En revisión', 'Cortometraje experimental.', 1, 2, 3, NULL);
                
                INSERT INTO premio (nombre, incluye_dinero, cantidad_dinero, id_categoria) VALUES
                ('Primer premio', true, 600.00, 1),
                ('Segundo premio', true, 300.00, 1),
                ('Tercer premio', true, 100.00, 1),
                ('Primer premio', true, 700.00, 2),
                ('Segundo premio', true, 300.00, 2),
                ('Reconocimiento Honorífico', false, NULL, 3);
                
                INSERT INTO organizador (nro_empresa, nombre, correo, contrasena, dni) VALUES
                ('EMP-001', 'Organizador Madrid', 'admin@gmail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', '99999999Z');
               
               INSERT INTO configuracion (nombre, valor, id_organizador) VALUES
                    ('modo', 'pre-evento', 1),
                    ('minCandidaturas', '2', 1),
                    ('maxCandidaturas', '5', 1),
                    ('galaProximaFecha', '2027-12-21', 1),
                    ('galaPreEventoTitulo', 'Festival de Cine 2026', 1),
                    ('galaPreEventoFecha', '2026-12-20', 1),
                    ('galaPreEventoHora', '15:00', 1),
                    ('galaPreEventoUbicacion', 'Auditorio Principal', 1),
                    ('galaPreEventoDescripcion', '¡Bienvenidos a la Gala de Cortometrajes 2026! Únete a nosotros para celebrar el talento creativo de nuestros estudiantes y alumni', 1),
                    ('galaPreEventoStreamingActivo', 'true', 1),
                    ('galaPreEventoStreamingUrl', 'https://streaming.ejemplo.com/gala2026', 1),
                    ('fechaUltimaModificacionConfiguracion', CURRENT_TIMESTAMP, 1),
                    ('baseUrl', 'http://localhost/DWES/proyecto_integrador_2daw/', 1);
                    
                INSERT INTO edicion (anio_edicion, resumen_evento, nro_participantes, tipo) VALUES
                    (2023, 'Resumen 2023', 150, 'anterior'),
                    (2024, 'Resumen 2024', 200, 'actual');
                
                INSERT INTO ganadores_edicion (id_edicion, categoria, nombre, premio, id_archivo_video) VALUES
                    (1, 'Documental', 'Juan Pérez', 'Mejor Documental', 1),
                    (1, 'Cortometraje', 'María López', 'Mejor Cortometraje', 4);
                
                INSERT INTO historial_candidatura (id_candidatura, estado, motivo) VALUES (1, 'En revisión', 'Inicio');
                INSERT INTO premio_candidatura (id_premio, id_candidatura) VALUES (1, 2);
                
                INSERT INTO edicion_archivos (id_archivo, id_edicion) VALUES
                (1, 1),
                (2, 1),
                (3, 2),
                (4, 2);
                
                INSERT INTO noticia (nombre, descripcion, fecha, id_organizador, id_archivo_imagen) VALUES
                ('Anuncio del festival', 'Lanzamiento oficial del festival de cortometrajes.', '2024-05-01', 1, 1),
                ('Jurado confirmado', 'Presentación del jurado para esta edición.', '2024-05-10', 1, 3),
                ('Programa de eventos', 'Calendario completo de eventos y proyecciones.', '2024-05-15', 1, 5);
                
                INSERT INTO evento (nombre, descripcion, ubicacion, fecha, hora_inicio, hora_fin, id_organizador, id_archivo_imagen) VALUES
                ('Proyección inaugural', 'Proyección del cortometraje inaugural del festival.', 'Cine Principal', '2024-06-01', '19:00', '21:00', 1, 2),
                ('Taller de cine', 'Taller práctico sobre técnicas de filmación.', 'Sala de Talleres', '2024-06-05', '10:00', '13:00', 1, 4),
                ('Clausura y entrega de premios', 'Ceremonia de clausura y entrega de premios a los ganadores.', 'Teatro Central', '2024-06-10', '20:00', '22:00', 1, 6);
                
                INSERT INTO patrocinador (nombre, id_archivo_logo) VALUES
                ('Canon', 1);
        
            ";

        if ($conexion->multi_query($sql_tables)) {
            // Vaciar los resultados de multi_query para evitar errores de sincronización
            do {
                if ($res = $conexion->store_result()) { $res->free(); }
            } while ($conexion->more_results() && $conexion->next_result());
        } else {
            die("Error al inicializar tablas: " . $conexion->error);
        }

    } else {
        seleccionarBaseDatos();
    }
}