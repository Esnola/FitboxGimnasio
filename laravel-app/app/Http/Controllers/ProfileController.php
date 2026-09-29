<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Booking;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index()
    {
        $currentMember = Member::where('email', 'alex.mendoza@fitbox.club')->first();
        if (!$currentMember) {
            $currentMember = Member::create([
                'name' => 'Alex Mendoza',
                'email' => 'alex.mendoza@fitbox.club',
                'member_code' => '#FB-8942',
                'level' => 'RX',
                'plan_id' => 'plan-rx',
                'plan_name' => 'Plan Atleta Ilimitado RX',
                'monthly_attendances' => 18,
                'streak_days' => 12,
            ]);
        }

        $today = '2024-10-25';

        // Future and active bookings
        $futureBookings = Booking::with('gymClass')
            ->where('member_id', $currentMember->id)
            ->whereHas('gymClass', fn ($q) => $q->where('date', '>=', $today))
            ->whereIn('status', ['confirmed', 'waitlist'])
            ->get();

        // Past bookings
        $pastBookings = Booking::with('gymClass')
            ->where('member_id', $currentMember->id)
            ->whereHas('gymClass', fn ($q) => $q->where('date', '<', $today))
            ->latest()
            ->get();

        return view('profile.index', compact('currentMember', 'futureBookings', 'pastBookings'));
    }

    public function update(Request $request)
    {
        $currentMember = Member::where('email', 'alex.mendoza@fitbox.club')->firstOrFail();

        $validated = $request->validate([
            'weight_kg' => 'nullable|numeric',
            'height_cm' => 'nullable|numeric',
            'body_fat_percent' => 'nullable|numeric',
            'emergency_contact' => 'nullable|string|max:150',
            'class_reminders' => 'nullable|boolean',
            'health_sync' => 'nullable|boolean',
        ]);

        $currentMember->update([
            'weight_kg' => $validated['weight_kg'] ?? $currentMember->weight_kg,
            'height_cm' => $validated['height_cm'] ?? $currentMember->height_cm,
            'body_fat_percent' => $validated['body_fat_percent'] ?? $currentMember->body_fat_percent,
            'emergency_contact' => $validated['emergency_contact'] ?? $currentMember->emergency_contact,
            'class_reminders' => $request->has('class_reminders'),
            'health_sync' => $request->has('health_sync'),
        ]);

        return back()->with('success', 'Perfil y parámetros biométricos actualizados con éxito.');
    }
}
