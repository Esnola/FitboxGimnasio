@extends('layouts.app')

@section('title', 'FitBox Club - WOD del Día & PRs')

@section('content')
<header class="p-4 bg-[#111317] border-b border-[#444933]/30">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="font-condensed text-2xl font-extrabold uppercase tracking-wider text-white">WOD & RÉCORDS</h1>
            <p class="font-inter text-xs text-[#c4c9ac]">Programación oficial y seguimiento de marcas personales</p>
        </div>
        <span class="font-condensed text-xs uppercase px-2 py-0.5 rounded bg-[#c3f400]/20 text-[#c3f400] font-bold">
            Martes 25 Oct
        </span>
    </div>
</header>

<main class="p-4 space-y-4">
    {{-- WOD DEL DÍA OFICIAL --}}
    <div class="bg-[#1e2024] border border-[#c3f400] rounded-2xl p-4 shadow-xl space-y-3">
        <div class="flex items-center justify-between">
            <span class="font-condensed text-xs uppercase bg-[#c3f400] text-[#111317] px-2 py-0.5 rounded font-extrabold">
                WOD DEL DÍA
            </span>
            <span class="font-condensed text-xs uppercase text-[#c4c9ac]">Coach Marcos R.</span>
        </div>

        <h2 class="font-condensed text-3xl font-extrabold uppercase text-white tracking-wide">
            "THOR'S HAMMER"
        </h2>

        {{-- Partes del WOD --}}
        <div class="space-y-2 text-xs font-inter border-t border-white/5 pt-3">
            <div class="p-2.5 rounded-xl bg-[#141619] border border-white/5">
                <span class="font-condensed text-xs font-bold uppercase text-[#c3f400]">PARTE A: FUERZA (15 MIN)</span>
                <p class="text-white mt-1">Clean & Jerk: 5 x 2 reps subiendo al 85% 1RM.</p>
            </div>

            <div class="p-2.5 rounded-xl bg-[#141619] border border-white/5">
                <span class="font-condensed text-xs font-bold uppercase text-[#c3f400]">PARTE B: METCON (FOR TIME - CAP 18')</span>
                <p class="text-white mt-1">3 Rondas por tiempo de:</p>
                <ul class="list-disc list-inside text-neutral-300 mt-1 space-y-0.5">
                    <li>21 Wall Ball Shots (9kg / 6kg)</li>
                    <li>15 Toes-to-Bar</li>
                    <li>9 Clean & Jerk (60kg / 42.5kg)</li>
                </ul>
            </div>
        </div>
    </div>

    {{-- MARCAS PERSONALES (PRs) --}}
    <div class="space-y-3">
        <div class="flex items-center justify-between">
            <h3 class="font-condensed text-lg uppercase tracking-wider text-white font-bold">Mis Marcas (PRs)</h3>
            <button onclick="document.getElementById('pr-modal').classList.remove('hidden')" class="px-2.5 py-1 rounded-lg bg-[#c3f400] text-[#111317] font-condensed font-extrabold text-xs uppercase flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">add</span>
                Nuevo PR
            </button>
        </div>

        <div class="grid grid-cols-2 gap-2.5">
            @forelse($prs as $pr)
                <div class="p-3 rounded-xl bg-[#1e2024] border border-[#444933]/30">
                    <span class="font-condensed text-xs uppercase text-[#c4c9ac] font-bold block truncate">{{ $pr->exercise }}</span>
                    <span class="font-condensed text-3xl font-black text-white leading-none mt-1 block">
                        {{ $pr->weight_kg }}<small class="text-xs text-[#c3f400] font-normal ml-0.5">kg</small>
                    </span>
                    <div class="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px] text-[#c4c9ac]">
                        <span>{{ $pr->reps }} {{ $pr->reps === 1 ? 'RM' : 'Reps' }}</span>
                        <span>{{ $pr->record_date }}</span>
                    </div>
                </div>
            @empty
                <p class="text-xs text-[#c4c9ac] col-span-2 text-center p-4 bg-[#1e2024] rounded-xl">No tienes marcas registradas aún.</p>
            @endforelse
        </div>
    </div>

    {{-- Modal Añadir PR --}}
    <div id="pr-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hidden">
        <div class="bg-[#1e2024] border border-[#c3f400] rounded-2xl w-full max-w-sm p-5 text-left relative">
            <button onclick="document.getElementById('pr-modal').classList.add('hidden')" class="absolute top-3.5 right-3.5 text-white">
                <span class="material-symbols-outlined">close</span>
            </button>
            <h3 class="font-condensed text-xl font-extrabold uppercase text-white mb-3">Registrar Nuevo PR</h3>
            <form action="{{ route('wod.pr.store') }}" method="POST" class="space-y-3">
                @csrf
                <div>
                    <label class="block text-xs font-condensed uppercase text-[#c4c9ac] mb-1">Ejercicio / Movimiento</label>
                    <input type="text" name="exercise" placeholder="ej. Snatch, Back Squat" required class="w-full bg-[#111317] border border-[#444933] rounded-lg p-2 text-white text-sm">
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-xs font-condensed uppercase text-[#c4c9ac] mb-1">Peso (kg)</label>
                        <input type="number" step="0.5" name="weight_kg" placeholder="100" required class="w-full bg-[#111317] border border-[#444933] rounded-lg p-2 text-white text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-condensed uppercase text-[#c4c9ac] mb-1">Repeticiones</label>
                        <input type="number" name="reps" value="1" required class="w-full bg-[#111317] border border-[#444933] rounded-lg p-2 text-white text-sm">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-condensed uppercase text-[#c4c9ac] mb-1">Notas / Sensaciones</label>
                    <textarea name="notes" rows="2" placeholder="Sensaciones o validación del coach" class="w-full bg-[#111317] border border-[#444933] rounded-lg p-2 text-white text-xs"></textarea>
                </div>
                <button type="submit" class="w-full py-2.5 rounded-xl bg-[#c3f400] text-[#111317] font-condensed font-extrabold uppercase text-sm">
                    Guardar Marca
                </button>
            </form>
        </div>
    </div>
</main>
@endsection
