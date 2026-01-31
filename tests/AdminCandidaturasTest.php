<?php

require_once __DIR__ . '/../src/php/api.php';

class AdminCandidaturasTest extends PHPUnit\Framework\TestCase
{

    protected function setUp(): void
    {
        global $conexion;
        abrirConexion();
        crearBaseDatosSiNoExiste();
        $conexion->begin_transaction();
        $_POST = [];
    }

    protected function tearDown(): void
    {
        global $conexion;
        if ($conexion) {
            $conexion->rollback();
            $conexion->close();
        }
        unset($_POST);
    }

    /**
     * Lo usamos para no ver SQL dentro de los tests.
     */
    private function prepararEscenario($nombre = "User Test", $sinopsis = "Sinopsis")
    {
        global $conexion;
        // Creamos lo mínimo necesario para que el INNER JOIN de mostrarCandidaturas funcione
        $conexion->query("INSERT INTO participante (nombre, dni) VALUES ('$nombre', '12345678Z')");
        $idParticipante = $conexion->insert_id;

        $conexion->query("INSERT INTO candidatura (id_participante, sinopsis, estado) VALUES ($idParticipante, '$sinopsis', 'pendiente')");
        return $conexion->insert_id;
    }

    // ========== TESTS LIMPIOS ==========

    public function testSinFiltros()
    {
        // Llamamos al método, no hay SQL a la vista aquí
        $this->prepararEscenario("Juan", "Test de película");

        $_POST = ['pagina' => 1, 'filtroTexto' => ''];

        ob_start();
        mostrarCandidaturas();
        $result = json_decode(ob_get_clean(), true);

        $this->assertEquals('success', $result['status']);
        $this->assertGreaterThanOrEqual(1, count($result['data']));
    }

    public function testEditarCandidaturaExitoso()
    {
        // Preparamos el terreno
        $id = $this->prepararEscenario();

        $_POST = [
            'idCandidatura' => $id,
            'nuevoEstadoCandidatura' => 'aprobado',
            'motivoCambioEstado' => 'Ok'
        ];

        ob_start();
        editarCandidatura();
        $result = json_decode(ob_get_clean(), true);

        $this->assertEquals('success', $result['status']);
    }
}
