<!DOCTYPE html>
<html lang="es" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>@yield('title', 'FitBox Club - App de Socios')</title>

    <!-- Tailwind CSS CDN or Vite -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        brand: '#c3f400',
                        bgDark: '#111317',
                        cardDark: '#1e2024',
                        cardDarkSubtle: '#282a2e',
                    },
                    fontFamily: {
                        condensed: ['Barlow Condensed', 'sans-serif'],
                        inter: ['Inter', 'sans-serif'],
                    }
                }
            }
        }
    </script>

    <!-- Google Fonts: Inter & Barlow Condensed -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;1,700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">

    <style>
        .font-condensed { font-family: 'Barlow Condensed', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .neon-glow { box-shadow: 0 0 15px rgba(195, 244, 0, 0.25); }
    </style>
</head>
<body class="bg-[#111317] text-[#e2e2e8] font-inter antialiased selection:bg-[#c3f400] selection:text-[#111317]">

    <div class="max-w-md mx-auto min-h-screen bg-[#111317] relative flex flex-col shadow-2xl pb-24">

        {{-- Toast Notifications --}}
        @if (session('success'))
            <div id="toast" class="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1e2024] border border-[#c3f400] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 max-w-xs text-xs font-inter animate-bounce">
                <span class="material-symbols-outlined text-[#c3f400] text-[18px]">verified</span>
                <span>{{ session('success') }}</span>
            </div>
        @endif

        @if (session('error'))
            <div id="toast" class="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-950 border border-red-500 text-red-200 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 max-w-xs text-xs font-inter">
                <span class="material-symbols-outlined text-red-400 text-[18px]">error</span>
                <span>{{ session('error') }}</span>
            </div>
        @endif

        {{-- Main Page Content --}}
        @yield('content')

        {{-- Bottom Navigation Bar --}}
        <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#111317]/95 backdrop-blur-md border-t border-[#444933]/30 px-3 py-2 flex justify-around items-center z-40">
            <a href="{{ route('classes.index') }}" class="flex flex-col items-center gap-0.5 {{ request()->routeIs('classes.*') ? 'text-[#c3f400]' : 'text-[#c4c9ac] hover:text-white' }} transition-colors">
                <span class="material-symbols-outlined text-[24px]">calendar_month</span>
                <span class="font-condensed text-[11px] font-bold uppercase tracking-wider">Clases</span>
            </a>

            <a href="{{ route('wod.index') }}" class="flex flex-col items-center gap-0.5 {{ request()->routeIs('wod.*') ? 'text-[#c3f400]' : 'text-[#c4c9ac] hover:text-white' }} transition-colors">
                <span class="material-symbols-outlined text-[24px]">fitness_center</span>
                <span class="font-condensed text-[11px] font-bold uppercase tracking-wider">WOD & PRs</span>
            </a>

            <a href="{{ route('membership.index') }}" class="flex flex-col items-center gap-0.5 {{ request()->routeIs('membership.*') ? 'text-[#c3f400]' : 'text-[#c4c9ac] hover:text-white' }} transition-colors">
                <span class="material-symbols-outlined text-[24px]">credit_card</span>
                <span class="font-condensed text-[11px] font-bold uppercase tracking-wider">Cuota</span>
            </a>

            <a href="{{ route('profile.index') }}" class="flex flex-col items-center gap-0.5 {{ request()->routeIs('profile.*') ? 'text-[#c3f400]' : 'text-[#c4c9ac] hover:text-white' }} transition-colors">
                <span class="material-symbols-outlined text-[24px]">badge</span>
                <span class="font-condensed text-[11px] font-bold uppercase tracking-wider">Perfil & Pase</span>
            </a>
        </nav>
    </div>

    <script>
        setTimeout(() => {
            const toast = document.getElementById('toast');
            if (toast) toast.remove();
        }, 4000);
    </script>
    @yield('scripts')
</body>
</html>
