<?php
use Carbon\Carbon;
use App\Services\TransferRequestService;

if (!function_exists('_date2Str')) {
    function _date2Str($datetime) {
        return empty($datetime) ? '' : Carbon::parse($datetime)->format('Y/m/d');
    }
}

if (!function_exists('_time2Str')) {
    function _time2Str($time) {
        return empty($time) ? '' : Carbon::parse($time)->format('H:i');
    }
}
