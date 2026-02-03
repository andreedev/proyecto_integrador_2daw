<?php
require_once __DIR__ . '/../src/php/api.php';

//Aplicar setUpBeforeClass y tearDownBeforeClass
class LoginTest extends PHPUnit\Framework\TestCase{

    protected function setUp(): void
    {
        global $conexion;
        abrirConexion();
        crearBaseDatosSiNoExiste();

        // Desactivar el autocommit e iniciar la transacción
        $conexion->begin_transaction();
    }


    protected function tearDown(): void
    {
        global $conexion;
        // Revertir todos los cambios hechos durante el test
        if ($conexion) {
            $conexion->rollback();
        }
    }

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

    public function testInicioSesion()
    {

        $_POST['numExpediente'] = 'PAR-001';
        $_POST['password'] = '123';

        login();

        // Comprobamos que la sesión está marcada como iniciada
        $this->assertEquals($_SESSION['iniciada'], 1);
    }



     /**
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
     */
    public function testOrganizadorPermitido()
    {
        $_SESSION['iniciada'] = true;
        $_SESSION['rol'] = 'organizador';

        $rolesPermitidos = ['organizador'];

        ob_start();
        validarRol($rolesPermitidos);
        $output = ob_get_clean();

        $this->assertEmpty($output); // si no hay error, la función no hace echo
    }

    public function testSesionNoIniciada()
    {
        $_SESSION = []; // sesión vacía

        $rolesPermitidos = ['participante', 'organizador'];

        ob_start();
        validarRol($rolesPermitidos);
        $output = ob_get_clean();

        $json = json_decode($output, true);

        $this->assertEquals('error', $json['status']);
        $this->assertEquals('Sesion no iniciada', $json['message']);
    }
}
