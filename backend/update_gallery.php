<?php

use App\Models\Asset;

Asset::all()->each(function($a) {
    $media = $a->media;
    $media['gallery'] = [
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1966&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?q=80&w=2069&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2070&auto=format&fit=crop'
    ];
    $a->media = $media;
    $a->save();
});

echo "Gallery updated successfully!";
