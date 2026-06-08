<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class AssetController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'show']),
        ];
    }

    // GET /api/assets (Public)
    public function index()
    {
        return response()->json(Asset::with(['owner', 'category'])->paginate(15), 200);
    }

    // POST /api/assets (Protected automatically by Sanctum middleware)
    public function store(Request $request){
        $validated = $request->validate([
            'category_id'      => 'required|exists:categories,id',
            'title'            => 'required|string|max:255',
            'condition_status' => 'required|in:new,excellent,good,fair',
            'thumbnail'        => 'required|image|max:5120', // 5MB max
            'gallery'          => 'nullable|array',
            'gallery.*'        => 'image|max:5120',
            'marketing'        => 'nullable|string',
            'specifications'   => 'nullable|string',
        ]);

        do {
            $lotNumber = 'LOT-' . strtoupper(Str::random(6));
        } while (Asset::where('lot_number', $lotNumber)->exists());

        // Handle File Uploads
        $media = ['thumbnail' => null, 'gallery' => []];

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('assets/thumbnails', 'public');
            $media['thumbnail'] = '/storage/' . $path;
        }

        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $path = $file->store('assets/gallery', 'public');
                $media['gallery'][] = '/storage/' . $path;
            }
        }

        $asset = Asset::create([
            'owner_id'         => auth()->id(),
            'category_id'      => $validated['category_id'],
            'lot_number'       => $lotNumber,
            'title'            => $validated['title'],
            'condition_status' => $validated['condition_status'],
            'media'            => $media,
            'marketing'        => isset($validated['marketing']) ? json_decode($validated['marketing'], true) : [],
            'specifications'   => isset($validated['specifications']) ? json_decode($validated['specifications'], true) : [],
        ]);

        return response()->json([
            'message' => 'Asset created successfully',
            'asset' => $asset
        ], 201);
    }

    // GET /api/assets/{id} (Public)
    public function show($id)
    {
        $asset = Asset::with(['owner', 'category'])->findOrFail($id);
        return response()->json($asset, 200);
    }

    // PUT/PATCH /api/assets/{id}
    public function update(Request $request, $id)
    {
        $asset = Asset::findOrFail($id);

        // Security check: Only owner can update
        if ($asset->owner_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized. You do not own this asset.'], 403);
        }

        $hasActiveAuction = $asset->auctions()
            ->whereIn('status', ['live', 'pending'])
            ->exists();

        if ($hasActiveAuction) {
            return response()->json([
                'message' => 'Cannot modify an asset that has an active or pending auction.'
            ], 422);
        }

        $validated = $request->validate([
            'title'            => 'sometimes|string|max:255',
            'condition_status' => 'sometimes|in:new,excellent,good,fair',
            'media'            => 'sometimes|array',
            'marketing'        => 'sometimes|array',
            'specifications'   => 'sometimes|array',
        ]);

        $asset->update($validated);

        return response()->json(['message' => 'Asset updated', 'asset' => $asset]);
    }

    // DELETE /api/assets/{id}
    public function destroy($id)
    {
        $asset = Asset::findOrFail($id);

        if ($asset->owner_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $hasActiveAuction = $asset->auctions()
            ->whereIn('status', ['live', 'pending'])
            ->exists();

        if ($hasActiveAuction) {
            return response()->json([
                'message' => 'Cannot delete an asset that has an active or pending auction.'
            ], 422);
        }

        $asset->delete();
        return response()->json(['message' => 'Asset deleted successfully']);
    }
}