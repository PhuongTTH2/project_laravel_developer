<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Auth;

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
//        $this->middleware('guest:admin')->except('logout');
    }

    // protected function guard(){
    //     return Auth::guard('admin');
    // }

    public function showLoginForm() {
        return view('admin.login');
    }

    public function username()
    {
        return 'account';
    }
}
