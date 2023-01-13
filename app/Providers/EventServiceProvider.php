<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Models\Post;
use App\Observers\PostObserver;

use App\Events\DemoEvent;
use App\Listeners\DemoListener;
use Illuminate\Support\Facades\Log;
use function Illuminate\Events\queueable;
class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],

        DemoEvent::class => [
            DemoListener::class
        ]
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        Post::observe(PostObserver::class);

        // Event::listen(queueable(function(DemoEvent $event){
        //    Log::info('hello2');
        // }));
    }


}
