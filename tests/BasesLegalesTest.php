<?php
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../src/php/api.php';

class BasesLegalesTest extends TestCase {

    protected function setUp(): void {
        global $conexion;
        abrirConexion();
        crearBaseDatosSiNoExiste();
        $conexion->begin_transaction();
    }

    protected function tearDown(): void {
        global $conexion;
        // Revertir todos los cambios hechos durante el test
        if ($conexion) {
            $conexion->rollback();
        }
        // Limpiar superglobales
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