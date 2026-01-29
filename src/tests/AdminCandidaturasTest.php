<?php
require_once __DIR__ . './api.php';

use PHPUnit\Framework\TestCase;

class AdminCandidaturasTest extends TestCase
{
    protected $conexionMock;
    protected $stmtCountMock;
    protected $stmtDataMock;
    protected $resultCountMock;
    protected $resultDataMock;

    protected function setUp(): void
    {
        global $conexion;

        // Mock de la conexión y de las sentencias
        $this->conexionMock = $this->createMock(mysqli::class);
        $this->stmtCountMock = $this->createMock(mysqli_stmt::class);
        $this->stmtDataMock = $this->createMock(mysqli_stmt::class);
        $this->resultCountMock = $this->createMock(mysqli_result::class);
        $this->resultDataMock = $this->createMock(mysqli_result::class);

        $conexion = $this->conexionMock;
    }

    protected function tearDown(): void
    {
        unset($GLOBALS['conexion']);
        $_POST = [];
    }

    private function prepararMocks(array $countResult, array $dataResult): void
{
    // Configurar resultados del COUNT(*)
    $this->stmtCountMock->method('bind_param')->willReturn(true);
    $this->stmtCountMock->method('execute')->willReturn(true);
    $this->resultCountMock->method('fetch_assoc')->willReturn($countResult);
    $this->stmtCountMock->method('get_result')->willReturn($this->resultCountMock);

    // Configurar resultados de los datos
    $this->stmtDataMock->method('bind_param')->willReturn(true);
    $this->stmtDataMock->method('execute')->willReturn(true);

    $fetchResults = $dataResult;
    $fetchResults[] = null; // Para terminar fetch_assoc
    $this->resultDataMock->method('fetch_assoc')
        ->willReturnOnConsecutiveCalls(...$fetchResults);

    $this->stmtDataMock->method('get_result')->willReturn($this->resultDataMock);

    // Preparar callback para prepare según la consulta
    $this->conexionMock->method('prepare')
        ->willReturnCallback(function ($sql) {
            if (strpos($sql, 'COUNT(*)') !== false) {
                return $this->stmtCountMock;
            }
            return $this->stmtDataMock;
        });
}


    public function testMostrarCandidaturasBasico(): void
    {
        $_POST = ['pagina' => 1];

        $this->prepararMocks(
            ['total' => 25],
            [
                [
                    'id_candidatura' => 1,
                    'nombre' => 'Candidatura Test',
                    'sinopsis' => 'Sinopsis de prueba',
                    'estado' => 'pendiente',
                    'video' => '/videos/test.mp4',
                    'ficha' => '/fichas/test.pdf',
                    'cartel' => '/carteles/test.jpg',
                    'trailer' => '/trailers/test.mp4'
                ]
            ]
        );

        ob_start();
        mostrarCandidaturas();
        $output = ob_get_clean();

        $data = json_decode($output, true);

        $this->assertEquals('success', $data['status']);
        $this->assertEquals(25, $data['totalRecords']);
        $this->assertEquals(3, $data['totalPages']);
        $this->assertEquals(1, $data['currentPage']);
        $this->assertCount(1, $data['data']);
    }

    public function testMostrarCandidaturasSinResultados(): void
    {
        $_POST = ['pagina' => 1, 'filtroTexto' => 'inexistente'];

        $this->prepararMocks(
            ['total' => 0],
            []
        );

        ob_start();
        mostrarCandidaturas();
        $output = ob_get_clean();

        $data = json_decode($output, true);

        $this->assertEquals(0, $data['totalRecords']);
        $this->assertEquals(0, $data['totalPages']);
        $this->assertEmpty($data['data']);
    }

    public function testMostrarCandidaturasRutas(): void
    {
        $_POST = ['pagina' => 1];

        // Definimos la función global de manera segura
        if (!function_exists('obtenerBaseUrl')) {
            function obtenerBaseUrl()
            {
                return 'http://localhost/proyecto/';
            }
        }

        $this->prepararMocks(
            ['total' => 1],
            [
                [
                    'id_candidatura' => 1,
                    'nombre' => 'Test',
                    'estado' => 'pendiente',
                    'video' => '/videos/test.mp4',
                    'ficha' => '/fichas/test.pdf',
                    'cartel' => '/carteles/test.jpg',
                    'trailer' => '/trailers/test.mp4'
                ]
            ]
        );

        ob_start();
        mostrarCandidaturas();
        $output = ob_get_clean();

        $data = json_decode($output, true);

        $this->assertStringStartsWith('http://localhost/proyecto/', $data['data'][0]['rutaVideo']);
        $this->assertStringStartsWith('http://localhost/proyecto/', $data['data'][0]['rutaFicha']);
        $this->assertStringStartsWith('http://localhost/proyecto/', $data['data'][0]['rutaCartel']);
        $this->assertStringStartsWith('http://localhost/proyecto/', $data['data'][0]['rutaTrailer']);
    }
}
