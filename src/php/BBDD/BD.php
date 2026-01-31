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
                    estado ENUM('En revisión', 'Aceptada', 'Rechazada', 'Finalista') DEFAULT 'En revisión',
                    tipo_candidatura ENUM('alumno', 'alumni') NOT NULL,
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
                
                INSERT INTO archivo (id_archivo, ruta) VALUES
                -- VIDEOS (IDs 1-2)
                (1, 'uploads/public/file_example_MP4_480_1_5MG.mp4'),
                (2, 'uploads/public/_file_example_MP4_480_1_5MG.mp4'),
                
                -- IMAGENES/POSTERS (IDs 3-7)
                (3, 'uploads/public/_FESTIVAL_CORTOS_CABACERA_GENERAL_2_s3Edkcr.width-800.jpg'),
                (4, 'uploads/public/_ENTRENADORES_CABECERA_GENERAL_3.width-800.jpg'),
                (5, 'uploads/public/_Gemini_Generated_Image_u3h353u3h353u3h3.png'),
                (6, 'uploads/public/_salidas-profesionales.png'),
                (7, 'uploads/public/_Pentawards_35_4aognhs.width-800.png'),
                
                -- DOCUMENTOS (IDs 8)
                (8, 'uploads/public/_dummy.pdf'),
                
                -- 
                (9, 'uploads/public/_FESTIVAL_CORTOS_CABACERA_GENERAL_2_s3Edkcr.width-800.jpg'),
                (10, 'uploads/public/file_example_MP4_480_1_5MG.mp4'),
                (11, 'uploads/public/_FESTIVAL_CORTOS_CABACERA_GENERAL_2_s3Edkcr.width-800.jpg'),
                (12, 'uploads/public/_file_example_MP4_480_1_5MG.mp4');
                
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
                
                INSERT INTO candidatura (id_participante, sinopsis, id_archivo_video, id_archivo_ficha, id_archivo_cartel, id_archivo_trailer, tipo_candidatura, estado) VALUES
                (1, 'Corto urbano sobre la vida moderna.', 1, 8, 3, 2, 'alumno', 'Aceptada'),
                (2, 'Documental sobre la fauna local.', 2, 8, 4, 10, 'alumno', 'En revisión'),
                (3, 'Animación infantil educativa.', 10, 8, 5, NULL, 'alumni', 'Rechazada'),
                (4, 'Drama social ambientado en un barrio.', 12, 8, 6, 1, 'alumno', 'Aceptada'),
                (5, 'Corto experimental en blanco y negro.', 1, 8, 7, NULL, 'alumni', 'En revisión'),
                (1, 'Comedia sobre la universidad.', 2, 8, 9, 12, 'alumno', 'Rechazada'),
                (2, 'Thriller psicológico de suspense.', 10, 8, 11, 1, 'alumno', 'Aceptada'),
                (3, 'Fantasía épica de bajo presupuesto.', 12, 8, 3, NULL, 'alumni', 'En revisión'),
                (4, 'Crítica social al consumismo.', 1, 8, 4, 2, 'alumno', 'Rechazada'),
                (5, 'Documental sobre música urbana.', 2, 8, 5, NULL, 'alumni', 'Aceptada'),
                (1, 'Corto histórico ambientado en 1900.', 10, 8, 6, 12, 'alumno', 'En revisión'),
                (2, 'Relato futurista de ciencia ficción.', 12, 8, 7, 1, 'alumno', 'Aceptada'),
                (3, 'Terror psicológico en espacio cerrado.', 1, 8, 9, NULL, 'alumni', 'Rechazada'),
                (4, 'Historia de superación personal.', 2, 8, 11, 10, 'alumno', 'En revisión'),
                (5, 'Corto musical con artistas locales.', 10, 8, 3, NULL, 'alumni', 'Aceptada'),
                (1, 'Romance juvenil contemporáneo.', 12, 8, 4, 1, 'alumno', 'Rechazada'),
                (2, 'Corto ecológico sobre reciclaje.', 1, 8, 5, 2, 'alumno', 'En revisión'),
                (3, 'Animación stop motion artesanal.', 2, 8, 6, NULL, 'alumni', 'Aceptada'),
                (4, 'Drama familiar intergeneracional.', 10, 8, 7, 12, 'alumno', 'Rechazada'),
                (5, 'Corto artístico abstracto.', 12, 8, 9, NULL, 'alumni', 'Finalista');

                
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
                    ('galaPreEventoFecha', '18/12/2026', 1),
                    ('galaPreEventoHora', '15:00', 1),
                    ('galaPreEventoUbicacion', 'Auditorio Principal', 1),
                    ('galaPreEventoDescripcion', '¡Bienvenidos a la Gala de Cortometrajes 2026! Únete a nosotros para celebrar el talento creativo de nuestros estudiantes y alumni', 1),
                    ('galaPreEventoStreamingActivo', 'true', 1),
                    ('galaPreEventoStreamingUrl', 'https://streaming.ejemplo.com/gala2026  ', 1),
                    ('fechaUltimaModificacionConfiguracion', CURRENT_TIMESTAMP, 1),
                    ('baseUrl', 'http://localhost/DWES/proyecto_integrador_2daw/src/', 1),
                    ('basesLegales', '<div style=\"font-family\": \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 0 auto; padding: 20px; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-radius: 8px;\">

  <div style=\"text-align: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 3px solid #e60012; margin-left: 32px; margin-right: 32px;\">
    <span style=\"font-size: 2.5em; font-weight: 700; color: #000;\">Festival Universitario de Cortometrajes de Animación - II Edición</span><br>
    <span style=\"font-size: 1.4em; color: #000; margin-top: 10px; display: block;\">Creative Campus Universidad Europea</span>
  </div>

  <div style=\"margin: 25px 0; padding: 15px; border-radius: 4px; margin-right: 32px; margin-left: 32px;\">
    <span style=\"font-size: 1.6em; font-weight: 600; text-transform: uppercase; color: #000; display: block; margin-bottom: 12px;\">ANTECEDENTES</span>
    Creative Campus de la Universidad Europea de Madrid, en colaboración con Digital Monster Collective y MIA, lanza el segundo festival de cortometrajes de animación con la intención de:
    <ul style=\"padding-left: 0; margin: 12px 0 0 0; list-style: none;\">
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Generar un espacio donde los estudiantes de diferentes universidades e institutos puedan compartir sus mejores trabajos</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Premiar el talento y la creatividad en el mundo de la animación audiovisual.</li>
    </ul>
  </div>

  <div style=\"margin: 25px 0; padding: 15px; border-radius: 4px; margin-right: 32px; margin-left: 32px;\">
    <span style=\"font-size: 1.6em; font-weight: 600; text-transform: uppercase; color: #000; display: block; margin-bottom: 12px;\">Características de las obras:</span>
    <ul style=\"padding-left: 0; margin: 12px 0 0 0; list-style: none;\">
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Cortometrajes de menos de 10 minutos realizados con cualquier técnica de animación durante 2024 hasta la fecha de entrega de este concurso en 2025.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> El formato deberá ser MP4 o Mov (H.264) con resolución HD 1080</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Las obras podrán estar en cualquier idioma oficial del territorio español y deberán incluir subtítulos en español.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Podrán ser obras de temática libre, siempre que no incurran en la discriminación, promuevan el odio o la xenofobia y no sean obras de carácter sexual explícito.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Se aceptarán cortometrajes tanto narrativos como experimentales, videoclips o piezas promocionales, así como cinemáticas de videojuegos, siempre y cuando el autor o autora posea los derechos de explotación de la obra y la marca que en ella figure.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Las obras deberán ser originales y el autor o autora deberá ser el propietario de los derechos de explotación de la obra presentada.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> No se permite el uso de inteligencias artificiales generativas para la realización de los cortometrajes.</li>
    </ul>
  </div>

  <div style=\"margin: 25px 0; padding: 15px; border-radius: 4px; margin-right: 32px; margin-left: 32px;\">
    <span style=\"font-size: 1.6em; font-weight: 600; text-transform: uppercase; color: #000; display: block; margin-bottom: 12px;\">Requisitos de participación:</span>
    Habrá dos categorías: estudiante y profesional
    <ul style=\"padding-left: 0; margin: 12px 0 0 0; list-style: none;\">
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> <strong>Categoría estudiante:</strong> podrán optar todos los estudiantes mayores de 16 o alumni que se hayan graduado máximo en 2024.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> <strong>Categoría profesional:</strong> profesionales de la industria de la animación o los videojuegos con proyectos audiovisuales que cumplan los requisitos anteriormente expuestos.</li>
    </ul>
  </div>

  <div style=\"margin: 25px 0; padding: 15px; border-radius: 4px; margin-right: 32px; margin-left: 32px;\">
    <span style=\"font-size: 1.6em; font-weight: 600; text-transform: uppercase; color: #000; display: block; margin-bottom: 12px;\">Inscripción</span>
    <ul style=\"padding-left: 0; margin: 12px 0 0 0; list-style: none;\">
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> La fecha límite para la inscripción de cortometrajes es el 1 de septiembre de 2025.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> La inscripción se realizará mediante la página FESTHOME</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> La inscripción es gratuita.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> La inscripción de una obra conlleva la aceptación de las bases.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> No serán admitidas las candidaturas entregadas fuera de plazo, así como aquellas que no se adecuen a los criterios establecidos en la convocatoria (cualquier obra en la que se detecte plagio, uso de IA, una vulneración de los derechos de autor o contemple contenidos o una duración no aceptados será rechazada del festival y la competición).</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Para participar en la categoría de estudiantes, junto con el cortometraje, se presentarán evidencias de tener una matrícula en vigor en alguna universidad, instituto o centro adscrito en el momento de la inscripción, o de haberse graduado entre 2024 y 2025. Además, incluirán un teaser del cortometraje para la difusión del evento en caso de resultar seleccionados finalistas, en el mismo formato que el cortometraje. También se presentará un cartel de la obra para promocionar en caso de resultar seleccionados finalistas.</li>
    </ul>
  </div>

  <div style=\"margin: 25px 0; padding: 15px; border-radius: 4px; margin-right: 32px; margin-left:32px;\">
    <span style=\"font-size: 1.6em; font-weight: 600; text-transform: uppercase; color: #000; display: block; margin-bottom: 12px;\">Categorías y premios:</span>
    <ul style=\"padding-left: 0; margin: 12px 0 0 0; list-style: none;\">
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Premio al mejor cortometraje de animación.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Premio Digital Monster Collective a Mejor Cortometraje de Animación de Estudiantes: 500€</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Premio Creative Campus a Mejor Cortometraje de Animación Profesional: 1000€</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Premio del público: 250€</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Se reserva la posibilidad de un accésit o mención especial si hubiera alguna obra meritoria</li>
    </ul>
  </div>

  <div style=\"margin: 25px 0; padding: 15px; border-radius: 4px; margin-right: 32px; margin-left: 32px;\">
    <span style=\"font-size: 1.6em; font-weight: 600; text-transform: uppercase; color: #000; display: block; margin-bottom: 12px;\">Criterios para concesión de los premios:</span>
    <ul style=\"padding-left: 0; margin: 12px 0 0 0; list-style: none;\">
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Los criterios que se valorarán para la concesión de los premios serán originalidad, la calidad técnica, la profundidad narrativa o complejidad de la técnica empleada en el caso de obras experimentales y el aporte de valor en cuanto a la elección del tema.</li>
    </ul>
  </div>

  <div style=\"margin: 25px 0; padding: 15px; border-radius: 4px; margin-right: 32px; margin-left: 32px;\">
    <span style=\"font-size: 1.6em; font-weight: 600; text-transform: uppercase; color: #000; display: block; margin-bottom: 12px;\">Cesión de derechos de propiedad intelectual:</span>
    La participación en la presente convocatoria supone la cesión gratuita, no exclusiva, universal y sin límite de tiempo, así como la capacidad de cesión a terceros (prensa, redes sociales y medios) de los derechos de propiedad intelectual de los trabajos presentados, con la finalidad de:
    <ul style=\"padding-left: 0; margin: 12px 0 0 0; list-style: none;\">
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Proyección en la plataforma digital online los días del festival de los cortometrajes finalistas.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Promoción del evento en redes sociales y prensa utilizando fragmentos del vídeo, o teasers.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Promoción en futuras ediciones del evento utilizando fragmentos del vídeo o teasers.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> En concreto, los cortometrajes ganadores, serán proyectados de nuevo en un evento público presencial</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Promoción en redes sociales y notas de prensa utilizando los carteles presentados.</li>
    </ul>
    <p style=\"margin-top: 12px;\">Esta cesión abarca, de manera enunciativa pero no limitativa, los derechos de reproducción, distribución, comunicación pública, transformación, y cualquier otro derecho de propiedad intelectual o industrial reconocido por la legislación aplicable, siempre limitado a las aplicaciones anteriormente expuestas.</p>
  </div>

  <div style=\"margin: 25px 0; padding: 15px; border-radius: 4px; margin-right: 32px; margin-left: 32px;\">
    <span style=\"font-size: 1.6em; font-weight: 600; text-transform: uppercase; color: #000; display: block; margin-bottom: 12px;\">Jurado y Resolución:</span>
    <ul style=\"padding-left: 0; margin: 12px 0 0 0; list-style: none;\">
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> El fallo del jurado, que será inapelable y los proyectos ganadores, se anunciarán el 25 de septiembre de 2025, en el Campus Creativo de la Universidad Europea en la calle María de Molina 39, durante el evento realizado a tal efecto a partir de las 18 horas.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Los finalistas serán anunciados el 19 de septiembre en redes sociales y se comunicará vía mail a los participantes.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> El Jurado estará compuesto por miembros designados por la UNIVERSIDAD EUROPEA DE MADRID.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> El jurado podrá declarar desierto el Premio. En este caso, la cuantía del Premio se reservará para la siguiente edición.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> El premio del público se recogerá de las votaciones realizadas a través de la cuenta oficial de Instagram de Creative Campus y serán votados los cortometrajes seleccionados finalistas por el jurado. La votación comenzará desde el momento que se anuncie la lista finalista del jurado hasta que se visionen los cortometrajes en la gala de entrega de premios. El ganador será el que más votos haya obtenido.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Los premiados se comprometen a hacer figurar en el cortometraje y sus comunicaciones públicas el laurel del festival.</li>
    </ul>
  </div>

  <div style=\"margin: 25px 0; padding: 15px; border-radius: 4px; margin-right: 32px; margin-left: 32px;\">
    <span style=\"font-size: 1.6em; font-weight: 600; text-transform: uppercase; color: #000; display: block; margin-bottom: 12px;\">Datos de carácter personal</span>
    <p style=\"margin: 0;\">El Candidato otorga pleno consentimiento y acepta en su totalidad las bases de participación en la presente convocatoria. Los datos que se faciliten a la UNIVERSIDAD en virtud de las presentes bases serán tratados por el responsable del tratamiento, UNIVERSIDAD EUROPEA DE MADRID, S.A.U., para las finalidades de gestión de la presente convocatoria y gestión de actividades varias para las cuales entrega sus datos, así como la remisión de publicidad y actividades de la Universidad que pudiera ser del interés del titular de los datos. Los datos facilitados en virtud de la presente solicitud se incluirán en los sistemas del responsable. Asimismo, de no manifestar fehacientemente lo contrario, usted consiente expresamente el tratamiento de dichos datos por el tiempo que sea necesario para cumplir con los fines indicados. El titular de los datos tiene derecho a acceder, rectificar y suprimir los datos, limitar su tratamiento, oponerse al tratamiento y ejercer su derecho a la portabilidad de los datos de carácter personal, todo ello de forma gratuita, tal como se detalla en la Política de Privacidad de las citadas entidades, en el enlace https://universidadeuropea.es/politica-de-privacidad. Podrá efectuar cualquier consulta en relación con el tratamiento de sus datos personales, así como ejercer los derechos antedichos, en la dirección que prefiera: dpo@universidadeuropea.es</p>
  </div>

  <div style=\"margin: 25px 0; padding: 15px;  border-radius: 4px; margin-right: 32px; margin-left: 32px;\">
    <span style=\"font-size: 1.6em; font-weight: 600; text-transform: uppercase; color: #000; display: block; margin-bottom: 12px;\">DISPOSICIONES FINALES</span>
    <ul style=\"padding-left: 0; margin: 12px 0 0 0; list-style: none;\">
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> El Comité Organizador formado por 3 profesores de la Universidad Europea de Madrid, será el responsable del buen desarrollo del concurso.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> El Comité Organizador se reservará el derecho de aplicar cualquier cambio a estas bases que ayude a mejorar la consecución de los objetivos del presente concurso.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> El Comité Organizador del concurso se reservará el derecho de anular o cancelar la totalidad o parte del concurso en caso de detectar el fraude o incumplimiento de las normas. En este caso, se reservará el derecho de no dar un premio a cualquier participante fraudulento. Una acción fraudulenta descalificará inmediatamente a la persona que la cometa.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> El Comité Organizador será quien determine y comunique cualquier cambio o excepción que afecte las presentes bases.</li>
    </ul>
  </div>

  <div style=\"margin: 25px 0; padding: 15px; border-radius: 4px; margin-right: 32px; margin-left: 32px;\">
    <span style=\"font-size: 1.6em; font-weight: 600; text-transform: uppercase; color: #000; display: block; margin-bottom: 12px;\">Aceptación de las Bases:</span>
    <ul style=\"padding-left: 0; margin: 12px 0 0 0; list-style: none;\">
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Los participantes, por el hecho de presentar sus candidaturas, aceptan las presentes bases y la decisión del Jurado, renunciando a toda reclamación.</li>
      <li style=\"margin: 8px 0; position: relative; padding-left: 22px;\"><span style=\"position: absolute; left: 0; color: #e60012; font-size: 0.8em;\">▪</span> Las presentes bases que serán publicadas en la presente página y en la web designada de la Universidad Europea, se aplicarán a partir de la fecha de su publicación.</li>
    </ul>
  </div>

</div>',1);
                    
                INSERT INTO edicion (anio_edicion, resumen_evento, nro_participantes, tipo, id_organizador, fecha_envio_email_informativo, fecha_borrado_datos) VALUES
                    (2024, 'Resumen 2024', 120, 'anterior', 1, CURDATE(), CURDATE()),
                    (2026, 'Resumen 2026', NULL, 'actual'  , 1, CURDATE(), CURDATE());
                
                INSERT INTO ganadores_edicion (id_edicion, categoria, nombre, premio, id_archivo_video) VALUES
                    (1, 'Documental'  , 'Juan Pérez' , 'Mejor Documental'  , 1),
                    (1, 'Cortometraje', 'María López', 'Mejor Cortometraje', 4);
                
                INSERT INTO historial_candidatura (id_candidatura, estado, motivo) VALUES (1, 'En revisión', 'Inicio');
                INSERT INTO premio_candidatura (id_premio, id_candidatura) VALUES (1, 2);
                
                INSERT INTO edicion_archivos (id_archivo, id_edicion) VALUES
                (1, 1),
                (2, 1),
                (3, 2),
                (4, 2);
                
                INSERT INTO noticia (nombre, descripcion, fecha, id_organizador, id_archivo_imagen) VALUES
                ('Anuncio del festival', 'Lanzamiento oficial del festival de cortometrajes.', '2024-05-01', 1, 4),
                ('Jurado confirmado', 'Presentación del jurado para esta edición.', '2024-05-10', 1, 3),
                ('Programa de eventos', 'Calendario completo de eventos y proyecciones.', '2024-05-15', 1, 5),
                ('Ganadores 2024', 'Lista de ganadores del festival de cortometrajes 2024.', '2024-12-20', 1, 4),
                ('Convocatoria 2025', 'Apertura de inscripciones para la edición 2025.', '2024-12-31', 1, 4),
                ('Evento especial', 'Anuncio de un evento especial durante el festival.', '2024-06-20', 1, 5),
                ('Colaboración con escuelas', 'Nuevas colaboraciones con escuelas de cine.', '2024-07-05', 1, 5),
                ('Talleres para participantes', 'Talleres gratuitos para los inscritos en el festival.', '2024-08-15', 1, 6);
                
                INSERT INTO evento (nombre, descripcion, ubicacion, fecha, hora_inicio, hora_fin, id_organizador, id_archivo_imagen) VALUES
                ('Proyección inaugural', 'Proyección del cortometraje inaugural del festival.', 'Cine Principal', CURDATE(), '19:00', '21:00', 1, 3),
                ('Taller de cine', 'Taller práctico sobre técnicas de filmación.', 'Sala de Talleres', CURDATE(), '10:00', '13:00', 1, 4),
                ('Clausura y entrega de premios', 'Ceremonia de clausura y entrega de premios a los ganadores.', 'Teatro Central', CURDATE(), '20:00', '22:00', 1, 5),
                ('Mesa redonda', 'Debate con directores y productores invitados.', 'Auditorio', CURDATE(), '16:00', '18:00', 1, 6),
                ('Networking', 'Sesión de networking para participantes y profesionales.', 'Sala VIP', CURDATE(), '18:00', '20:00', 1, 7),
                ('Proyección de cortos ganadores', 'Proyección de los cortometrajes ganadores de ediciones anteriores.', 'Cine Secundario', CURDATE(), '15:00', '17:00', 1, 4),
                ('Taller de guionismo', 'Taller sobre escritura de guiones para cortometrajes.', 'Sala de Guionismo', CURDATE(), '11:00', '14:00', 1, 5),
                ('Fiesta de clausura', 'Fiesta para celebrar el cierre del festival.', 'Club Nocturno', CURDATE(), '23:00', '02:00', 1, 6),
                ('Proyección temática', 'Proyección de cortometrajes con temática específica.', 'Cine Temático', CURDATE(), '14:00', '16:00', 1, 4);
                
                INSERT INTO patrocinador (nombre, id_archivo_logo) VALUES
                ('Canon', 4);
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
