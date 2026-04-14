<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index() {
        return response()->json(Category::all());
    }

    public function store(Request $request) {
        $request->validate(['name' => 'required', 'slug' => 'required|unique:categories']);
        
        $category = Category::create([
            'id' => 'cat_' . Str::ulid(),
            'name' => $request->name,
            'slug' => $request->slug
        ]);
        return response()->json($category, 201);
    }

    public function show($id) {
        return response()->json(Category::findOrFail($id));
    }

    public function update(Request $request, $id) {
        $category = Category::findOrFail($id);
        $category->update($request->all());
        return response()->json($category);
    }

    public function destroy($id) {
        Category::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}