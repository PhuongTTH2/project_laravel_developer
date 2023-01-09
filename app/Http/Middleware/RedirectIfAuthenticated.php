<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @param  string|null  ...$guards
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, ...$guards)
    {
        $guards = empty($guards) ? [null] : $guards[0];

        switch ($guards) {
            case 'admin' :
                if (Auth::guard($guards)->check()) {
                    return redirect()->route('company.index');
                }
                break;
            case 'web':
                if (Auth::guard($guards)->check()) {
                    return redirect()->route('home');
                }
                break;
            default:
                abort(403, 'Unauthorized action.');
                break;
        }
        return $next($request);
    }
}
