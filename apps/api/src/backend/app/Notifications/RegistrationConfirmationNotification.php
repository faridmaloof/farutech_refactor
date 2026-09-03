<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RegistrationConfirmationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $token;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $token)
    {
        $this->token = $token;
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
        $url = url('/api/register/confirm?token=' . $this->token);

        return (new MailMessage)
                    ->subject('Confirma tu cuenta en FaruTech')
                    ->greeting('¡Hola ' . $notifiable->name . '!')
                    ->line('Por favor confirma tu dirección de correo electrónico haciendo clic en el botón de abajo.')
                    ->action('Confirmar Correo', $url)
                    ->line('Si no creaste una cuenta, no es necesario realizar ninguna acción.');
    }
}
