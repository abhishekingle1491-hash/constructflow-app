<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Equipment>
 */
class EquipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Generate realistic names for a construction rental fleet
            'name' => fake()->randomElement([
                'Compact Excavator', 'Skid Steer Loader', 'Scissor Lift', 
                'Portable Generator', 'Concrete Mixer', 'Forklift', 'Trench Roller'
            ]),
            'make' => fake()->randomElement(['Caterpillar', 'Bobcat', 'John Deere', 'Komatsu', 'JCB']),
            'model' => fake()->bothify('??-####'), // e.g., AB-1234
            'serial_number' => fake()->unique()->regexify('[A-Z0-9]{10}'),
            'purchase_date' => fake()->dateTimeBetween('-3 years', 'now')->format('Y-m-d'),
            'status' => fake()->randomElement(['available', 'available', 'rented', 'maintenance']),
        ];
    }
}
