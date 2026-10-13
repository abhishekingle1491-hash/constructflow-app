<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; // 1. Add this import

class Equipment extends Model
{
    use HasFactory; // 2. Add the trait inside the class
    // Prevent mass-assignment vulnerabilities
    protected $fillable = [
        'organization_id', 'name', 'make', 'model', 'serial_number', 'purchase_date', 'status', 'qr_code_path'
    ];

    // Belongs to an organization
    public function organization() {
        return $this->belongsTo(Organization::class);
    }

    public function rentals() { return $this->hasMany(Rental::class); }
}
