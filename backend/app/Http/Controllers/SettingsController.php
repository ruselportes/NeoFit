<?php

namespace App\Http\Controllers;

use App\Models\GymSetting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index()
    {
        return response()->json([
            'gymName'      => GymSetting::get('gymName', 'Neofit Fitness Gym'),
            'contact'      => GymSetting::get('contact', '0908 305 2660'),
            'address'      => GymSetting::get('address', ''),
            'announcement' => GymSetting::get('announcement', ''),
        ]);
    }

    public function update(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admins only.'], 403);
        }

        $validated = $request->validate([
            'gymName'      => 'sometimes|string|max:255',
            'contact'      => 'sometimes|string|max:50',
            'address'      => 'sometimes|string',
            'announcement' => 'sometimes|string',
        ]);

        foreach ($validated as $key => $value) {
            GymSetting::set($key, $value);
        }

        return response()->json(['message' => 'Settings saved successfully.']);
    }
}
