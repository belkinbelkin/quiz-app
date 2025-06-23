<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user (original from login screen)
        User::firstOrCreate(
            ['email' => 'admin'],
            [
                'name' => 'Admin User',
                'email' => 'admin',
                'password' => Hash::make('admin'),
            ]
        );

        // Create test user with proper email format
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => Hash::make('password'),
            ]
        );

        // Create dedicated E2E test user (won't trigger password leak warnings)
        User::firstOrCreate(
            ['email' => 'e2e@test.local'],
            [
                'name' => 'E2E Test User',
                'email' => 'e2e@test.local',
                'password' => Hash::make('secureTestPass2024'),
            ]
        );

        // Create additional test users for parallel testing if needed
        User::firstOrCreate(
            ['email' => 'playwright@test.local'],
            [
                'name' => 'Playwright Test User',
                'email' => 'playwright@test.local',
                'password' => Hash::make('playwrightPass123'),
            ]
        );
    }
}