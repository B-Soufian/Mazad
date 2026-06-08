<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

// NOTE: Auth & admin protection for this controller is handled at the route level
// in routes/api.php — no middleware needed inside this controller.
class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
        ]);

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category
        ], 201);
    }

    public function show($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category, 200);
    }

    // PUT/PATCH /api/categories/{id} (Admin Only)
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
        ]);

        if (isset($validated['name'])) {
            $category->name = $validated['name'];
            $category->slug = Str::slug($validated['name']);
        }
        if (isset($validated['description'])) {
            $category->description = $validated['description'];
        }

        $category->save();

        return response()->json(['message' => 'Category updated', 'category' => $category]);
    }

    // DELETE /api/categories/{id} (Admin Only)
    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        if ($category->assets()->exists()) {
            return response()->json([
                'message' => 'Cannot delete category because it contains assets.'
            ], 400);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}