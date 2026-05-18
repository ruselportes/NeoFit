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
            $today = now();
            Member::insert([
                [
                    'name' => 'John Doe',
                    'contact' => '09123456789',
                    'address' => 'Tagum Sur, Trinidad, Bohol',
                    'plan' => 'Regular Member - Monthly (No Treadmill)',
                    'joined_date' => '2026-05-01',
                    'expiry_date' => '2026-06-01',
                    'membership_expiry' => '2027-05-01',
                    'created_at' => $today, 'updated_at' => $today,
                ],
                [
                    'name' => 'Sarah Connor',
                    'contact' => '09987654321',
                    'address' => 'Poblacion, Trinidad, Bohol',
                    'plan' => 'Student/Senior Member - Monthly (With Treadmill)',
                    'joined_date' => '2026-05-10',
                    'expiry_date' => '2026-06-10',
                    'membership_expiry' => '2027-05-10',
                    'created_at' => $today, 'updated_at' => $today,
                ],
                [
                    'name' => 'Mike Ross',
                    'contact' => '09112223344',
                    'address' => null,
                    'plan' => 'Regular Non-Member - Daily (No Treadmill)',
                    'joined_date' => '2026-05-18',
                    'expiry_date' => '2026-05-19',
                    'membership_expiry' => null,
                    'created_at' => $today, 'updated_at' => $today,
                ],
                [
                    'name' => 'Jane Smith',
                    'contact' => '09887776655',
                    'address' => 'San Isidro, Trinidad, Bohol',
                    'plan' => 'Regular Member - Monthly (With Treadmill)',
                    'joined_date' => '2026-04-18',
                    'expiry_date' => '2026-05-18',
                    'membership_expiry' => '2027-04-18',
                    'created_at' => $today, 'updated_at' => $today,
                ],
                [
                    'name' => 'Bruce Wayne',
                    'contact' => '09334445566',
                    'address' => 'Lundag, Trinidad, Bohol',
                    'plan' => 'Regular Member - Semi-Monthly (No Treadmill)',
                    'joined_date' => '2026-05-10',
                    'expiry_date' => '2026-05-25',
                    'membership_expiry' => '2027-05-10',
                    'created_at' => $today, 'updated_at' => $today,
                ],
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
