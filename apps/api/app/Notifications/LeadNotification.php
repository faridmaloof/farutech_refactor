<?php

namespace App\Notifications;

use App\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LeadNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $lead;
    public $action;

    /**
     * Create a new notification instance.
     */
    public function __construct(Lead $lead, string $action = 'created')
    {
        $this->lead = $lead;
        $this->action = $action;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject("Lead {$this->action}: {$this->lead->name}")
                    ->greeting('Hola!')
                    ->line("El lead {$this->lead->name} ha sido {$this->action}.")
                    ->action('Ver Lead', url("/admin/leads/{$this->lead->id}"))
                    ->line('Gracias por usar FaruTech!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'lead_id' => $this->lead->id,
            'action' => $this->action,
        ];
    }
}
