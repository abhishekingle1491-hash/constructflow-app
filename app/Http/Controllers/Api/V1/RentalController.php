<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Rental;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\RentalResource;

class RentalController extends Controller
{
    public function index(Request $request)
    {
        $orgId = $request->user()->organization_id;
        
        $rentals = Rental::with('equipment:id,name,make,model,serial_number')
            ->where('organization_id', $orgId)
            ->get();

        return RentalResource::collection($rentals);
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

        // Wrap the booking logic in a transaction to enforce the pessimistic lock
        $rental = DB::transaction(function () use ($validated, $orgId) {
            // lockForUpdate() prevents simultaneous reads/writes from other booking requests
            $equipment = Equipment::where('id', $validated['equipment_id'])
                ->where('organization_id', $orgId)
                ->lockForUpdate()
                ->firstOrFail();

            if ($equipment->status === 'rented' || $equipment->status === 'maintenance') {
                abort(422, 'This equipment is currently unavailable for booking.');
            }

            $rental = Rental::create([
                'organization_id' => $orgId,
                'equipment_id'    => $validated['equipment_id'],
                'customer_name'   => $validated['renter_name'],
                'start_date'      => $validated['start_date'],
                'end_date'        => $validated['end_date'],
            ]);

            $equipment->update(['status' => 'rented']);

            return $rental;
        });

        // Eager load the relationship for the response
        $rental->load('equipment');

        return new RentalResource($rental);
    }
}