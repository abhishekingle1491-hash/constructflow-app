<?php
namespace App\Repositories;

use App\Repositories\Interfaces\AuthRepositoryInterface;
use Illuminate\Support\Facades\DB;
use stdClass;

class AuthRepository implements AuthRepositoryInterface
{
    public function findUserByEmail(string $email):?stdClass
    {
        $results = DB::select('SELECT * FROM users WHERE email = ? LIMIT 1', [$email]);
        return $results[0] ?? null;
    }

    public function createUserAndOrganization(array $userData, string $orgName):?int
    {
        try {
            DB::beginTransaction();

            // 1. Create Organization via Eloquent
            $organization = \App\Models\Organization::create([
                'name' => $orgName
            ]);

            // 2. Create User via Eloquent, linked to Org
            $user = \App\Models\User::create([
                'organization_id' => $organization->id,
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => $userData['password'], // Already hashed in Controller
            ]);

            DB::commit();
            return $user->id;
            
        } catch (\Exception $e) {
            DB::rollBack();
            // Optionally log the exception
            return null;
        }
    }
}