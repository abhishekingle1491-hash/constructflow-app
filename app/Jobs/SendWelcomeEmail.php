<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;

class SendWelcomeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(protected array $userData)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Access data via array keys since we aren't using Models
        \Mail::to($this->userData['email'])->send(new \App\Mail\WelcomeEmail($this->userData));
    }
}
