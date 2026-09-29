<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Planes de Membresía
        Schema::create('plans', function (Blueprint $table) {
            $table->string('id')->primary(); // ej: 'plan-rx', 'plan-basico', 'plan-elite'
            $table->string('name');
            $table->string('tag')->nullable();
            $table->decimal('price_monthly', 8, 2);
            $table->decimal('price_annual_monthly', 8, 2);
            $table->text('description')->nullable();
            $table->json('features')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->string('highlight')->nullable();
            $table->timestamps();
        });

        // 2. Socios / Atletas
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('member_code')->unique(); // ej: '#FB-8942'
            $table->string('avatar_url')->nullable();
            $table->enum('level', ['RX', 'SCALED', 'PRO'])->default('RX');
            $table->string('plan_id')->default('plan-rx');
            $table->foreign('plan_id')->references('id')->on('plans')->onDelete('cascade');
            $table->string('plan_name')->default('Plan Atleta Ilimitado RX');
            $table->date('plan_expiry')->nullable();
            $table->enum('plan_status', ['active', 'paused', 'expired'])->default('active');
            $table->string('payment_method')->default('VISA •••• 4291');
            $table->string('payment_expiry')->default('09/27');
            $table->decimal('weight_kg', 5, 2)->default(78.4);
            $table->decimal('height_cm', 5, 2)->default(178);
            $table->decimal('body_fat_percent', 4, 1)->default(13.5);
            $table->string('emergency_contact')->nullable();
            $table->string('medical_certificate_valid_until')->nullable();
            $table->integer('monthly_attendances')->default(18);
            $table->integer('streak_days')->default(12);
            $table->boolean('class_reminders')->default(true);
            $table->boolean('health_sync')->default(true);
            $table->timestamps();
        });

        // 3. Clases del Box
        Schema::create('gym_classes', function (Blueprint $table) {
            $table->string('id')->primary(); // ej: 'class-25-1830'
            $table->string('title');
            $table->enum('category', ['crossfit', 'halterofilia', 'endurance', 'openbox', 'mobility']);
            $table->string('location')->default('Box Principal');
            $table->string('coach_name');
            $table->string('coach_initials', 5);
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('duration_minutes')->default(60);
            $table->date('date');
            $table->string('day_of_week', 5);
            $table->string('intensity')->nullable();
            $table->string('sublabel')->nullable();
            $table->integer('max_capacity')->default(16);
            $table->integer('booked_count')->default(0);
            $table->integer('waitlist_count')->default(0);
            $table->timestamps();
        });

        // 4. Reservas
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->onDelete('cascade');
            $table->string('gym_class_id');
            $table->foreign('gym_class_id')->references('id')->on('gym_classes')->onDelete('cascade');
            $table->string('box_pass_code'); // ej: '#4920'
            $table->enum('status', ['confirmed', 'waitlist', 'cancelled'])->default('confirmed');
            $table->timestamps();

            $table->unique(['member_id', 'gym_class_id', 'status']);
        });

        // 5. Récords Personales (PRs / Benchmarks)
        Schema::create('prs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->onDelete('cascade');
            $table->string('exercise');
            $table->decimal('weight_kg', 6, 2);
            $table->integer('reps')->default(1);
            $table->string('record_date');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 6. Recibos y Facturas
        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->onDelete('cascade');
            $table->string('title');
            $table->decimal('amount', 8, 2);
            $table->string('date_label');
            $table->string('payment_method');
            $table->enum('status', ['paid', 'pending'])->default('paid');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receipts');
        Schema::dropIfExists('prs');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('gym_classes');
        Schema::dropIfExists('members');
        Schema::dropIfExists('plans');
    }
};
