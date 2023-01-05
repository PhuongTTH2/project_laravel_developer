function setSummary(params){
  contents = params.summarys
  title_data = params.title_data
  $('#onair_date').text(contents.onairDate);
  $('#position').text(contents.position);
  $('#pt_sb').text(contents.ptSb);

  $('#rates').empty()
  $('#title').empty()

  let strRateValue;
  if(typeof contents.rates.rate == 'string') {
      strRateValue = contents.rates.rate;
  } else {
      if (contents.rates.rate == null) {
          strRateValue = 'データなし';
      } else {
          strRateValue = contents.rates.rate.toFixed(1);
      }
  }

  $('#rates').append(
    $('<ul/>').attr({class: 'search_info_list'})
      .append($('<li/>').attr({class: 'bold'}).text(contents.rates.text))
      .append($('<li/>').text(strRateValue))
  )

  if (contents.rates.rate == null) {
    $('#rates').append(
      $('<ul/>').attr({class: 'search_info_list'})
        .append($('<li/>').text('データ搭載前のため'))
    )
  }
  if (title_data.title) {
    $('#title').text('予定番組名：' + title_data.title);
  }
}
function setDetail(params, keyHashCode) {
    $('#no_data_rate').hide();
    let contents = []
    let datas;
    future_title_flg = params.title_data.future_title_flg
    $.each(params.details, function (index, c) {
         datas = {
            'id': c.id,
            'length': c.cm_length,
            'price': c.price,
            'basePrice': c.basePrice,
            'countAvailableAdd': c.countAvailableAdd,
            'countCm': c.countCm,
            'keyHashCode': keyHashCode,
            'tagDisabled': c.countAvailableAdd == 0 ? 'disabled' : '',
            'numberAudience': c.numberAudience,
            'cpm': c.cpm,
            'perCost': c.perCosts.rate
        };
        if (!params.isViewCpm) {
            delete datas.numberAudience;
            delete datas.cpm;
        }
        if ((strange_data_types.indexOf(Number(data_type_id)) > -1)
                || (datas.perCost === '-')
                || (datas.perCost === '*'))  {
            delete datas.perCost;
        }
        contents.push(datas);
    })

    // render template
    if (contents.length > 0) {
        $(".cm_cost_info_box").html($.templates('.tmpl_cost_table').render({
          'contents': contents,
          'futureTitleFlg': future_title_flg
        }));
    }
}

function resizeBody() {
  $("body").css("min-height", $("#sidebar").height());
}

function viewRateInfo(keyHashCode){
  //データ種類
  data_type_id = $('#data_type_id').val()
  //集計率区分
  rate_type_ids = getRateTypeIds()
  if(!rate_type_ids.length){
    rate_type_ids = [1,2]
  }

  //集計率取得方法
  aggregate_type_id = $('#aggregate_type_id').val()
  //特性
  target_code = $('#targets').val()

  //集計区分
  period_type_id = $('#period_type_id').val()
  //集計対象期間
  let period_from_date = null
  let period_to_date = null
  if($('#periodTerm').length) {
    if($('#periodTerm').val() != -1) {
      periods = $('#periodTerm').val().split('_')
      period_from_date = periods[0]
      period_to_date = periods[1]
    }
  }

  //推定人口種別
//  let population_type_id = $('#population_type_id').val()

  let params = {
    'cart_id': $('#cart_item').val(),
    'key_hash_code': keyHashCode,
    'requestCondition': $('input[name=requestCondition]').val()
  }

  $.ajax({
      url: "/agency/program_guide/api/get_rate_info",
      type: 'GET',
      data: params,
//      timeout: 10000,
      dataType: 'json',
  }).done(function(res) {
        if (res.result == false) {
            if (res.reason == 'errorParams') {
                notifyError(res.errMsg);
                return
            }
            alert(res.errMsg)
            return
        }

        setSummary(res)
        setDetail(res, keyHashCode)
        $('.cm_cost_info').data('key-hash-code', keyHashCode)
        $('.cm_cost_info').iziModal('open');
  }).fail(function(data) {
    if (data && ["timeout", "error"].some(function (value) {
        return value == data.statusText;
    })) {
        notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
    } else if (data && data.status >= 500) {
        notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
    }
  })
}

function search(){
  $('#search').submit();
}

