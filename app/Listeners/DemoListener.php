<?php

namespace App\Listeners;

use App\Events\DemoEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
// use Illuminate\Bus\Queueable;
class DemoListener implements ShouldQueue
{
    // use Queueable;
    // public $queue = "listenser";
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\DemoEvent  $event
     * @return void
     */
    public function handle(DemoEvent $event)
    {
        Log::info('hello: '. $event->name);
    }

    public function faile(DemoEvent $event, $exc)
    {
        Log::info('hello: '. $event->name);
    }
}
