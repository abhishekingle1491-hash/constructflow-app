<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'http://app.constructflow.test')),
    'allowed_origins_patterns' => [], // This was the source of the error
    'allowed_headers' => ['*'],
    'exposed_headers' => [], // This should also be an array
    'max_age' => 0,
    'supports_credentials' => true, // This must be true for SPA authentication
];

?>