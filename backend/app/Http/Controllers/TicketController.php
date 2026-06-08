<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class TicketController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum'),
        ];
    }

    // GET /api/tickets  (user: own tickets, admin: all tickets)
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            $tickets = Ticket::with('user')->latest()->paginate(15);
        } else {
            $tickets = Ticket::where('user_id', $user->id)->latest()->paginate(15);
        }

        return response()->json($tickets);
    }

    // POST /api/tickets
    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $ticket = Ticket::create([
            'user_id' => $request->user()->id,
            'subject' => $request->subject,
            'message' => $request->message,
            'status' => 'open',
        ]);

        return response()->json(['message' => 'Ticket created', 'ticket' => $ticket], 201);
    }

    // GET /api/tickets/{id}
    public function show(Request $request, $id)
    {
        $ticket = Ticket::with('user')->findOrFail($id);
        $user = $request->user();

        if ($user->role !== 'admin' && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json($ticket);
    }

    // PATCH /admin/tickets/{id}/reply  (admin only)
    public function reply(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admins only.'], 403);
        }

        $request->validate(['reply' => 'required|string']);

        $ticket = Ticket::findOrFail($id);
        $ticket->update([
            'admin_reply' => $request->reply,
            'status' => 'answered',
        ]);

        return response()->json(['message' => 'Reply saved', 'ticket' => $ticket]);
    }

    // PATCH /admin/tickets/{id}/close  (admin only)
    public function close(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admins only.'], 403);
        }

        $ticket = Ticket::findOrFail($id);
        $ticket->update(['status' => 'closed']);

        return response()->json(['message' => 'Ticket closed', 'ticket' => $ticket]);
    }

    // DELETE /api/tickets/{id}
    public function destroy(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $user = $request->user();

        if ($user->role !== 'admin' && $ticket->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $ticket->delete();
        return response()->json(['message' => 'Ticket deleted']);
    }
}
