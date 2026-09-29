@extends('layouts.app')

@section('title', 'FitBox Club - Programación de Clases')

@section('content')
<header class="p-4 bg-[#111317] border-b border-[#444933]/30 sticky top-0 z-30">
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
            <span class="material-symbols-outlined text-[#c3f400] text-3xl font-bold">fitness_center</span>
            <div>
                <h1 class="font-condensed text-2xl font-extrabold uppercase tracking-wider text-white">FITBOX CLUB</h1>
                <p class="font-inter text-xs text-[#c4c9ac] font-medium">Box Central • Barcelona</p>
            </div>
        </div>

        <a href="{{ route('profile.index') }}" class="flex items-center space-x-2 bg-[#1e2024] p-1.5 px-3 rounded-full border border-[#444933]/40">
            <img src="{{ $currentMember->avatar_url ?? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz-fRYjq9mEKCj76LB96WcXEgdk0qRvDbl5jzZOMOzqIPPqN-lLpoat8dJy5a_AY289-RSQarjWUQhM9kVpxprUqgkaoOu8dq60R0vVaLSAv-d42qV5hGU4w8_wK5blImUkh_94fn1qxRTRsdzXo3MkEt5jtblfiaRAm7tmKQWsUypEeMp3TLmDUELHI3lD4lczJzITGZdwOZ-XIUbJo_EcsZxYgAep-PSd25WXSkc-5pYO7Elo6jZ2A' }}" alt="Avatar" class="w-7 h-7 rounded-full object-cover border border-[#c3f400]">
            <span class="font-condensed font-bold text-xs uppercase text-[#c3f400]">{{ $currentMember->level }}</span>
        </a>
    </div>

    {{-- Date Picker Slider --}}
    @php
        $days = [
            ['day' => '24', 'dow' => 'LUN', 'date' => '2024-10-24'],
            ['day' => '25', 'dow' => 'MAR', 'date' => '2024-10-25'],
            ['day' => '26', 'dow' => 'MIÉ', 'date' => '2024-10-26'],
            ['day' => '27', 'dow' => 'JUE', 'date' => '2024-10-27'],
            ['day' => '28', 'dow' => 'VIE', 'date' => '2024-10-28'],
            ['day' => '29', 'dow' => 'SÁB', 'date' => '2024-10-29'],
            ['day' => '30', 'dow' => 'DOM', 'date' => '2024-10-30'],
        ];
    @endphp

    <div class="flex items-center justify-between gap-1.5 mt-4 overflow-x-auto pb-1 no-scrollbar">
        @foreach($days as $d)
            @php $isSelected = ($d['date'] === $selectedDate); @endphp
            <a href="{{ route('classes.index', ['date' => $d['date'], 'category' => $selectedCategory]) }}"
               class="flex flex-col items-center justify-center min-w-[50px] py-2 px-1 rounded-xl transition-all {{ $isSelected ? 'bg-[#c3f400] text-[#111317] font-bold shadow-lg scale-105' : 'bg-[#1e2024] text-[#c4c9ac] hover:text-white border border-white/5' }}">
                <span class="font-condensed text-[11px] uppercase tracking-wider">{{ $d['dow'] }}</span>
                <span class="font-condensed text-xl font-extrabold leading-none mt-0.5">{{ $d['day'] }}</span>
            </a>
        @endforeach
    </div>

    {{-- Category Pills Filter --}}
    <div class="flex items-center gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar text-xs font-condensed uppercase tracking-wider">
        @php
            $categories = [
                'all' => 'Todas las Clases',
                'crossfit' => 'CrossFit WOD',
                'halterofilia' => 'Halterofilia',
                'endurance' => 'HIIT & Endurance',
                'openbox' => 'Open Box',
            ];
        @endphp
        @foreach($categories as $catKey => $catLabel)
            <a href="{{ route('classes.index', ['date' => $selectedDate, 'category' => $catKey]) }}"
               class="px-3 py-1.5 rounded-full transition-all whitespace-nowrap {{ $selectedCategory === $catKey ? 'bg-white text-black font-bold' : 'bg-[#1e2024] text-[#c4c9ac] hover:bg-[#282a2e]' }}">
                {{ $catLabel }}
            </a>
        @endforeach
    </div>
</header>

