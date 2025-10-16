<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Repositories\EquipmentRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EquipmentController extends Controller
{
    protected $equipmentRepository;

    public function __construct(EquipmentRepository $equipmentRepository)
    {
        $this->equipmentRepository = $equipmentRepository;
    }

    public function index()
    {
        $orgId = Auth::user()->organization_id;
        $equipment = $this->equipmentRepository->getAllByOrg($orgId);
        return response()->json($equipment);
    }

    public function store(Request $request)
    {
        // NOTE: Add proper validation here using a Form Request class in a real app
        $validatedData = $request->validate([
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'serial_number' => 'required|string|max:255',
            'purchase_date' => 'required|date',
        ]);

        $orgId = Auth::user()->organization_id;
        $equipmentId = $this->equipmentRepository->create($validatedData, $orgId);
        $newEquipment = $this->equipmentRepository->findById($equipmentId, $orgId);

        return response()->json($newEquipment, 201);
    }
    //... Add show(), update(), and destroy() methods
}