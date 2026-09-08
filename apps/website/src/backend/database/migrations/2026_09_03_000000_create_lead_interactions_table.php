<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lead_interactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type', 50)->comment('call, email, meeting, message, note');
            $table->string('subject')->nullable();
            $table->text('description')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('next_follow_up')->nullable();
            $table->string('channel', 50)->nullable();
            $table->string('sentiment', 50)->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lead_interactions');
    }
};
