<?php

namespace App\DTOs;

class ContactMessageDTO
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $email,
        public readonly ?string $phone,
        public readonly string $message,
        public readonly string $status,
        public readonly ?string $admin_note,
        public readonly \DateTimeInterface $created_at
    ) {}

    public static function fromModel(array $data): self
    {
        return new self(
            id: $data['id'],
            name: $data['name'],
            email: $data['email'],
            phone: $data['phone'] ?? null,
            message: $data['message'],
            status: $data['status'],
            admin_note: $data['admin_note'] ?? null,
            created_at: new \DateTime($data['created_at'])
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'message' => $this->message,
            'status' => $this->status,
            'admin_note' => $this->admin_note,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
