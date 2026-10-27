<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaintenanceLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'equipmentId' => $this->equipment_id,
            'maintenanceDate' => $this->maintenance_date,
            'type' => $this->type,
            'description' => $this->description,
            'cost' => $this->cost,
            'performedBy' => $this->performed_by,
        ];
    }
}