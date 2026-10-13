<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EquipmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'make' => $this->make,
            'model' => $this->model,
            // Map snake_case to camelCase for the React frontend!
            'serialNumber' => $this->serial_number,
            'purchaseDate' => $this->purchase_date,
            'status' => $this->status,
        ];
    }
}
