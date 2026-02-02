<?php
require_once __DIR__ . '/../src/php/api.php';

class PatrocinadoresTest extends PHPUnit\Framework\TestCase
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

    /* Nota: No incluyo testAgregarPatrocinador por petición del usuario 
    */

    /**
     * Test para evitar nombres duplicados
     */
    public function testAgregarPatrocinadorDuplicado() {

        // Creamos el primero
        $_POST['nombre'] = 'ADOBE';
        $_POST['idArchivoLogo'] = 3;
        agregarPatrocinador();
        ob_clean(); // Limpiamos el buffer anterior

        // Intentamos crear el segundo con el mismo nombre
        ob_start();
        agregarPatrocinador();
        $json = ob_get_clean();

        $this->assertStringContainsString('error', $json);
        $this->assertStringContainsString('Ya existe un patrocinador', $json);
    }

    /**
     * Test para actualizar un patrocinador existente
     */
    public function testActualizarPatrocinador() {

        // 1. Insertamos uno para tener algo que editar
        $_POST['nombre'] = 'MARCA ORIGINAL';
        $_POST['idArchivoLogo'] = 1;
        agregarPatrocinador();
        
        // 2. Obtenemos el ID asignado
        ob_start();
        listarPatrocinadores();
        $lista = json_decode(ob_get_clean(), true);
        $idParaEditar = $lista['data'][0]['idPatrocinador'];

        // 3. Editamos
        $_POST['idPatrocinador'] = $idParaEditar;
        $_POST['nombre'] = 'MARCA EDITADA';
        $_POST['idArchivoLogo'] = 1;

        ob_start();
        actualizarPatrocinador();
        $res = ob_get_clean();
        $this->assertStringContainsString('success', $res);

        // 4. Verificamos cambio
        ob_start();
        listarPatrocinadores();
        $jsonFinal = ob_get_clean();
        $this->assertStringContainsString('MARCA EDITADA', $jsonFinal);
    }

    /**
     * Test para eliminar un patrocinador
     */
    public function testEliminarPatrocinador() {

        // 1. Insertamos
        $_POST['nombre'] = 'BORRAME';
        $_POST['idArchivoLogo'] = 1;
        agregarPatrocinador();

        // 2. Obtenemos ID
        ob_start();
        listarPatrocinadores();
        $lista = json_decode(ob_get_clean(), true);
        $idParaEliminar = null;
        foreach($lista['data'] as $p) {
            if($p['nombrePatrocinador'] === 'BORRAME') $idParaEliminar = $p['idPatrocinador'];
        }

        // 3. Eliminamos
        $_POST['idPatrocinador'] = $idParaEliminar;
        ob_start();
        eliminarPatrocinador();
        $res = ob_get_clean();
        $this->assertStringContainsString('success', $res);
    }
}