<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rental extends Model
{
    protected $fillable = ['organization_id', 'equipment_id', 'customer_name', 'start_date', 'end_date', 'notes'];

    // Load the equipment details alongside the rental
    public function equipment() {
        return $this->belongsTo(Equipment::class);
    }
}
