<?php

return [

    /*
    |--------------------------------------------------------------------------
    | CORS — Cross-Origin Resource Sharing
    |--------------------------------------------------------------------------
    |
    | This tells the browser which origins (domains) are allowed to call
    | this API. During development we allow localhost on common frontend ports.
    | In production, replace these with your real domain.
    |
    */

    // Which URL patterns should CORS apply to
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // Which HTTP methods are allowed
    'allowed_methods' => ['*'],

    // Which origins (frontend URLs) can call the API
    // Add your frontend URL here — e.g. http://localhost:5173 for Vite
    'allowed_origins' => [
        'http://localhost:3000',  // React (Create React App)
        'http://localhost:5173',  // Vite (Vue / React)
        'http://localhost:5174',  // Vite fallback port
        'http://localhost:4200',  // Angular
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:3000',
    ],

    // No wildcard patterns needed since we list them above
    'allowed_origins_patterns' => [],

    // Which request headers the frontend is allowed to send
    'allowed_headers' => ['*'],

    // Which response headers the browser can read
    'exposed_headers' => [],

    // How long the browser can cache the CORS preflight response (in seconds)
    'max_age' => 0,

    // We do NOT use cookies for API auth (we use Bearer tokens), so false is correct
    'supports_credentials' => false,

];
