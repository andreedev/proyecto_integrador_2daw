<?php
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../src/php/api.php';

class AdminCandidaturasTest extends TestCase {
    private $mockConexion;
    private $mockStmtCount;
    private $mockStmtData;
    private $mockResultCount;
    private $mockResultData;

    protected function setUp(): void {
        $this->mockConexion = $this->createMock(mysqli::class);
        $this->mockStmtCount = $this->createMock(mysqli_stmt::class);
        $this->mockStmtData = $this->createMock(mysqli_stmt::class);
        $this->mockResultCount = $this->createMock(mysqli_result::class);
        $this->mockResultData = $this->createMock(mysqli_result::class);
        
        $GLOBALS['conexion'] = $this->mockConexion;
    }

    protected function tearDown(): void {
        unset($GLOBALS['conexion']);
        unset($_POST);
    }

    // ========== Tests para mostrarCandidaturas ==========

    public function testSinFiltros() {
        $testData = [
            'id_candidatura' => 1,
            'participante' => 'Juan Pérez',
            'estado' => 'pendiente',
            'sinopsis' => 'Test'
        ];

        $this->mockConexion->method('prepare')
            ->willReturnOnConsecutiveCalls($this->mockStmtCount, $this->mockStmtData);

        $this->mockStmtCount->method('execute')->willReturn(true);
        $this->mockResultCount->method('fetch_assoc')->willReturn(['total' => 1]);
        $this->mockStmtCount->method('get_result')->willReturn($this->mockResultCount);

        $this->mockStmtData->method('execute')->willReturn(true);
        $this->mockResultData->method('fetch_assoc')
            ->willReturnOnConsecutiveCalls($testData, null);
        $this->mockStmtData->method('get_result')->willReturn($this->mockResultData);

        $_POST = ['pagina' => 1, 'filtroTexto' => '', 'filtroEstado' => '', 'filtroFecha' => ''];

        ob_start();
        mostrarCandidaturas();
        $result = json_decode(ob_get_clean(), true);

        $this->assertEquals('success', $result['status']);
        $this->assertEquals(1, $result['totalRecords']);
        $this->assertCount(1, $result['data']);
    }

    public function testConFiltroTexto() {
        $testData = [
            'id_candidatura' => 1,
            'participante' => 'Ana',
            'sinopsis' => 'Película de aventuras',
            'estado' => 'aprobado'
        ];

        $this->mockConexion->method('prepare')
            ->willReturnOnConsecutiveCalls($this->mockStmtCount, $this->mockStmtData);

        $this->mockStmtCount->method('execute')->willReturn(true);
        $this->mockResultCount->method('fetch_assoc')->willReturn(['total' => 1]);
        $this->mockStmtCount->method('get_result')->willReturn($this->mockResultCount);

        $this->mockStmtData->method('execute')->willReturn(true);
        $this->mockResultData->method('fetch_assoc')
            ->willReturnOnConsecutiveCalls($testData, null);
        $this->mockStmtData->method('get_result')->willReturn($this->mockResultData);

        $_POST = ['pagina' => 1, 'filtroTexto' => 'aventuras', 'filtroEstado' => '', 'filtroFecha' => ''];

        ob_start();
        mostrarCandidaturas();
        $result = json_decode(ob_get_clean(), true);

        $this->assertStringContainsString('aventuras', strtolower($result['data'][0]['sinopsis']));
    }

    public function testSinResultados() {
        $this->mockConexion->method('prepare')
            ->willReturnOnConsecutiveCalls($this->mockStmtCount, $this->mockStmtData);

        $this->mockStmtCount->method('execute')->willReturn(true);
        $this->mockResultCount->method('fetch_assoc')->willReturn(['total' => 0]);
        $this->mockStmtCount->method('get_result')->willReturn($this->mockResultCount);

        $this->mockStmtData->method('execute')->willReturn(true);
        $this->mockResultData->method('fetch_assoc')->willReturn(null);
        $this->mockStmtData->method('get_result')->willReturn($this->mockResultData);

        $_POST = ['pagina' => 1, 'filtroTexto' => 'noexiste', 'filtroEstado' => '', 'filtroFecha' => ''];

        ob_start();
        mostrarCandidaturas();
        $result = json_decode(ob_get_clean(), true);

        $this->assertEquals(0, $result['totalRecords']);
        $this->assertEmpty($result['data']);
    }


