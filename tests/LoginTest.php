    <?php

    require_once __DIR__ . '/../src/php/api.php';


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
        $_SESSION = [];

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

    public function testAgregarPatrocinador(){
        $this->testInicioSesion();

        $_POST['nombre'] = 'ADOBE';
        $_POST['idArchivoLogo'] = 3;

        agregarPatrocinador();

        // Capturar el buffer
        ob_start();
        listarPatrocinadores();
        $json = ob_get_clean();

        $this->assertStringContainsString('ADOBE', $json);
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
