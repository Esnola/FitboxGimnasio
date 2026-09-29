<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\PrRecord;
use Illuminate\Http\Request;

class WodController extends Controller
{
    public function index()
    {
        $currentMember = Member::where('email', 'alex.mendoza@fitbox.club')->first();
        $prs = PrRecord::where('member_id', $currentMember?->id)->latest()->get();

        return view('wod.index', compact('currentMember', 'prs'));
    }

    public function storePr(Request $request)
    {
        $currentMember = Member::where('email', 'alex.mendoza@fitbox.club')->firstOrFail();

        $validated = $request->validate([
            'exercise' => 'required|string|max:100',
            'weight_kg' => 'required|numeric|min:1',
            'reps' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:250',
        ]);

        PrRecord::create([
            'member_id' => $currentMember->id,
            'exercise' => $validated['exercise'],
            'weight_kg' => $validated['weight_kg'],
            'reps' => $validated['reps'],
            'record_date' => date('d M Y'),
            'notes' => $validated['notes'],
        ]);

        return back()->with('success', '¡Nuevo récord personal guardado!');
    }
}
