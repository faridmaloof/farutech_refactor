<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lead_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('note');
            $table->enum('type', ['general', 'call', 'email', 'meeting', 'follow_up'])->default('general');
            $table->boolean('is_private')->default(false);
            $table->timestamp('reminder_at')->nullable();
            $table->timestamps();
            
            $table->index('lead_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lead_notes');
    }
};
