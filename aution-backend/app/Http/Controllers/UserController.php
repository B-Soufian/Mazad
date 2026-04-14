<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function index() {
        // Return users, but hide the password
        return response()->json(User::select('id', 'username', 'email', 'role', 'status', 'wallet_balance')->get());
    }

    public function store(Request $request) {
        // Usually handled by Breeze Register, but an Admin might manually create one here
        $user = User::create([
            'id' => 'usr_' . Str::ulid(),
            'username' => $request->username,
            'email' => $request->email,
            'password' => bcrypt($request->password), // Breeze standard
            'role' => $request->role ?? 'bidder'
        ]);
        return response()->json($user, 201);
    }

    public function show($id) {
        return response()->json(User::findOrFail($id));
    }

    public function update(Request $request, $id) {
        $user = User::findOrFail($id);
        // E.g., Admin changing status to 'suspended'
        $user->update($request->all());
        return response()->json($user);
    }

    public function destroy($id) {
        User::destroy($id);
        return response()->json(['message' => 'User deleted']);
    }
}
