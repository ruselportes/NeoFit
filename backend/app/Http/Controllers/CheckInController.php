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
                ->get()
                ->map(fn($c) => [
                    'id' => $c->id,
                    'memberName' => $c->member->name,
                    'memberId' => $c->member->member_id,
                    'plan' => $c->member->plan,
                    'status' => $c->member->status,
                    'time' => Carbon::parse($c->checked_in_at)->setTimezone('Asia/Manila')->format('h:i A'),
                ]);

            return response()->json($checkIns);
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

            // Prevent duplicate check-in for the same member on the same day
            $alreadyCheckedIn = CheckIn::where('member_id', $member->id)
                ->whereDate('checked_in_at', Carbon::today('Asia/Manila'))
                ->exists();

            if ($alreadyCheckedIn) {
                return response()->json([
                    'error' => $member->name . ' (M-' . str_pad($member->id, 3, '0', STR_PAD_LEFT) . ') has already checked in today.'
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
