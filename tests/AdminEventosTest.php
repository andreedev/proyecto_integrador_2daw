<?php

require_once __DIR__ . '/../src/php/api.php';

class AdminEventosTest extends PHPUnit\Framework\TestCase {

    /**
     * Se ejecuta una sola vez al abrir el archivo de test
     */
    public static function setUpBeforeClass(): void {
        abrirConexion();
        crearBaseDatosSiNoExiste();
    }

    /**
     * Se ejecuta una sola vez al terminar todos los tests del archivo
     */
    public static function tearDownAfterClass(): void {
        global $conexion;
        if ($conexion) {
            $conexion->close();
        }
    }

    protected function setUp(): void {
        global $conexion;
        // Iniciamos la transacción para mantener cada test aislado
        $conexion->begin_transaction();
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

    private function insertarEventoPrueba($nombre = "Evento Test") {
        global $conexion;
        $query = "INSERT INTO evento (nombre, descripcion, ubicacion, fecha, hora_inicio, hora_fin) 
                  VALUES ('$nombre', 'Desc', 'Ubica', '2025-10-10', '10:00:00', '12:00:00')";
        $conexion->query($query);
        return $conexion->insert_id;
    }

    // --- LOS TESTS SE MANTIENEN IGUAL ---

    public function testCrearEventoExitoso() {
        $_POST = [
            'nombreEvento' => 'Conferencia Tech',
            'descripcionEvento' => 'Una charla sobre IA',
            'ubicacionEvento' => 'Madrid',
            'fechaEvento' => '2025-05-20',
            'horaInicioEvento' => '09:00:00',
            'horaFinEvento' => '14:00:00',
            'idArchivoImagen' => null
        ];

        $resultado = $this->capturarSalida('crearEvento');
        $this->assertEquals('success', $resultado['status']);
    }

    public function testListarEventos() {
        $this->insertarEventoPrueba("Evento Listar");
        $resultado = $this->capturarSalida('listarEventos');
        $this->assertEquals('success', $resultado['status']);
        $this->assertIsArray($resultado['data']);
    }

    public function testObtenerEventoPorId() {
        $id = $this->insertarEventoPrueba("Evento Individual");
        $_POST['idEvento'] = $id;
        $resultado = $this->capturarSalida('obtenerEventoPorId');
        $this->assertEquals('success', $resultado['status']);
        $this->assertEquals("Evento Individual", $resultado['data']['nombreEvento']);
    }

    public function testActualizarEvento() {
        $id = $this->insertarEventoPrueba("Evento Antiguo");
        $_POST = [
            'idEvento' => $id,
            'nombreEvento' => 'Evento Actualizado',
            'descripcionEvento' => 'Nueva desc',
            'ubicacionEvento' => 'Nueva ubica',
            'fechaEvento' => '2025-12-31',
            'horaInicioEvento' => '18:00:00',
            'horaFinEvento' => '20:00:00',
            'idArchivoImagen' => 4
        ];
        $resultado = $this->capturarSalida('actualizarEvento');
        $this->assertEquals('success', $resultado['status']);
    }

    public function testEliminarEvento() {
        $id = $this->insertarEventoPrueba("A Eliminar");
        $_POST['idEvento'] = $id;
        $resultado = $this->capturarSalida('eliminarEvento');
        $this->assertEquals('success', $resultado['status']);

        global $conexion;
        $check = $conexion->query("SELECT id_evento FROM evento WHERE id_evento = $id");
        $this->assertEquals(0, $check->num_rows);
    }
}