<?php

require_once __DIR__ . '/../src/php/api.php';

class ConfiguracionTest extends PHPUnit\Framework\TestCase {

    /**
     * Se ejecuta una sola vez antes de lanzar el primer test de la clase
     */
    public static function setUpBeforeClass(): void {
        abrirConexion();
        crearBaseDatosSiNoExiste();
    }

    /**
     * Se ejecuta una sola vez después de terminar el último test de la clase
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
        
        // Limpiamos el escenario para que cada test sea independiente
        $conexion->query("SET FOREIGN_KEY_CHECKS = 0");
        $conexion->query("DELETE FROM edicion_archivos");
        $conexion->query("DELETE FROM archivo");
        $conexion->query("DELETE FROM edicion");
        $conexion->query("DELETE FROM configuracion");
        $conexion->query("SET FOREIGN_KEY_CHECKS = 1");
    }

    protected function tearDown(): void {
        global $conexion;
        if ($conexion) {
            // Revertimos lo insertado para no ensuciar
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
     * Test principal: Obtener configuración completa
     */
    public function testObtenerConfiguracionCompleta() {
        global $conexion;

        // 1. Datos de prueba
        $conexion->query("INSERT INTO configuracion (nombre, valor) VALUES ('baseUrl', 'http://localhost/'), ('emailContacto', 'test@test.com')");
        $conexion->query("INSERT INTO edicion (anio_edicion, resumen_evento, tipo) VALUES (2026, 'Resumen de prueba', 'actual')");
        $idEdicion = $conexion->insert_id;

        $conexion->query("INSERT INTO archivo (ruta) VALUES ('img/foto1.jpg')");
        $idImg = $conexion->insert_id;
        $conexion->query("INSERT INTO archivo (ruta) VALUES ('video/clip.mp4')");
        $idVid = $conexion->insert_id;
        
        $conexion->query("INSERT INTO edicion_archivos (id_edicion, id_archivo) VALUES ($idEdicion, $idImg), ($idEdicion, $idVid)");

        // 2. Ejecución
        $resultado = $this->capturarSalida('obtenerConfiguracion');

        // 3. Verificaciones
        $this->assertEquals('success', $resultado['status']);
        $data = $resultado['data'];

        $this->assertCount(2, $data['archivosPostEvento']);
        $this->assertEquals('imagen', $data['archivosPostEvento'][0]['tipo']);
        $this->assertEquals('video', $data['archivosPostEvento'][1]['tipo']);
        $this->assertEquals(2026, $data['edicionActual']['anioEdicion']);
    }

    /**
     * Test: Caso cuando no hay edición marcada como actual
     */
    public function testObtenerConfiguracionSinEdicionActual() {
        global $conexion;
        
        $conexion->query("UPDATE edicion SET tipo = 'anterior' WHERE tipo = 'actual'");

        $resultado = $this->capturarSalida('obtenerConfiguracion');

        $this->assertEquals('success', $resultado['status']);
        $this->assertNull($resultado['data']['edicionActual']);
    }
}