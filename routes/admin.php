<?php
Route::domain(config('app.domain'))->group(function() {
    Route::prefix('admin')->group(function() {
        Route::get('/login', 'AuthController@showLoginForm')->name('admin.login');
        Route::post('/login', 'AuthController@login')->name('login.login_auth');
        Route::get('/logout', 'AuthController@logout')->name('admin.logout');

        Route::middleware('auth:admin')->group(function(){
            Route::prefix('company')->group(function() {
                Route::get('/', 'CompaniesController@index')->name('company.index');
                Route::get('/create', 'CompaniesController@create')->name('company.create');
                Route::post('/update', 'CompaniesController@update')->name('company.update');
                Route::get('/send-mail', 'CompaniesController@sendMail')->name('login.end-mail');
            });
            Route::prefix('upload')->group(function() {
                Route::get('/', 'UploadController@index')->name('upload.index');
                Route::post('/', 'UploadController@doUpload')->name('upload.doUpload');

            });
        });
    });
});
?>
