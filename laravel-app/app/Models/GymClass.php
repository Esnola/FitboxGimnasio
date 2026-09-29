<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GymClass extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'category',
        'location',
        'coach_name',
        'coach_initials',
        'start_time',
        'end_time',
        'duration_minutes',
        'date',
        'day_of_week',
        'intensity',
        'sublabel',
        'max_capacity',
        'booked_count',
        'waitlist_count',
    ];

    protected $casts = [
        'duration_minutes' => 'integer',
        'max_capacity' => 'integer',
        'booked_count' => 'integer',
        'waitlist_count' => 'integer',
        'date' => 'date',
    ];

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'gym_class_id');
    }

    public function getAvailableSpotsAttribute(): int
    {
        return max(0, $this->max_capacity - $this->booked_count);
    }

    public function getIsFullAttribute(): bool
    {
        return $this->booked_count >= $this->max_capacity;
    }
}
