<?php

namespace App\Jobs;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Intervention\Image\Laravel\Facades\Image;

/**
 * Job para procesar y optimizar imágenes.
 * 
 * Este job redimensiona, comprime y genera múltiples versiones
 * de imágenes subidas (thumbnail, medium, large).
 */
class ProcessImageJob extends Job
{
    protected string $filePath;
    protected string $type; // 'blog', 'profile', 'logo', etc.
    protected array $sizes;
    
    /**
     * Create a new job instance.
     */
    public function __construct(string $filePath, string $type = 'default', array $sizes = [])
    {
        $this->filePath = $filePath;
        $this->type = $type;
        $this->sizes = $sizes ?: $this->getDefaultSizes($type);
    }
    
    /**
     * Execute the job.
     */
    public function handle(): array
    {
        $results = [
            'original' => $this->filePath,
            'versions' => [],
            'errors' => []
        ];
        
        // Verificar que el archivo existe
        if (!Storage::disk('public')->exists($this->filePath)) {
            Log::error("ProcessImageJob: File not found", ['path' => $this->filePath]);
            $results['errors'][] = 'File not found';
            return $results;
        }
        
        // Obtener contenido del archivo
        $fileContent = Storage::disk('public')->get($this->filePath);
        
        // Crear instancia de imagen
        try {
            $image = Image::read($fileContent);
        } catch (\Exception $e) {
            Log::error("ProcessImageJob: Failed to read image", [
                'path' => $this->filePath,
                'error' => $e->getMessage()
            ]);
            $results['errors'][] = 'Failed to read image: ' . $e->getMessage();
            return $results;
        }
        
        // Procesar cada tamaño configurado
        foreach ($this->sizes as $sizeName => $dimensions) {
            try {
                $versionPath = $this->generateVersion($image, $sizeName, $dimensions);
                $results['versions'][$sizeName] = $versionPath;
            } catch (\Exception $e) {
                Log::error("ProcessImageJob: Failed to generate version {$sizeName}", [
                    'path' => $this->filePath,
                    'error' => $e->getMessage()
                ]);
                $results['errors'][] = "Failed to generate {$sizeName}: " . $e->getMessage();
            }
        }
        
        Log::info("ProcessImageJob completed", [
            'original' => $this->filePath,
            'versions_count' => count($results['versions']),
            'errors_count' => count($results['errors'])
        ]);
        
        return $results;
    }
    
    /**
     * Generate a specific version of the image.
     */
    protected function generateVersion($image, string $sizeName, array $dimensions): string
    {
        $width = $dimensions['width'] ?? null;
        $height = $dimensions['height'] ?? null;
        $quality = $dimensions['quality'] ?? 85;
        $fit = $dimensions['fit'] ?? 'contain'; // contain, cover, fill, stretch
        
        // Clonar imagen original para no modificarla
        $version = clone $image;
        
        // Aplicar resize según el tipo de fit
        if ($fit === 'cover') {
            $version->cover($width, $height);
        } elseif ($fit === 'fill') {
            $version->fill($width, $height);
        } elseif ($width && $height) {
            $version->resize($width, $height, function ($constraint) {
                $constraint->aspectRatio();
            });
        } elseif ($width) {
            $version->resize($width, null, function ($constraint) {
                $constraint->aspectRatio();
            });
        } elseif ($height) {
            $version->resize(null, $height, function ($constraint) {
                $constraint->aspectRatio();
            });
        }
        
        // Generar path para la versión
        $originalPath = $this->filePath;
        $extension = pathinfo($originalPath, PATHINFO_EXTENSION);
        $filename = pathinfo($originalPath, PATHINFO_FILENAME);
        $directory = dirname($originalPath);
        
        $versionFilename = "{$filename}-{$sizeName}.{$extension}";
        $versionPath = $directory . '/' . $versionFilename;
        
        // Guardar versión
        $versionData = $version->encodeByExtension($extension, $quality);
        Storage::disk('public')->put($versionPath, $versionData);
        
        return $versionPath;
    }
    
    /**
     * Get default sizes for a specific type.
     */
    protected function getDefaultSizes(string $type): array
    {
        $defaults = [
            'blog' => [
                'thumbnail' => ['width' => 300, 'height' => 200, 'fit' => 'cover', 'quality' => 80],
                'medium' => ['width' => 800, 'height' => 600, 'fit' => 'contain', 'quality' => 85],
                'large' => ['width' => 1920, 'height' => 1080, 'fit' => 'contain', 'quality' => 90],
            ],
            'profile' => [
                'thumbnail' => ['width' => 100, 'height' => 100, 'fit' => 'cover', 'quality' => 85],
                'medium' => ['width' => 400, 'height' => 400, 'fit' => 'cover', 'quality' => 90],
            ],
            'logo' => [
                'small' => ['width' => 100, 'height' => 100, 'fit' => 'contain', 'quality' => 95],
                'medium' => ['width' => 300, 'height' => 300, 'fit' => 'contain', 'quality' => 95],
                'large' => ['width' => 600, 'height' => 600, 'fit' => 'contain', 'quality' => 95],
            ],
            'default' => [
                'thumbnail' => ['width' => 300, 'height' => 300, 'fit' => 'cover', 'quality' => 80],
                'medium' => ['width' => 800, 'height' => null, 'fit' => 'contain', 'quality' => 85],
                'large' => ['width' => 1920, 'height' => null, 'fit' => 'contain', 'quality' => 90],
            ]
        ];
        
        return $defaults[$type] ?? $defaults['default'];
    }
}
