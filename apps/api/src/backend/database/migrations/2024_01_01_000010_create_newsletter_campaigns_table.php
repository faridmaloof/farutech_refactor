<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('newsletter_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subject');
            $table->text('preview_text')->nullable();
            $table->longText('content_html');
            $table->longText('content_text')->nullable();
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['draft', 'scheduled', 'sending', 'sent', 'cancelled'])->default('draft');
            $table->timestamp('scheduled_for')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->integer('recipients_count')->default(0);
            $table->integer('opens_count')->default(0);
            $table->integer('clicks_count')->default(0);
            $table->integer('unsubscribes_count')->default(0);
            $table->integer('bounces_count')->default(0);
            $table->json('blog_posts_included')->nullable();
            $table->timestamps();
            
            $table->index('status');
            $table->index('scheduled_for');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('newsletter_campaigns');
    }
};
