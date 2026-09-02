<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeadRequest extends FormRequest
{
    public function rules()
    {
        $rules = [
            'name' => 'required|string|max:100',
            'email' => 'nullable|email:max:255',
            'phone' => 'nullable|phone',
            'company' => 'nullable|string|max:150',
            'position' => 'nullable|string|max:100',
            'service_id' => 'nullable|integer|exists:application_types,id',
            'location_id' => 'nullable|integer|exists:locations,id',
            'message' => 'nullable|string',
            'status' => ['nullable', 'in:new,contacted,qualified,proposal,negotiation,closed_won,closed_lost,unreachable'],
            'priority' => ['nullable', 'in:low,medium,high,urgent', 'default:medium'],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
            'source' => ['nullable', 'in:web_form,newsletter,email', 'default:web_form'],
        ];

        return $rules;
    }
}