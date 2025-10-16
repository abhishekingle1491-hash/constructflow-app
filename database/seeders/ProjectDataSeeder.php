<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Organization;
use App\Models\User;
use App\Models\Role;
use App\Models\Equipment;

class ProjectDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data to prevent duplicates
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        Organization::truncate();
        User::truncate();
        Role::truncate();
        Equipment::truncate();
        DB::table('role_user')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // --- Create Roles ---
        $adminRole = Role::create(['name' => 'admin']);
        $managerRole = Role::create(['name' => 'manager']);
        $technicianRole = Role::create(['name' => 'technician']);
        $this->command->info('Roles created successfully.');

        // --- Organization 1: Apex Construction ---
        $org1 = Organization::create(['name' => 'Apex Construction']);
        $this->command->info('Created Organization: Apex Construction');

        $user1 = User::create([
            'organization_id' => $org1->id,
            'name' => 'Alice Admin',
            'email' => 'admin@apex.com',
            'password' => Hash::make('password'),
        ]);
        $user1->roles()->attach($adminRole);

        $user2 = User::create([
            'organization_id' => $org1->id,
            'name' => 'Bob Builder',
            'email' => 'bob@apex.com',
            'password' => Hash::make('password'),
        ]);
        $user2->roles()->attach($technicianRole);

        Equipment::create([
            'organization_id' => $org1->id,
            'name' => 'CAT D6 Bulldozer',
            'serial_number' => 'CATD6-12345',
            'status' => 'available',
        ]);
        Equipment::create([
            'organization_id' => $org1->id,
            'name' => 'JLG 800S Boom Lift',
            'serial_number' => 'JLG800S-67890',
            'status' => 'rented',
        ]);
        $this->command->info('Users and Equipment for Apex Construction created.');

        // --- Organization 2: Summit Rentals ---
        $org2 = Organization::create(['name' => 'Summit Rentals']);
        $this->command->info('Created Organization: Summit Rentals');

        $user3 = User::create([
            'organization_id' => $org2->id,
            'name' => 'Charlie Crane',
            'email' => 'charlie@summit.com',
            'password' => Hash::make('password'),
        ]);
        $user3->roles()->attach($managerRole);
        $user3->roles()->attach($technicianRole);

        Equipment::create([
            'organization_id' => $org2->id,
            'name' => 'Komatsu PC200 Excavator',
            'serial_number' => 'KPC200-ABCDE',
            'status' => 'maintenance',
        ]);
        $this->command->info('Users and Equipment for Summit Rentals created.');

        $this->command->info('Database seeding completed successfully!');
    }
}