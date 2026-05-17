<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\CheckIn;
use Illuminate\Http\Request;
use Carbon\Carbon;

class MemberController extends Controller
{
    public function dashboard()
    {
        $members = Member::all();
        $activeCount = $members->filter(fn($m) => $m->status === 'Active')->count();
        $todayCheckIns = CheckIn::whereDate('checked_in_at', Carbon::today())->count();

        $recentCheckIns = CheckIn::with('member')
            ->whereDate('checked_in_at', Carbon::today())
            ->orderBy('checked_in_at', 'desc')
            ->limit(10)
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'memberName' => $c->member->name,
                'memberId' => $c->member->member_id,
                'plan' => $c->member->plan,
                'status' => $c->member->status,
                'time' => Carbon::parse($c->checked_in_at)->format('h:i A'),
            ]);

        return response()->json([
            'activeMembers' => $activeCount,
            'totalMembers' => $members->count(),
            'todayCheckIns' => $todayCheckIns,
            'recentCheckIns' => $recentCheckIns,
        ]);
    }

    public function index(Request $request)
    {
        $query = Member::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('id', 'LIKE', "%{$search}%");
            });
        }

        $members = $query->orderBy('created_at', 'desc')->get();

        if ($request->filled('status') && $request->status !== 'All Status') {
            $members = $members->filter(fn($m) => $m->status === $request->status)->values();
        }

        return response()->json($members);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact' => 'required|string|max:20',
            'plan' => 'required|in:Daily Pass,Monthly,Annual',
            'joined_date' => 'required|date',
            'expiry_date' => 'required|date|after_or_equal:joined_date',
        ]);

        $member = Member::create($validated);
        return response()->json($member, 201);
    }

    public function show(Member $member)
    {
        return response()->json($member);
    }

    public function update(Request $request, Member $member)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'contact' => 'sometimes|string|max:20',
            'plan' => 'sometimes|in:Daily Pass,Monthly,Annual',
            'joined_date' => 'sometimes|date',
            'expiry_date' => 'sometimes|date',
        ]);

        $member->update($validated);
        return response()->json($member);
    }

    public function destroy(Member $member)
    {
        $member->delete();
        return response()->json(null, 204);
    }
}
