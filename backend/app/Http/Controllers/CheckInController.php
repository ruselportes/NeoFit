<?php

namespace App\Http\Controllers;

use App\Models\CheckIn;
use App\Models\Member;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CheckInController extends Controller
{
    public function index()
    {
        $checkIns = CheckIn::with('member')
            ->whereDate('checked_in_at', Carbon::today('Asia/Manila'))
            ->orderBy('checked_in_at', 'desc')
            ->get();

        return response()->json($checkIns->map(function ($c) {
            /** @var CheckIn $c */
            $member = $c->member;
            /** @var Member $member */
            return [
                'id' => $c->id,
                'memberName' => $member->name,
                'memberId' => $member->member_id,
                'plan' => $member->plan,
                'status' => $member->status,
                'time' => $c->checked_in_at->setTimezone('Asia/Manila')->format('h:i A'),
            ];
        }));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'member_id' => 'required|string',
        ]);

        // Support both numeric ID and formatted ID like "M-001"
        $rawId = $validated['member_id'];
        if (str_starts_with(strtoupper($rawId), 'M-')) {
            $rawId = (int) str_replace(['M-', 'm-'], '', $rawId);
        }

        $member = Member::find($rawId);
        if (!$member) {
            return response()->json(['error' => 'Member not found. Check the ID and try again.'], 404);
        }

        // Prevent check-in for expired or pending memberships
        if ($member->status === 'Expired') {
            return response()->json([
                'error' => 'Cannot check in. ' . $member->name . ' (M-' . str_pad((string) $member->id, 3, '0', STR_PAD_LEFT) . ') has an expired membership.'
            ], 403);
        }

        if ($member->status === 'Pending') {
            return response()->json([
                'error' => 'Cannot check in. ' . $member->name . ' (M-' . str_pad((string) $member->id, 3, '0', STR_PAD_LEFT) . ') has a pending membership.'
            ], 403);
        }

        // Prevent duplicate check-in for the same member on the same day
        $alreadyCheckedIn = CheckIn::where('member_id', $member->id)
            ->whereDate('checked_in_at', Carbon::today('Asia/Manila'))
            ->exists();

        if ($alreadyCheckedIn) {
            return response()->json([
                'error' => $member->name . ' (M-' . str_pad((string) $member->id, 3, '0', STR_PAD_LEFT) . ') has already checked in today.'
            ], 409);
        }

        $checkIn = CheckIn::create([
            'member_id' => $member->id,
            'checked_in_at' => Carbon::now('Asia/Manila'),
        ]);

        return response()->json([
            'id' => $checkIn->id,
            'memberName' => $member->name,
            'memberId' => $member->member_id,
            'plan' => $member->plan,
            'status' => $member->status,
            'time' => Carbon::now('Asia/Manila')->format('h:i A'),
        ], 201);
    }
}
