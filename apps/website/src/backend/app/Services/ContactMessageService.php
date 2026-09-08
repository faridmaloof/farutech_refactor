<?php

namespace App\Services;

use App\DTOs\ContactMessageDTO;
use App\Repositories\ContactMessageRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class ContactMessageService
{
    public function __construct(
        private ContactMessageRepository $repository
    ) {}

    public function getPaginatedMessages(int $perPage = 15, ?string $status = null): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage, $status);
    }

    public function getMessageById(int $id): ?ContactMessageDTO
    {
        $message = $this->repository->findById($id);
        
        if (!$message) {
            return null;
        }

        return ContactMessageDTO::fromModel([
            'id' => $message->id,
            'name' => $message->name,
            'email' => $message->email,
            'phone' => $message->phone,
            'message' => $message->message,
            'status' => $message->status,
            'admin_note' => $message->admin_note,
            'created_at' => $message->created_at->toISOString(),
        ]);
    }

    public function markAsRead(int $id): bool
    {
        return $this->repository->updateStatus($id, 'read');
    }

    public function markAsArchived(int $id): bool
    {
        return $this->repository->updateStatus($id, 'archived');
    }

    public function updateAdminNote(int $id, ?string $note): bool
    {
        return $this->repository->updateAdminNote($id, $note);
    }

    public function getUnreadCount(): int
    {
        return $this->repository->getUnreadCount();
    }

    public function createMessage(array $data): ContactMessageDTO
    {
        $message = $this->repository->create($data);

        return ContactMessageDTO::fromModel([
            'id' => $message->id,
            'name' => $message->name,
            'email' => $message->email,
            'phone' => $message->phone,
            'message' => $message->message,
            'status' => $message->status,
            'admin_note' => $message->admin_note,
            'created_at' => $message->created_at->toISOString(),
        ]);
    }
}
