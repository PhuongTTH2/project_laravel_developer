/* 
 * 管理画面専用共通JS
 */

$(function(){
  // 対象テーブルがあれば調整
  if( $("div.container.admin .cart_table_container div.table_box").length ) {
    var brows, os;
    var browsAgent = window.navigator.userAgent.toLowerCase();
    if( browsAgent.indexOf('msie') != -1 || browsAgent.indexOf('trident') != -1 ) {
      brows = "IE";
    }
    if( browsAgent.indexOf(' mac ') != -1 ) {
      os = "Mac"
    }

    fitResizeInlineTable( brows, os, "initial" );

    var vh = $(window).height();
    if( vh > 0 ) {
      $("nav").css({'height':vh,'min-height':vh,'max-height':vh});
    }

    $(window).resize(function() {
      fitResizeInlineTable( brows, os );
    });
  }
});


/* テーブルの overflow とウィンドウサイズに合わせる調整 */
function fitResizeInlineTable( brows, os, times ) {
  var block_h = ($("div.table_box").offset().top) ? $("div.table_box").offset().top : 0;
  var add_h1 = ($("div.table_box table thead").outerHeight()) ? $("div.table_box table thead").outerHeight() : 0;

  if( $(window).height() > 0 ) {
    var oth = $(window).height() - parseInt(block_h);
    var ith = parseInt(oth) + parseInt(add_h1);
    if( $(".login_user_list").length )  ith = ith-180;   // 他の箇所のmergin 分を調整
    if( $(".upload_file_list").length ) ith = ith-100;   // 
    if( $(".user_list").length )        ith = ith-100;	 //
    if( brows == "IE" ) oth = oth-17;			 // IEは下部バーに被ると２重になって操作出来ない
    if( os == "Mac" ) ith = ith+17;			 // Mac はバー部分の高さを除外させる
  }
  $("div.table_box").css('height', oth);
  $("div.table_box table tbody").css('height', ith);

  // タイトルブロックをテーブルの幅と同じに調整
  var targetElement = "div.table_box table tbody tr:first-child td";

  if( $(targetElement).length ) {
    var totalWidth = 0;
    $(targetElement).each(function(i, e) {
      var ow = $(e).outerWidth(); totalWidth += ow;
      var targetNum = parseInt(i)+1;
      if( $(".login_user_list").length ) {
        $("div.table_box table thead tr:nth-child(2) th:nth-child("+targetNum+")").css('width',ow+'px');
      }else{
        $("div.table_box table thead tr:first-child th:nth-child("+targetNum+")").css('width',ow+'px');
      }
    });

    // テーブルが収まるようなら overflow-x は解除する
    if( (parseInt(totalWidth)-19) > $("div.table_box").width() ) {
      $(".cart_table_container div.table_box").css({"overflow-x":"scroll","-ms-overflow-x":"scroll"});
    }else{
      $(".cart_table_container div.table_box").css({"overflow-x":"visible","-ms-overflow-x":"visible"});
    }

    // 初回だけの調整
    if( times == "initial" ) {
      if( brows == "IE" ) {	// IEはバーの分だけ見切れてしまうので、１行足して調整
        var addColumn;
        for (var i=1;i<=1;i++) {
          addColumn = '<tr>';
          for (var n=1;n<=$(targetElement).length;n++) {
            addColumn += '<td style="height:20px;"></td>';
          }
          addColumn += '</tr>';
          $("div.table_box table tbody").append(addColumn);
        }
      }
    }
  }
}

function apiErrNotify(data)
{
    let messages = [];
    if (data && $.inArray(data.statusText, ["timeout", "error"])) {
        messages.push("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
    } else if (data && data.status >= 500) {
        messages.push("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
    }

    if (messages.length > 0) {
        return $.notify({message: messages.join('<br>')},{type: 'danger'});
    }
    return;
}