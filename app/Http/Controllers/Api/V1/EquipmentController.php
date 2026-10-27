<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEquipmentRequest;
use App\Http\Requests\UpdateEquipmentRequest;
use App\Http\Resources\EquipmentResource;
use App\Repositories\Interfaces\EquipmentRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Carbon\Carbon;

class EquipmentController extends Controller
{
    public function __construct(private EquipmentRepositoryInterface $repository) {}

    public function index(Request $request) {
        $orgId = $request->user()->organization_id;
        $filters = $request->only(['search', 'status']);
        $equipment = $this->repository->getAllByOrganization($orgId, 10, $filters);
        
        return EquipmentResource::collection($equipment);
    }

    public function show(Request $request, $id) 
    {
        $orgId = $request->user()->organization_id;
        $equipment = \App\Models\Equipment::where('id', $id)
            ->where('organization_id', $orgId)
            ->firstOrFail();
            
        return new EquipmentResource($equipment);
    }

    public function store(StoreEquipmentRequest $request) {
        $orgId = $request->user()->organization_id;
        $equipment = $this->repository->create($orgId, $request->validated());
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
        
        // Use generator/stream instead of loading whole file to memory
        $handle = fopen($path, 'r');
        $headers = fgetcsv($handle);

        if (!$headers) {
            fclose($handle);
            return response()->json(['errors' => ['file' => ['The uploaded file is empty or missing data.']]], 422);
        }

        $headers[0] = trim($headers[0], "\xEF\xBB\xBF");
        $headers = array_map('trim', $headers);

        $insertData = [];
        $now = now();
        $totalImported = 0;

        // Process row by row
        while (($row = fgetcsv($handle)) !== false) {
            if (count($headers) !== count($row)) continue;
            
            $rowAssoc = array_combine($headers, $row);
            if (empty($rowAssoc['name'])) continue;

            $formattedDate = null;
            if (!empty($rowAssoc['purchase_date'])) {
                try {
                    $cleanDate = str_replace('/', '-', trim($rowAssoc['purchase_date']));
                    $formattedDate = Carbon::parse($cleanDate)->format('Y-m-d');
                } catch (\Exception $e) {
                    $formattedDate = null;
                }
            }

            $insertData[] = [
                'organization_id' => $orgId,
                'name' => $rowAssoc['name'],
                'make' => $rowAssoc['make'] ?? null,
                'model' => $rowAssoc['model'] ?? null,
                'serial_number' => $rowAssoc['serial_number'] ?? null,
                'purchase_date' => $formattedDate,
                'status' => $rowAssoc['status'] ?? 'available',
                'created_at' => $now,
                'updated_at' => $now,
            ];

            // Batch insert every 500 rows to prevent DB packet size limits & memory spikes
            if (count($insertData) >= 500) {
                $this->repository->insertBulk($insertData);
                $totalImported += count($insertData);
                $insertData = []; // Clear memory
            }
        }
        fclose($handle);

        // Insert remaining rows
        if (!empty($insertData)) {
            $this->repository->insertBulk($insertData);
            $totalImported += count($insertData);
        }

        if ($totalImported === 0) {
            return response()->json(['errors' => ['file' => ['No valid data found. Check your column headers.']]], 422);
        }

        return response()->json([
            'message' => $totalImported . ' equipment records imported successfully.'
        ]);
    }

    public function bulkDelete(Request $request)
    {
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