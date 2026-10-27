<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RentalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'equipmentId' => $this->equipment_id,
            'customerName' => $this->customer_name,
            'startDate' => $this->start_date,
            'endDate' => $this->end_date,
            // Recursively format loaded relationships
            'equipment' => new EquipmentResource($this->whenLoaded('equipment')),
        ];
    }
}