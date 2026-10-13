<?php

namespace App\Repositories\Interfaces;

interface EquipmentRepositoryInterface {
    public function getAllByOrganization(int $organizationId, $perPage = 10, array $filters = []);
    public function create(int $organizationId, array $data);
    public function update(int $id, int $organizationId, array $data);
    public function delete(int $id, int $organizationId): bool;
    // Add this to your interface
    public function insertBulk(array $data);
    // Add this to your interface
    public function deleteBulk(array $ids, $orgId);
}