<?php

require_once __DIR__ . '/../src/php/api.php';

class GanadoresTest extends PHPUnit\Framework\TestCase
{
    /**
     * Se ejecuta una sola vez al inicio: abre conexión y prepara tablas
     */
    public static function setUpBeforeClass(): void
    {
        abrirConexion();
        crearBaseDatosSiNoExiste();
    }

    /**
     * Se ejecuta una sola vez al final: cierra la conexión con el servidor
     */
    public static function tearDownAfterClass(): void
    {
        global $conexion;
        if ($conexion) {
            $conexion->close();
        }
    }

    /**
     * Iniciamos transacción para aislar cada test
     */
    protected function setUp(): void
    {
        global $conexion;
        if ($conexion) {
            $conexion->begin_transaction();
        }
    }

    /**
     * Revertimos cambios para dejar la BD como estaba y limpiamos superglobales
     */
    protected function tearDown(): void
    {
        global $conexion;
        if ($conexion) {
            $conexion->rollback();
        }
        $_POST = [];
    }

    // --- Casos de Prueba ---

    public function testListarFinalistasNoGanadores()
    {
        // Capturamos el JSON que imprime la función
        ob_start();
        listarFinalistasNoGanadores();
        $output = ob_get_clean();

        $data = json_decode($output, true);

        $this->assertEquals('success', $data['status'], "La respuesta debería ser success");
        $this->assertIsArray($data['data'], "El campo data debería ser un array");
    }

    public function testAsignarGanador()
    {
        global $conexion;

        // 1. Desactivamos llaves foráneas para que nos deje insertar IDs 999 
        // sin que existan realmente en las otras tablas (evita el error de Foreign Key)
        $conexion->query("SET FOREIGN_KEY_CHECKS = 0");

        // Preparamos los IDs (asegúrate de que estos no existan o sean altos)
        $_POST['idPremio'] = 999;
        $_POST['idCandidatura'] = 999;

        // 2. Manejo del búfer de salida
        ob_start();
        try {
            asignarGanador();
            $output = ob_get_clean();
        } catch (Exception $e) {
            if (ob_get_level() > 0) ob_end_clean();
            $this->fail("Error de base de datos: " . $e->getMessage());
        } finally {
            // MUY IMPORTANTE: Volver a activar las llaves foráneas
            $conexion->query("SET FOREIGN_KEY_CHECKS = 1");
        }

        $data = json_decode($output, true);

        $this->assertEquals('success', $data['status']);
        $this->assertEquals('Ganador asignado correctamente', $data['message']);
    }

    public function testDesasignarGanador()
    {
        $_POST['idPremio'] = 999;
        $_POST['idCandidatura'] = 999;

        ob_start();
        try {
            desasignarGanador();
            $output = ob_get_clean();
        } catch (Exception $e) {
            if (ob_get_level() > 0) ob_end_clean();
            $this->fail("Error en desasignar: " . $e->getMessage());
        }

        $data = json_decode($output, true);
        $this->assertEquals('success', $data['status']);
    }
}