$(function($) {

  $.views.settings.delimiters("<%", "%>");
  let tmpl_cm_cart_info = $.templates('.cm_cart_info .tmpl');

  $.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });

  //$('.cm_cost_info').iziModal()
  $('.cm_cost_info').iziModal({
    bodyOverflow: false,
    onOpening: function(){
      $("body").addClass("non-scroll");
    },
    onClosing: function(){
      $("body").removeClass("non-scroll");
    }
  });

  $('.cm_cart_info').iziModal({
    title: 'カートに追加するCM枠',
    width: 1000,
    bodyOverflow: false,
    onOpening: function(){
      $("body").addClass("non-scroll");
    },
    onClosing: function(){
      $("body").removeClass("non-scroll");
    }
  });

  $('.position_area').click(function() {
    let contents = $(this).find('span')
    if (contents.length > 0) {
      viewRateInfo(contents.data('key-hash-code'))
    }
  })

  $('#cart_item').change(function() {
      $('input[name=selected_cart]').val($(this).val());
      let params = {
          'cart_id': $(this).val(),
          '_token' : $('input[name=_token]').val()
      };
      $.ajax({
          url: "/agency/program_guide/inCart",
          type: 'POST',
          data: params,
//          timeout: 10000,
          dataType: 'json',
      }).done(function(data) {
            if (data.errMsg) {
                notifyError(data.errMsg);
                return
            }
            if (data) {
                $('span[id^=key_cm]').removeClass('is_add_cart');
                $(data).each(function (index, value) {
                    $('span[data-key-hash-code=' + value + ']').addClass('is_add_cart');
                });
            }
      }).fail(function(data) {
          if (data && data.statusText == "timeout") {
              notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
          } else if (data && data.status == 0) {
              notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
          } else if (data && data.status >= 500) {
              notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
          }
      });

      $("a.btn-cart-detail").prop("href", "/agency/cart?cart_id=" + $(this).val());
  });

  $("#detail-btn").on("click", function() {
    var target = $("#search_menu");
    var menuHeight = $("#sidebar").height();
    var openClass = "glyphicon glyphicon-chevron-up";
    var closeClass = "glyphicon glyphicon-chevron-down";
    if (target.hasClass("in")) {
      $( '#contents.scroll_div' ).attr( { style: '' } );
      $( '#table_datas_thead.table_headers' ).css({position: 'sticky'});
      target.removeClass("in");
      target.css({
        width: '100%'
      });
      $("#btn_search_lower").css("margin-left", 'auto');
      $("span",this).removeClass(openClass);
      $("span",this).addClass(closeClass);
      $('#btn_search_upper').show();
      $('#result_condition_rate').show();
      $('#detail-btn').css("margin-left", 10);
      $("#sidebar").css("min-height", menuHeight - target.outerHeight());
      //テーブルヘッダー位置調整
      var header_h = $('header > div').outerHeight();
      var search_area_h = $('.contents_title').outerHeight();
      $('.table_headers').css('top', header_h + search_area_h);
      $('.container #table_box').css('padding-top', search_area_h);
    } else {
      $( '#contents.scroll_div' ).css({
        position: 'fixed',
        width: '100%'
      });
      $( '#table_datas_thead.table_headers' ).css({position: ''});
      target.addClass("in");
      target.css({
        width: '100%'
      });

      let tblLeftOffset = 164;
      if ($('.menu_close').length) {
        tblLeftOffset = 60;
      }

      let searchMenuLeft = $("#search_menu").width() / 2 - tblLeftOffset;
      $("#btn_search_lower").css("margin-left", searchMenuLeft + 'px');
  
      $("span",this).removeClass(closeClass);
      $("span",this).addClass(openClass);
      $('#btn_search_upper').hide();
      $('#result_condition_rate').hide();
      $('#detail-btn').css("margin-left", 86);
      $("#sidebar").css("min-height", menuHeight + target.outerHeight() + 30);
    }
  })

  $(document).on("click", ".cart_in", function () {

    let params = null
    let key_hash_code = $(this).data('key-hash-code')
    let price = $(this).data('base-price')
    let length = $(this).data('length')

    params = {
        'key_hash_codes': [key_hash_code],
        'cart_id': $('#cart_item').val()
    };
    
    $.ajax({
        url: "/agency/api/cart/check_available_area",
        type: 'POST',
        data: params,
//        timeout: 10000,
        dataType: 'json',
    }).done(function(res) {
        if (!res.result) {
            return notifyError(res.msg)
        } else {
            params = {
                'cart_id': $('#cart_item').val(),
                'key_hash_code': key_hash_code,
                'price': price,
                'length': length
            }

            $.ajax({
                url: "/agency/program_guide/api/get_cm_info",
                type: 'GET',
                data: params,
//                timeout: 10000,
                dataType: 'json',
            }).done(function(res) {
                $('.cm_cost_info').iziModal('close')
                
                if (res.errMsg) {
                    notifyError(res.errMsg);
                    return
                }
                
                let selector = '.cm_cart_info'
                let btn = $(selector).find('.cart_in_exe')

                btn.data("base-price", price)
                btn.data("length", length)
                btn.data("key-hash-code", key_hash_code)

                $(".cm_cart_info .contents").html(
                        tmpl_cm_cart_info.render({
                            'commercials': [
                                {
                                    'key_hash_code': key_hash_code,
                                    'broadcaster_name': res.broadcaster.broadcaster_name,
                                    'length': res.length,
                                    'onair_date': res.onair_date,
                                    'day_of_week': res.day_of_week,
                                    'position': res.position,
                                    'pt_sb_code': res.pt_sb_code,
                                    'price': res.price,
                                    'countAvailableAdd': res.countAvailableAdd,
                                    'countCm': res.countCm
                                }
                            ]
                        })
                        );

                $(selector).iziModal('open')
            }).fail(function (data) {
                if (data && data.statusText == "timeout") {
                    notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
                } else if (data && data.status == 0) {
                    notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
                } else if (data && data.status >= 500) {
                    notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
                }
            })
        }
    }).fail(function(data) {
        if (data && data.statusText == "timeout") {
            notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
        } else if (data && data.status == 0) {
            notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
        } else if (data && data.status >= 500) {
            notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
        }
    })
  })

  $(document).on('opening', '.cm_cart_info', function (e) {
      $(this).find('.cart_in_exe').prop('disabled', false)
  });

  $(document).on("click", '.cm_cart_info .cart_in_exe', function () {

    $(this).prop('disabled', true)
    let keyHashCode = $(this).data('key-hash-code')
    let basePrice = $(this).data('base-price')
    let length = $(this).data('length')
    params = {
        'key_hash_codes': [keyHashCode],
        'cart_id': $('#cart_item').val()
    };

    $.ajax({
        url: "/agency/api/cart/check_available_area",
        type: 'POST',
        data: params,
//        timeout: 10000,
        dataType: 'json',
    }).done(function(res) {
        if (!res.result) {
            return notifyError(res.msg)
        } else {

            let params = $.extend({
              "cart_id": $('#cart_item').val(),
              "num": $('.cm_cart_info .counter-txt').val(),
              "key_hash_code": keyHashCode,
              "price": basePrice,
              "length": length,
              'requestCondition': $('input[name=requestCondition]').val()
            }, getCartCommonParams())

            $.ajax({
                url: "/agency/program_guide/add_cart",
                type: 'POST',
                data: params,
//                timeout: 10000,
                dataType: 'json',
            }).done(function (data) {
                let type;
                let message;
                if (!data.result) {
                    if (data.msg) {
                        message = data.msg;
                    }
                    else {
                        message = 'カート処理に失敗しました。';
                    }
                    type = 'danger';
                } else {
                    if (data.numAdd == 0) {
                        message = '空き枠がありませんでした。もしくはカートに追加済です。';
                        type = 'danger';
                    } else {
                        message = data.numAdd + '枠をカートに追加しました。';
                        type = 'success';
                        $('.cm_cart_info #count_cm_rest').text(data.countAvailableAdd)
                        $('.cm_cart_info').iziModal('close')
                        $('#key_cm_' + keyHashCode).addClass('is_add_cart')
                    }
                }
                $.notify({'message': message}, {'type': type});
            }).fail(function (data) {
                if (data && data.statusText == "timeout") {
                    notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
                } else if (data && data.status == 0) {
                    notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
                } else if (data && data.status >= 500) {
                    notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
                }
            })
        }
    }).fail(function(data) {
        if (data && data.statusText == "timeout") {
            notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
        } else if (data && data.status == 0) {
            notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
        } else if (data && data.status >= 500) {
            notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
        }
    })
  })

  $(document).on("click", '.cm_cart_info .counter-minus', function () {
    console.log("minus")
    let selector = $('.cm_cart_info .counter-txt');
    let num = Number(selector.val()) - 1;
    if(num > 0) {
        selector.val(num)
    }
  })

  $(document).on("click", '.cm_cart_info .counter-plus', function () {
    console.log("plus")
    let selector = $('.cm_cart_info .counter-txt');
    console.log(selector)
    let num = Number(selector.val()) + 1;
    console.log(num)
    if(num <= $('.cm_cart_info .count_available_add').text()) {
        selector.val(num)
    }
  })

  $('table.data_head').eq(1).children('thead').fixedsticky();
  $(window).scrollTop(3343);
})
