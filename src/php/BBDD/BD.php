<?php

require_once __DIR__ . DIRECTORY_SEPARATOR . 'connection.php';

function crearBaseDatosSiNoExiste(): void {
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
                    nombre VARCHAR(100) NOT NULL,
                    tipo_categoria ENUM('alumno', 'alumni', 'honorifico') NOT NULL
                );
                
                CREATE TABLE premio (
                    id_premio INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(150) NOT NULL,
                    incluye_dinero BOOLEAN DEFAULT TRUE,
                    cantidad_dinero DECIMAL(10,2),
                    id_categoria INT NOT NULL,
                    incluye_objeto_adicional BOOLEAN DEFAULT FALSE,
                    objeto_adicional VARCHAR(255),
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
                
                CREATE TABLE ganador_honorifico(
                    id_ganador_honorifico INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100),
                    id_archivo_video INT comment 'Video del ganador honorífico',
                    FOREIGN KEY (id_archivo_video) REFERENCES archivo(id_archivo)
                );
                
                CREATE TABLE premio_candidatura (
                    id_premio_candidatura INT AUTO_INCREMENT PRIMARY KEY,
                    id_premio INT NOT NULL UNIQUE,
                    id_candidatura INT UNIQUE,
                    id_ganador_honorifico INT UNIQUE,
                    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (id_premio) REFERENCES premio(id_premio),
                    FOREIGN KEY (id_candidatura) REFERENCES candidatura(id_candidatura),
                    FOREIGN KEY (id_ganador_honorifico) REFERENCES ganador_honorifico(id_ganador_honorifico)
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
                -- --- VIDEOS PRINCIPALES (Gala y Premios) ---
                (1, 'uploads/public/01_CABECERA_GALA_ESTEREO.mp4'),
                (2, 'uploads/public/02_RESUMEN_VID_GALA.mp4'),
                (3, 'uploads/public/03_TRAILER_ALUMNI_ESTEREO.mp4'),
                (4, 'uploads/public/04_TRAILER_ALUMNO_ESTEREO.mp4'),
                (5, 'uploads/public/05_premio_trayectoria_profesional_MIGUEL_ANGEL_ESTEREO.mp4'),
                (6, 'uploads/public/06_TRAILER_ALUMNI_TORMENTO_ESTEREO_2DO_PREMIO.mp4'),
                (7, 'uploads/public/07_TRAILER_ALUMNI_ZOE_ESTEREO_1ER_PREMIO.mp4'),
                (8, 'uploads/public/08_TRAILER_ALUMNO_ESPERANDO_ESTEREO_3ER_PREMIO.mp4'),
                (9, 'uploads/public/09_TRAILER_ALUMNO_DE_POCO_UN_TODO_ESTEREO_2DO_PREMIO.mp4'),
                (10, 'uploads/public/10_TRAILER_ALUMNO_UMBRA_ESTEREO_1ER_PREMIO.mp4'),
                
                -- --- CORTOMETRAJES ---
                (11, 'uploads/public/corto_blava_terra.mp4'),
                (12, 'uploads/public/corto_la_otra_orilla.mp4'),
                (13, 'uploads/public/corto_si_no_fuera_por_mi.mp4'),
                (14, 'uploads/public/corto_un_dia_perfecto.mp4'),
                (15, 'uploads/public/corto_violetas.mp4'),
                
                -- --- CARTELES ---
                (16, 'uploads/public/cartel_BLAVA-TERRA.jpg'),
                (17, 'uploads/public/cartel_LA-OTRA-ORILLA.jpg'),
                (18, 'uploads/public/cartel_SI-NO-FUERA-POR-MI.jpg'),
                (19, 'uploads/public/cartel_UN-DIA-PERFECTO.jpg'),
                (20, 'uploads/public/cartel_VIOLETAS.jpg'),
                
                -- --- FOTOS DE EVENTOS ---
                (21, 'uploads/public/evento1.jpg'),
                (22, 'uploads/public/evento2.jpg'),
                (23, 'uploads/public/evento3.jpg'),
                (24, 'uploads/public/evento4.jpg'),
                (25, 'uploads/public/evento5.jpg'),
                
                -- --- GALERÍA DEL FESTIVAL ---
                (26, 'uploads/public/festival1.jpg'),
                (27, 'uploads/public/festival2.jpg'),
                (28, 'uploads/public/festival3.jpg'),
                (29, 'uploads/public/festival4.jpg'),
                (30, 'uploads/public/festival5.jpg'),
                (31, 'uploads/public/festival6.jpg'),
                (32, 'uploads/public/festival7.jpg'),
                (33, 'uploads/public/festival8.jpg'),
                (34, 'uploads/public/festival9.jpg'),
                (35, 'uploads/public/festival10.jpg'),
                (36, 'uploads/public/festival11.jpg'),
                (37, 'uploads/public/festival12.jpg'),
                (38, 'uploads/public/festival13.png'),
                (39, 'uploads/public/festival14.jpg'),
                (40, 'uploads/public/festival15.jpg'),
                (41, 'uploads/public/festival16.png'),
                
                -- --- NOTICIAS Y PATROCINADORES ---
                (42, 'uploads/public/noticia1.png'),
                (43, 'uploads/public/noticia2.png'),
                (44, 'uploads/public/noticia3.jpg'),
                (45, 'uploads/public/noticia4.jpg'),
                (46, 'uploads/public/noticia5.jpg'),
                (47, 'uploads/public/noticia6.jpg'),
                
                -- --- DOCUMENTOS Y FICHAS TÉCNICAS ---
                (48, 'uploads/public/Bases Legales Concurso Festival de Cine UE_ 2025.pdf'),
                (49, 'uploads/public/ficha_tecnica_blava_terra.pdf'),
                (50, 'uploads/public/ficha_tecnica_la_otra_orilla.pdf'),
                (51, 'uploads/public/ficha_tecnica_si_no_fuera_por_mi.pdf'),
                (52, 'uploads/public/ficha_tecnica_un_dia_perfecto.pdf'),
                (53, 'uploads/public/ficha_tecnica_violetas.pdf'),
                
                (54, 'uploads/public/patrocinador_adobe.jpg'),
                (55, 'uploads/public/patrocinador_netflix.png'),
                (56, 'uploads/public/patrocinador_canon.jpg'),
                (57, 'uploads/public/patrocinador_google.png'),
                (58, 'uploads/public/patrocinador_microsoft.png');
                
                INSERT INTO categoria (nombre, tipo_categoria) VALUES
                ('Mejor cortometraje UE', 'alumno'),
                ('Mejor cortometraje', 'alumni'),
                ('Premio honorífico', 'honorifico');
                
                INSERT INTO participante (nombre, dni, correo, contrasena, nro_expediente) VALUES
                ('Juan Diego León Lamas', '11111111A', 'juan@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-001'),
                ('María del Prado', '22222222B', 'maria@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-002'),
                ('Carlos Ruiz', '33333333C', 'carlos@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-003'),
                ('Laura Pausini', '44444444D', 'laura@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-004'),
                ('Ana Torres', '55555555E', 'ana@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-005'),
                ('Miguel Ángel Rodríguez', '66666666F', 'miguel@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-006'),
                ('María Igualada Farcha', '77777777G', 'm.igualada@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-007'),
                ('Paula Taboada Blanco', '88888888H', 'paula@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-008'),
                ('Ricardo Ignacio Pérez DiGiammarco', '99999999I', 'ricardo@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-009'),
                ('Raúl Alonso Herranz', '10101010J', 'raul@mail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', 'PAR-010');
                
                INSERT INTO candidatura (id_participante, titulo, sinopsis, id_archivo_video, id_archivo_ficha, id_archivo_cartel, id_archivo_trailer, tipo_candidatura) VALUES
                -- Participante 1
                (1,'Ritmo de Asfalto','Elionor descubre los entresijos de la adultez en la Mallorca de 1940. Vive en una remota finca, de la cual los habitantes jamás han salido. Todo cambiará con la llegada de una película.',11,49,16,NULL,'alumno'),
                -- Participante 2
                (2,'Latido Salvaje','La Otra Orilla es más que una historia: el miedo a la muerte explora la propia existencia a través de los ojos de una niña, mostrando que es una parte natural de la vida. María, una niña con una rara enfermedad, aprende a enfrentar sus miedos con música, esperanza y amor por la vida. Conoce a Marisol, una musicoterapeuta, y a Soledad, una anciana que repara instrumentos. Sus vidas se entrelazarán inesperadamente.',15,53,20,NULL,'alumno'),
                -- Participante 3
                (3,'Pequeños Sabios','Javier va casi todos los días a comer a casa de su madre. Se hace mayor y así la tiene contenta. Pero esa rutina de aparente normalidad, esconde un profundo secreto. Hay veces en las que el fin justifica los medios.',14,52,19,NULL,'alumno'),
                -- Participante 4
                (4,'Entre Bloques','Julia decide dejar el hospital apresuradamente para pasar el fin de semana con sus amigos de toda la vida, en una casa llena de recuerdos compartidos, se disponen a celebrar como si un hubiese un mañana. Mientras julia tiene que tomar una decisión importante.',13,51,18,NULL,'alumno'),
                -- Participante 5
                (5,'Sombras Estáticas','En 1945, bajo la sombra de la dictadura franquista, Juan, un ayudante universitario, conoce a Manuel tras un encuentro fortuito durante la noche en el Parque del Retiro.',12,50,17,NULL,'alumno'),
                -- Participante 6
                (6,'Crónicas del Campus','Un grupo de estudiantes de cine intenta documentar la vida universitaria, pero terminan descubriendo una red de secretos académicos. Lo que comenzó como un ejercicio de clase se convierte en una obsesión por revelar la verdad detrás de las fachadas de piedra del campus antiguo.',12,50,17,NULL,'alumno'),                -- Participante 7
                (7,'Laberinto Mental','Un viaje psicológico al interior de la mente de un joven que ha perdido la capacidad de distinguir sus recuerdos de sus sueños. Atrapado en una arquitectura mental cambiante, deberá encontrar la salida antes de que su propia conciencia lo borre por completo.',11,49,16,NULL,'alumno'),                -- Participante 8
                (8,'Reinos de Cartón','Dos niños construyen un imperio imaginario en un callejón abandonado para escapar de la cruda realidad de la pobreza. A través de sus ojos, el cartón se convierte en castillos, pero la llegada de una excavadora municipal amenaza con destruir el único refugio que les queda.',15,53,20,NULL,'alumno'),                -- Participante 9
                (9,'Código de Barras','En una sociedad futurista donde el valor humano se mide por su consumo, un cajero de supermercado descubre una anomalía en su propio escáner. Esta pequeña falla técnica le permite ver la realidad detrás del sistema de control social más grande jamás creado.',14,52,19,NULL,'alumno'),                -- Participante 10 (tiene 2 candidaturas alumni)
                (10,'Voz de Calle','Un veterano locutor de radio pirata emite desde una furgoneta en movimiento para denunciar las injusticias del barrio. Mientras la policía le pisa los talones, su voz se convierte en el único hilo de esperanza para una comunidad que ha sido silenciada durante décadas.',13,51,18,NULL,'alumni'),                -- Participante 10  (tiene 2 candidaturas alumni)
                (10,'Ecos de 1900','A principios del siglo XX, una joven sirvienta en una mansión señorial descubre un gramófono que parece reproducir voces del futuro. A través de las grabaciones, intenta cambiar el destino trágico que acecha a la familia para la que trabaja.',11,49,16,NULL,'alumni');        
                
                        
                INSERT INTO premio (nombre, incluye_dinero, cantidad_dinero, id_categoria, incluye_objeto_adicional, objeto_adicional) VALUES
                    ('Primer premio', true, 600.00, 1, true, 'Cámara de vídeo de Canon'),
                    ('Segundo premio', true, 300.00, 1, false, NULL),
                    ('Tercer premio', true, 100.00, 1, false, NULL),
                    ('Primer premio', true, 700.00, 2, false, NULL),
                    ('Segundo premio', true, 300.00, 2, false, NULL),
                    ('Reconocimiento Honorífico', false, NULL, 3, true, 'A uno de los profesionales del sector');
                
                INSERT INTO organizador (nro_empresa, nombre, correo, contrasena, dni) VALUES
                    ('EMP-001', 'Organizador Madrid', 'admin@gmail.com', '$2y$10$19128ZLg8CbORHHHJ/yAa.xty0QNttbDuw/uEZRGUqKLR9zN3kiU.', '99999999Z');
               
                INSERT INTO configuracion (nombre, valor, id_organizador) VALUES
                    ('modo', 'pre-evento', 1), -- Puede ser 'pre-evento' o 'post-evento'
                    ('galaPreEventoTitulo', 'Festival de Cine 2026', 1),
                    ('galaPreEventoFecha', '09/11/2026', 1),
                    ('galaPreEventoHora', '15:00', 1),
                    ('galaPreEventoUbicacion', 'Auditorio Principal', 1),
                    ('galaPreEventoDescripcion', '¡Bienvenidos a la Gala de Cortometrajes 2026! Únete a nosotros para celebrar el talento creativo de nuestros estudiantes y alumni', 1),
                    ('galaPreEventoStreamingActivo', 'true', 1),
                    ('galaPreEventoStreamingUrl', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1),
                    ('fechaUltimaModificacionConfiguracion', CURRENT_TIMESTAMP, 1),
                    ('baseUrl', 'https://festivalcortosuem.azurewebsites.net/', 1);
                    
                INSERT INTO edicion (anio_edicion, resumen_evento, nro_participantes, tipo, id_organizador, fecha_envio_email_informativo, fecha_borrado_datos) VALUES
                    (2024, 'Una noche llena de emoción, talento y nuevas miradas. Revive los mejores momentos de la edición, desde la alfombra roja hasta el anuncio de los cortometrajes que marcaron la diferencia este año. ¡Gracias por formar parte de nuestra historia!', 120, 'anterior', 1, CURDATE(), CURDATE()),
                    
                    (2025, 'Una noche llena de emoción, talento y nuevas miradas. Revive los mejores momentos de la edición, desde la alfombra roja hasta el anuncio de los cortometrajes que marcaron la diferencia este año. ¡Gracias por formar parte de nuestra historia!', 150, 'anterior' , 1, CURDATE(), CURDATE()),
                    
                    (2026, 'Una noche llena de emoción, talento y nuevas miradas. Revive los mejores momentos de la edición, desde la alfombra roja hasta el anuncio de los cortometrajes que marcaron la diferencia este año. ¡Gracias por formar parte de nuestra historia!', NULL, 'actual'  , 1, CURDATE(), CURDATE());
                
                -- Edición 2024 (id_edicion = 1)
                INSERT INTO ganadores_edicion (id_edicion, categoria, nombre, premio, id_archivo_video) VALUES
                -- Premio Honorífico
                (1, 'Reconocimiento Honorífico', 'Miguel Ángel Rodríguez', 'Premio Trayectoria Profesional', 5),
                -- Alumni
                (1, 'Mejor cortometraje alumni', 'Zoe Martínez', '1er Premio', 7),
                (1, 'Mejor cortometraje alumni', 'Antonio Tormento García', '2do Premio', 6),
                -- Alumno
                (1, 'Mejor cortometraje alumno', 'Umbra Jiménez', '1er Premio', 10),
                (1, 'Mejor cortometraje alumno', 'Carlos De Poco', '2do Premio', 9),
                (1, 'Mejor cortometraje alumno', 'Laura Esperando Sánchez', '3er Premio', 8);
                
                -- Edición 2025 (id_edicion = 2)
                INSERT INTO ganadores_edicion (id_edicion, categoria, nombre, premio, id_archivo_video) VALUES
                -- Premio Honorífico
                (2, 'Reconocimiento Honorífico', 'Miguel Ángel Fernández', 'Premio Trayectoria Profesional', 5),
                -- Alumni
                (2, 'Mejor cortometraje alumni', 'Zoe López', '1er Premio', 7),
                (2, 'Mejor cortometraje alumni', 'Diego Tormento Ruiz', '2do Premio', 6),
                -- Alumno
                (2, 'Mejor cortometraje alumno', 'Umbra Morales', '1er Premio', 10),
                (2, 'Mejor cortometraje alumno', 'Javier De Poco Torres', '2do Premio', 9),
                (2, 'Mejor cortometraje alumno', 'Ana Esperando Gómez', '3er Premio', 8);
                
                INSERT INTO edicion_archivos (id_archivo, id_edicion) VALUES
                -- Edición 1 (2024) - archivo 2 + 8 archivos festival (26-33)
                (2, 1),
                (26, 1),
                (27, 1),
                (28, 1),
                (29, 1),
                (30, 1),
                (31, 1),
                (32, 1),
                (33, 1),
                -- Edición 2 (2025) - archivo 2 + 8 archivos festival (34-41)
                (2, 2),
                (34, 2),
                (35, 2),
                (36, 2),
                (37, 2),
                (38, 2),
                (39, 2),
                (40, 2),
                (41, 2);
                
                -- NOTICIAS (8 noticias, 5 archivos noticia_* ids 42-46)
                INSERT INTO noticia (nombre, descripcion, fecha, id_organizador, id_archivo_imagen) VALUES
                ('Anuncio del festival', 'Lanzamiento oficial del festival de cortometrajes.', '2024-05-01', 1, 42),
                ('Jurado confirmado', 'Presentación del jurado para esta edición.', '2024-05-10', 1, 43),
                ('Programa de eventos', 'Calendario completo de eventos y proyecciones.', '2024-05-15', 1, 44),
                ('Ganadores 2024', 'Lista de ganadores del festival de cortometrajes 2024.', '2024-12-20', 1, 45),
                ('Convocatoria 2025', 'Apertura de inscripciones para la edición 2025.', '2024-12-31', 1, 46),
                ('Evento especial', 'Anuncio de un evento especial durante el festival.', '2024-06-20', 1, 42),
                ('Colaboración con escuelas', 'Nuevas colaboraciones con escuelas de cine.', '2024-07-05', 1, 43),
                ('Talleres para participantes', 'Talleres gratuitos para los inscritos en el festival.', '2024-08-15', 1, 44);

                
                -- EVENTOS (9 eventos, 5 archivos evento_* ids 21-25)
                -- =========================
                INSERT INTO evento (nombre, descripcion, ubicacion, fecha, hora_inicio, hora_fin, id_organizador, id_archivo_imagen) VALUES
                ('Encuentro con profesionales del mundo audiovisual', 'Mesa redonda y conversatorio con expertos de la industria para compartir experiencias y tendencias actuales del sector.', 'Auditorio del B', '2026-11-09', '10:30', '13:00', 1, 22),
                ('Visionado del los cortos', 'Sesión de exhibición de los cortometrajes seleccionados, incluyendo el estreno de la pieza inaugural del festival.', 'Salón de Grados', '2026-11-09', '13:30', '16:30', 1, 21),
                ('Gala de entrega de premios', 'Evento de clausura donde se reconocerá el talento de los participantes y se premiará a las mejores obras de la edición.', 'Auditorio del B', '2026-11-09', '20:00', '22:00', 1, 23),
                ('Mesa redonda', 'Debate con directores y productores invitados.', 'Auditorio', CURDATE(), '16:00', '18:00', 1, 24),
                ('Networking', 'Sesión de networking para participantes y profesionales.', 'Sala VIP', CURDATE(), '18:00', '20:00', 1, 25),
                ('Taller de guionismo', 'Taller sobre escritura de guiones para cortometrajes.', 'Sala de Guionismo', CURDATE(), '11:00', '14:00', 1, 22),
                ('Fiesta de clausura', 'Fiesta para celebrar el cierre del festival.', 'Club Nocturno', CURDATE(), '23:00', '02:00', 1, 23),
                ('Proyección temática', 'Proyección de cortometrajes con temática específica.', 'Cine Temático', CURDATE(), '14:00', '16:00', 1, 24);

                
                -- =========================
                -- PATROCINADOR
                -- =========================
                INSERT INTO patrocinador (nombre, id_archivo_logo) VALUES
                ('Canon', 54),
                ('Adobe', 55),
                ('Netflix', 56),
                ('Google', 57),
                ('Microsoft', 58);
           
                
                -- UPDATES e INSERTS relacionados con el proceso de revisión de candidaturas, cambios de estado y asignación de premios
                -- candidatura 1: Rechazada por duración, sin trailer
                UPDATE candidatura SET estado = 'Rechazada' WHERE id_candidatura = 1;
                INSERT INTO historial_candidatura (id_candidatura, estado, motivo, estado_correo_enviado) VALUES
                (1, 'Rechazada', 'El cortometraje no cumple con los requisitos de duración.', true);
                
                -- candidatura 2: Rechazada por problemas técnicos, luego subsanados y pendiente de revisión
                UPDATE candidatura SET estado = 'Rechazada' WHERE id_candidatura = 2;
                INSERT INTO historial_candidatura (id_candidatura, estado, motivo, estado_correo_enviado) VALUES
                (2, 'Rechazada', 'El cortometraje no cumple con los requisitos de resolución 1920x1080.', true);
                UPDATE candidatura SET estado = 'En revisión' WHERE id_candidatura = 2;
                INSERT INTO historial_candidatura (id_candidatura, estado, motivo, estado_correo_enviado) VALUES
                (2, 'En revisión', 'He subsanado los problemas técnicos, el cortometraje ahora cumple con los requisitos.', true);
                
                -- candidatura 3: Aceptada sin problemas
                UPDATE candidatura SET estado = 'Aceptada' WHERE id_candidatura = 3;
                INSERT INTO historial_candidatura (id_candidatura, estado) VALUES
                (3, 'Aceptada');
                
                -- candidatura 4: Rechazada por contenido inapropiado
                UPDATE candidatura SET estado = 'Rechazada' WHERE id_candidatura = 4;
                INSERT INTO historial_candidatura (id_candidatura, estado, motivo, estado_correo_enviado) VALUES
                (4, 'Rechazada', 'El cortometraje contiene escenas que no cumplen con las normas de contenido del festival.', true);
                
                -- candidatura 5: Aceptada y luego finalista, sin trailer
                UPDATE candidatura SET estado = 'Aceptada' WHERE id_candidatura = 5;
                INSERT INTO historial_candidatura (id_candidatura, estado, estado_correo_enviado) VALUES
                (5, 'Aceptada', true);
                UPDATE candidatura SET estado = 'Finalista' WHERE id_candidatura = 5;
                INSERT INTO historial_candidatura (id_candidatura, estado, estado_correo_enviado) VALUES
                (5, 'Finalista', true);
                
                -- candidatura 6: Aceptada y luego finalista, con trailer
                UPDATE candidatura SET estado = 'Aceptada' WHERE id_candidatura = 6;
                INSERT INTO historial_candidatura (id_candidatura, estado, estado_correo_enviado) VALUES
                (6, 'Aceptada', true);
                UPDATE candidatura SET estado = 'Finalista' WHERE id_candidatura = 6;
                INSERT INTO historial_candidatura (id_candidatura, estado, estado_correo_enviado) VALUES
                (6, 'Finalista', true);
                UPDATE candidatura
                SET id_archivo_trailer = id_archivo_video
                WHERE id_candidatura = 6;
                
                -- candidatura 7: Rechazada por problemas de formato
                UPDATE candidatura SET estado = 'Rechazada' WHERE id_candidatura = 7;
                INSERT INTO historial_candidatura (id_candidatura, estado, motivo, estado_correo_enviado) VALUES
                (7, 'Rechazada', 'El cortometraje no cumple con los requisitos de formato de archivo (debe ser MP4).', true);
              
                -- candidatura 8: Aceptada sin problemas
                UPDATE candidatura SET estado = 'Aceptada' WHERE id_candidatura = 8;
                INSERT INTO historial_candidatura (id_candidatura, estado) VALUES
                (8, 'Aceptada');
                
                
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
