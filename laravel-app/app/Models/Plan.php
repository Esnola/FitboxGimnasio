<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'tag',
        'price_monthly',
        'price_annual_monthly',
        'description',
        'features',
        'is_popular',
        'highlight',
    ];

    protected $casts = [
        'price_monthly' => 'decimal:2',
        'price_annual_monthly' => 'decimal:2',
        'features' => 'array',
        'is_popular' => 'boolean',
    ];

    public function members(): HasMany
    {
        return $this->hasMany(Member::class, 'plan_id');
    }
}
