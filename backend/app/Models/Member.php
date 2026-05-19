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
        // Use pure date strings (Y-m-d) to avoid UTC vs Asia/Manila timezone mismatch
        $todayStr = Carbon::now('Asia/Manila')->format('Y-m-d');
        $joinedStr = Carbon::parse($this->joined_date)->format('Y-m-d');
        $expiryStr = Carbon::parse($this->expiry_date)->format('Y-m-d');

        if ($joinedStr > $todayStr) return 'Pending';
        if ($expiryStr < $todayStr) return 'Expired';

        // Check if expiring within 7 days (plan expiry date - today)
        $today = Carbon::parse($todayStr);
        $expiry = Carbon::parse($expiryStr);
        $daysLeft = (int) $today->diffInDays($expiry, false); // positive = future, negative = past
        if ($daysLeft >= 0 && $daysLeft <= 7) return 'Expiring Soon';

        return 'Active';
    }

    public function checkIns()
    {
        return $this->hasMany(CheckIn::class);
    }
}
