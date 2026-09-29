<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Plan;
use App\Models\Receipt;
use Illuminate\Http\Request;

class MembershipController extends Controller
{
    public function index()
    {
        $currentMember = Member::where('email', 'alex.mendoza@fitbox.club')->first();
        $plans = Plan::all();
        $receipts = Receipt::where('member_id', $currentMember?->id)->latest()->get();

        return view('membership.index', compact('currentMember', 'plans', 'receipts'));
    }

    public function changePlan(Request $request)
    {
        $currentMember = Member::where('email', 'alex.mendoza@fitbox.club')->firstOrFail();
        $plan = Plan::findOrFail($request->plan_id);
        $billingCycle = $request->input('billing_cycle', 'monthly');

        $price = $billingCycle === 'annual' ? $plan->price_annual_monthly : $plan->price_monthly;

        $currentMember->update([
            'plan_id' => $plan->id,
            'plan_name' => $plan->name,
            'plan_status' => 'active',
        ]);

        Receipt::create([
            'member_id' => $currentMember->id,
            'title' => "Cambio a {$plan->name} (" . ($billingCycle === 'annual' ? 'Anual' : 'Mensual') . ")",
            'amount' => $price,
            'date_label' => date('j M Y'),
            'payment_method' => $currentMember->payment_method,
            'status' => 'paid',
        ]);

        return back()->with('success', "Plan actualizado a {$plan->name}.");
    }
}