    public function testEditarCandidaturaExitoso() {
        $mockStmtUpdate = $this->createMock(mysqli_stmt::class);
        $mockStmtInsert = $this->createMock(mysqli_stmt::class);

        $mockStmtUpdate->method('bind_param')->willReturn(true);
        $mockStmtUpdate->method('execute')->willReturn(true);

        $mockStmtInsert->method('bind_param')->willReturn(true);
        $mockStmtInsert->method('execute')->willReturn(true);

        $this->mockConexion->method('prepare')
            ->willReturnCallback(function($sql) use ($mockStmtUpdate, $mockStmtInsert) {
                if (strpos($sql, 'UPDATE candidatura') !== false) {
                    return $mockStmtUpdate;
                }
                if (strpos($sql, 'INSERT INTO historial_candidatura') !== false) {
                    return $mockStmtInsert;
                }
                return null;
            });

        $_POST = [
            'idCandidatura' => 1,
            'nuevoEstadoCandidatura' => 'aprobado',
            'motivoCambioEstado' => 'Cumple todos los requisitos'
        ];

        ob_start();
        editarCandidatura();
        $result = json_decode(ob_get_clean(), true);

        $this->assertEquals('success', $result['status']);
        $this->assertEquals('Estado actualizado correctamente', $result['message']);
    }

    public function testEditarCandidaturaConIdInvalido() {
        $mockStmtUpdate = $this->createMock(mysqli_stmt::class);
        $mockStmtInsert = $this->createMock(mysqli_stmt::class);

        $mockStmtUpdate->method('bind_param')->willReturn(true);
        $mockStmtUpdate->method('execute')->willReturn(true);

        $mockStmtInsert->method('bind_param')->willReturn(true);
        $mockStmtInsert->method('execute')->willReturn(true);

        $this->mockConexion->method('prepare')
            ->willReturnCallback(function($sql) use ($mockStmtUpdate, $mockStmtInsert) {
                if (strpos($sql, 'UPDATE candidatura') !== false) {
                    return $mockStmtUpdate;
                }
                if (strpos($sql, 'INSERT INTO historial_candidatura') !== false) {
                    return $mockStmtInsert;
                }
                return null;
            });

        $_POST = [
            'idCandidatura' => 0,
            'nuevoEstadoCandidatura' => 'rechazado',
            'motivoCambioEstado' => 'Datos incompletos'
        ];

        ob_start();
        editarCandidatura();
        $result = json_decode(ob_get_clean(), true);

        $this->assertEquals('success', $result['status']);
    }

    public function testEditarCandidaturaError() {
        $mockStmtUpdate = $this->createMock(mysqli_stmt::class);

        $mockStmtUpdate->method('bind_param')->willReturn(true);
        $mockStmtUpdate->method('execute')->willReturn(false);

        $this->mockConexion->method('prepare')
            ->willReturnCallback(function($sql) use ($mockStmtUpdate) {
                if (strpos($sql, 'UPDATE candidatura') !== false) {
                    return $mockStmtUpdate;
                }
                return null;
            });

        $_POST = [
            'idCandidatura' => 1,
            'nuevoEstadoCandidatura' => 'aprobado',
            'motivoCambioEstado' => 'Test'
        ];

        ob_start();
        editarCandidatura();
        $result = json_decode(ob_get_clean(), true);

        $this->assertEquals('error', $result['status']);
        $this->assertStringContainsString('Error', $result['message']);
    }
}
?>