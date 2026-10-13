<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceLog extends Model
{
    protected $fillable = [
        'organization_id', 
        'equipment_id', 
        'maintenance_date', 
        'type', 
        'description', 
        'cost', 
        'performed_by'
    ];

    public function equipment() {
        return $this->belongsTo(Equipment::class);
    }
}
