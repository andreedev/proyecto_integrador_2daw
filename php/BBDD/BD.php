<?php
require_once "conection.php";

function crearBaseDatosSiNoExiste() {
    global $conexion, $db;

    $sql = "SHOW DATABASES LIKE '$db'";
    $resultado = $conexion->query($sql);

    if ($resultado->num_rows <= 0) {
        $conexion->query("CREATE DATABASE $db") or die("Error creando BD: " . $conexion->error);

        seleccionarBaseDatos();

        $sql_tables = "
            -- CATEGORIA
                CREATE TABLE categoria (
                    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL
                );
                
                -- PREMIO
                CREATE TABLE premio (
                    id_premio INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(150) NOT NULL,
                    incluye_dinero BOOLEAN DEFAULT TRUE,
                    cantidad_dinero DECIMAL(10,2),
                    id_categoria INT NOT NULL,
                    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
                );
                
                -- PARTICIPANTE
                CREATE TABLE participante (
                    id_participante INT AUTO_INCREMENT PRIMARY KEY,
                    dni VARCHAR(15) UNIQUE,
                    nro_expediente VARCHAR(50),
                    nombre VARCHAR(100),
                    correo VARCHAR(150),
                    contrasena VARCHAR(255)
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
                    estado_correo_enviado BOOLEAN DEFAULT FALSE,
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
                    nro_empresa VARCHAR(50),
                    nombre VARCHAR(100),
                    correo VARCHAR(150),
                    contrasena VARCHAR(255),
                    dni VARCHAR(15)
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
                    galeria_imagenes TEXT comment 'JSON array de URL de imágenes',
                    galeria_videos TEXT comment 'JSON array de URL de videos'
                );
                
                 -- GANADORES
                CREATE TABLE ganadores (
                    id_ganador INT AUTO_INCREMENT PRIMARY KEY,
                    id_edicion INT NOT NULL,
                    categoria VARCHAR(100),
                    nombre VARCHAR(100),
                    premio VARCHAR(100),
                    url_video TEXT,
                    FOREIGN KEY (id_edicion) REFERENCES edicion(id_edicion)
                );
                
                -- =========================
                -- INSERTS
                
                INSERT INTO categoria (nombre) VALUES
                ('Mejor cortometraje UE (alumno)'),
                ('Mejor cortometraje alumni'),
                ('Premio honorífico');
                
                INSERT INTO premio (nombre, incluye_dinero, cantidad_dinero, id_categoria) VALUES
                ('Primer premio', true, 600.00, 1),
                ('Segundo premio', true, 300.00, 1),
                ('Tercer premio', true, 100.00, 1),
                ('Primer premio', true, 700.00, 2),
                ('Segundo premio', true, 300.00, 2),
                ('Reconocimiento Honorífico', false, NULL, 3);
                
                INSERT INTO participante (nombre, dni, correo, contrasena, nro_expediente) VALUES
                ('Juan Pérez', '11111111A', 'juan@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-001'),
                ('María López', '22222222B', 'maria@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-002'),
                ('Carlos Ruiz', '33333333C', 'carlos@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-003'),
                ('Laura Gómez', '44444444D', 'laura@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-004'),
                ('Ana Torres', '55555555E', 'ana@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-005');
                
                INSERT INTO candidatura (id_participante, estado, fecha_presentacion, sinopsis) VALUES
                (1, 'En revisión', '2024-05-01 10:00:00', 'Sinopsis del cortometraje de Juan Pérez.'),
                (2, 'Aceptada', '2024-05-02 11:30:00', 'Sinopsis del cortometraje de María López.'),
                (3, 'Rechazada', '2024-05-03 14:15:00', 'Sinopsis del cortometraje de Carlos Ruiz.'),
                (4, 'Aceptada', '2024-05-04 09:45:00', 'Sinopsis del cortometraje de Laura Gómez.'),
                (5, 'En revisión', '2024-05-05 16:20:00', 'Sinopsis del cortometraje de Ana Torres.');
                
                INSERT INTO historial_candidatura (id_candidatura, estado, motivo) VALUES
                (1, 'En revisión', 'Candidatura recibida y en proceso de revisión.'),
                (1, 'Rechazada', 'El cortometraje no cumple con los requisitos técnicos.'),
                (1, 'En revisión', 'Candidatura revisada nuevamente.'),
                (1, 'Aceptada', 'Candidatura aceptada para el festival.'),
                (1, 'Finalista', 'Cortometraje seleccionado como finalista.'),
                (2, 'En revisión', 'Candidatura recibida y en proceso de revisión.'),
                (2, 'Aceptada', 'Candidatura aceptada para el festival.'),
                (3, 'En revisión', 'Candidatura recibida y en proceso de revisión.'),
                (3, 'Rechazada', 'El cortometraje no cumple con los requisitos temáticos.'),
                (4, 'En revisión', 'Candidatura recibida y en proceso de revisión.'),
                (4, 'Aceptada', 'Candidatura aceptada para el festival.'),
                (5, 'En revisión', 'Candidatura recibida y en proceso de revisión.')
                ;
                
                INSERT INTO organizador (nro_empresa, nombre, correo, contrasena, dni) VALUES
                ('EMP-001', 'Organizador Madrid', 'admin@gmail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', '99999999Z'),
                ('EMP-002', 'Organizador Barcelona', 'organizador@gmail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', '8888888Y'),
                ('EMP-003', 'Organizador Valencia', 'valencia@gmail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', '77777777X'),
                ('EMP-004', 'Organizador Sevilla', 'sevilla@gmail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', '66666666W'),
                ('EMP-005', 'Organizador Alicante', 'alicante@gmail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', '55555555V')
                ;
                
                INSERT INTO configuracion (nombre, valor, id_organizador) VALUES
                ('modo_concurso', 'pre-evento', 1), -- pre-evento, post-evento
                ('min_candidaturas', '2', 1),
                ('max_candidaturas', '5', 1),
                ('gala_titulo_evento_principal', 'Festival de Cine 2026', 1),
                ('gala_fecha_evento_principal', '2026-12-20', 1),
                ('gala_hora_evento_principal', '15:00', 1),
                ('gala_descripcion_evento_principal', '¡Bienvenidos a la Gala de Cortometrajes 2026! Únete a nosotros para celebrar el talento creativo de nuestros estudiantes y alumni', 1),
                ('gala_ubicacion_evento', 'Auditorio Principal', 1),
                ('gala_proxima_fecha', '2027-12-21', 1),
                ('gala_streaming_activo', 'true', 1),
                ('gala_streaming_url', 'https://streaming.ejemplo.com/gala2026', 1),
                ('gala_post_evento_resumen', 'Gracias por asistir a la Gala de Cortometrajes 2026. Fue una noche inolvidable llena de talento y creatividad.', 1),
                ('gala_post_evento_galeria_imagenes', '[]', 1),
                ('gala_post_evento_galeria_videos', '[]', 1)
                ;
                
                INSERT INTO noticia (nombre, descripcion, fecha, id_organizador) VALUES
                ('Inicio inscripciones', 'Se abre el plazo', CURRENT_DATE, 1),
                ('Recordatorio', 'Últimos días', CURRENT_DATE, 1),
                ('Nuevo jurado', 'Jurados confirmados', CURRENT_DATE, 2),
                ('Programa oficial', 'Programa publicado', CURRENT_DATE, 3),
                ('Clausura', 'Evento de cierre', CURRENT_DATE, 4);
                
                INSERT INTO evento (nombre, descripcion, ubicacion, fecha, hora_inicio, hora_fin, id_organizador) VALUES
                ('Ceremonia apertura', 'Inauguración del festival', 'Teatro Principal', '2024-06-01', '18:00', '20:00', 1),
                ('Proyección cortometrajes', 'Selección oficial', 'Sala 1', '2024-06-02', '10:00', '13:00', 1),
                ('Taller de cine', 'Taller para participantes', 'Aula 5', '2024-06-02', '14:00', '16:00', 2),
                ('Mesa redonda jurado', 'Discusión con jurados', 'Sala de conferencias', '2024-06-03', '11:00', '12:30', 3),
                ('Gala de clausura', 'Entrega de premios y cierre', 'Gran Salón', '2024-06-03', '19:00', '22:00', 1);
                
                INSERT INTO edicion (anio_edicion, nro_participantes, galeria_imagenes, galeria_videos) VALUES
                (2023, 50, '[]', '[]'),
                (2024, 60, '[]', '[]');
                
                INSERT INTO ganadores (id_edicion, categoria, nombre, premio, url_video) VALUES
                (1, 'Documental', 'Juan Pérez', 'Mejor Documental', ''),
                (1, 'Cortometraje', 'María López', 'Mejor Cortometraje', ''),
                (1, 'Animación', 'Carlos Ruiz', 'Mejor Animación', ''),
                (1, 'Ficción', 'Laura Gómez', 'Mejor Ficción', ''),
                (1, 'Experimental', 'Ana Torres', 'Premio Especial', '')
                ;
                
                INSERT INTO premio_candidatura (id_premio, id_candidatura) VALUES
                (1, 2),
                (4, 4),
                (6, 1),
                (2, 5),
                (3, 3),
                (5, 2)
                ;
        
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