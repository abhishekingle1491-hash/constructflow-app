<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\MaintenanceLog;
use Illuminate\Http\Request;

class MaintenanceController extends Controller
{
    public function index(Request $request, $equipmentId)
    {
        $orgId = $request->user()->organization_id;
        
        // Security: Ensure they own the equipment before viewing logs
        Equipment::where('id', $equipmentId)->where('organization_id', $orgId)->firstOrFail();

        $logs = MaintenanceLog::where('equipment_id', $equipmentId)
            ->orderBy('maintenance_date', 'desc')
            ->get();

        return response()->json(['data' => $logs]);
    }

    public function store(Request $request, $equipmentId)
    {
        $orgId = $request->user()->organization_id;

        // Security: Ensure they own the equipment before logging maintenance
        $equipment = Equipment::where('id', $equipmentId)->where('organization_id', $orgId)->firstOrFail();

        $validated = $request->validate([
            'maintenance_date' => 'required|date',
            'type'             => 'required|string|max:50',
            'description'      => 'required|string',
            'cost'             => 'nullable|numeric|min:0',
            'performed_by'     => 'nullable|string|max:255',
        ]);

        $log = MaintenanceLog::create(array_merge($validated, [
            'organization_id' => $orgId,
            'equipment_id'    => $equipmentId,
            'cost'            => $validated['cost'] ?? 0,
        ]));

        return response()->json(['data' => $log], 201);
    }
}