<?php
namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Notifications\LeadStatusUpdateNotification;
use App\Models\User;
use App\Models\Lead;

class SendLeadUpdateNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $userId;
    protected $leadId;

    public function __construct(int $userId, int $leadId)
    {
        $this->userId = $userId;
        $this->leadId = $leadId;
    }

    public function handle()
    {
        $user = User::find($this->userId);
        $lead = Lead::find($this->leadId);
        
        if ($user && $lead) {
            $user->notify(new LeadStatusUpdateNotification($lead));
        }
    }
}