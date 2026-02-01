<?php

require_once __DIR__ . '/../src/php/api.php';

class AdminCategoriaConPremioTest extends PHPUnit\Framework\TestCase
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
     * Configuración inicial antes de cada test.
     */
    protected function setUp(): void
    {
        global $conexion;

        // Limpiar $_POST para evitar arrastrar datos de tests anteriores
        $_POST = [];

        // Inicia una transacción para que los cambios no afecten a la base de datos real
        $conexion->begin_transaction();
    }

    /**
     * Limpieza después de cada test.
     */
    protected function tearDown(): void
    {
        global $conexion;
        if ($conexion) {
            $conexion->rollback();
        }
    }

    /**
     * Método auxiliar para capturar la salida de las funciones que usan 'echo'.
     * Convierte el JSON impreso en un array asociativo de PHP.
     */
    private function capturarRespuestaAPI($funcion)
    {
        ob_start();
        try {
            $funcion();
        } finally {
            $output = ob_get_clean();
        }
        return json_decode($output, true);
    }

    /**
     * Verifica que se puedan listar las categorías con sus premios.
     */
    public function testObtenerCategoriasConPremios()
    {
        $response = $this->capturarRespuestaAPI('obtenerCategoriasConPremios');

        $this->assertEquals('success', $response['status']);
        $this->assertIsArray($response['data']);
    }

    /**
     * Verifica la creación de una nueva categoría junto con una lista de premios.
     */
    public function testAgregarCategoriaConPremios()
    {
        $_POST['nombreCategoria'] = 'Categoría de Prueba';
        $_POST['premios'] = json_encode([
            ['nombre' => 'Premio 1', 'incluye_dinero' => true, 'cantidad_dinero' => 100],
            ['nombre' => 'Premio 2', 'incluye_dinero' => false]
        ]);

        $response = $this->capturarRespuestaAPI('agregarCategoriaConPremios');

        $this->assertEquals('success', $response['status']);
        $this->assertEquals('Categoría de Prueba', $response['data']['nombre']);
        $this->assertCount(2, $response['data']['premios']);
        $this->assertNotNull($response['data']['id_categoria']);
    }

    /**
     * Verifica la actualización del nombre de una categoría y sus premios asociados.
     */
    public function testEditarCategoriaConPremios()
    {
        global $conexion;

        $conexion->query("INSERT INTO categoria (nombre) VALUES ('Original')");
        $idInsertado = $conexion->insert_id;

        $_POST['idCategoria'] = $idInsertado;
        $_POST['nombreCategoria'] = 'Nombre Editado';
        $_POST['premios'] = json_encode([
            ['nombre' => 'Premio Nuevo', 'incluye_dinero' => true, 'cantidad_dinero' => 50]
        ]);

        $response = $this->capturarRespuestaAPI('editarCategoriaConPremios');

        $this->assertEquals('success', $response['status']);
        $this->assertEquals('Nombre Editado', $response['data']['nombre']);
    }

    /**
     * Verifica la eliminación lógica/física de una categoría.
     */
    public function testEliminarCategoria()
    {
        global $conexion;

        $conexion->query("INSERT INTO categoria (nombre) VALUES ('A Borrar')");
        $idABorrar = $conexion->insert_id;

        $_POST['id_categoria'] = $idABorrar;

        $response = $this->capturarRespuestaAPI('eliminarCategoria');

        $this->assertEquals('success', $response['status']);
        $this->assertEquals($idABorrar, $response['id_categoria_eliminada']);
    }

    /**
     * Verifica el manejo de errores por datos faltantes.
     */
    public function testAgregarCategoriaFaltanDatos()
    {
        $_POST['nombreCategoria'] = 'Incompleta';

        $response = $this->capturarRespuestaAPI('agregarCategoriaConPremios');

        $this->assertEquals('error', $response['status']);
        $this->assertEquals('Faltan datos', $response['message']);
    }
}
