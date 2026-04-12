<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        
        // 1. Prepend HandleCors to handle those 204 Preflight requests correctly
        $middleware->prepend(\Illuminate\Http\Middleware\HandleCors::class);

        // 2. Enable Sanctum's stateful API behavior (fixes 401/419 issues)
        $middleware->statefulApi();

    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
