<?php
namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use stdClass;

class AuthRepository
{
    public function findUserByEmail(string $email):?stdClass
    {
        $results = DB::select('SELECT * FROM users WHERE email =? LIMIT 1', [$email]);
        return $results?? null;
    }

    public function createUserAndOrganization(array $userData, string $orgName):?int
    {
        try {
            DB::beginTransaction();

            DB::insert(
                'INSERT INTO organizations (name, created_at, updated_at) VALUES (?, NOW(), NOW())',
                [$orgName]
            );

            $orgId = DB::getPdo()->lastInsertId();

            DB::insert('INSERT INTO users (organization_id, name, email, password, created_at, updated_at) VALUES (?,?,?,?, NOW(), NOW())', [$orgId, $userData['name'], $userData['email'], $userData['password']]);

            $userId = DB::getPdo()->lastInsertId();

            DB::commit();

            return (int)$userId;
        } catch (\Exception $e) {
            DB::rollBack();
            // Optionally log the exception
            return null;
        }
    }
}