$(function(){

    $.views.settings.delimiters("<%", "%>");
    
    $("#cart_select").on("change", function() {
        if (parseInt(this.value) !== -1) {
          searchPosition()
        }
      })
      
    $(document).on("click", 'input[name=add_cart]', function(){

        if ($('input[name=cart_row]:checked').length === 0) {
            return $.notify({message: 'カートに追加するCU商品を選択してください。'},{type: 'danger'});
        }
        $('.modal_commercial_cart').iziModal("open");

    });

    $(document).on("blur", "#distribute_start_time, #distribute_end_time", function(e){
        fixOnairDate(
            $('.enable_onair_date_start'),
            $('.enable_onair_date_end'),
            $('#distribute_start_time'),
            $('#distribute_end_time')
        )
    });

    $(document).on("click", '.month-previous', function(){
        changeDatepicker('month-previous');
    });

    $(document).on("click", '.month-next', function(){
        changeDatepicker('month-next');
    });

    $(document).on("change", 'select[name=area_id]', function(){
        let params = {
            'type': 'area',
            'area_id': $(this).val()
        };
        disableBtnSearch();
        $.ajax({
            url: "/agency/cu/positions/api/change_conditions",
            type: 'GET',
            data: params,
//            timeout: 10000,
            dataType: 'json',
        })
        .then(
            function (response) {
                if(response) {
                  let callsignElem = $('#callsign_wrapper');
                  callsignElem.empty();
                  if(response.broadcasters) {
                      jQuery.each(response.broadcasters, function(index, d) {
                          let callsign = $("<input>", {
                              type: 'checkbox',
                              name: 'callsign[]',
                              id: "callsign_" + d.callsign,
                              value: d.callsign,
                              checked: 'checked'
                          });
                          let callsign_label = $("<label>", {
                              for: "callsign_" + d.callsign,
                          });
                          let callsign_label_text = $('<span>' + d.broadcaster_name + '</span>');
                          callsignElem.append(callsign);
                          callsignElem.append(callsign_label);
                          callsign_label_text.appendTo(callsign_label);
                      })
                  }           

                  $('.enable_onair_date_start').text(response.enableOnairDates.from)
                  $('.enable_onair_date_end').text(response.enableOnairDates.to)
                  $('input[name=distribute_start_time]').val(response.distributes.from)
                  $('input[name=distribute_end_time]').val(response.distributes.to)

                  applyDatePicker($('input[name=distribute_start_time]'), response.enableOnairDates.from, response.enableOnairDates.to);
                  applyDatePicker($('input[name=distribute_end_time]'), response.enableOnairDates.from, response.enableOnairDates.to);
                }
            },
            function (data) {
                apiErrNotify(data)
            }
        ).done(function() {
                enableBtnSearch();
        });
    });

    $(document).on("click", "input[name='callsign[]']", function(event){
        const checked = $('input[name="callsign[]"]:checked').map(function() { return $(this).val() }).get()
        if (checked.length === 0) {
            event.preventDefault()
        }
    });
    $(document).on("change", 'input[name="callsign[]"]', function(event){
        const checked = $('input[name="callsign[]"]:checked').map(function() { return $(this).val() }).get()
        if (checked.length === 0) {
            event.preventDefault()
            return false;
        }

        disableBtnSearch();
        let params = {
            'type': 'callsign',
            'callsign': $('input[name="callsign"]:checked').val() || $('input[name="callsign[]"]:checked').map(function() { return $(this).val() }).get()
        };
        $.ajax({
            url: "/agency/cu/positions/api/change_conditions",
            type: 'GET',
            data: params,
//            timeout: 10000,
            dataType: 'json',
        })
        .then(
            function (response) {
                if(response) {
                    $('.enable_onair_date_start').text(response.enableOnairDates.from)
                    $('.enable_onair_date_end').text(response.enableOnairDates.to)
                    $('input[name=distribute_start_time]').val(response.distributes.from)
                    $('input[name=distribute_end_time]').val(response.distributes.to)

                    applyDatePicker($('input[name=distribute_start_time]'), response.enableOnairDates.from, response.enableOnairDates.to);
                    applyDatePicker($('input[name=distribute_end_time]'), response.enableOnairDates.from, response.enableOnairDates.to);
                }
            },
            function (data) {
                apiErrNotify(data)
            }
        ).done(function() {
            enableBtnSearch();
        });
    });

    var chkSearchHight = function(){
        if($('#search_info_lists').length){
          const position_list_control_wrap_height = $('.position_list_control_wrap').height() + 20 || 0;
          const view_discount_rate_height = $('.view_discount_rate').height() || 0;
          const search_info_list_title_height = $('.search_info_list' + '.title').height() || 0;
          const padding_top_container = 30;
          const borderline_height = 10;
          let searchHight = $('#search_info_lists').height() + padding_top_container + borderline_height - search_info_list_title_height - position_list_control_wrap_height - view_discount_rate_height;
    
            if($('#search_menu').length){
              $('#search_menu').css('margin-top',searchHight + 40);
            }
    
        }
      }
      chkSearchHight();
    
      //リサイズ
      $(window).on('load resize', function(){
        setTimeout(function(){
          chkSearchHight();
        },100);  
      });
      //メニュー開閉
      $("#menu_btn").on("click", function(){
         setTimeout(chkSearchHight(),500);
      });
      
    initCartInfo('.cart_items');

});

