<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEquipmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->organization_id !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Get the equipment ID from the URL route parameter
        $equipmentId = $this->route('equipment');

        return [
            'name' => ['required', 'string', 'max:255'],
            'make' => ['nullable', 'string', 'max:255'],
            'model' => ['nullable', 'string', 'max:255'],
            // CRITICAL: Ignore the current item's ID when checking for uniqueness
            'serial_number' => [
                'required', 
                'string', 
                Rule::unique('equipment', 'serial_number')->ignore($equipmentId)
            ],
            'purchase_date' => ['nullable', 'date'],
            'status' => ['required', 'in:available,rented,maintenance'],
        ];
    }
}
