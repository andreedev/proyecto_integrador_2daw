<?php
require_once __DIR__ . '/../src/php/api.php';

class AdminCategoriaConPremioTest extends PHPUnit\Framework\TestCase {

    /**
     * Configuración inicial antes de cada test.
     */
    protected function setUp(): void
    {
        global $conexion;
        if (function_exists('abrirConexion')) abrirConexion();
        if (function_exists('crearBaseDatosSiNoExiste')) crearBaseDatosSiNoExiste();

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
    private function capturarRespuestaAPI($funcion) {
        ob_start(); // Inicia el buffer de salida
        $funcion(); // Ejecuta la función de la API
        $output = ob_get_clean(); // Captura el contenido y limpia el buffer
        return json_decode($output, true);
    }


    /**
     * Verifica que se puedan listar las categorías con sus premios.
     */
    public function testObtenerCategoriasConPremios() {
        $response = $this->capturarRespuestaAPI('obtenerCategoriasConPremios');

        $this->assertEquals('success', $response['status']);
        $this->assertIsArray($response['data']);
    }

    /**
     * Verifica la creación de una nueva categoría junto con una lista de premios.
     */
    public function testAgregarCategoriaConPremios() {
        $_POST['nombreCategoria'] = 'Categoría de Prueba';
        $_POST['premios'] = json_encode([
            ['nombre' => 'Premio 1', 'incluye_dinero' => true, 'cantidad_dinero' => 100],
            ['nombre' => 'Premio 2', 'incluye_dinero' => false]
        ]);

        $response = $this->capturarRespuestaAPI('agregarCategoriaConPremios');

        // Validamos que la respuesta sea exitosa y contenga los datos correctos
        $this->assertEquals('success', $response['status']);
        $this->assertEquals('Categoría de Prueba', $response['data']['nombre']);
        $this->assertCount(2, $response['data']['premios']);
        $this->assertNotNull($response['data']['id_categoria']);
    }

    /**
     * Verifica la actualización del nombre de una categoría y sus premios asociados.
     */
    public function testEditarCategoriaConPremios() {
        global $conexion;
        
        // Creamos una categoría previa para poder editarla
        $conexion->query("INSERT INTO categoria (nombre) VALUES ('Original')");
        $idInsertado = $conexion->insert_id;

        // Configuramos los nuevos datos en $_POST
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
    public function testEliminarCategoria() {
        global $conexion;

        // Creamos un registro temporal para borrar
        $conexion->query("INSERT INTO categoria (nombre) VALUES ('A Borrar')");
        $idABorrar = $conexion->insert_id;

        $_POST['id_categoria'] = $idABorrar;

        $response = $this->capturarRespuestaAPI('eliminarCategoria');

        $this->assertEquals('success', $response['status']);
        $this->assertEquals($idABorrar, $response['id_categoria_eliminada']);
    }

    /**
     * Este test prueba que haya pruebas que no funcionen o que estén incompletas.
     */
    public function testAgregarCategoriaFaltanDatos() {
        // Enviamos nombre pero no enviamos el campo 'premios'
        $_POST['nombreCategoria'] = 'Incompleta';
        
        $response = $this->capturarRespuestaAPI('agregarCategoriaConPremios');

        $this->assertEquals('error', $response['status']);
        $this->assertEquals('Faltan datos', $response['message']);
    }
}
?>