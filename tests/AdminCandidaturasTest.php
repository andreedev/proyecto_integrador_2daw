<?php

require_once __DIR__ . '/../src/php/api.php';

class AdminCandidaturasTest extends PHPUnit\Framework\TestCase
{
    // Se ejecuta UNA VEZ al inicio de la clase
    public static function setUpBeforeClass(): void
    {
        abrirConexion();
        crearBaseDatosSiNoExiste();
    }

    // Se ejecuta UNA VEZ al finalizar todos los tests de la clase
    public static function tearDownAfterClass(): void
    {
        global $conexion;
        if ($conexion) {
            $conexion->close();
        }
    }

    /**
     * Se ejecuta ANTES de CADA test individual.
     * Aquí iniciamos una transacción para que cada test trabaje en un entorno aislado.
     */
    protected function setUp(): void
    {
        global $conexion;
        $conexion->begin_transaction();
        $_POST = [];
    }

    /**
     * Se ejecuta DESPUÉS de CADA test individual.
     * Aplicamos un rollback para deshacer cualquier cambio en la BD y dejarla limpia.
     */
    protected function tearDown(): void
    {
        global $conexion;
        if ($conexion) {
            $conexion->rollback();
        }
        unset($_POST);
    }

    /**
     * Mejora: Usamos un DNI aleatorio para que no falle por clave duplicada 
     * si ejecutas el test varias veces.
     */
    private function prepararEscenario($nombre = "User Test", $sinopsis = "Sinopsis")
    {
        global $conexion;
        $dniAleatorio = rand(1000, 9999) . "X"; 
        
        $conexion->query("INSERT INTO participante (nombre, dni) VALUES ('$nombre', '$dniAleatorio')");
        $idParticipante = $conexion->insert_id;

        $conexion->query("INSERT INTO candidatura (id_participante, sinopsis, estado) VALUES ($idParticipante, '$sinopsis', 'En revision')");
        return $conexion->insert_id;
    }


    /**
     * Test de las candidaturas sin aplicar los filtros
     */
    public function testSinFiltros()
    {
        $this->prepararEscenario("Juan", "Test de película");

        $_POST = ['filtroTexto' => ''];

        ob_start();
        listarCandidaturasAdmin();
        $output = ob_get_clean();
        $result = json_decode($output, true);

        $this->assertNotNull($result, "La respuesta de listarCandidaturasAdmin no es un JSON válido: " . $output);
        $this->assertEquals('success', $result['status']);
        $this->assertGreaterThanOrEqual(1, count($result['data']));
    }


    /**
     * Test de cuando la candidatura ha sido exitosa.
     */
    public function testEditarCandidaturaExitoso()
    {
        $id = $this->prepararEscenario();

    
        $_POST = [
            'idCandidatura' => $id,
            'nuevoEstadoCandidatura' => 'aceptado', 
            'motivoCambioEstado' => 'Ok'
        ];

        ob_start();
        actualizarCandidatura();
        $output = ob_get_clean();
        $result = json_decode($output, true);

        $this->assertNotNull($result, "La respuesta de actualizarCandidatura no es un JSON válido: " . $output);
        $this->assertEquals('success', $result['status']);
    }
}