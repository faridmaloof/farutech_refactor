<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLeadRequest extends FormRequest
{
    public function rules()
    {
        $rules = [
            'name' => 'sometimes|string|max:100',
            'email' => 'nullable|email:max:255',
            'phone' => 'nullable|phone',
            'company' => 'nullable|string|max:150',
            'position' => 'nullable|string|max:100',
            'service_id' => 'nullable|integer',
            'location_id' => 'nullable|integer',
            'message' => 'nullable|string',
            'status' => ['nullable', 'in:new,contacted,qualified,proposal,negotiation,closed_won,closed_lost,unreachable'],
            'priority' => ['nullable', 'in:low,medium,high,urgent'],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
            'source' => ['nullable', 'in:web_form,newsletter,email'],
        ];

        return $rules;
    }
}