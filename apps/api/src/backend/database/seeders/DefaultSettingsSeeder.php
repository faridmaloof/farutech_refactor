<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DefaultSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // Telegram settings
            [
                'key' => 'telegram_enabled',
                'type' => 'telegram',
                'value' => 'false',
                'config' => json_encode(['description' => 'Enable Telegram notifications']),
                'is_active' => true,
            ],
            [
                'key' => 'telegram_bot_token',
                'type' => 'telegram',
                'value' => null,
                'config' => json_encode(['description' => 'Telegram Bot Token from @BotFather']),
                'is_active' => true,
            ],
            [
                'key' => 'telegram_chat_ids',
                'type' => 'telegram',
                'value' => '[]',
                'config' => json_encode(['description' => 'Array of chat IDs to notify']),
                'is_active' => true,
            ],
            // WhatsApp settings
            [
                'key' => 'whatsapp_enabled',
                'type' => 'whatsapp',
                'value' => 'false',
                'config' => json_encode(['description' => 'Enable WhatsApp notifications']),
                'is_active' => true,
            ],
            [
                'key' => 'twilio_account_sid',
                'type' => 'whatsapp',
                'value' => null,
                'config' => json_encode(['description' => 'Twilio Account SID']),
                'is_active' => true,
            ],
            [
                'key' => 'twilio_auth_token',
                'type' => 'whatsapp',
                'value' => null,
                'config' => json_encode(['description' => 'Twilio Auth Token']),
                'is_active' => true,
            ],
            [
                'key' => 'twilio_whatsapp_number',
                'type' => 'whatsapp',
                'value' => null,
                'config' => json_encode(['description' => 'Twilio WhatsApp Number']),
                'is_active' => true,
            ],
            // Email settings
            [
                'key' => 'smtp_host',
                'type' => 'email',
                'value' => 'smtp.gmail.com',
                'config' => json_encode(['description' => 'SMTP Host']),
                'is_active' => true,
            ],
            [
                'key' => 'smtp_port',
                'type' => 'email',
                'value' => '587',
                'config' => json_encode(['description' => 'SMTP Port']),
                'is_active' => true,
            ],
            [
                'key' => 'notification_leads_enabled',
                'type' => 'general',
                'value' => 'true',
                'config' => json_encode(['description' => 'Notify on new leads']),
                'is_active' => true,
            ],
            [
                'key' => 'notification_contacts_enabled',
                'type' => 'general',
                'value' => 'true',
                'config' => json_encode(['description' => 'Notify on new contact messages']),
                'is_active' => true,
            ],
        ];

        foreach ($settings as $setting) {
            $setting['created_at'] = now();
            $setting['updated_at'] = now();
            DB::table('notification_settings')->insert($setting);
        }
    }
}
