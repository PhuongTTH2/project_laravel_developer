<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>User login</title>

     <!-- CSS -->
    <link rel="stylesheet" type="text/css" href="/css/common.css">
    <link rel="stylesheet" type="text/css" href="/css/schedule.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/earlyaccess/notosansjp.css">
    <!-- JS -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <!-- IconFonts -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

</head>
<body id="login">
    <div id="contents">
        <div class="container">
            <div style="align-items: center">
                <div class="login_box">
                    <img src="/img/top_log.png">
                    <form action="{{ route('login') }}" method="post">
                      @csrf
                      <label>ログインID</label>
                      <input type="text" name="account" size="40" maxlength="20">
                      @if ($errors->has('account'))
                      <span class="invalid-feedback" role="alert">
                        <strong>{{ $errors->first('account') }}</strong>
                      </span>
                      @endif
                      <label>パスワード</label>
                      <input type="password" name="password" size="40" maxlength="20">
                      @if ($errors->has('password'))
                      <span class="invalid-feedback" role="alert">
                        <strong>{{ $errors->first('password') }}</strong>
                      </span>
                      @endif
                      <input type="hidden" name="callsign" value="{{ old('callsign', request()->get('callsign')) }}" />
                      <input type="submit" name="login" class="btn_M" value="ログイン">
                    </form>
                  </div>
            </div>
        </div>
    </div>

<script src="/js/libs/bootstrap-notify.min.js"></script>
<link rel="stylesheet" type="text/css" href="/libs/iziModal.min.css" media="screen">
<script type="text/javascript" src="/libs/iziModal.min.js"></script>
<script>
    @if(Session::has('message'))

       $.notify({
         message: "{{ session('message') }}"
       },{
         type: 'danger',
       });
   @endif

   @if(Session::has('login_confirm'))
   $(function(){
     $(".cart_modal").iziModal();
   });

   $(document).ready(function (event) {
     $('.cart_modal').iziModal('open');
   });
   @endif

   </script>
</body>
</html>
