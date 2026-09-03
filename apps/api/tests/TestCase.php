<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    /**
     * Crea la aplicación para los tests.
     */
    protected function createApplication()
    {
        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

        return $app;
    }

    /**
     * Configura el entorno de prueba.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Configurar MongoDB para tests si existe
        if (config('database.connections.mongodb')) {
            config(['database.default' => 'mongodb']);
        }
    }
}
