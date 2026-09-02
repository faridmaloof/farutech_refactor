<?php
namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;
use App\Notifications\LeadNotification;

class SendLeadNotification implements ShouldQueue
{
    protected $userId;
    protected $leadId;

    public function __construct(int $userId, int $leadId)
    {
        $this->userId = $userId;
        $this->leadId = $leadId;
    }

    public function handle()
    {
        $user = \App\Models\User::find($this->userId);
        if ($user) {
            $user->notify(new LeadNotification(auth()->user(), $this->leadId));
        }
    }
}