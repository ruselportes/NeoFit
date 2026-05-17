<?php

namespace Database\Seeders;

use App\Models\Member;
use App\Models\GymSetting;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed users (only if empty)
        if (\App\Models\User::count() === 0) {
            \App\Models\User::create([
                'name' => 'Admin User',
                'email' => 'admin@neofit.com',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]);

            \App\Models\User::create([
                'name' => 'Staff User',
                'email' => 'staff@neofit.com',
                'password' => bcrypt('password'),
                'role' => 'staff',
            ]);
        }

        // Seed members (only if empty)
        if (Member::count() === 0) {
            Member::insert([
                ['name' => 'John Doe',     'contact' => '09123456789', 'plan' => 'Regular Monthly (No Treadmill)',    'joined_date' => '2026-01-15', 'expiry_date' => '2026-06-15', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Sarah Connor',  'contact' => '09987654321', 'plan' => 'Student/Senior Monthly (With Treadmill)',     'joined_date' => '2026-02-02', 'expiry_date' => '2027-02-02', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Mike Ross',     'contact' => '09112223344', 'plan' => 'Regular Daily', 'joined_date' => '2026-03-10', 'expiry_date' => '2026-03-10', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Jane Smith',    'contact' => '09887776655', 'plan' => 'Regular Monthly (With Treadmill)',    'joined_date' => '2026-04-05', 'expiry_date' => '2026-07-05', 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Bruce Wayne',   'contact' => '09334445566', 'plan' => 'Regular Semi-Monthly',    'joined_date' => '2026-05-01', 'expiry_date' => '2026-05-25', 'created_at' => now(), 'updated_at' => now()],
            ]);
        }

        // Seed settings (only if empty)
        if (GymSetting::count() === 0) {
            GymSetting::set('gymName', 'Neofit Fitness Gym');
            GymSetting::set('contact', '0908 305 2660');
            GymSetting::set('address', 'PUROK 1 TAGUM SUR, TRINIDAD, BOHOL, Trinidad, Philippines, 6324');
            GymSetting::set('announcement', 'Good day, dear clients! Please be advised that APRIL 2 AND 3, 2026 gym will be closed due to the HOLIDAY SEASON. Please be guided.');
        }
    }
}
