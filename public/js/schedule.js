// 各セルの高さはPHPでやってください
// 現在は 1min = 20px で計算してセットしています
// 5:00~5:15 の番組 -> 20 * (15 / 5) = height: 60px


$(function() {

  let pos = 0;
  if ($("#table_box div.table_datas table.time_table").length) {
      // 横スクロール監視
      pos = $("#table_box div.table_datas table.time_table").offset().left;
      $("#menu_btn").on("click", function(){
        // メニューの開閉時にはleft位置取得し直し
        pos = $("#table_box div.table_datas table.time_table").offset().left;
      });
  }

  // 曜日の全選択
  $("[id=day_all_check]").on("change", function(){
      if ($(this).prop("checked") == true) {
          $("input[id^=search_week]").prop("checked", true);
      } else {
          $("input[id^=search_week]").prop("checked", false);
      }
  })

  /**
   IE11用 ハック
   **/
  var ua = window.navigator.userAgent.toLowerCase();
  if(ua.indexOf('msie') >= 0 || ua.indexOf('trident') >= 0){
    // $("#table_box #table_container").css("overflow", "visible");
    var h = $(".table_datas table.time_table").height();

    $(".table_datas").css("height", h);
    $(".table_datas table.schedule").each(function(i, e){
//      $(e).css("height", h);
      $(e).css("overflow-y", "hidden");
    })
    var list = $(".table_datas table.schedule").length;
    var w = Number(list) * $(".table_datas table.schedule").width() + 145 + 160;

    $(".table_headers").css("width", w+15);
    $(".table_datas").css("width", w+55);
  }

})
