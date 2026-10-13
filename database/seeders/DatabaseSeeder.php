<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Equipment;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        //User::factory()->create([
          //  'name' => 'Test User',
            //'email' => 'test@example.com',
        //]);

// This line tells Laravel to run your new seeder class
        //$this->call(ProjectDataSeeder::class);

        // 1. Grab the first user in your database (which is the account you just registered)
        $user = User::first();

        if ($user && $user->organization_id) {
            // 2. Generate 15 pieces of equipment and attach them to your organization
            Equipment::factory(15)->create([
                'organization_id' => $user->organization_id
            ]);
            
            $this->command->info('Successfully seeded 15 pieces of equipment for your organization!');
        } else {
            $this->command->error('No user or organization found. Please register an account in the browser first.');
        }
    }
}
