<?php

require_once __DIR__ . '/../src/php/api.php';

class AdminModoEventoTest extends PHPUnit\Framework\TestCase {

    /**
     * Se ejecuta una sola vez al inicio: abre conexión y prepara tablas
     */
    public static function setUpBeforeClass(): void {
        abrirConexion();
        crearBaseDatosSiNoExiste();
    }

    /**
     * Se ejecuta una sola vez al final: cierra la conexión con el servidor
     */
    public static function tearDownAfterClass(): void {
        global $conexion;
        if ($conexion) {
            $conexion->close();
        }
    }

    protected function setUp(): void {
        global $conexion;
        $conexion->begin_transaction();

        // IMPORTANTE: Para que los UPDATE funcionen, las filas deben existir.
        // Insertamos las claves necesarias en la tabla configuración.
        $claves = [
            'modo', 'galaPreEventoTitulo', 'galaPreEventoFecha', 'galaPreEventoHora',
            'galaPreEventoUbicacion', 'galaPreEventoDescripcion', 
            'galaPreEventoStreamingActivo', 'galaPreEventoStreamingUrl', 
            'fechaUltimaModificacionConfiguracion'
        ];

        foreach ($claves as $clave) {
            $conexion->query("INSERT IGNORE INTO configuracion (nombre, valor) VALUES ('$clave', '')");
        }
    }

    protected function tearDown(): void {
        global $conexion;
        if ($conexion) {
            $conexion->rollback();
        }
        $_POST = [];
    }

    private function capturarSalida($funcion) {
        ob_start();
        try {
            $funcion();
        } finally {
            $salida = ob_get_clean();
        }
        return json_decode($salida, true);
    }

    /**
     * Test para actualizarDatosPreEvento
     */
    public function testActualizarDatosPreEvento() {
        global $conexion;

        $_POST = [
            'galaPreEventoTitulo' => 'Gala de Bienvenida 2026',
            'galaPreEventoFecha' => '2026-05-15',
            'galaPreEventoHora' => '19:00',
            'galaPreEventoUbicacion' => 'Teatro Principal',
            'galaPreEventoDescripcion' => 'Descripción del evento de prueba',
            'galaPreEventoStreamingActivo' => 'si',
            'galaPreEventoStreamingUrl' => 'https://live.stream.com/test'
        ];

        $res = $this->capturarSalida('actualizarDatosPreEvento');

        $this->assertEquals('success', $res['status']);
        $this->assertEquals('Proceso finalizado', $res['message']);

        // Verificamos que se haya cambiado el modo y el título en la BD
        $check = $conexion->query("SELECT valor FROM configuracion WHERE nombre = 'modo'");
        $this->assertEquals('pre-evento', $check->fetch_assoc()['valor']);

        $checkTitulo = $conexion->query("SELECT valor FROM configuracion WHERE nombre = 'galaPreEventoTitulo'");
        $this->assertEquals('Gala de Bienvenida 2026', $checkTitulo->fetch_assoc()['valor']);
    }

    /**
     * Test para actualizarDatosPostEvento
     */
    public function testActualizarDatosPostEvento() {
        global $conexion;

        // 1. Preparamos una edición actual y un par de archivos
        $conexion->query("INSERT INTO edicion (anio_edicion, resumen_evento, tipo) VALUES (2026, 'Resumen antiguo', 'actual')");
        $idEdicion = $conexion->insert_id;

        $conexion->query("INSERT INTO edicion_archivos (id_archivo, id_edicion) VALUES (6, $idEdicion)");
        $conexion->query("INSERT INTO edicion_archivos (id_archivo, id_edicion) VALUES (7, $idEdicion)");

        // 2. Preparamos los datos POST
        $_POST = [
            'resumenPostEvento' => 'Este es el nuevo resumen del post-evento.',
            'archivos' => json_encode([6, 7]) // Enviamos los IDs de los archivos como JSON
        ];

        $res = $this->capturarSalida('actualizarDatosPostEvento');

        $this->assertEquals('success', $res['status']);
        $this->assertEquals('Galería actualizada', $res['message']);

        // 3. Verificaciones en la BD
        // Verificamos que el modo cambió a post-evento
        $checkModo = $conexion->query("SELECT valor FROM configuracion WHERE nombre = 'modo'");
        $this->assertEquals('post-evento', $checkModo->fetch_assoc()['valor']);

        // Verificamos que el resumen de la edición se actualizó
        $checkResumen = $conexion->query("SELECT resumen_evento FROM edicion WHERE id_edicion = $idEdicion");
        $this->assertEquals($_POST['resumenPostEvento'], $checkResumen->fetch_assoc()['resumen_evento']);

        // Verificamos que se insertaron 2 relaciones en edicion_archivos
        $checkArchivos = $conexion->query("SELECT COUNT(*) as total FROM edicion_archivos WHERE id_edicion = $idEdicion");
        $this->assertEquals(2, $checkArchivos->fetch_assoc()['total']);
    }
}