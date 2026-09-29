@extends('layouts.app')

@section('title', 'FitBox Club - Carnet de Socio y Perfil')

@section('content')
<header class="p-4 bg-[#111317] border-b border-[#444933]/30">
    <div class="flex items-center justify-between">
        <h1 class="font-condensed text-2xl font-extrabold uppercase tracking-wider text-white">MI PERFIL & PASE</h1>
        <span class="font-condensed text-xs uppercase px-2 py-0.5 rounded bg-[#c3f400]/20 text-[#c3f400] font-bold">
            {{ $currentMember->member_code }}
        </span>
    </div>
</header>

<main class="p-4 space-y-4">
    {{-- CARNET DIGITAL DE ACCESO (QR CARD) --}}
    <div class="bg-gradient-to-br from-[#1e2024] to-[#141619] border-2 border-[#c3f400] rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-[#c3f400]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
                <span class="material-symbols-outlined text-[#c3f400] text-2xl font-bold">fitness_center</span>
                <span class="font-condensed text-lg font-extrabold tracking-wider text-white">FITBOX ATHLETE PASS</span>
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-[#c3f400] text-[#111317] font-condensed font-extrabold text-xs uppercase">
                {{ $currentMember->level }}
            </span>
        </div>

        <div class="flex items-center gap-4 mt-4">
            <img src="{{ $currentMember->avatar_url ?? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz-fRYjq9mEKCj76LB96WcXEgdk0qRvDbl5jzZOMOzqIPPqN-lLpoat8dJy5a_AY289-RSQarjWUQhM9kVpxprUqgkaoOu8dq60R0vVaLSAv-d42qV5hGU4w8_wK5blImUkh_94fn1qxRTRsdzXo3MkEt5jtblfiaRAm7tmKQWsUypEeMp3TLmDUELHI3lD4lczJzITGZdwOZ-XIUbJo_EcsZxYgAep-PSd25WXSkc-5pYO7Elo6jZ2A' }}" alt="Socio" class="w-16 h-16 rounded-full object-cover border-2 border-[#c3f400]">
            <div>
                <h3 class="font-condensed text-2xl font-black uppercase text-white leading-none">{{ $currentMember->name }}</h3>
                <p class="text-xs text-[#c4c9ac] font-inter mt-1">{{ $currentMember->plan_name }}</p>
                <p class="font-condensed text-xs uppercase text-[#c3f400] font-bold mt-0.5">Socio Verificado: {{ $currentMember->member_code }}</p>
            </div>
        </div>

        {{-- QR Code Display --}}
        <div class="mt-4 pt-3 border-t border-white/10 flex flex-col items-center justify-center p-3 bg-white rounded-xl">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=FITBOX-{{ $currentMember->member_code }}" alt="QR Access" class="w-32 h-32">
            <p class="text-[10px] text-neutral-800 font-condensed font-bold uppercase tracking-widest mt-1">Escanea en el torno óptico del Box</p>
        </div>
    </div>

    {{-- SECCIÓN MIS RESERVAS (FUTURAS Y PASADAS) --}}
    <div class="bg-[#1e2024] border border-[#444933]/30 rounded-2xl p-4 space-y-3">
        <div class="flex items-center justify-between border-b border-white/5 pb-2.5">
            <div class="flex items-center space-x-2">
                <span class="material-symbols-outlined text-[#c3f400] text-xl">event_available</span>
                <h3 class="font-condensed text-lg uppercase tracking-wider text-white font-bold">Mis Reservas</h3>
            </div>
            <span class="font-condensed text-xs uppercase px-2 py-0.5 rounded bg-[#0c0e12] border border-[#c3f400]/40 text-[#c3f400] font-bold">
                {{ $futureBookings->count() }} Activas
            </span>
        </div>

        {{-- Próximas Clases --}}
        <div class="space-y-2.5">
            <h4 class="font-condensed text-xs uppercase tracking-wider text-[#c4c9ac] font-bold">Próximas Sesiones</h4>
            @forelse($futureBookings as $b)
                <div class="p-3 rounded-xl bg-[#141619] border border-[#c3f400]/40 space-y-2">
                    <div class="flex items-start justify-between">
                        <div>
                            <span class="font-condensed text-xs uppercase text-[#c3f400] font-bold">
                                {{ $b->gymClass->date->format('d M') }} • {{ substr($b->gymClass->start_time, 0, 5) }} - {{ substr($b->gymClass->end_time, 0, 5) }}
                            </span>
                            <h5 class="font-condensed text-lg font-extrabold uppercase text-white">{{ $b->gymClass->title }}</h5>
                            <p class="text-xs text-[#c4c9ac] font-inter">{{ $b->gymClass->coach_name }} • {{ $b->gymClass->location }}</p>
                        </div>
                        <span class="font-condensed text-xs font-bold uppercase px-2 py-0.5 rounded {{ $b->status === 'confirmed' ? 'bg-[#c3f400] text-[#111317]' : 'bg-orange-500 text-white' }}">
                            {{ $b->status === 'confirmed' ? 'CONFIRMADA' : 'EN ESPERA' }}
                        </span>
                    </div>

                    <div class="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                        <span class="font-condensed text-[#c3f400] font-bold uppercase">PASE: {{ $b->box_pass_code }}</span>
                        <form action="{{ route('classes.cancel', $b->gym_class_id) }}" method="POST">
                            @csrf
                            <button type="submit" onclick="return confirm('¿Confirmas cancelar la reserva?')" class="text-red-400 font-condensed uppercase font-bold hover:underline">
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            @empty
                <p class="text-xs text-[#c4c9ac] font-inter p-3 bg-[#141619] rounded-xl text-center">No tienes reservas activas programadas.</p>
            @endforelse
        </div>

        {{-- Historial de Clases Pasadas --}}
        @if($pastBookings->isNotEmpty())
            <div class="space-y-2 pt-2 border-t border-white/5">
                <h4 class="font-condensed text-xs uppercase tracking-wider text-[#c4c9ac] font-bold">Historial Pasado</h4>
                @foreach($pastBookings->take(3) as $pb)
                    <div class="p-2.5 rounded-lg bg-[#141619] border border-white/5 flex items-center justify-between text-xs">
                        <div>
                            <span class="font-condensed uppercase text-[#c4c9ac]">{{ $pb->gymClass->date->format('d M') }} • {{ $pb->gymClass->title }}</span>
                            <p class="text-[11px] text-neutral-400 font-inter">{{ $pb->gymClass->coach_name }}</p>
                        </div>
                        <span class="text-[10px] font-condensed uppercase text-[#c3f400] bg-[#c3f400]/10 px-1.5 py-0.5 rounded font-bold">ASISTIDA</span>
                    </div>
                @endforeach
            </div>
        @endif
    </div>

    {{-- Métricas Biométricas Actualizables --}}
    <div class="bg-[#1e2024] border border-[#444933]/30 rounded-2xl p-4">
        <h3 class="font-condensed text-lg uppercase tracking-wider text-white font-bold mb-3">Parámetros Físicos</h3>
        <form action="{{ route('profile.update') }}" method="POST" class="space-y-3">
            @csrf
            <div class="grid grid-cols-3 gap-2">
                <div>
                    <label class="block text-[11px] font-condensed uppercase text-[#c4c9ac] mb-1">Peso (kg)</label>
                    <input type="number" step="0.1" name="weight_kg" value="{{ $currentMember->weight_kg }}" class="w-full bg-[#111317] border border-[#444933] rounded-lg px-2.5 py-2 text-white font-bold text-sm">
                </div>
                <div>
                    <label class="block text-[11px] font-condensed uppercase text-[#c4c9ac] mb-1">Altura (cm)</label>
                    <input type="number" step="0.5" name="height_cm" value="{{ $currentMember->height_cm }}" class="w-full bg-[#111317] border border-[#444933] rounded-lg px-2.5 py-2 text-white font-bold text-sm">
                </div>
                <div>
                    <label class="block text-[11px] font-condensed uppercase text-[#c4c9ac] mb-1">% Grasa</label>
                    <input type="number" step="0.1" name="body_fat_percent" value="{{ $currentMember->body_fat_percent }}" class="w-full bg-[#111317] border border-[#444933] rounded-lg px-2.5 py-2 text-white font-bold text-sm">
                </div>
            </div>

            <div>
                <label class="block text-[11px] font-condensed uppercase text-[#c4c9ac] mb-1">Contacto de Emergencia</label>
                <input type="text" name="emergency_contact" value="{{ $currentMember->emergency_contact }}" class="w-full bg-[#111317] border border-[#444933] rounded-lg px-3 py-2 text-white text-xs">
            </div>

            <button type="submit" class="w-full py-2.5 rounded-xl bg-[#c3f400] text-[#111317] font-condensed font-extrabold uppercase text-xs tracking-wider">
                Guardar Parámetros
            </button>
        </form>
    </div>
</main>
@endsection
