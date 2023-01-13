<?php

namespace App\Observers;

use App\Models\Post;
use Illuminate\Database\Eloquent\Model;
class PostObserver
{
    public function created(Model $model)
    {
        //
    }


    public function updated(Model $model)
    {
        //
    }

    public function deleted(Post $post)
    {
        //
    }


    public function restored(Post $post)
    {
        //
    }

    public function forceDeleted(Post $post)
    {
        //
    }
}
