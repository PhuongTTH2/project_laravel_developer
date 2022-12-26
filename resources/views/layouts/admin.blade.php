<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>@yield('title')</title>

      <!-- CSS -->
  <link rel="stylesheet" type="text/css" href="/css/admin/common.css">
  <link rel="stylesheet" type="text/css" href="/css/schedule.css">
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
