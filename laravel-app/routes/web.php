<?php

use App\Http\Controllers\ClassController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WodController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - FitBox Club (Laravel 13 + Blade)
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return redirect()->route('classes.index');
});

// 1. Clases y Horarios
Route::get('/clases', [ClassController::class, 'index'])->name('classes.index');
Route::post('/clases/{classId}/reservar', [ClassController::class, 'reserve'])->name('classes.reserve');
Route::post('/clases/{classId}/cancelar', [ClassController::class, 'cancel'])->name('classes.cancel');
Route::post('/clases/{classId}/espera', [ClassController::class, 'waitlist'])->name('classes.waitlist');

// 2. WOD & Récords Personales (PRs)
Route::get('/wod', [WodController::class, 'index'])->name('wod.index');
Route::post('/wod/pr', [WodController::class, 'storePr'])->name('wod.pr.store');

// 3. Cuotas & Membresía
Route::get('/cuota', [MembershipController::class, 'index'])->name('membership.index');
Route::post('/cuota/cambiar', [MembershipController::class, 'changePlan'])->name('membership.change');

// 4. Perfil del Socio & Carnet Digital QR
Route::get('/perfil', [ProfileController::class, 'index'])->name('profile.index');
Route::post('/perfil/actualizar', [ProfileController::class, 'update'])->name('profile.update');
