<?php
require_once __DIR__ . "/connection.php";

function crearBaseDatosSiNoExiste()
{
    global $conexion;

    $db = $_ENV['DB_NAME'];

    $sql = "SHOW DATABASES LIKE '$db'";
    $resultado = $conexion->query($sql);

    if ($resultado->num_rows <= 0) {
        $conexion->query("CREATE DATABASE $db") or die("Error creando BD: " . $conexion->error);

        $conexion->select_db($db);

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
                    estado ENUM('En revisión', 'Aceptada', 'Rechazada', 'Finalista') DEFAULT 'En revisión',
                    tipo_candidatura ENUM('alumno', 'alumni') NOT NULL,
                    fecha_presentacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    fecha_ultima_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    titulo varchar(200),
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
                    id_premio INT NOT NULL UNIQUE,
                    id_candidatura INT NOT NULL UNIQUE,
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
                    tipo ENUM('anterior', 'actual') DEFAULT 'actual',
                    id_organizador INT,
                    FOREIGN KEY (id_organizador) REFERENCES organizador(id_organizador)
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
                    id_archivo_video INT comment 'Video o trailer del cortometraje de un ganador',
                    FOREIGN KEY (id_edicion) REFERENCES edicion(id_edicion),
                    FOREIGN KEY (id_archivo_video) REFERENCES archivo(id_archivo)
                );
                
                CREATE TABLE patrocinador (
                    id_patrocinador INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100),
                    id_archivo_logo INT,
                    FOREIGN KEY (id_archivo_logo) REFERENCES archivo(id_archivo)
                );
                
                CREATE TRIGGER tr_crear_historial_insercion
                AFTER INSERT ON candidatura
                FOR EACH ROW
                INSERT INTO historial_candidatura (id_candidatura, estado, motivo, fecha_hora)
                VALUES (NEW.id_candidatura, 'En revisión', NULL, NOW());
                
                -- =========================
                -- INSERTS
                
                INSERT INTO archivo (id_archivo, ruta) VALUES
                (1, 'uploads/public/corto_blava_terra.mp4'),
                (2, 'uploads/public/corto_la_otra_orilla.mp4'),
                (3, 'uploads/public/corto_si_no_fuera_por_mi.mp4'),
                (4, 'uploads/public/corto_un_dia_perfecto.mp4'),
                (5, 'uploads/public/corto_violetas.mp4'),
                (6,  'uploads/public/cartel_BLAVA-TERRA.jpg'),
                (7,  'uploads/public/cartel_LA-OTRA-ORILLA.jpg'),
                (8,  'uploads/public/cartel_SI-NO-FUERA-POR-MI.jpg'),
                (9,  'uploads/public/cartel_UN-DIA-PERFECTO.jpg'),
                (10, 'uploads/public/cartel_VIOLETAS.jpg'),
                (11, 'uploads/public/evento1.jpg'),
                (12, 'uploads/public/evento2.jpg'),
                (13, 'uploads/public/evento3.jpg'),
                (14, 'uploads/public/evento4.jpg'),
                (15, 'uploads/public/evento5.jpg'),
                (16, 'uploads/public/festival1.png'),
                (17, 'uploads/public/festival2.jpg'),
                (18, 'uploads/public/festival3.jpg'),
                (19, 'uploads/public/patrocinador_canon.jpg'),
                (20, 'uploads/public/ficha_tecnica_blava_terra.pdf'),
                (21, 'uploads/public/ficha_tecnica_la_otra_orilla.pdf'),
                (22, 'uploads/public/ficha_tecnica_si_no_fuera_por_mi.pdf'),
                (23, 'uploads/public/ficha_tecnica_un_dia_perfecto.pdf'),
                (24, 'uploads/public/ficha_tecnica_violetas.pdf');
                
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
                
                INSERT INTO candidatura (id_participante, titulo, sinopsis, id_archivo_video, id_archivo_ficha, id_archivo_cartel, id_archivo_trailer, tipo_candidatura) VALUES
                (1,'Ritmo de Asfalto','Elionor descubre los entresijos de la adultez en la Mallorca de 1940. Vive en una remota finca, de la cual los habitantes jamás han salido. Todo cambiará con la llegada de una película.',1,20,6,NULL,'alumno'),
                (2,'Latido Salvaje','La Otra Orilla es más que una historia: el miedo a la muerte explora la propia existencia a través de los ojos de una niña, mostrando que es una parte natural de la vida. María, una niña con una rara enfermedad, aprende a enfrentar sus miedos con música, esperanza y amor por la vida. Conoce a Marisol, una musicoterapeuta, y a Soledad, una anciana que repara instrumentos. Sus vidas se entrelazarán inesperadamente.',2,21,7,NULL,'alumno'),
                (3,'Pequeños Sabios','Javier va casi todos los días a comer a casa de su madre. Se hace mayor y así la tiene contenta. Pero esa rutina de aparente normalidad, esconde un profundo secreto. Hay veces en las que el fin justifica los medios.',3,22,8,NULL,'alumni'),
                (4,'Entre Bloques','Julia decide dejar el hospital apresuradamente para pasar el fin de semana con sus amigos de toda la vida, en una casa llena de recuerdos compartidos, se disponen a celebrar como si un hubiese un mañana. Mientras julia tiene que tomar una decisión importante.',4,23,9,NULL,'alumno'),
                (5,'Sombras Estáticas','En 1945, bajo la sombra de la dictadura franquista, Juan, un ayudante universitario, conoce a Manuel tras un encuentro fortuito durante la noche en el Parque del Retiro.',5,24,10,NULL,'alumni'),
                (1,'Crónicas del Campus','Elionor descubre los entresijos de la adultez en la Mallorca de 1940. Vive en una remota finca, de la cual los habitantes jamás han salido. Todo cambiará con la llegada de una película.',1,20,6,NULL,'alumno'),
                (2,'Laberinto Mental','La Otra Orilla es más que una historia: el miedo a la muerte explora la propia existencia a través de los ojos de una niña...',2,21,7,NULL,'alumno'),
                (3,'Reinos de Cartón','Javier va casi todos los días a comer a casa de su madre...',3,22,8,NULL,'alumni'),
                (4,'Código de Barras','Julia decide dejar el hospital apresuradamente...',4,23,9,NULL,'alumno'),
                (5,'Voz de Calle','En 1945, bajo la sombra de la dictadura franquista...',5,24,10,NULL,'alumni'),
                (1,'Ecos de 1900','Elionor descubre los entresijos de la adultez en la Mallorca de 1940...',1,20,6,NULL,'alumno'),
                (2,'Neón y Acero','La Otra Orilla es más que una historia...',2,21,7,NULL,'alumno'),
                (3,'Claustro','Javier va casi todos los días a comer a casa de su madre...',3,22,8,NULL,'alumni'),
                (4,'Contra la Corriente','Julia decide dejar el hospital apresuradamente...',4,23,9,NULL,'alumno'),
                (5,'Acordes Locales','En 1945, bajo la sombra de la dictadura franquista...',5,24,10,NULL,'alumni'),
                (1,'A un Click de Ti','Elionor descubre los entresijos de la adultez en la Mallorca de 1940...',1,20,6,NULL,'alumno'),
                (2,'Ciclo Infinito','La Otra Orilla es más que una historia...',2,21,7,NULL,'alumno'),
                (3,'Manos de Barro','Javier va casi todos los días a comer a casa de su madre...',3,22,8,NULL,'alumni'),
                (4,'Raíces y Ramas','Julia decide dejar el hospital apresuradamente...',4,23,9,NULL,'alumno'),
                (5,'Formas del Vacío','En 1945, bajo la sombra de la dictadura franquista...',5,24,10,NULL,'alumni');
                
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
                    ('galaProximaFecha', '18/12/2027', 1),
                    ('galaPreEventoTitulo', 'Festival de Cine 2026', 1),
                    ('galaPreEventoFecha', DATE_FORMAT(NOW(), '%d/%m/%Y'), 1),
                    ('galaPreEventoHora', '15:00', 1),
                    ('galaPreEventoUbicacion', 'Auditorio Principal', 1),
                    ('galaPreEventoDescripcion', '¡Bienvenidos a la Gala de Cortometrajes 2026! Únete a nosotros para celebrar el talento creativo de nuestros estudiantes y alumni', 1),
                    ('galaPreEventoStreamingActivo', 'true', 1),
                    ('galaPreEventoStreamingUrl', 'https://www.youtube.com/watch?v=OdiUGCJIAC8', 1),
                    ('fechaUltimaModificacionConfiguracion', CURRENT_TIMESTAMP, 1),
                    ('baseUrl', 'http://localhost/DWES/proyecto_integrador_2daw/', 1);
                    
                INSERT INTO edicion (anio_edicion, resumen_evento, nro_participantes, tipo, id_organizador, fecha_envio_email_informativo, fecha_borrado_datos) VALUES
                    (2024, 'Una noche llena de emoción, talento y nuevas miradas. Revive los mejores momentos de la edición, desde la alfombra roja hasta el anuncio de los cortometrajes que marcaron la diferencia este año. ¡Gracias por formar parte de nuestra historia!', 120, 'anterior', 1, CURDATE(), CURDATE()),
                    
                    (2025, 'Una noche llena de emoción, talento y nuevas miradas. Revive los mejores momentos de la edición, desde la alfombra roja hasta el anuncio de los cortometrajes que marcaron la diferencia este año. ¡Gracias por formar parte de nuestra historia!', 150, 'anterior' , 1, CURDATE(), CURDATE()),
                    
                    (2026, 'Una noche llena de emoción, talento y nuevas miradas. Revive los mejores momentos de la edición, desde la alfombra roja hasta el anuncio de los cortometrajes que marcaron la diferencia este año. ¡Gracias por formar parte de nuestra historia!', NULL, 'actual'  , 1, CURDATE(), CURDATE());
                
                INSERT INTO ganadores_edicion (id_edicion, categoria, nombre, premio, id_archivo_video) VALUES
                    (1, 'Documental', 'Juan Pérez', 'Mejor Documental', 1),
                    (1, 'Cortometraje', 'María López', 'Mejor Cortometraje', 4),
                    (2, 'Animación', 'Ana Gómez', 'Mejor Animación', 2),
                    (2, 'Ficción', 'Luis Ruiz', 'Mejor Ficción', 3);
                
                INSERT INTO edicion_archivos (id_archivo, id_edicion) VALUES
                (16, 1),
                (17, 1),
                (18, 1),
                (19, 1),
                (16, 2),
                (17, 2),
                (18, 2),
                (19, 2),
                (16, 3),
                (17, 3),
                (18, 3),
                (19, 3);
                
                INSERT INTO noticia (nombre, descripcion, fecha, id_organizador, id_archivo_imagen) VALUES
                ('Anuncio del festival', 'Lanzamiento oficial del festival de cortometrajes.', '2024-05-01', 1, 16),
                ('Jurado confirmado', 'Presentación del jurado para esta edición.', '2024-05-10', 1, 17),
                ('Programa de eventos', 'Calendario completo de eventos y proyecciones.', '2024-05-15', 1, 18),
                ('Ganadores 2024', 'Lista de ganadores del festival de cortometrajes 2024.', '2024-12-20', 1, 16),
                ('Convocatoria 2025', 'Apertura de inscripciones para la edición 2025.', '2024-12-31', 1, 16),
                ('Evento especial', 'Anuncio de un evento especial durante el festival.', '2024-06-20', 1, 18),
                ('Colaboración con escuelas', 'Nuevas colaboraciones con escuelas de cine.', '2024-07-05', 1, 18),
                ('Talleres para participantes', 'Talleres gratuitos para los inscritos en el festival.', '2024-08-15', 1, 17);
                
                INSERT INTO evento (nombre, descripcion, ubicacion, fecha, hora_inicio, hora_fin, id_organizador, id_archivo_imagen) VALUES
                ('Proyección inaugural', 'Proyección del cortometraje inaugural del festival.', 'Cine Principal', CURDATE(), '19:00', '21:00', 1, 11),
                ('Taller de cine', 'Taller práctico sobre técnicas de filmación.', 'Sala de Talleres', CURDATE(), '10:00', '13:00', 1, 12),
                ('Clausura y entrega de premios', 'Ceremonia de clausura y entrega de premios a los ganadores.', 'Teatro Central', CURDATE(), '20:00', '22:00', 1, 13),
                ('Mesa redonda', 'Debate con directores y productores invitados.', 'Auditorio', CURDATE(), '16:00', '18:00', 1, 14),
                ('Networking', 'Sesión de networking para participantes y profesionales.', 'Sala VIP', CURDATE(), '18:00', '20:00', 1, 15),
                ('Proyección de cortos ganadores', 'Proyección de los cortometrajes ganadores de ediciones anteriores.', 'Cine Secundario', CURDATE(), '15:00', '17:00', 1, 12),
                ('Taller de guionismo', 'Taller sobre escritura de guiones para cortometrajes.', 'Sala de Guionismo', CURDATE(), '11:00', '14:00', 1, 13),
                ('Fiesta de clausura', 'Fiesta para celebrar el cierre del festival.', 'Club Nocturno', CURDATE(), '23:00', '02:00', 1, 14),
                ('Proyección temática', 'Proyección de cortometrajes con temática específica.', 'Cine Temático', CURDATE(), '14:00', '16:00', 1, 12);
                
                INSERT INTO patrocinador (nombre, id_archivo_logo) VALUES
                ('Canon', 19);
                
                -- UPDATES
                UPDATE candidatura SET estado = 'Rechazada' WHERE id_candidatura = 16;
                INSERT INTO historial_candidatura (id_candidatura, estado, motivo, estado_correo_enviado) VALUES
                (1, 'Rechazada', 'El cortometraje no cumple con los requisitos de duración.', true);
                UPDATE candidatura SET estado = 'En revisión' WHERE id_candidatura = 16;
                INSERT INTO historial_candidatura (id_candidatura, estado, motivo) VALUES
                (1, 'En revisión', 'He subsanado los problemas de duración.');
                
                UPDATE candidatura SET estado = 'Aceptada' WHERE id_candidatura = 1;
                INSERT INTO historial_candidatura (id_candidatura, estado) VALUES
                (3, 'Aceptada');
                INSERT INTO historial_candidatura (id_candidatura, estado, estado_correo_enviado) VALUES
                (2, 'Aceptada', true);
                UPDATE candidatura SET estado = 'Finalista' WHERE id_candidatura = 1;
                INSERT INTO historial_candidatura (id_candidatura, estado, estado_correo_enviado) VALUES
                (2, 'Finalista', true);
                
                UPDATE candidatura SET sinopsis = 'En el caótico ecosistema de la Universidad Estatal, Álex, un estudiante experto en procrastinar, se enfrenta a su mayor pesadilla: el \\'Lunes Negro\\'. Tras quedarse dormido para el examen final que define su graduación, debe cruzar un campus convertido en una carrera de obstáculos surrealista. Entre reclutadores de sectas de café y la temida \\'Hermandad del Silencio\\' en la biblioteca, la jornada se vuelve una sátira sobre la desesperación académica. \\'Crónicas del Campus\\' es una oda humorística a esos años donde el mayor drama es conseguir una fotocopia antes del cierre.' WHERE id_candidatura = 6;
                
                UPDATE candidatura SET estado = 'Aceptada' WHERE id_candidatura = 6;
                INSERT INTO historial_candidatura (id_candidatura, estado, estado_correo_enviado) VALUES
                (6, 'Aceptada', true);
                UPDATE candidatura SET estado = 'Finalista' WHERE id_candidatura = 6;
                INSERT INTO historial_candidatura (id_candidatura, estado, estado_correo_enviado) VALUES
                (6, 'Finalista', true);
                
                UPDATE candidatura SET estado = 'Aceptada' WHERE id_candidatura = 2;
                INSERT INTO historial_candidatura (id_candidatura, estado, estado_correo_enviado) VALUES
                (2, 'Aceptada', true);
                UPDATE candidatura SET estado = 'Finalista' WHERE id_candidatura = 2;
                INSERT INTO historial_candidatura (id_candidatura, estado, estado_correo_enviado) VALUES
                (2, 'Finalista', true);
                
                UPDATE candidatura
                SET id_archivo_trailer = id_archivo_video
                WHERE estado = 'Finalista' AND id_archivo_trailer IS NULL;
                
                INSERT INTO premio_candidatura (id_premio, id_candidatura) VALUES(1, 1);
                INSERT INTO premio_candidatura (id_premio, id_candidatura) VALUES(4, 2);
                
            ";

        if ($conexion->multi_query($sql_tables)) {
            // Vaciar los resultados de multi_query para evitar errores de sincronización
            do {
                if ($res = $conexion->store_result()) {
                    $res->free();
                }
            } while ($conexion->more_results() && $conexion->next_result());
        } else {
            echo "Error creando tablas e inserts iniciales: " . $conexion->error;
            exit;
        }
    } else {
        seleccionarBaseDatos();
    }
}
