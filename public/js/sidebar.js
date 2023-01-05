/** Sidemenu.js **/
$(function() {
	var menuBtn = $("#menu_btn");
	var closeIcon = "fa-bars fa";
	var openIcon = "fa fa-chevron-left";
	var sideWidth = 0;
	var posLeft = menuBtn.position().left;

	// コンテンツの横幅調整（セッション判定時）
	if ($("#sidebar ul.sidemenu").hasClass("menu_open")) {
		// アイコン切り替え
		menuBtn.removeClass(closeIcon);
		menuBtn.addClass(openIcon);
		menuBtn.css("left", 240);
		$("#contents .container").css("padding-left", 164);
		$(".search_info_wrap").css("width", "calc(100% - 226px)");
		$('.search_info').width($(".search_info_wrap").width());
        $('#search_menu').css('left', 224);
        $('.menu_sub').css('left', 224);
        $('.menu_sub_title').hide();

	} else {
		// アイコン切り替え
		menuBtn.removeClass(openIcon);
		menuBtn.addClass(closeIcon);
		menuBtn.css("left", posLeft);
		$("#contents .container").css("padding-left", 0);
		$(".search_info_wrap").css("width", "auto");
		$('.search_info').width($(".search_info_wrap").width());
        $('#search_menu').css('left', 60);
        $('.badge_sidemenu').css('left', 30);
        $('.menu_sub').css('left', 60);
        $('.menu_sub_title').show();
	}

	menuBtn.on("click", function(){

		if (menuBtn.hasClass(closeIcon)) {
			// 開く

			// アイコン切り替え
			menuBtn.removeClass(closeIcon);
			menuBtn.addClass(openIcon);

			var currentLeft = menuBtn.position().left;
			menuBtn.css("left", 240);

			$("#sidebar ul.sidemenu").removeClass("menu_close");
			$("#sidebar ul.sidemenu").addClass("menu_open");

			// コンテンツの横幅調整
			$("#contents .container").css("padding-left", 164);
			$(".search_info_wrap").css("width", "calc(100% - 226px)");
			$('.search_info').width($(".search_info_wrap").width());
            $('#search_menu').css('left', 224);
            $('.badge_sidemenu').css('left', 30);
            $('.menu_sub').css('left', 224);
            $('.menu_sub_title').hide();

            badgeDisplay('show');

			window.sessionStorage.setItem('isSidebarOpen','true');
		} else {
			//閉じる

			// アイコン切り替え
            badgeDisplay('hide');

			menuBtn.removeClass(openIcon);
			menuBtn.addClass(closeIcon);

			menuBtn.css("left", posLeft);
			$("#sidebar ul.sidemenu").removeClass("menu_open");
			$("#sidebar ul.sidemenu").addClass("menu_close");

			// コンテンツの横幅調整
			$("#contents .container").css("padding-left", 0);
            $(".search_info_wrap").css("width", "auto");
            $('.search_info').width($(".search_info_wrap").width());
            $('#search_menu').css('left', 60);
            $('.badge_sidemenu').css('left', 30);

            $('.menu_sub').css('left', 60);
            $('.menu_sub_title').show();
			window.sessionStorage.setItem('isSidebarOpen','false');



		}

		// 検索項目等の強制ポジショニング
		if (Number($("#contents .container").css("padding-left").replace('px', '')) > 30) {
			$("#contents .container ul.search_info_list").each(function(i, list){
				if ($(list).css("position") == "absolute"){
					$(list).addClass("force-block");
				}
			});
		} else {
			$("#contents .container ul.search_info_list").each(function(i, list){
				if ($(list).hasClass("force-block")){
					$(list).removeClass("force-block");
				}
			});
		}
	})
})

/*
$(window).on("load resize", function() {
	// 画面の高さ合わせ
	setTimeout(function(){
		var minHeight = 550;
		var windowHeight = $(window).height();
		var contentsHeight = $("#contents").innerHeight();
		if (windowHeight > contentsHeight) {
			minHeight = windowHeight;
		} else {
			minHeight = contentsHeight;
		}
		$('#sidebar').css('min-height', minHeight+10);
	}, 10);

	/* 検索項目等の強制ポジショニング
	console.log($("#contents .container").css("padding-left"));
	if ($("#contents .container").css("padding-left") > 30) {
		$("#contents .container ul.search_info_list").each(function(i, list){
			if ($(list).css("position") == "absolute"){
				$(list).addClass("force-block");
			}
		});
	}
});
*/

function badgeDisplay(selector, type){
  if ($(selector).length > 0) {
    $(selector).each(function(index, element){
      if (type == 'hide') {
        $(element).hide();
      } else if (type == 'show') {
        $(element).show();
      }
    });

  }
}


function badgeSideMenu(url){
  if (!url.length) return;
  $.ajax({
	url: url,
	type: 'get',
	dataType: 'text',
	data: {
		_token: '{{ csrf_token() }}'
	}
  }).done(function(res, st, xhr) {
    if ((xhr.getResponseHeader("content-type") || "html").indexOf('html') > -1) {
      // リダイレクトが走っているとHTMLが帰ってきてるのでログアウト
      //リダイレクト後のユーザ設定画面は、除外
      if(location.href.split('/').pop() != 'edit_my_profile'){
        window.location.href = '/logout/forced?type=other';
      }
	}
	res = JSON.parse(res);
    badgeDisplay('#badge_sidemenu_cart', (res.isCart || res.isCuCart) ? 'show' : 'hide');
	badgeDisplay('#badge_sidemenu_cart_received', (res.isCartReceived || res.isCuCartReceived) ? 'show' : 'hide');
    badgeDisplay('#badge_sidemenu_bookings', (res.isBookings || res.isCuBookings) ? 'show' : 'hide');
    badgeDisplay('#badge_sidemenu_receptions', (res.isReceptions) ? 'show' : 'hide');
  }).fail(function(xhr) {
      if (xhr.status === 401) {
          window.location.href = '/logout/forced?type=other';
      }
  });
}
