<?php
require_once __DIR__ . '/../src/php/api.php';

class LoginTest extends PHPUnit\Framework\TestCase
{

    // Se ejecuta UNA VEZ al inicio de la clase
    public static function setUpBeforeClass(): void
    {
        // Abrimos la conexión y preparamos la BD solo una vez
        abrirConexion();
        crearBaseDatosSiNoExiste();
        echo "\nConexión de base de datos establecida para la clase.\n";
    }

    // Se ejecuta UNA VEZ al finalizar todos los tests de la clase
    public static function tearDownAfterClass(): void
    {
        global $conexion;
        if ($conexion) {
            $conexion->close();
        }
        echo "Conexión de base de datos cerrada.\n";
    }

    /**
     * Se ejecuta ANTES de CADA test individual.
     * Aquí iniciamos una transacción para que cada test trabaje en un entorno aislado.
     */
    protected function setUp(): void
    {
        global $conexion;
        // La transacción sí debe ser por cada test para asegurar limpieza
        $conexion->begin_transaction();
    }

    /**
     * Se ejecuta DESPUÉS de CADA test individual.
     * Aplicamos un rollback para deshacer cualquier cambio en la BD y dejarla limpia.
     */
    protected function tearDown(): void
    {
        global $conexion;
        // Revertimos cambios después de cada test individual
        if ($conexion) {
            $conexion->rollback();
        }
    }


    /**
     * En esta función simulamos que el usuario está loggeado y vemos los atributos que tiene.
     */
    public function testSesionActiva()
    {
        $_SESSION['iniciada'] = true;
        ob_start();
        revisarSesion();
        $output = ob_get_clean();

        $this->assertEquals(
            ['status' => 'active', 'rol' => '', 'id' => ''],
            json_decode($output, true)
        );
    }

    /**
     * Cuando no hay ninguna sesion activa.
     */
    public function testSesionInactiva()
    {
        $_SESSION['iniciada'] = false;
        ob_start();
        revisarSesion();
        $output = ob_get_clean();

        $this->assertEquals(
            ['status' => 'inactive'],
            json_decode($output, true)
        );
    }

    /**
     * En esta función probamos el iniciar sesión con un usuario de prueba
     */
    public function testInicioSesion()
    {
        $_POST['numExpediente'] = 'PAR-001';
        $_POST['password'] = '123';

        login();

        $this->assertEquals($_SESSION['iniciada'], 1);
    }

    /**
     * Prueba que el login de un participante es correcto
     */
    public function testParticipantePermitido()
    {
        $_SESSION['iniciada'] = true;
        $_SESSION['rol'] = 'participante';

        $rolesPermitidos = ['participante'];

        ob_start();
        validarRol($rolesPermitidos);
        $output = ob_get_clean();

        $this->assertEmpty($output);
    }

    /**
     * Cuando iniciamos sesión como organizador
     */
    public function testOrganizadorPermitido()
    {
        $_SESSION['iniciada'] = true;
        $_SESSION['rol'] = 'organizador';

        $rolesPermitidos = ['organizador'];

        ob_start();
        validarRol($rolesPermitidos);
        $output = ob_get_clean();

        $this->assertEmpty($output);
    }

    /**
     * Esta función es cuando salta un error al iniciar sesión.
     */

    public function testSesionNoIniciada()
    {
        $_SESSION = [];
        $rolesPermitidos = ['participante', 'organizador'];

        ob_start();
        validarRol($rolesPermitidos);
        $output = ob_get_clean();

        $json = json_decode($output, true);

        $this->assertEquals('error', $json['status']);
        $this->assertEquals('Sesion no iniciada', $json['message']);
    }
}
