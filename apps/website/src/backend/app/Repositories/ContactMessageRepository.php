<?php

namespace App\Repositories;

use App\Models\ContactMessage;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ContactMessageRepository
{
    public function __construct(
        private ContactMessage $model
    ) {}

    public function paginate(int $perPage = 15, ?string $status = null): LengthAwarePaginator
    {
        $query = $this->model->with('adminUser')->latest();

        if ($status) {
            $query->where('status', $status);
        }

        return $query->paginate($perPage);
    }

    public function findById(int $id): ?ContactMessage
    {
        return $this->model->with('adminUser')->find($id);
    }

    public function updateStatus(int $id, string $status): bool
    {
        $message = $this->model->find($id);
        if (!$message) {
            return false;
        }

        $message->update(['status' => $status]);
        return true;
    }

    public function updateAdminNote(int $id, ?string $note): bool
    {
        $message = $this->model->find($id);
        if (!$message) {
            return false;
        }

        $message->update(['admin_note' => $note]);
        return true;
    }

    public function getUnreadCount(): int
    {
        return $this->model->where('status', 'new')->count();
    }

    public function create(array $data): ContactMessage
    {
        return $this->model->create($data);
    }
}
