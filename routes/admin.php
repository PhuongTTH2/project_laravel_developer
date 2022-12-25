<?php
Route::domain(config('app.domain'))->group(function() {
    Route::prefix('admin')->group(function() {
        Route::get('/login', 'AuthController@showLoginForm')->name('admin.login');
        Route::post('/login', 'AuthController@login')->name('login.login_auth');
        Route::get('/logout', 'AuthController@logout')->name('admin.logout');
    });
});
?>
