<?php

namespace App\Http\Controllers;

use App\Models\GymClass;
use App\Models\Booking;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClassController extends Controller
{
    public function index(Request $request)
    {
        $selectedDate = $request->query('date', '2024-10-25');
        $selectedCategory = $request->query('category', 'all');

        // Current demo or logged-in member
        $currentMember = Member::firstOrCreate(
            ['email' => 'alex.mendoza@fitbox.club'],
            [
                'name' => 'Alex Mendoza',
                'member_code' => '#FB-8942',
                'level' => 'RX',
                'plan_id' => 'plan-rx',
            ]
        );

        $query = GymClass::where('date', $selectedDate)->orderBy('start_time');

        if ($selectedCategory !== 'all') {
            $query->where('category', $selectedCategory);
        }

        $classes = $query->get();

        // Get user's bookings for this day
        $userBookings = Booking::where('member_id', $currentMember->id)
            ->whereIn('gym_class_id', $classes->pluck('id'))
            ->get()
            ->keyBy('gym_class_id');

        return view('classes.index', compact(
            'classes',
            'currentMember',
            'selectedDate',
            'selectedCategory',
            'userBookings'
        ));
    }

    public function reserve(Request $request, string $classId)
    {
        $currentMember = Member::where('email', 'alex.mendoza@fitbox.club')->firstOrFail();

        return DB::transaction(function () use ($classId, $currentMember) {
            $class = GymClass::lockForUpdate()->findOrFail($classId);

            // Check existing
            $existing = Booking::where('member_id', $currentMember->id)
                ->where('gym_class_id', $classId)
                ->where('status', 'confirmed')
                ->first();

            if ($existing) {
                return back()->with('error', 'Ya tienes una plaza reservada en esta clase.');
            }

            if ($class->booked_count >= $class->max_capacity) {
                return back()->with('error', 'Clase completa. Puedes unirte a la lista de espera.');
            }

            $passCode = '#' . rand(1000, 9999);

            Booking::create([
                'member_id' => $currentMember->id,
                'gym_class_id' => $class->id,
                'box_pass_code' => $passCode,
                'status' => 'confirmed',
            ]);

            $class->increment('booked_count');

            return back()->with('success', "¡Plaza reservada con éxito! Tu pase de acceso es {$passCode}");
        });
    }

    public function cancel(Request $request, string $classId)
    {
        $currentMember = Member::where('email', 'alex.mendoza@fitbox.club')->firstOrFail();

        return DB::transaction(function () use ($classId, $currentMember) {
            $booking = Booking::where('member_id', $currentMember->id)
                ->where('gym_class_id', $classId)
                ->where('status', 'confirmed')
                ->firstOrFail();

            $class = GymClass::lockForUpdate()->findOrFail($classId);
            $booking->delete();

            if ($class->booked_count > 0) {
                $class->decrement('booked_count');
            }

            return back()->with('success', 'Reserva cancelada correctamente. Tu cupo ha sido liberado.');
        });
    }

    public function waitlist(Request $request, string $classId)
    {
        $currentMember = Member::where('email', 'alex.mendoza@fitbox.club')->firstOrFail();

        $class = GymClass::findOrFail($classId);

        Booking::create([
            'member_id' => $currentMember->id,
            'gym_class_id' => $class->id,
            'box_pass_code' => 'ESPERA-' . rand(100, 999),
            'status' => 'waitlist',
        ]);

        $class->increment('waitlist_count');

        return back()->with('success', 'Te has unido a la lista de espera.');
    }
}
