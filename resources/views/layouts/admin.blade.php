<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta name="robots" content="noindex">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="content-language" content="ja">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>AAA 2| @yield('title')</title>
  <link rel="icon" href="/favicon.ico">
  <!-- CSS -->
  <link rel="stylesheet" type="text/css" href="/css/admin/common.css?v={{ time() }}">
  <link rel="stylesheet" type="text/css" href="/css/schedule.css?v={{ time() }}">
  <link rel="stylesheet" type="text/css" href="/libs/iziModal.min.css">
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
  <script>
    $(function() {
      // ソート項目のテキスト編集　（不要なら削除してください）
      $(".sort").each(function(index, element) {
        var newVal = $(element).text() + " ▲";
        $(element).text(newVal);
      })
    })
    // 画面の高さ合わせ
    $(window).on("load resize", function() {
      var minHeight = 550
      var windowHeight = $(window).height()
      var contentsHeight = $("#contents").height()
      if (windowHeight > contentsHeight) {
        minHeight = windowHeight
      } else {
        minHeight = contentsHeight
      }
      $('#sidebar').css('min-height', minHeight)
      $('#sidebar').css('height', contentsHeight)
    })

  @if(Session::has('success'))
      $.notify({message: "{{ session('success') }}"},{type: 'success',});
  @endif
  @if(Session::has('error'))
      $.notify({message: "{{ session('error') }}"},{type: 'danger',});
  @endif
  </script>
</head>
<body>
  <div id="contents">
    <!-- sidebar -->
    <input type="hidden" name="current_page" id="current_page" value="">
    <!-- ▼▼ sidebar ▼▼ -->
    <nav id="sidebar">
      <ul class="sidemenu">
        <li>
          <a href="{{ route('company.index') }}" class="bold" style="font-family: 'Noto Sans Japanese', sans-serif; vertical-align: bottom;padding-right: 16px; color: #000; display: block;">枠ファインダー<br>運用管理</a>
        </li>
        <li @if (preg_match('/company/', \Request::route()->getName())) class="active"  @endif>
          <a href="{{ route('company.index') }}">Company</a>
        </li>
        {{-- <li @if (preg_match('/administrators/', \Request::route()->getName())) class="active"  @endif>
          <a href="{{ route('administrators.index') }}">管理者一覧</a>
        </li>
        <li @if (preg_match('/import_data/', \Request::route()->getName())) class="active"  @endif>
          <a href="{{ route('import_data.index') }}">取込データ一覧</a>
        </li>
        <li @if (preg_match('/loginusers/', \Request::route()->getName())) class="active"  @endif>
          <a href="{{ route('loginusers.index') }}">ログインユーザ一覧</a>
        </li>
        <li @if (preg_match('/wp-page/', \Request::route()->getName())) class="active"  @endif>
          <a href="{{ url('/admin/wp-page') }}">Wordpressページ管理</a>
        </li>
        <li @if (preg_match('/template/', \Request::route()->getName())) class="active"  @endif>
          <a href="{{ url('/admin/license-template') }}">ライセンステンプレート</a>
        </li>
        <li @if (preg_match('/auction/', \Request::route()->getName())) class="active"  @endif>
          <a href="{{ url('/admin/auctions') }}">オークション管理</a>
        </li>
        <li @if (preg_match('/reference_materials/', \Request::route()->getName())) class="active"  @endif>
          <a href="{{ url('/admin/reference_materials') }}">年末年始情報管理</a>
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
          </div>
        </li> --}}
      </ul>
    </nav>
    <!-- ▲▲ sidebar ▲▲ -->
    <!-- ▼▼ header ▼▼ -->
    <header>
      <div>
        <p id="menu_btn" class="fa fa-bars" style="display: none;"></p>
        <a id="logout" href="{{ route('admin.logout') }}"><p class="glyphicon glyphicon-log-out"><span class="bold">Logout</span></p></a>
      </div>
    </header>
    <!-- ▲▲ header ▲▲ -->
    <div class="container admin">
            @yield('content')
    </div>

  </div>

</body>

</html>
