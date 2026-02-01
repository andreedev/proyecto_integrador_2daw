<?php

require_once __DIR__ . '/../src/php/api.php';

class BasesLegalesTest extends PHPUnit\Framework\TestCase {

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
        // Iniciamos transacción para aislar cada test
        $conexion->begin_transaction();
    }

    protected function tearDown(): void {
        global $conexion;
        if ($conexion) {
            // Revertimos cambios para dejar la BD como estaba
            $conexion->rollback();
        }
        $_POST = [];
    }

    /**
     * Helper para capturar el JSON de salida de las funciones de la API
     */
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
     * Test: Obtener bases legales cuando existen en la BD
     */
    public function testObtenerBasesLegalesExitoso() {
        global $conexion;

        $textoTest = "Texto legal de prueba con tildes (áéíóú) y ñ.";
        
        // Limpieza y carga de datos controlada para el test
        $conexion->query("DELETE FROM configuracion WHERE nombre = 'basesLegales'");
        $stmt = $conexion->prepare("INSERT INTO configuracion (nombre, valor) VALUES ('basesLegales', ?)");
        $stmt->bind_param("s", $textoTest);
        $stmt->execute();

        $resultado = $this->capturarSalida('obtenerBasesLegales');

        $this->assertIsArray($resultado, "La salida debe ser un JSON válido.");
        $this->assertEquals('success', $resultado['status']);
        $this->assertEquals($textoTest, $resultado['data']);
    }

    /**
     * Test: Error cuando no existe la fila en la tabla configuración
     */
    public function testObtenerBasesLegalesNoExisten() {
        global $conexion;

        $conexion->query("DELETE FROM configuracion WHERE nombre = 'basesLegales'");

        $resultado = $this->capturarSalida('obtenerBasesLegales');

        $this->assertEquals('error', $resultado['status']);
        $this->assertEquals('No se encontraron las bases legales', $resultado['message']);
    }
}