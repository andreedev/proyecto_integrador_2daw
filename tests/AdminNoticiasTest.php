<?php

require_once __DIR__ . '/../src/php/api.php';

class AdminNoticiasTest extends PHPUnit\Framework\TestCase {

    /**
     * Se ejecuta una sola vez al inicio: abre conexión y prepara tablas
     */
    public static function setUpBeforeClass(): void {
        abrirConexion();
        crearBaseDatosSiNoExiste();
    }

    /**
     * Se ejecuta una sola vez al final: cierra la conexión con el servidor
     */
    public static function tearDownAfterClass(): void {
        global $conexion;
        if ($conexion) {
            $conexion->close();
        }
    }

    protected function setUp(): void {
        global $conexion;
        // Iniciamos la transacción para no ensuciar la BD real en cada test
        $conexion->begin_transaction();
    }

    protected function tearDown(): void {
        global $conexion;
        if ($conexion) {
            $conexion->rollback();
        }
        // Limpiar $_POST después de cada test
        $_POST = [];
    }

    /**
     * Auxiliar para capturar el JSON de las funciones de api.php
     * Acepta el nombre de la función como string y la ejecuta
     */
    private function ejecutarFuncion($nombreFuncion) {
        ob_start();
        try {
            // Llamar a la función por su nombre
            call_user_func($nombreFuncion);
        } finally {
            $salida = ob_get_clean();
        }
        return json_decode($salida, true);
    }

    public function testCrearNoticia() {
        $_POST = [
            'nombreNoticia' => 'Noticia de Prueba_PHPUnit',
            'descripcionNoticia' => 'Esta es una descripción de test de php unit',
            'fechaPublicacionNoticia' => '2026-02-01',
            'idArchivoImagen' => null
        ];

        $res = $this->ejecutarFuncion('crearNoticia');

        $this->assertEquals('success', $res['status']);
        $this->assertEquals('Noticia creada correctamente', $res['message']);
    }

    public function testListarNoticias() {
        $this->testCrearNoticia();

        $_POST['filtroNombre'] = 'Noticia';
        $_POST['page'] = 1;
        $_POST['pageSize'] = 5;

        // ejecutarFuncion YA hace ob_start/ob_get_clean y devuelve el JSON decodificado
        $res = $this->ejecutarFuncion('listarNoticias');

        // Debug: ver qué se está devolviendo
        if ($res === null) {
            $this->fail('La respuesta es null. Puede haber un error en la función o un JSON inválido.');
        }

        $this->assertEquals('success', $res['status']);
        $this->assertIsArray($res['data']);

        $this->assertArrayHasKey('list', $res['data']);
        $this->assertArrayHasKey('totalRecords', $res['data']);

        $this->assertGreaterThan(0, count($res['data']['list']));
    }

    public function testEliminarNoticia() {
        global $conexion;

        // Insertamos manualmente una noticia para tener un ID real
        $conexion->query("INSERT INTO noticia (nombre, descripcion, fecha) VALUES ('Eliminar', 'Desc', '2026-02-01')");
        $idInsertado = $conexion->insert_id;

        $_POST['idNoticia'] = $idInsertado;
        $res = $this->ejecutarFuncion('eliminarNoticia');

        $this->assertEquals('success', $res['status']);

        // Verificar que ya no existe en la BD
        $check = $conexion->query("SELECT id_noticia FROM noticia WHERE id_noticia = $idInsertado");
        $this->assertEquals(0, $check->num_rows);
    }
}