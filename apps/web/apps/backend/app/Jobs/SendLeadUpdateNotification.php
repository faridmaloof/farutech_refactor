<?php
namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Notifications\LeadStatusUpdateNotification;

class SendLeadUpdateNotification
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
            $user->notify(new LeadStatusUpdateNotification($this->leadId));
        }
    }
}