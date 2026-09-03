<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('subject');
            $table->enum('type', ['sales', 'support', 'general', 'partnership'])->default('general');
            $table->text('message');
            $table->foreignId('service_id')->nullable()->constrained()->nullOnDelete();
            $table->boolean('privacy_accepted')->default(false);
            $table->boolean('marketing_accepted')->default(false);
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['new', 'in_progress', 'resolved', 'closed'])->default('new');
            $table->text('internal_notes')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->index('is_read');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
    }
};
