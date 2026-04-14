<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AssetController extends Controller
{
    public function index() {
        return response()->json(Asset::with('category', 'owner')->get());
    }

    public function store(Request $request) 
    {
        // 1. Validate the text fields AND the image files
        $request->validate([
            'title' => 'required',
            'category_id' => 'required|exists:categories,id',
            'owner_id' => 'required|exists:users,id',
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // Max 5MB
            'gallery.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // Validate array of images
        ]);

        // 2. Prepare the Media Array
        $mediaData = [
            'thumbnail' => null,
            'gallery' => []
        ];

        // 3. Upload Thumbnail
        if ($request->hasFile('thumbnail')) {
            // Stores in storage/app/public/assets/thumbnails
            $path = $request->file('thumbnail')->store('assets/thumbnails', 'public');
            // Creates a full URL like: http://localhost:8000/storage/assets/thumbnails/img.jpg
            $mediaData['thumbnail'] = url('storage/' . $path);
        }

        // 4. Upload Gallery (Multiple images)
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $path = $file->store('assets/gallery', 'public');
                $mediaData['gallery'][] = url('storage/' . $path);
            }
        }

        // 5. Handle React FormData Arrays (FormData sends arrays as JSON strings, so we decode them)
        $specifications = is_string($request->specifications) 
            ? json_decode($request->specifications, true) 
            : ($request->specifications ?? []);

        $marketing = is_string($request->marketing) 
            ? json_decode($request->marketing, true) 
            : ($request->marketing ?? []);

        // 6. Save to Database
        $asset = Asset::create([
            'id' => uniqid('ast_'),
            'owner_id' => $request->owner_id,
            'category_id' => $request->category_id,
            'lot_number' => $request->lot_number,
            'title' => $request->title,
            'condition_status' => $request->condition_status ?? 'new',
            'media' => $mediaData, // Save our new image URLs here!
            'marketing' => $marketing,
            'specifications' => $specifications
        ]);

        return response()->json($asset, 201);
    }

    public function show($id) {
        return response()->json(Asset::with('category')->findOrFail($id));
    }

    public function update(Request $request, $id) {
        $asset = Asset::findOrFail($id);
        $asset->update($request->all());
        return response()->json($asset);
    }

    public function destroy($id) {
        Asset::destroy($id);
        return response()->json(['message' => 'Asset deleted']);
    }
}