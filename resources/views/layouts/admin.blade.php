<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>@yield('title')</title>

      <!-- CSS -->
  {{-- <link rel="stylesheet" type="text/css" href="/css/admin/common.css">
  <link rel="stylesheet" type="text/css" href="/css/schedule.css">
  <link rel="stylesheet" type="text/css" href="/libs/iziModal.min.css"> --}}
  <link rel="stylesheet" href="https://fonts.googleapis.com/earlyaccess/notosansjp.css">
  <!-- JS -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <script src="/libs/iziModal.min.js"></script>

  <!-- IconFonts -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css">
  <script src="/js/libs/bootstrap-notify.min.js"></script>
</head>
<body>
    <div id="contents">
        <nav id="sidebar">
            <ul class="sidemenu">
                <li>
                    <a href="{{ route('company.index') }}" class="bold"
                    style="font-family: 'Noto Sans Japanese', sans-serif; vertical-align: bottom;padding-right: 16px; color: #000; display: block;">
                    枠ファインダー<br>運用管理</a>
                </li>
                <li @if (preg_match('/company/', \Request::route()->getName())) class="active"  @endif>
                    <a href="{{ route('company.index') }}">company</a>
                </li>
                {{-- <li @if (preg_match('/administrators/', \Request::route()->getName())) class="active"  @endif>
                    <a href="{{ route('administrators.index') }}">administrators</a>
                </li>
                <li @if (preg_match('/import_data/', \Request::route()->getName())) class="active"  @endif>
                    <a href="{{ route('import_data.index') }}">import_data</a>
                </li>
                <li @if (preg_match('/loginusers/', \Request::route()->getName())) class="active"  @endif>
                    <a href="{{ route('loginusers.index') }}">loginusers</a>
                </li>
                <li @if (preg_match('/template/', \Request::route()->getName())) class="active"  @endif>
                    <a href="{{ url('/admin/license-template') }}">license-template'</a>
                </li>
                <li @if (preg_match('/auction/', \Request::route()->getName())) class="active"  @endif>
                <a href="{{ url('/admin/auctions') }}">auctions</a>
                </li>
                <li @if (preg_match('/reference_materials/', \Request::route()->getName())) class="active"  @endif>
                <a href="{{ url('/admin/reference_materials') }}">reference_materials</a>
                </li>
                <li @if (preg_match('/master/', \Request::route()->getName())) class="active"  @endif>
                <div class="">
                    <div class="" style="">
                    <a class="bbb" data-toggle="collapse" href="#menu-master-admin">マスタ管理</a>
                    </div>
                    <div id="menu-master-admin" class="panel-collapse collapse">
                    <ul class="list-group"  style="margin-left: 20px;">
                        <li>
                        <a class="aaa" href="{{ route('master.ass_plus_pattern.index') }}" style="margin-top:10px;">ASS+割引率</a>
                        </li>
                        <li>
                        <a class="aaa" href="{{ url('/admin/configs') }}" style="margin-top:10px;">各種システム設定</a>
                        </li>
                        <li>
                        <a class="aaa" href="{{ url('/admin/company-business-code') }}" style="margin-top:10px;">役割業種</a>
                        </li>
                    </ul>
                    </div>
                </div> --}}
                </li>
            </ul>
        </nav>

        <header>
            <div>
                <p id="menu_btn" class="fa fa-bars" style="display: none;"></p>
                <a id="logout" href="{{ route('admin.logout') }}"><p class="glyphicon glyphicon-log-out"><span class="bold">Logout</span></p></a>
            </div>
        </header>

        <div class="container admin">
            @yield('content')
        </div>
    </div>
</body>
</html>
