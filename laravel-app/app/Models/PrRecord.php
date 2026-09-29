<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrRecord extends Model
{
    use HasFactory;

    protected $table = 'prs';

    protected $fillable = [
        'member_id',
        'exercise',
        'weight_kg',
        'reps',
        'record_date',
        'notes',
    ];

    protected $casts = [
        'weight_kg' => 'float',
        'reps' => 'integer',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }
}
