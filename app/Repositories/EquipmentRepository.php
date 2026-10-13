<?php
namespace App\Repositories;
use App\Models\Equipment;
use App\Repositories\Interfaces\EquipmentRepositoryInterface;

class EquipmentRepository implements EquipmentRepositoryInterface {
    public function getAllByOrganization(int $organizationId, $perPage = 10, array $filters = []) {
        //return Equipment::where('organization_id', $organizationId)
        //->orderBy('created_at', 'desc')
        //->get();
        //->latest()
        //->paginate($perPage);
        // 1. Always scope by organization first (Bulletproof Multi-tenancy)
        $query = Equipment::where('organization_id', $organizationId);

        // 2. Apply Search Filter (Name, Make, Model, or Serial)
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            // Group the OR conditions inside a closure so they don't break the org_id scope!
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('make', 'LIKE', "%{$search}%")
                  ->orWhere('model', 'LIKE', "%{$search}%")
                  ->orWhere('serial_number', 'LIKE', "%{$search}%");
            });
        }

        // 3. Apply Status Filter
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // 4. Execute Paginated Query
        return $query->latest()->paginate($perPage);
    }

    public function create(int $organizationId, array $data) {
        // Securely force the organization_id at the database layer
        $data['organization_id'] = $organizationId;
        return Equipment::create($data);
    }
    //... Add update() and delete() methods similarly using DB::update and DB::delete
    public function update(int $id, int $organizationId, array $data)
    {
        // findOrFail combined with organization_id guarantees they own the record
        $equipment = \App\Models\Equipment::where('organization_id', $organizationId)
        ->findOrFail($id);
        $equipment->update($data);
        return $equipment;
    }

    public function delete(int $id, int $organizationId): bool
    {
        return \App\Models\Equipment::where('organization_id', $organizationId)
        ->where('id', $id)
        ->delete() > 0;
    }

    // Add this inside your repository class
    public function insertBulk(array $data)
    {
        // Insert in batches of 500 to prevent MySQL maximum placeholder errors
        foreach (array_chunk($data, 500) as $chunk) {
            Equipment::insert($chunk);
        }
    }

    // Add this inside your repository class
    public function deleteBulk(array $ids, $orgId)
    {
        // Eloquent's whereIn + organization_id ensures users can ONLY delete their own data
        return Equipment::whereIn('id', $ids)
        ->where('organization_id', $orgId)
        ->delete();
    }
}