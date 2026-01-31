<?php

require_once __DIR__ . '/../src/php/api.php';


class LoginTest extends PHPUnit\Framework\TestCase{
    protected function setUp(): void
    {
        if ($this->assertTrue(session_status()) !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        $_SESSION = [];
    }


    protected function tearDown(): void
    {
        $_SESSION = [];

        if (session_status() === PHP_SESSION_ACTIVE) {
            session_unset();
            session_destroy();
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
        $_SESSION = [];

        ob_start();
        revisarSesion();
        $output = ob_get_clean();

        $this->assertEquals(
            ['status' => 'inactive'],
            json_decode($output, true)
        );
    }

    public function testSesionIniciada()
    {
        // Limpiar sesión
        $_SESSION = [];

        // Simular que login ha ocurrido
        $_SESSION['iniciada'] = true;

        // Comprobamos que la sesión está marcada como iniciada
        $this->assertTrue(isset($_SESSION['iniciada']) && $_SESSION['iniciada'] === true);
    }


     /**
     * @runInSeparateProcess
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
     * @runInSeparateProcess
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

    /**
     * @runInSeparateProcess
     */
    public function testSesionNoIniciada()
    {
        $_SESSION = []; // sesión vacía

        $rolesPermitidos = ['participante', 'organizador'];

        ob_start();
        validarRol($rolesPermitidos);
        $output = ob_get_clean();

        $json = json_decode($output, true);

        $this->assertEquals('error', $json['status']);
        $this->assertEquals('Sesión no iniciada', $json['message']);
    }
}
