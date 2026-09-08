<?php

namespace App\Jobs;

use App\Models\NewsletterSubscriber;
use App\Models\NewsletterCampaign;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Job para enviar campañas de newsletter a suscriptores.
 * 
 * Este job procesa el envío masivo de emails en chunks
 * para evitar timeouts y límites de rate limiting.
 */
class SendNewsletterJob extends Job
{
    protected NewsletterCampaign $campaign;
    protected int $chunkSize = 100;
    
    /**
     * Create a new job instance.
     */
    public function __construct(NewsletterCampaign $campaign, int $chunkSize = 100)
    {
        $this->campaign = $campaign;
        $this->chunkSize = $chunkSize;
    }
    
    /**
     * Execute the job.
     */
    public function handle(): int
    {
        $sentCount = 0;
        $failedCount = 0;
        
        // Verificar estado de la campaña
        if (!in_array($this->campaign->status, ['scheduled', 'sending'])) {
            Log::warning("SendNewsletterJob: Campaign {$this->campaign->id} is not in sendable status", [
                'status' => $this->campaign->status
            ]);
            return 0;
        }
        
        // Actualizar estado a "sending"
        DB::transaction(function () {
            $this->campaign->update([
                'status' => 'sending',
                'started_at' => now()
            ]);
        });
        
        // Obtener suscriptores activos con paginación por chunks
        $query = NewsletterSubscriber::query()
            ->where('is_active', true)
            ->whereNull('unsubscribed_at');
        
        // Aplicar filtros por tags si la campaña tiene targeting
        if (!empty($this->campaign->target_tags)) {
            $tags = is_array($this->campaign->target_tags) 
                ? $this->campaign->target_tags 
                : json_decode($this->campaign->target_tags, true);
            
            if (is_array($tags) && !empty($tags)) {
                $query->whereJsonContains('tags', $tags);
            }
        }
        
        // Procesar en chunks para evitar memory issues
        $query->chunk($this->chunkSize, function ($subscribers) use (&$sentCount, &$failedCount) {
            foreach ($subscribers as $subscriber) {
                try {
                    $this->sendEmailToSubscriber($subscriber);
                    $sentCount++;
                    
                    // Actualizar contadores incrementalmente
                    if ($sentCount % 10 === 0) {
                        $this->campaign->update([
                            'sent_count' => DB::raw('sent_count + 10')
                        ]);
                    }
                } catch (\Exception $e) {
                    Log::error("SendNewsletterJob: Failed to send to subscriber {$subscriber->id}", [
                        'email' => $subscriber->email,
                        'error' => $e->getMessage()
                    ]);
                    $failedCount++;
                }
            }
        });
        
        // Finalizar campaña
        DB::transaction(function () use ($sentCount, $failedCount) {
            $this->campaign->update([
                'status' => 'sent',
                'completed_at' => now(),
                'sent_count' => $sentCount,
                'failed_count' => $failedCount
            ]);
        });
        
        Log::info("SendNewsletterJob completed", [
            'campaign_id' => $this->campaign->id,
            'sent' => $sentCount,
            'failed' => $failedCount
        ]);
        
        return $sentCount;
    }
    
    /**
     * Send email to a single subscriber.
     */
    protected function sendEmailToSubscriber(NewsletterSubscriber $subscriber): void
    {
        // Generar token único para tracking
        $trackingToken = bin2hex(random_bytes(16));
        
        // Guardar token para tracking (en tabla campaign_recipients o similar)
        // Esto permitiría trackear opens y clicks por destinatario
        
        // Enviar email
        Mail::raw($this->buildEmailContent($subscriber), function ($message) use ($subscriber, $trackingToken) {
            $message->to($subscriber->email, $subscriber->name)
                    ->subject($this->campaign->subject)
                    ->from(config('mail.from.address', 'noreply@farutech.local'), config('mail.from.name', 'Farutech'))
                    ->withSwiftMessage(function ($swiftMessage) use ($trackingToken) {
                        // Agregar header para tracking de opens
                        $swiftMessage->getHeaders()->addTextHeader(
                            'X-Campaign-Token',
                            $trackingToken
                        );
                    });
        });
        
        // Tracking pixel para opens (inyectado en el contenido HTML)
        // <img src="{{ url('/newsletter/track/open/' . $token) }}" width="1" height="1" />
    }
    
    /**
     * Build email content with personalization and tracking.
     */
    protected function buildEmailContent(NewsletterSubscriber $subscriber): string
    {
        $content = $this->campaign->content;
        
        // Personalización básica
        $replacements = [
            '{{name}}' => $subscriber->name ?? $subscriber->email,
            '{{email}}' => $subscriber->email,
            '{{unsubscribe_url}}' => $this->generateUnsubscribeUrl($subscriber),
            '{{tracking_pixel}}' => $this->generateTrackingPixel($subscriber),
        ];
        
        foreach ($replacements as $placeholder => $value) {
            $content = str_replace($placeholder, $value, $content);
        }
        
        return $content;
    }
    
    /**
     * Generate unsubscribe URL for subscriber.
     */
    protected function generateUnsubscribeUrl(NewsletterSubscriber $subscriber): string
    {
        $token = hash_hmac('sha256', $subscriber->email . $subscriber->id, config('app.key'));
        return url("/newsletter/unsubscribe/{$token}");
    }
    
    /**
     * Generate tracking pixel for open tracking.
     */
    protected function generateTrackingPixel(NewsletterSubscriber $subscriber): string
    {
        $token = bin2hex(random_bytes(16));
        // Guardar token en DB para asociar con subscriber
        return "<img src=\"" . url("/newsletter/track/open/{$token}") . "\" width=\"1\" height=\"1\" style=\"display:none;\" />";
    }
}