<main class="p-4 space-y-3.5">
    <div class="flex items-center justify-between text-xs text-[#c4c9ac] px-1 font-condensed uppercase">
        <span>Horarios Disponibles ({{ $classes->count() }})</span>
        <span class="text-[#c3f400]">Martes 25 Octubre</span>
    </div>

    @forelse($classes as $c)
        @php
            $booking = $userBookings->get($c->id);
            $isBooked = ($booking && $booking->status === 'confirmed');
            $isWaitlist = ($booking && $booking->status === 'waitlist');
            $isFull = ($c->booked_count >= $c->max_capacity);
        @endphp

        <div class="bg-[#1e2024] border {{ $isBooked ? 'border-[#c3f400] shadow-lg' : 'border-[#444933]/30' }} rounded-2xl p-4 transition-all hover:border-[#c3f400]/60">
            <div class="flex items-start justify-between">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="font-condensed text-lg font-bold text-[#c3f400]">
                            {{ substr($c->start_time, 0, 5) }} - {{ substr($c->end_time, 0, 5) }}
                        </span>
                        <span class="text-[11px] font-condensed uppercase bg-[#282a2e] text-[#c4c9ac] px-2 py-0.5 rounded font-bold">
                            {{ $c->duration_minutes }} MIN
                        </span>
                    </div>
                    <h3 class="font-condensed text-2xl font-extrabold uppercase text-white mt-0.5 tracking-wide">
                        {{ $c->title }}
                    </h3>
                    <p class="text-xs text-[#c4c9ac] font-inter mt-0.5">
                        {{ $c->location }} • {{ $c->sublabel }}
                    </p>
                </div>

                {{-- Coach Badge --}}
                <div class="flex flex-col items-center">
                    <div class="w-10 h-10 rounded-full bg-[#282a2e] border border-[#c3f400]/50 flex items-center justify-center font-condensed font-extrabold text-sm text-[#c3f400]">
                        {{ $c->coach_initials }}
                    </div>
                    <span class="text-[10px] font-condensed text-[#c4c9ac] mt-1">{{ explode(' ', $c->coach_name)[1] ?? $c->coach_name }}</span>
                </div>
            </div>

            {{-- Capacity Bar --}}
            <div class="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                <div class="flex items-center gap-2 text-xs">
                    <span class="material-symbols-outlined text-[16px] {{ $isFull ? 'text-red-400' : 'text-[#c3f400]' }}">
                        group
                    </span>
                    <span class="font-condensed uppercase font-semibold text-[#c4c9ac]">
                        Cupos: <strong class="{{ $isFull ? 'text-red-400' : 'text-white' }}">{{ $c->booked_count }}/{{ $c->max_capacity }}</strong>
                    </span>
                    @if($c->waitlist_count > 0)
                        <span class="text-[11px] font-condensed text-orange-400 uppercase font-bold">
                            ({{ $c->waitlist_count }} en espera)
                        </span>
                    @endif
                </div>

                @if($isBooked)
                    <span class="font-condensed font-bold text-xs uppercase px-2.5 py-1 rounded bg-[#c3f400] text-[#111317] flex items-center gap-1">
                        <span class="material-symbols-outlined text-[14px]">check</span>
                        PASE: {{ $booking->box_pass_code }}
                    </span>
                @endif
            </div>

            {{-- Actions --}}
            <div class="mt-3 pt-1">
                @if($isBooked)
                    <form action="{{ route('classes.cancel', $c->id) }}" method="POST">
                        @csrf
                        <button type="submit" onclick="return confirm('¿Confirmas que deseas cancelar tu reserva?')" class="w-full py-2.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-950/30 font-condensed font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-1 transition-all">
                            <span class="material-symbols-outlined text-[18px]">close</span>
                            Cancelar Reserva
                        </button>
                    </form>
                @elseif($isWaitlist)
                    <div class="w-full py-2.5 rounded-xl bg-orange-950/40 border border-orange-500/50 text-orange-300 font-condensed font-bold text-sm uppercase text-center">
                        En Lista de Espera (#{{ $booking->box_pass_code }})
                    </div>
                @elseif($isFull)
                    <form action="{{ route('classes.waitlist', $c->id) }}" method="POST">
                        @csrf
                        <button type="submit" class="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-condensed font-bold text-sm uppercase tracking-wider transition-all">
                            Unirme a Lista de Espera
                        </button>
                    </form>
                @else
                    <form action="{{ route('classes.reserve', $c->id) }}" method="POST">
                        @csrf
                        <button type="submit" class="w-full py-2.5 rounded-xl bg-[#c3f400] hover:brightness-110 active:scale-98 text-[#111317] font-condensed font-extrabold text-sm uppercase tracking-wider transition-all shadow-md">
                            Reservar Plaza
                        </button>
                    </form>
                @endif
            </div>
        </div>
    @empty
        <div class="p-8 text-center bg-[#1e2024] rounded-2xl border border-white/5 space-y-2">
            <span class="material-symbols-outlined text-4xl text-[#c4c9ac]">event_busy</span>
            <p class="font-inter text-sm text-[#c4c9ac]">No hay clases programadas para los filtros seleccionados.</p>
        </div>
    @endforelse
</main>
@endsection
