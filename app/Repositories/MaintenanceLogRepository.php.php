<?php
namespace App\Repositories;
use Illuminate\Support\Facades\DB;

class EquipmentRepository
{
    public function getAllByOrg(int $organizationId)
    {
        return DB::select('SELECT * FROM equipment WHERE organization_id =?', [$organizationId]);
    }

    public function findById(int $id, int $organizationId)
    {
        $results = DB::select('SELECT * FROM equipment WHERE id =? AND organization_id =?', [$id, $organizationId]);
        return $results?? null;
    }

    public function create(array $data, int $organizationId): int
    {
        DB::insert(
            'INSERT INTO equipment (make, model, serial_number, purchase_date, organization_id, created_at, updated_at) VALUES (?,?,?,?,?, NOW(), NOW())',
            [$data['make'], $data['model'], $data['serial_number'], $data['purchase_date'], $organizationId]
        );
        return DB::getPdo()->lastInsertId();
    }
    //... Add update() and delete() methods similarly using DB::update and DB::delete
}