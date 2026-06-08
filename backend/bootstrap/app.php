<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        // ── Middleware Aliases ─────────────────────────────────────────────
        $middleware->alias([
            'admin' => \App\Http\Middleware\IsAdmin::class,
        ]);

        // ── CORS ───────────────────────────────────────────────────────────
        // Allow the frontend dev server to call the API.
        // Change these origins when you deploy to production.
        $middleware->validateCsrfTokens(except: ['api/*']);

    })
    
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
