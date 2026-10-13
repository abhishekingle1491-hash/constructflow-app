<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Rental;
use App\Models\Equipment;
use Illuminate\Http\Request;

class RentalController extends Controller
{
    public function index(Request $request)
    {
        $orgId = $request->user()->organization_id;
        
        // Fetch all rentals for this org, and load the connected equipment name
        $rentals = Rental::with('equipment:id,name')
            ->where('organization_id', $orgId)
            ->get();

        return response()->json(['data' => $rentals]);
    }

    public function store(Request $request)
    {
        $orgId = $request->user()->organization_id;

        $validated = $request->validate([
            'equipment_id' => 'required|exists:equipment,id',
            'renter_name'  => 'required|string|max:255',
            'start_date'   => 'required|date',
            'end_date'     => 'required|date|after_or_equal:start_date',
        ]);

        // Security check: Ensure the equipment belongs to their org before renting
        $equipment = Equipment::where('id', $validated['equipment_id'])
            ->where('organization_id', $orgId)
            ->firstOrFail();

        $rental = Rental::create([
            'organization_id' => $orgId,
            'equipment_id'    => $validated['equipment_id'],
            'customer_name'     => $validated['renter_name'],
            'start_date'      => $validated['start_date'],
            'end_date'        => $validated['end_date'],
        ]);

        // Automatically update equipment status
        $equipment->update(['status' => 'rented']);

        return response()->json(['data' => $rental]);
    }
}