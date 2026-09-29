<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'member_code',
        'avatar_url',
        'level',
        'plan_id',
        'plan_name',
        'plan_expiry',
        'plan_status',
        'payment_method',
        'payment_expiry',
        'weight_kg',
        'height_cm',
        'body_fat_percent',
        'emergency_contact',
        'medical_certificate_valid_until',
        'monthly_attendances',
        'streak_days',
        'class_reminders',
        'health_sync',
    ];

    protected $casts = [
        'weight_kg' => 'float',
        'height_cm' => 'float',
        'body_fat_percent' => 'float',
        'monthly_attendances' => 'integer',
        'streak_days' => 'integer',
        'class_reminders' => 'boolean',
        'health_sync' => 'boolean',
        'plan_expiry' => 'date',
    ];

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class, 'plan_id');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function prs(): HasMany
    {
        return $this->hasMany(PrRecord::class);
    }

    public function receipts(): HasMany
    {
        return $this->hasMany(Receipt::class);
    }

    public function getBmiAttribute(): float
    {
        if ($this->height_cm > 0) {
            $heightMeters = $this->height_cm / 100;
            return round($this->weight_kg / ($heightMeters * $heightMeters), 1);
        }
        return 0.0;
    }
}
