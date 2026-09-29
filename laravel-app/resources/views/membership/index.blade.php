@extends('layouts.app')

@section('title', 'FitBox Club - Cuota y Membresía')

@section('content')
<header class="p-4 bg-[#111317] border-b border-[#444933]/30">
    <h1 class="font-condensed text-2xl font-extrabold uppercase tracking-wider text-white">GESTIÓN DE CUOTA</h1>
    <p class="font-inter text-xs text-[#c4c9ac]">Membresías activas, cambio de plan y facturas</p>
</header>

<main class="p-4 space-y-4">
    {{-- Plan Actual Card --}}
    <div class="bg-gradient-to-br from-[#1e2024] to-[#141619] border-2 border-[#c3f400] rounded-2xl p-5 shadow-xl">
        <div class="flex items-center justify-between">
            <span class="font-condensed text-xs uppercase px-2.5 py-0.5 rounded bg-[#c3f400] text-[#111317] font-extrabold">
                PLAN ACTUAL
            </span>
            <span class="text-xs text-[#c3f400] font-condensed uppercase font-bold flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse"></span>
                Activo
            </span>
        </div>

        <h2 class="font-condensed text-3xl font-extrabold uppercase text-white mt-2">{{ $currentMember->plan_name }}</h2>
        <div class="mt-2 flex items-baseline gap-1">
            <span class="font-condensed text-4xl font-extrabold text-white">69.00€</span>
            <span class="text-xs text-[#c4c9ac] font-inter">/ mes</span>
        </div>

        <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#c4c9ac]">
            <span>Método: {{ $currentMember->payment_method }}</span>
            <span>Renovación: Mensual</span>
        </div>
    </div>

    {{-- Planes Disponibles --}}
    <div class="space-y-3">
        <h3 class="font-condensed text-lg uppercase tracking-wider text-white font-bold">Cambiar o Mejorar Plan</h3>

        @foreach($plans as $p)
            @php $isCurrent = ($p->id === $currentMember->plan_id); @endphp
            <div class="bg-[#1e2024] border {{ $isCurrent ? 'border-[#c3f400]' : 'border-[#444933]/30' }} rounded-2xl p-4">
                <div class="flex items-start justify-between">
                    <div>
                        <span class="font-condensed text-xs uppercase text-[#c3f400] font-bold">{{ $p->tag }}</span>
                        <h4 class="font-condensed text-xl font-bold uppercase text-white">{{ $p->name }}</h4>
                    </div>
                    <span class="font-condensed text-2xl font-black text-white">{{ number_format($p->price_monthly, 2) }}€</span>
                </div>

                <p class="text-xs text-[#c4c9ac] font-inter mt-1.5">{{ $p->description }}</p>

                <div class="mt-3 pt-3 border-t border-white/5">
                    @if($isCurrent)
                        <div class="w-full py-2 rounded-xl bg-[#282a2e] text-[#c4c9ac] text-xs font-condensed font-bold uppercase text-center">
                            Plan Actual en uso
                        </div>
                    @else
                        <form action="{{ route('membership.change') }}" method="POST">
                            @csrf
                            <input type="hidden" name="plan_id" value="{{ $p->id }}">
                            <button type="submit" class="w-full py-2.5 rounded-xl bg-[#c3f400] hover:brightness-110 text-[#111317] font-condensed font-extrabold text-xs uppercase tracking-wider">
                                Cambiar a {{ $p->name }}
                            </button>
                        </form>
                    @endif
                </div>
            </div>
        @endforeach
    </div>

    {{-- Historial de Recibos --}}
    @if($receipts->isNotEmpty())
        <div class="bg-[#1e2024] border border-[#444933]/30 rounded-2xl p-4 space-y-2.5">
            <h3 class="font-condensed text-lg uppercase tracking-wider text-white font-bold">Últimos Recibos</h3>
            @foreach($receipts as $r)
                <div class="p-2.5 rounded-xl bg-[#141619] border border-white/5 flex items-center justify-between text-xs">
                    <div>
                        <span class="font-condensed text-white font-bold uppercase">{{ $r->title }}</span>
                        <p class="text-[11px] text-[#c4c9ac] font-inter">{{ $r->date_label }} • {{ $r->payment_method }}</p>
                    </div>
                    <div class="text-right">
                        <span class="font-condensed text-sm font-black text-white">{{ number_format($r->amount, 2) }}€</span>
                        <span class="block text-[10px] text-[#c3f400] font-condensed uppercase font-bold">PAGADO</span>
                    </div>
                </div>
            @endforeach
        </div>
    @endif
</main>
@endsection
