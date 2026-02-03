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
     * He añadido un bloque try/finally para evitar buffers abiertos si falla
     */
    private function ejecutarFuncion($funcion) {
        ob_start();
        try {
            $funcion();
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
        // Primero creamos una noticia para asegurar que hay datos
        $this->testCrearNoticia();

        $_POST['filtroNombre'] = 'Noticia';
        $res = $this->ejecutarFuncion('listarNoticias');

        $this->assertEquals('success', $res['status']);
        $this->assertIsArray($res['data']);
        $this->assertGreaterThan(0, count($res['data']));
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