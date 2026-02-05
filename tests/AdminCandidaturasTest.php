<?php

require_once __DIR__ . '/../src/php/api.php';

class AdminCandidaturasTest extends PHPUnit\Framework\TestCase
{
    /**
     * Se ejecuta una sola vez antes de lanzar el primer test de la clase.
     * Ideal para inicializar la conexión y preparar la estructura.
     */
    public static function setUpBeforeClass(): void
    {
        abrirConexion();
        crearBaseDatosSiNoExiste();
    }

    /**
     * Se ejecuta una sola vez al finalizar todos los tests de la clase.
     */
    public static function tearDownAfterClass(): void
    {
        global $conexion;
        if ($conexion) {
            $conexion->close();
        }
    }

    protected function setUp(): void
    {
        global $conexion;
        // Iniciamos transacción para que los cambios de cada test no sean permanentes
        $conexion->begin_transaction();
        $_POST = [];
    }

    protected function tearDown(): void
    {
        global $conexion;
        if ($conexion) {
            // Revertimos los cambios realizados en el test individual
            $conexion->rollback();
        }
        unset($_POST);
    }

    /**
     * Lo usamos para no ver SQL dentro de los tests.
     */
    private function prepararEscenario($nombre = "User Test", $sinopsis = "Sinopsis")
    {
        global $conexion;
        $conexion->query("INSERT INTO participante (nombre, dni) VALUES ('$nombre', '12345678Z')");
        $idParticipante = $conexion->insert_id;

        $conexion->query("INSERT INTO candidatura (id_participante, sinopsis, estado) VALUES ($idParticipante, '$sinopsis', 'pendiente')");
        return $conexion->insert_id;
    }

    // ========== TESTS ==========

    public function testSinFiltros()
    {
        $this->prepararEscenario("Juan", "Test de película");

        $_POST = ['pagina' => 1, 'filtroTexto' => ''];

        ob_start();
        listarCandidaturasAdmin();
        $result = json_decode(ob_get_clean(), true);

        $this->assertEquals('success', $result['status']);
        $this->assertGreaterThanOrEqual(1, count($result['data']));
    }

    public function testEditarCandidaturaExitoso()
    {
        $id = $this->prepararEscenario();

        $_POST = [
            'idCandidatura' => $id,
            'nuevoEstadoCandidatura' => 'aprobado',
            'motivoCambioEstado' => 'Ok'
        ];

        ob_start();
        actualizarCandidatura();
        $result = json_decode(ob_get_clean(), true);

        $this->assertEquals('success', $result['status']);
    }
}
