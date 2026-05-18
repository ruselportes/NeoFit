<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Member extends Model
{
    protected $fillable = ['name', 'contact', 'plan', 'joined_date', 'expiry_date', 'address', 'membership_expiry'];

    protected $casts = [
        'joined_date' => 'date',
        'expiry_date' => 'date',
        'membership_expiry' => 'date',
    ];

    protected $appends = ['status', 'member_id'];

    public function getMemberIdAttribute(): string
    {
        return 'M-' . str_pad($this->id, 3, '0', STR_PAD_LEFT);
    }

    public function getStatusAttribute(): string
    {
        $today = Carbon::today();
        $expiry = Carbon::parse($this->expiry_date);
        if ($expiry->lt($today)) return 'Expired';
        if ($expiry->diffInDays($today) <= 7) return 'Expiring Soon';
        return 'Active';
    }

    public function checkIns()
    {
        return $this->hasMany(CheckIn::class);
    }
}
