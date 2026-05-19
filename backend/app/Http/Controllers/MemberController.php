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
        $todayCheckIns = CheckIn::whereDate('checked_in_at', Carbon::today('Asia/Manila'))->count();

        $recentCheckIns = CheckIn::with('member')
            ->whereDate('checked_in_at', Carbon::today('Asia/Manila'))
            ->orderBy('checked_in_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($c) {
                /** @var CheckIn $c */
                $member = $c->member;
                /** @var Member $member */
                return [
                    'id' => $c->id,
                    'memberName' => $member->name,
                    'memberId' => $member->member_id,
                    'plan' => $member->plan,
                    'status' => $member->status,
                    'time' => Carbon::parse($c->checked_in_at)->setTimezone('Asia/Manila')->format('h:i A'),
                ];
            });

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
            if ($request->status === 'Annual Membership') {
                $members = $members->filter(fn($m) => str_contains($m->plan, 'Annual'))->values();
            } else {
                $members = $members->filter(fn($m) => $m->status === $request->status)->values();
            }
        }

        return response()->json($members);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact' => ['required', 'string', 'regex:/^09\d{9}$/'],
            'plan' => 'required|string|max:255',
            'joined_date' => 'required|date',
            'expiry_date' => 'required|date|after_or_equal:joined_date',
            'address' => 'nullable|string|max:500',
            'membership_expiry' => 'nullable|date',
        ], [
            'contact.regex' => 'The contact number must be exactly 11 digits starting with 09.',
        ]);

        // Check for duplicate member (same name and contact)
        $duplicateExists = Member::where('name', $validated['name'])
            ->where('contact', $validated['contact'])
            ->exists();

        if ($duplicateExists) {
            return response()->json([
                'message' => 'A member with this name and contact number already exists.'
            ], 422);
        }

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
            'contact' => ['sometimes', 'string', 'regex:/^09\d{9}$/'],
            'plan' => 'sometimes|string|max:255',
            'joined_date' => 'sometimes|date',
            'expiry_date' => 'sometimes|date',
            'address' => 'nullable|string|max:500',
            'membership_expiry' => 'nullable|date',
        ], [
            'contact.regex' => 'The contact number must be exactly 11 digits starting with 09.',
        ]);

        // Check for duplicate member (same name and contact, excluding current member)
        $targetName = $validated['name'] ?? $member->name;
        $targetContact = $validated['contact'] ?? $member->contact;

        $duplicateExists = Member::where('name', $targetName)
            ->where('contact', $targetContact)
            ->where('id', '!=', $member->id)
            ->exists();

        if ($duplicateExists) {
            return response()->json([
                'message' => 'Another member with this name and contact number already exists.'
            ], 422);
        }

        $member->update($validated);
        return response()->json($member);
    }

    public function destroy(Request $request, Member $member)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admins only.'], 403);
        }

        $member->delete();
        return response()->json(null, 204);
    }
}