function setTargetCommercial(cuCommercialId)
{

}

function errorSystem(jqXHR, textStatus, errorThrown)
{
    if(jqXHR.status >= 500){
        $.notify({message: 'システムエラーが発生しました。'},{type: 'danger'});
    }
}

function applyDatePicker(elem, from, to)
{
    elem.datepicker('setStartDate', from);
    elem.datepicker('setEndDate', to);
}

function changeDatepicker(type)
{
    let params = {
        'type': type,
        'distribute_start_time': $('input[name=distribute_start_time]').val(),
        'distribute_end_time': $('input[name=distribute_end_time]').val(),
        'callsign': $('input[name="callsign[]"]:checked').map(function() { return $(this).val() }).get(),
    };

    loading('show')
    $.ajax({
        url: '/agency/cu/positions/api/change_conditions',
        type: 'GET',
        data: params,
//        timeout: 120000,
        dataType: 'json',
        success: function (data) {
            if(data) {
                $('input[name=distribute_start_time]').val(data.distributes.from)
                $('input[name=distribute_end_time]').val(data.distributes.to)
            }
        }
    }).done(function () {
        
    }).fail(function (data) {
        if (data && data.statusText == "timeout") {
            errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
        } else if (data && data.status == 0) {
            errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
        } else if (data && data.status >= 500) {
            errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
        } else if (data && data.status == 422 && data.responseJSON) {
            errNotify([data.responseJSON.errMsg]);
        }
    }).always(function() {
        loading("hide")
    })
}

function searchPosition(){

    if(valid()){
      loading('show')
  
      if($('#cart_item').length > 0) {
        $('#choice_cart_id').val($('#cart_item').val())
      } else {
        $('#choice_cart_id').val($('#cart_select').val())
      }
      $('#search').submit()
    }
}

function checkTermOnairDate(){
    let from = $('input[name=distribute_start_time]').val()
    let to = $('input[name=distribute_end_time]').val()
    from = new Date(from).getTime() / 1000
    to = new Date(to).getTime() / 1000
    if(from > to) {
      return false
    }
    return true
}

function isYYYYMMDD(str){
    str = str.replace(/-/g , "" ) ;
    if(str==null || str.length != 8 || isNaN(str)){
      return false;
    }
    let y = parseInt(str.substr(0,4));
    let m = parseInt(str.substr(4,2)) -1;
    let d = parseInt(str.substr(6,2));
    let dt = new Date(y, m, d);
  
    return (y == dt.getFullYear() && m == dt.getMonth() && d == dt.getDate());
}

function errNotify(msgs){
    $.notify({message: msgs.join('<br>')},{type: 'danger'})
}

function initCartInfo(selector) {
    tippy(selector, {
      delay: 100,
      size: 'large',
      duration: 500,
      animation: 'scale',
      allowHTML: true,
      placement: 'left',
      onShow: function(instance) {
        $.get('/agency/cu/api/cart/' + $(selector).val(), {}).done(function(res) {
            let contents = [];

              if(res.price == 0) {
                contents.push($("<p>", { text:'カート内にCU商品はありません'}).html());
              } else {
                contents.push($("<p>", { text:'カート内合計金額(千円): '+res.price}).html());
                contents.push($("<p>", { text:'カート内CU商品本数: '+res.count}).html());
                
              }
              instance.setContent('<span style="font-size:1.4em; text-align:left">' + contents.join('<br>')+'</span>')
        })
      }
    });
}

function fixOnairDate (enable_from, enable_to, datepicker_from, datepicker_to) {
    // onairDateが有効か確認
    let enableMinDate = new Date(enable_from.text().replace(/\-/, "/"))
    let enableMaxDate = new Date(enable_to.text().replace(/\-/, "/"))
    
    let onairDateFromDate = new Date(datepicker_from.val().replace(/\-/, "/"))
    let onairDateToDate = new Date(datepicker_to.val().replace(/\-/, "/"))
    if(onairDateFromDate.toString() === "Invalid Date" || onairDateFromDate > enableMaxDate || onairDateFromDate < enableMinDate) {
        datepicker_from.datepicker('setDate', [enableMinDate.getFullYear(), enableMinDate.getMonth() + 1, + enableMinDate.getDate()].join('-'));
    }
    if(onairDateToDate.toString() === "Invalid Date" || onairDateToDate > enableMaxDate || onairDateToDate < enableMinDate) {
        datepicker_to.datepicker('setDate', [enableMaxDate.getFullYear(), enableMaxDate.getMonth() + 1, + enableMaxDate.getDate()].join('-'));
    }
}

function enableBtnSearch () {
      const btnSearch = ($('#search_menu').hasClass('in')) ? $('#btn_search_lower') : $('#btn_search_upper');
      btnSearch.css("cssText", "color: #fff !important; pointer-events: auto; padding: 0 30px; border-radius: 16px;");
      btnSearch.prop("disabled", false);
}

function disableBtnSearch () {
    const btnSearch = ($('#search_menu').hasClass('in')) ? $('#btn_search_lower') : $('#btn_search_upper');
    btnSearch.css("cssText", "color: #a6a6a6 !important; pointer-events: none; padding: 0 30px; border-radius: 16px;");
    btnSearch.prop("disabled", true);
}
