<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Auth;
use App\Providers\RouteServiceProvider;

class AuthController extends Controller
{

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/admin/company';

    public function __construct()
    {
       $this->middleware('guest:admin')->except('logout');
    }

    protected function guard(){
        //RedirectIfAuthenticated
        return Auth::guard('admin');
    }

    public function showLoginForm() {
        return view('admin.login');
    }

    public function username()
    {
        return 'account';
    }

    public function logout(Request $request) {
        Auth::guard('admin')->logout();
        return redirect()->route('admin.login');
    }
}
