<?php
// app/Http/Controllers/Api/V1/EquipmentController.php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEquipmentRequest;
use App\Http\Resources\EquipmentResource;
use App\Repositories\Interfaces\EquipmentRepositoryInterface;
use Illuminate\Http\Request;
use App\Http\Requests\UpdateEquipmentRequest;
use Illuminate\Http\Response;

class EquipmentController extends Controller
{
    public function __construct(private EquipmentRepositoryInterface $repository) {}

    public function index(Request $request) {
        $orgId = $request->user()->organization_id;
        // Extract only the fields we care about
        $filters = $request->only(['search', 'status']);
        $equipment = $this->repository->getAllByOrganization($orgId, 10, $filters);
        
        // Automatically returns an array of standardized JSON objects
        return EquipmentResource::collection($equipment);
    }

    public function show(Request $request, $id) 
    {
        $orgId = $request->user()->organization_id;
        
        // Fetch the specific equipment, ensuring it belongs to their organization
        // We use direct Eloquent here to avoid Repository Interface mismatch errors
        $equipment = \App\Models\Equipment::where('id', $id)
            ->where('organization_id', $orgId)
            ->firstOrFail();
            
        return new EquipmentResource($equipment);
    }

    public function store(StoreEquipmentRequest $request) {
        $orgId = $request->user()->organization_id;
        // ONLY pass validated data
        $equipment = $this->repository->create($orgId, $request->validated());

        // CRITICAL FIX: Forces Eloquent to pull the default DB values (like 'status')
        $equipment->refresh();
        
        return new EquipmentResource($equipment);
    }

    public function update(UpdateEquipmentRequest $request, $id) 
    {
        $orgId = $request->user()->organization_id;
        
        $equipment = $this->repository->update($id, $orgId, $request->validated());
        $equipment->refresh();
        
        return new EquipmentResource($equipment);
    }

    public function destroy(Request $request, $id) 
    {
        $orgId = $request->user()->organization_id;
        $this->repository->delete($id, $orgId);
        
        // 204 No Content is the standard REST response for a successful delete
        return response()->noContent(); 
    }

    public function bulkUpload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:5120' 
        ]);

        $orgId = $request->user()->organization_id;
        $file = $request->file('file');

        if (strtolower($file->getClientOriginalExtension()) !== 'csv') {
            return response()->json(['errors' => ['file' => ['Please upload a valid .csv file.']]], 422);
        }

        $path = $file->getRealPath();
        $records = array_map('str_getcsv', file($path));

        if (count($records) < 2) {
            return response()->json(['errors' => ['file' => ['The uploaded file is empty or missing data.']]], 422);
        }

        $headers = array_shift($records);
        $headers[0] = trim($headers[0], "\xEF\xBB\xBF");
        $headers = array_map('trim', $headers);

        $insertData = [];
        $now = now();

        foreach ($records as $row) {
            if (count($headers) !== count($row)) continue; 
            
            $rowAssoc = array_combine($headers, $row);

            if (empty($rowAssoc['name'])) continue;

            // --- CRITICAL FIX: DATE PARSER ---
            $formattedDate = null;
            if (!empty($rowAssoc['purchase_date'])) {
                try {
                    // Replace slashes with dashes so Carbon parses European DD-MM-YYYY correctly
                    $cleanDate = str_replace('/', '-', trim($rowAssoc['purchase_date']));
                    $formattedDate = \Carbon\Carbon::parse($cleanDate)->format('Y-m-d');
                } catch (\Exception $e) {
                    // If the date is completely unreadable, default to null instead of crashing
                    $formattedDate = null;
                }
            }
            // --- END DATE PARSER ---

            $insertData[] = [
                'organization_id' => $orgId,
                'name' => $rowAssoc['name'],
                'make' => $rowAssoc['make'] ?? null,
                'model' => $rowAssoc['model'] ?? null,
                'serial_number' => $rowAssoc['serial_number'] ?? null,
                'purchase_date' => $formattedDate, // Passed the formatted date here
                'status' => $rowAssoc['status'] ?? 'available',
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        if (empty($insertData)) {
            return response()->json(['errors' => ['file' => ['No valid data found. Check your column headers.']]], 422);
        }

        $this->repository->insertBulk($insertData);

        return response()->json([
            'message' => count($insertData) . ' equipment records imported successfully.'
        ]);
    }

    public function bulkDelete(Request $request)
    {
        // Validate that 'ids' is an array and contains actual integers
        $request->validate([
            'ids'   => 'required|array|min:1',
            'ids.*' => 'integer|exists:equipment,id'
        ]);

        $orgId = $request->user()->organization_id;
        
        $this->repository->deleteBulk($request->ids, $orgId);

        return response()->json([
            'message' => count($request->ids) . ' equipment records deleted successfully.'
        ]);
    }
}