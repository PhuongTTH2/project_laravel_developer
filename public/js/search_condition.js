const default_commercial_length_not_bs = '15';
function urlParam(name){
    let results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null){
       return null;
    }
    else {
       return decodeURI(results[1]) || 0;
    }
}
function errSystem(){
  errNotify(['・システムエラーが発生しました。管理者にお問い合わせください。'])
}
function checkTargetGroupCodeByRate(params){
  let result = [];
  if(params['rate_type_ids'].length > 0) {
    $.ajax({
      url : "/agency/api/check_target_group",
      type : "get",
      data: $.extend({}, {'onair_date_from': $('#onair_date_from').val(), 'onair_date_to': $('#onair_date_to').val()}, params),
      async: false,
      success : function(data) {
        result["result"] = data.result;
      },
      error: function(jqXHR) {
        if (jqXHR.status == 504) {
            //Gateway Time-out
            result["result"] = false;
            result["msg"] = "・サーバに接続できませんでした。しばらく経ってからアクセスしてください。";
        }
        else if (jqXHR.status == 0) {
            // ネットワーク切断時のエラー
            result["result"] = false;
            result["msg"] = "・サーバに接続できませんでした。しばらく経ってからアクセスしてください。";
        }
        else if (jqXHR.status >= 500) {
            // 5XX 系統のエラー
            result["result"] = false;
            result["msg"] = "・サーバに接続できませんでした。しばらく経ってからアクセスしてください。";
        }
        else {
           errSystem() 
        }
      }
   });
  }
  return result
}

function checkTermOnairDate(){
  let from = $('#onair_date_from').val()
  let to = $('#onair_date_to').val()
  from = new Date(from).getTime() / 1000
  to = new Date(to).getTime() / 1000
  if(from > to) {
    return false
  }
  return true
}

function initSelectBox(elm){
  elm.css({'color': ''}).empty()
}
function alertSelectBox(elm){
  elm.css({'color': 'red'})
}

function isDecimal(val){
  return (val.match(/^(-?[0-9]+\.)?[0-9]+$/))
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

function valid(){

  let msgs = []
  let from = $('#onair_date_from').val()
  let to = $('#onair_date_to').val()
  let isOkOnairDate = true

  if(!from.length || !to.length){
    msgs.push('・セールス枠期間が指定されていません。')
    isOkOnairDate = false
  } else {
    if(!isYYYYMMDD(from) || !isYYYYMMDD(to)){
      msgs.push('・セールス枠期間の期間に誤りがあります。')
      isOkOnairDate = false
    }

    if(!checkTermOnairDate()){
      msgs.push('・セールス枠期間の期間に誤りがあります。')
      isOkOnairDate = false
    }

    if(isMonthOver(from, to)){
      msgs.push('・月を跨いでの検索は不可です。')
      isOkOnairDate = false
    }
  }

  let ids = [];
  if($('.pt_sb_codes').length){
    ids = getCheckBoxVal('.pt_sb_codes')
    if(!ids.length) {
      msgs.push('・PT/SBが選択されていません。')
    }
  }
  if($('.rate_type_ids').length && $('.rate_type_ids').attr('type') == 'checkbox'){
    ids = getCheckBoxVal('.rate_type_ids')
    if($('#rate_rating').length && $('#cost_rate_rating').length) {
      if($('#rate_rating').val().length || $('#cost_rate_rating').val().length) {
        if(!$('#rate_type_id_1:checked').length) {
          msgs.push('・集計率区分('+$('.rate_str_1:eq(0)').text()+')と絞込み条件が一致していません。')
        }
      }
    }

    if($('#rate_pc7').length && $('#cost_rate_pc7').length) {
      if($('#rate_pc7').val().length || $('#cost_rate_pc7').val().length) {
        if(!$('#rate_type_id_2:checked').length) {
          msgs.push('・集計率区分('+$('.rate_str_2:eq(0)').text()+')と絞込み条件が一致していません。')
        }
      }
    }
  }

  if($('.day_of_week_ids').length){
    ids = getCheckBoxVal('.day_of_week_ids')
    if(!ids.length) {
      msgs.push('・曜日が選択されていません。')
    }
  }

  if($('.rate_type_ids').length){
    ids = getCheckBoxVal('.rate_type_ids')
    if(!ids.length) {
      msgs.push('・集計率区分が選択されていません。')
    }
  }


  if($('.callsign').length){
    ids = getSelectBoxVal('.callsign')
    if(!ids.length) {
      msgs.push('・放送局が選択されていません。')
    }
  }

  if ($('#cost_rate_rating').length) {
    if($('#cost_rate_rating').val().length){
      if(!isDecimal($('#cost_rate_rating').val())){
        msgs.push('・パーコスト'+$('.rate_str_1:eq(0)').text()+'には整数もしくは少数を入力してください。')
      }
    }
  }

  if ($('#cost_rate_pc7').length) {
    if($('#cost_rate_pc7').val().length){
      if(!isDecimal($('#cost_rate_pc7').val())){
        msgs.push('・パーコスト'+$('.rate_str_2:eq(0)').text()+'には整数もしくは少数を入力してください。')
      }
    }
  }

  if ($('#rate_rating').length) {
    if($('#rate_rating').val().length){
      if(!isDecimal($('#rate_rating').val())){
        msgs.push('・'+$('.rate_str_1:eq(0)').text()+'には整数もしくは少数を入力してください。')
      }
    }
  }
  if ($('#rate_pc7').length) {
    if($('#rate_pc7').val().length){
      if(!isDecimal($('#rate_pc7').val())){
        msgs.push('・'+$('.rate_str_2:eq(0)').text()+'には整数もしくは少数を入力してください。')
      }
    }
  }

  if ($('#targets').length) {
    if($('#targets').val() == -1){
      //msgs.push('・特性が設定されていません。')
    }
  }

  if(isOkOnairDate) {
    if($('.day_of_week_ids').length) {
      let converts = {
        0: 6,
        1: 0,
        2: 1,
        3: 2,
        4: 3,
        5: 4,
        6: 5,
      }
      let onairDateFrom = new Date($('#onair_date_from').val())
      let onairDateTo = new Date($('#onair_date_to').val())

      ids = getCheckBoxVal('.day_of_week_ids')
      let termDay = Math.ceil((onairDateTo - onairDateFrom) / 86400000);
      let weeks = []
      if (termDay <= 7) {
        do{
          weeks.push(String(converts[onairDateFrom.getDay()]))
          onairDateFrom.setDate(onairDateFrom.getDate() + 1)
        }while (onairDateFrom.getTime() <= onairDateTo.getTime())
      }
      if (weeks.length && ids.length) {
        let duplications = weeks.concat(ids).filter(function (x, i, self) {
          return self.indexOf(x) !== self.lastIndexOf(x);
        });
        if (!duplications.length) {
          msgs.push('・指定した想定タイムテーブルの曜日がCM枠のセールス枠期間内に含まれていません。')
        }
      }
    }
  }
  
  if ($('#commercial_length_bs').is(':visible')) {
      // BSの場合
        const commercial_length_bs = ["15", "30", "60", "90", "120", "180", "240", "300"];
        var isSellectLength = false
        commercial_length_bs.map(function (num) {
            let value = $('[name="commercial_length_' + num + '_checkBox"]').val();
            if (value == 1) {
                isSellectLength = true
            }
        });
        if (isSellectLength == false) {
            msgs.push('・枠秒数が選択されていません。')
        }
  }

  let result = checkTargetGroupCodeByRate(getApiCommonParams())
  if (("result" in result) && result["result"] === false) {
      if ("msg" in result) {
          msgs.push(result["msg"])
      }
      else {
          msgs.push('・ライセンスに無い特性グループが選択されています。')
      }
  }

  if (msgs.length) {
      errNotify(msgs)
      return false
  }
  return true
}
function getElement(selector){
  if($('#current_cart_id').length){
    return $($('.conditions_cart_' + $('#current_cart_id').val())).find(selector)
  } else {
    return $(selector)
  }
}
function changeConditionsCart(){
  let params = getApiCommonParamsCart()
  //params.cart_id = cartId
  loading("show");
  $.get('/agency/api/change_conditions', $.extend({}, { type: 'cart'}, params),
  function(data){rateTypeIds
    changeDataTypes(data)
    changeRateTypes(data)
    changeTargetGroups(data)
    changeTargets(data)
    changePeriodTerm(data)
  }).always(function() {
      loading("hide")
  })
}

function errNotify(msgs){
  $.notify({message: msgs.join('<br>')},{type: 'danger'})
}

function getApiCommonParamsCart(){


  let cartId = $('#current_cart_id').val()
  let baseSelector = $('.conditions_cart_' + cartId)

  let rateTypeIds = getRateTypesCart(baseSelector)
  if(!rateTypeIds.length){
    rateTypeIds = [1,2]
  }

  return {
    commercial_year_months: null,
    area_id: $(baseSelector).find('#area').val(),
    callsigns: null,
    data_type_id: $(baseSelector).find('#data_type_id').val(),
    rate_type_ids: rateTypeIds,
    aggregate_type_id: $(baseSelector).find('#aggregate_type_id').val(),
    target_group_code: $(baseSelector).find('#target_groups').val(),
    target_code: $(baseSelector).find('#targets').val(),
    period_type_id: $(baseSelector).find('#period_type_id').val(),
    cart_id: cartId,
    planning: false,
  }
}

function getApiCommonParams(){
  let commercialYearMonths = []
  let onairDateFroms = null
  let onairDateTos = null

  if($('#onair_date_from').val().length){
    onairDateFroms = $('#onair_date_from').val().split('-')
    commercialYearMonths.push(onairDateFroms[0]+onairDateFroms[1])
  }
  if($('#onair_date_to').val().length){
    onairDateTos = $('#onair_date_to').val().split('-')
    commercialYearMonths.push(onairDateTos[0]+onairDateTos[1])
  }

  let rateTypeIds = getRateTypes()
  if(!rateTypeIds.length){
   // rateTypeIds = [1,2]
  }

  let paramCallsigns = []
  let selCallsign = $('input[name="callsign"]:checked').val() || $('input[name="callsign[]"]:checked').map(function() { return $(this).val() }).get()
  if(selCallsign instanceof Array){
    paramCallsigns = selCallsign
  } else {
    paramCallsigns.push(selCallsign)
  }
  let cartId = null
  if ($('#current_cart_id').length) {
    cartId = $('#current_cart_id').val()
  }
  return {
    commercial_year_months: commercialYearMonths,
    area_id: $('#area').val(),
    callsigns: paramCallsigns,
    data_type_id: $('#data_type_id').val(),
    rate_type_ids: rateTypeIds,
    aggregate_type_id: $('#aggregate_type_id').val(),
    target_group_code: $('#target_groups').val(),
    target_code: $('#targets').val(),
    period_type_id: $('#period_type_id').val(),
    onair_date_from: $('#onair_date_from').val(),
    onair_date_to: $('#onair_date_to').val(),
    cart_id: cartId,
    kind_cm: urlParam('kind_cm'),
    planning: false,
  }
}

function getCartCommonParams(){
  let period_from_date = null
  let period_to_date = null
  if($('#periodTerm').length) {
    periods = $('#periodTerm').val().split('_')
    period_from_date = periods[0]
    period_to_date = periods[1]
  }
  rateTypeIds = getRateTypeIds()
  return {
    'area_id': $('#area').val(),
    'data_type_id': $('#data_type_id').val(),
    'rate_type_id_1': Number($.inArray("1", rateTypeIds) != -1),
    'rate_type_id_2': Number($.inArray("2", rateTypeIds) != -1),
    'rate_type_ids': rateTypeIds,
    'aggregate_type_id': $('#aggregate_type_id').val(),
    'target_group_code': $('#target_groups').val(),
    'target_code': $('#targets').val(),
    'period_type_id': $('#period_type_id').val(),
    'period_from_date': period_from_date,
    'period_to_date': period_to_date,
    'population_type_id': $('#population_type_id').val(),
  }
}

function getRateTypeIds(){
  return $('.rate_type_ids:checked').map(function(){ return $(this).val() }).get()
}

function getCheckBoxVal(selector){
  let checks = $(selector+':checked')
  ids = []
  if(checks.length){
    ids = checks.map(function(){
      return $(this).val();
    }).get();
  }
  return ids
}

function getSelectBoxVal(selector){
  let checks = $(selector+' option:selected')
  ids = []
  if(checks.length){
    ids = checks.map(function(){
      return $(this).val();
    }).get();
  }
  return ids
}


function getRateTypes(){
  let checks = $('.rate_type_ids:checked')
  ids = []
  if(checks.length){
    ids = checks.map(function(){
      return $(this).val();
    }).get();
  }
  return ids
}

function getRateTypesCart(baseSelector){
  let checks = $(baseSelector).find('.rate_type_ids:checked')
  ids = []
  if(checks.length){
    ids = checks.map(function(){
      return $(this).val();
    }).get();
  }
  return ids
}

function changeYearMonthPrograms(data){
  let elm = $('#year_month')
  initSelectBox(elm)

  if (data.futureProgramMonths === null || !data.futureProgramMonths.length){
    elm.append(
      $('<option/>').val(0).text('-')
    )
  } else {
    if(data.futureProgramMonths && data.futureProgramMonths.length){
      jQuery.each(data.futureProgramMonths, function(index, d) {
        elm.append(
          $('<option/>').val(d.year_month_code).text(d.year_month_str)
        )
      })
    }
  }
}
function changeBroadcasters(data){
  $('.callsign_select').remove();
  let type = (location.href.indexOf("program_guide") > -1) ? "radio" : "checkbox";
  let name = (type === "radio")? "callsign" : "callsign[]";
  if(data.broadcasters) {
    jQuery.each(data.broadcasters, function(index, d) {
      let callsign = $("<input>", {
                                    type: type,
                                    name: name,
                                    id: "callsign_" + d.callsign,
                                    "class": "callsign_select",
                                    value: d.callsign
                                  });
      let callsign_label = $("<label>", {
                                          for: "callsign_" + d.callsign,
                                          class: "callsign_select",
                                        });
      let callsign_label_text = $('<span>' + d.broadcaster_name + '</span>');
      $('#callsign_wrapper').append(callsign);
      $('#callsign_wrapper').append(callsign_label);
      callsign_label_text.appendTo(callsign_label);
    })
  } else {
    let callsign = $("<input>", {
                                  type: type,
                                  name: name,
                                  id: "callsign_none",
                                  "class": "callsign_select",
                                  value: "-1"
                                });
    let callsign_label = $("<label>", {
                                        for: "callsign_none",
                                        class: "callsign_select",
                                      });
    let callsign_label_text = $('<span>放送局は存在しません</span>');
    $('#callsign_wrapper').append(callsign);
    $('#callsign_wrapper').append(callsign_label);
    callsign_label_text.appendTo(callsign_label);
  }
  if (type === "radio") {
      $('input[name="' + name + '"]:eq(0)').prop('checked', true);
  } else {
    for (let i = 0; i < $('input[name="' + name + '"]').length; i++) {
      $('input[name="' + name + '"]').eq(i).prop('checked', true);
    }
  }
}

function changeDataTypes(data, selectedId){
  let elm = getElement('#data_type_id')
  initSelectBox(elm)

  if(data.dataTypes && Object.keys(data.dataTypes).length > 0){
    jQuery.each(data.dataTypes, function(index, d) {
      elm.append(
        $('<option/>').val(d.data_type_id).text(d.display_name).attr('selected', ((selectedId != null) ? (d.data_type_id == selectedId) : (index === 0)))
      )
    })
  } else {
    elm.append(
      $('<option/>').val(-1).text('指定条件でのデータ種類は存在しません')
    )
  }
}

function changeRateTypes(data, selectedId){

  let elm = getElement('#rate_types')
  initSelectBox(elm)
  $('.refine_rate_type').css('display', 'none')

  if(data.rateTypes && Object.keys(data.rateTypes).length > 0){

    let checkType = 'radio';

    jQuery.each(data.rateTypes, function(index, d) {
      let key = 'rate_type_id_'+d.rate_type_id
      let input = $('<input/>').attr({
        'id': key,
        'type': checkType,
        'class': 'rate_type_ids',
        'name': 'rate_type_ids[]'
      }).val(d.rate_type_id)

      if ((selectedId != null) ? (d.rate_type_id == selectedId) : (index === 0)) {
          input.attr({'checked': 'checked'});
      }

      let label = $('<label/>').attr({
        'for': key,
        'class': 'rate_type_ids',
        'name': 'rate_type_ids[]',
      }).text(d.display_name)
      elm.append(input)
      elm.append(label)

      $('.refine_rate_type_' + d.rate_type_id).css('display', '')
      $('#refine_conditions').find('input').val(null)
    });

    if (getElement('#data_type_id').val() !== "4") {
        if(data.rateTypeStr != null) {
            $('.rate_str_1').text(data.rateTypeStr[0]);
            $('.rate_str_2').text(data.rateTypeStr[1]);
        }
    } else {
        $('.rate_str_1').text(data.rateTypes[0].display_name);
    }

    dispSearchConditionRateInput()
  }
}
function changeTargetGroups(data){
  let elm = getElement('#target_groups')
  initSelectBox(elm)
  if(data.targetGroups && Object.keys(data.targetGroups).length > 0){
    jQuery.each(data.targetGroups, function(index, d) {
      elm.append(
        $('<option/>').val(d.target_group_code).text(d.target_group_name)
      )
    })
  } else {
    elm.append(
      $('<option/>').val(-1).text('指定条件での特性グループは存在しません')
    )
  }
}
function changeTargets(data){
  let elm = getElement('#targets')
  initSelectBox(elm)
  if(data.targets && Object.keys(data.targets).length > 0){
    jQuery.each(data.targets, function(index, d) {
      elm.append(
        $('<option/>').val(d.target_code).text(d.target_name)
      )
    })
  } else {
    elm.append(
      $('<option/>').val(-1).text('指定条件での特性は存在しません')
    )
  }
}

function changePeriodTerm(data){
  let elm = getElement('#periodTerm')
  initSelectBox(elm)
  if(!data.periodTerms || !data.periodTerms.length){
    elm.append(
      $('<option/>').val(-1).text('指定条件での集計対象期間は存在しません。')
    )
  } else{
    jQuery.each(data.periodTerms, function(index, d) {
      elm.append(
        $('<option/>').val(d.period_from_date_ym+'_'+d.period_to_date_ym).text(d.period_string)
      )
    })
  }
}

function changeAggregateTypes(data){
  let elm = getElement('#aggregate_type_id')
  initSelectBox(elm)
  if(data.aggregateTypes && Object.keys(data.aggregateTypes).length > 0){
    jQuery.each(data.aggregateTypes, function(index, d) {
      elm.append(
        $('<option/>').val(d.aggregate_type_id).text(d.display_name)
      )
    })
  } else {
    elm.append(
      $('<option/>').val(-1).text('指定条件での集計率取得方法は存在しません')
    )
  }
}

function changePeriodTypes(data){
  let elm = getElement('#period_type_id')
  initSelectBox(elm)
  if(data.periodTypes && Object.keys(data.periodTypes).length > 0){
    jQuery.each(data.periodTypes, function(index, d) {
      elm.append(
        $('<option/>').val(d.period_type_id).text(d.display_name)
      )
    })
  } else {
    elm.append(
      $('<option/>').val(-1).text('指定条件での集計区分は存在しません')
    )
  }
}

function changeEnableOnairDates(data){
  let elm = getElement('#enable_onair_dates')
  elm.text(null)
  let selectorName = '#onair_date_from, #onair_date_to';

  //初期化
  $(selectorName).datepicker('setDaysOfWeekDisabled', [0,1,2,3,4,5,6]);
  $(selectorName).datepicker('setDate', null);

  if (data.enableOnairDates === null) {
    elm.text('無し');
  } else if(!data.enableOnairDates.min_onair_date || !data.enableOnairDates.max_onair_date){
    elm.text('無し')
  } else{
    let minOnairDate = data.enableOnairDates.min_onair_date;
    let maxOnairDate = data.enableOnairDates.max_onair_date;

    elm.text([minOnairDate, maxOnairDate].join('～'));
    $('#onair_date_from, #onair_date_to').datepicker('setStartDate', minOnairDate);
    $('#onair_date_from, #onair_date_to').datepicker('setEndDate', maxOnairDate);

    if(data.positionTerms != null) {
      let from = new Date(data.positionTerms.from.date.replace(/\-/, "/"));
      let to = new Date(data.positionTerms.to.date.replace(/\-/, "/"));
      $('#onair_date_from').datepicker('setDate', [from.getFullYear(), from.getMonth() + 1, + from.getDate()].join('-'));
      $('#onair_date_to').datepicker('setDate', [to.getFullYear(), to.getMonth() + 1, + to.getDate()].join('-'));
    }
    $(selectorName).datepicker('setDaysOfWeekDisabled', []);
  }
}

function changeDefaultSelect(data) {
    if (data.default_target) {
        if (data.default_target.data_type_id) {
            getElement('#data_type_id').val(data.default_target.data_type_id);
        }
        if (data.default_target.target_group_code) {
            getElement('#target_groups').val(data.default_target.target_group_code);
        }
        if (data.default_target.target_code) {
            getElement('#targets').val(data.default_target.target_code);
        }
    } else {
        if($('#data_type_id>option').length){
            getElement('#data_type_id').val($('#data_type_id>option').get(0).value);
        }
        getElement('#target_groups').val($('#target_groups>option').get(0).value);
        getElement('#targets').val($('#targets>option').get(0).value);
    }
}

function changeOnairDate(type){
    loading("show");
    $.ajax({
        url: "/agency/api/change_conditions",
        type: 'GET',
        data: $.extend({}, { 'type': type}, getApiCommonParams()),
//        timeout: 120000,
        dataType: 'json',
    }).done(function (data) {
        isOnairDateForcus = false
        //set onair date
        if(data.positionTerms != null) {
          let from = new Date(data.positionTerms.from.date.replace(/\-/, "/"));
          let to = new Date(data.positionTerms.to.date.replace(/\-/, "/"));
          $('#onair_date_from').datepicker('setDate', [from.getFullYear(), from.getMonth() + 1, + from.getDate()].join('-'));
          $('#onair_date_to').datepicker('setDate', [to.getFullYear(), to.getMonth() + 1, + to.getDate()].join('-'));
        }

        isOnairDateForcus = true

        //attach change event
        $('#onair_date_from').change();
    }).fail(function (data) {
        loading("hide")
        if (data && data.statusText == "timeout") {
            errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
        } else if (data && data.status == 0) {
            errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
        } else if (data && data.status >= 500) {
            errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
        } else if (data && data.status == 422 && data.responseJSON) {
            errNotify([data.responseJSON.errMsg]);
        }
    })
}

function getDateObject(str){
  str = str.replace(/-/g , "" ) ;
  if(str==null || str.length != 8 || isNaN(str)){
    return false;
  }
  let y = parseInt(str.substr(0,4));
  let m = parseInt(str.substr(4,2)) -1;
  let d = parseInt(str.substr(6,2));
  let dt = new Date(y, m, d);
  return dt;
}

function isMonthOver(from, to){
  let dtFrom = getDateObject(from);
  let dtTo = getDateObject(to);
  return (dtFrom.getFullYear()+dtFrom.getMonth() != dtTo.getFullYear()+dtTo.getMonth());
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

function dispSearchConditionRateInput(){
    let rateTypeIds = $('input.rate_type_ids').map(function(){
        return $(this).val();
    }).get();

    $('.rate_rating_suffix').hide();

    // for TVI
    $('.per_cost').hide();
    $('.rate_rating_suffix').hide();
    if($('#data_type_id').val() != 4) {
        $('.per_cost').show();
        $('.rate_rating_suffix').show();
    }
}

function changRateTypeString(){
    let id = $('input:radio:checked.rate_type_ids').val();
    $('.rate_str_1').text(
        $('label[for=rate_type_id_' + id + ']').text()
    );
}

function togglePopulation () {
    if($("#data_type_id").val() == 1) {
        $('.block_population').show(500);
    }else{
        $('.block_population').hide(500);
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

function checkAtBS(area_id, areas, request, mounted, cm_not_bs_default_length) {
  const commercial_length_bs = ["15", "30", "60", "90", "120", "180", "240", "300"];
  const commercial_length_not_bs = ["15", "30", "60"];
  const area_filtered = areas.filter(function(obj) {
      return (obj.id == area_id);
  });
  let area = area_filtered[0];
  if (area.view_bs_area === 1) {
      enableAtBS(commercial_length_bs, commercial_length_not_bs, request, mounted);
  } else {
      cm_not_bs_default_length = ((cm_not_bs_default_length != null) && (commercial_length_not_bs.indexOf(String(cm_not_bs_default_length)) > -1)) ? String(cm_not_bs_default_length) : default_commercial_length_not_bs;
      disableAtBS(commercial_length_bs, commercial_length_not_bs, request, mounted, cm_not_bs_default_length);
  }
}

function disableAtBS(commercial_length_bs, commercial_length_not_bs, request, mounted, cm_not_bs_default_length) {

  commercial_length_not_bs.map(function(num, index) {
    const commercial_length = 'commercial_length_' + num + '_radio';
    const program_guide_defalut_commercial_length = 'commercial_length_' + cm_not_bs_default_length + '_radio';

    // 想定タイムテーブル画面の場合、局ごとのデフォルト秒数を使用する
    const program_guide = '/agency/program_guide'
    const path = location.pathname ;

    if (mounted && commercial_length in request && request[commercial_length] == "1") {
        // 検索時(指定秒数のラジオボタン)
        $('input:radio[name="commercial_length"]:eq(' + index + ')').prop('checked', true);
        $('[name="' + commercial_length + '"]').val('1');
    } else if ((mounted && !(commercial_length in request)) || !mounted) {
        // 非検索時(サイドメニュー等からの遷移)、または地区変更時
        if(program_guide === path){
            // 地区変更時は放送局を取得し直すため、下記処理の後にonchangeで再度変更する
            let checked = (commercial_length === program_guide_defalut_commercial_length) ? true : false;
            let val = (commercial_length === program_guide_defalut_commercial_length) ? '1' : '0';
            $('input:radio[name="commercial_length"]:eq(' + index + ')').prop('checked', checked);
            $('[name="' + commercial_length + '"]').val(val);
        } else {
            checked = (index == 0) ? true : false;
            val = (index == 0) ? '1' : '0';
            $('input:radio[name="commercial_length"]:eq(' + index + ')').prop('checked', checked);
            $('[name="' + commercial_length + '"]').val(val);
        }
    } else {
      // 検索時(指定秒数ではないラジオボタン)
        if(program_guide === path){
            if($('input:radio[name="commercial_length"]:eq(1)').is(':checked')){
                return false;
            } else {
                $('input:radio[name="commercial_length"]:eq(' + index + ')').prop('checked', false);
                $('[name="' + commercial_length + '"]').val('0');
            }
        } else {
            $('input:radio[name="commercial_length"]:eq(' + index + ')').prop('checked', false);
            $('[name="' + commercial_length + '"]').val('0');
        }
    }
  });

  $('input:checkbox[name="commercial_length"]').prop('checked', false);
  commercial_length_bs.map(function(num) {
    $('[name="commercial_length_' + num + '_checkBox"]').val('0');
  });

  $('#commercial_length_not_bs').show();
  $('#commercial_length_bs').hide();

  const elemGyokyoPopulations = $('select#population_type_id option[value="1"]');
  const elemExEstimatePopulations = $('select#population_type_id option[value="3"]');
  if (elemGyokyoPopulations.parents().attr("class") == "wrap") {
      elemGyokyoPopulations.unwrap();
  }

  if (elemExEstimatePopulations.parents().attr("class") !== "wrap") {
      elemExEstimatePopulations.wrap('<span class="wrap">');
  }
}

function enableAtBS(commercial_length_bs, commercial_length_not_bs, request, mounted) {
  $('input:radio[name="commercial_length"]').prop('checked', false);
  commercial_length_not_bs.map(function(num) {
    $('[name="commercial_length_' + num + '_radio"]').val('0');
  });

  commercial_length_bs.map(function(num, index) {
    const commercial_length = 'commercial_length_' + num + '_checkBox';
    if (mounted && commercial_length in request && request[commercial_length] == "1") {
      $('[name="' + commercial_length + '"]').val('1');
      $('input:checkbox[name="commercial_length"]:eq(' + index + ')').prop('checked', true);
    } else if (mounted && !(commercial_length in request)) {
      $('[name="' + commercial_length + '"]').val('1');
      $('input:checkbox[name="commercial_length"]:eq(' + index + ')').prop('checked', true);
    } else if (!mounted) {
      $('[name="' + commercial_length + '"]').val('1');
      $('input:checkbox[name="commercial_length"]:eq(' + index + ')').prop('checked', true);
    } else {
      $('[name="' + commercial_length + '"]').val('0');
      $('input:checkbox[name="commercial_length"]:eq(' + index + ')').prop('checked', false);
    }
  });
  $('#commercial_length_not_bs').hide();
  $('#commercial_length_bs').show();

  const elemGyokyoPopulations = $('select#population_type_id option[value="1"]');
  const elemExEstimatePopulations = $('select#population_type_id option[value="3"]');
  if (elemExEstimatePopulations.parents().attr("class") == "wrap") {
      elemExEstimatePopulations.unwrap();
  }

  if (elemGyokyoPopulations.parents().attr("class") !== "wrap") {
      elemGyokyoPopulations.wrap('<span class="wrap">');
  }
}

function callsignChanged () {
  loading("show");
  disableBtnSearch()
  isOnairDateForcus = false
  let params = (!$('#current_cart_id').length) ? getApiCommonParams() : getApiCommonParamsCart()
  $.ajax({
    url: "/agency/api/change_conditions",
    type: 'GET',
    data: $.extend({}, { type: 'callsign'}, params),
//    timeout: 10000,
    dataType: 'json',
    success: function(data) {
            changeEnableOnairDates(data)
            changeYearMonthPrograms(data)
            changeDataTypes(data)
            changeRateTypes(data)
            changePeriodTerm(data)
            changeAggregateTypes(data)
            changeTargetGroups(data)
            changeTargets(data)
            changePeriodTypes(data)
            changeDefaultSelect(data)
            
            setProgramGuideCmDefaultLength(data)
    }
  }).done(function() {
    enableBtnSearch()
    togglePopulation();
  }).always(function() {
      loading("hide")
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
  })
}

function fixOnairDate () {
  // onairDateが有効か確認
  let enableOnairDatesTxt = $('#enable_onair_dates').text().trim()
  let enableOnairDatesArr = enableOnairDatesTxt.split('～')
  let enableMinDate = new Date(enableOnairDatesArr[0].replace(/\-/, "/"))
  let enableMaxDate = new Date(enableOnairDatesArr[1].replace(/\-/, "/"))
  let onairDateFromDate = new Date($('#onair_date_from').val().replace(/\-/, "/"))
  let onairDateToDate = new Date($('#onair_date_to').val().replace(/\-/, "/"))
  if(onairDateFromDate.toString() === "Invalid Date" || onairDateFromDate > enableMaxDate || onairDateFromDate < enableMinDate) {
    $('#onair_date_from').datepicker('setDate', [enableMinDate.getFullYear(), enableMinDate.getMonth() + 1, + enableMinDate.getDate()].join('-'));
  }
  if(onairDateToDate.toString() === "Invalid Date" || onairDateToDate > enableMaxDate || onairDateToDate < enableMinDate) {
    $('#onair_date_to').datepicker('setDate', [enableMaxDate.getFullYear(), enableMaxDate.getMonth() + 1, + enableMaxDate.getDate()].join('-'));
  }
}

function recallOnairDateChangeConditionsApi (params) {
  $.ajax({
      url: "/agency/api/change_conditions",
      type: 'GET',
      data: $.extend({}, {type: 'onair_date'}, params),
//        timeout: 120000,
      dataType: 'json',
      success: function (data) {
          let dataTypeId = $('#data_type_id').val()
          let selectedDataTypeId = null;

          if((dataTypeId != null) && data.dataTypes){
              jQuery.each(data.dataTypes, function(index, d1) {
                  if (d1.data_type_id == dataTypeId) {
                      selectedDataTypeId = d1.data_type_id;
                      return false
                  }
              })
          }

          changeDataTypes(data, selectedDataTypeId)
          changeRateTypes(data)
          changePeriodTypes(data)
          changeAggregateTypes(data)
          changePeriodTerm(data)
          changeTargetGroups(data)
          changeTargets(data)
      }
  }).done(function () {
      enableBtnSearch()
  }).fail(function (data) {
      if (data && data.statusText == "timeout") {
          errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
      } else if (data && data.status == 0) {
          errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
      } else if (data && data.status >= 500) {
          errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
      }
  }).always(function() {
      loading("hide")
  })
}

function setProgramGuideCmDefaultLength (data) {
  // 想定タイムテーブル画面の場合、局ごとのデフォルト秒数を使用する
  if (location.href.indexOf("program_guide") > -1) {
      let selCallsign = $('input[name="callsign"]:checked').val()

      if((selCallsign != null) && data.broadcasters) {
          jQuery.each(data.broadcasters, function(index, d) {
              if ((selCallsign === d.callsign) && ($('#commercial_length_not_bs').css('display') != 'none')) {
                  const commercial_length_not_bs = ["15", "30", "60"];
                  let cm_default_length = (commercial_length_not_bs.indexOf(String(d.default_commercial_length)) > -1) ? String(d.default_commercial_length) : default_commercial_length_not_bs;
                  commercial_length_not_bs.map(function(num, index) {
                      const commercial_length = 'commercial_length_' + num + '_radio';
                      const program_guide_defalut_commercial_length = 'commercial_length_' + cm_default_length + '_radio';

                      let checked = (commercial_length === program_guide_defalut_commercial_length) ? true : false;
                      let val = (commercial_length === program_guide_defalut_commercial_length) ? '1' : '0';
                      $('input:radio[name="commercial_length"]:eq(' + index + ')').prop('checked', checked);
                      $('[name="' + commercial_length + '"]').val(val);
                });
              }
          })
      }
  }
}

let isOnairDateForcus = false
$(function(){

  $(document).on("focus", "#onair_date_from, #onair_date_to", function(e){
    isOnairDateForcus = true
  })

  $(document).on("blur", "#onair_date_from, #onair_date_to", function(e){
    fixOnairDate()
  })

  $("#onair_date_from, #onair_date_to").keypress(function(e){
    console.log(e)
    if (e.key === "Enter") fixOnairDate()
  })

  $(document).on("change", "#onair_date_from, #onair_date_to", function(e){
    if (!isOnairDateForcus) {
      return false
    }
    loading("show");
    disableBtnSearch()
    let isRecallApiForAssPlus = false
    let params = (!$('#current_cart_id').length) ? getApiCommonParams() : getApiCommonParamsCart()
    $.ajax({
        url: "/agency/api/change_conditions",
        type: 'GET',
        data: $.extend({}, {type: 'onair_date'}, params),
//        timeout: 120000,
        dataType: 'json',
        success: function (data) {
            if (data.isAssPlus) {
                // 直前枠でも選択済みのデータ種類と集計率区分を維持する
                let dataTypeId = $('#data_type_id').val()
                let rateTypeIds = getRateTypes()
                let rateTypeId = (rateTypeIds.length > 0) ? rateTypeIds[0] : null;
                let selectedDataTypeId = null;
                let selectedRateTypeId = null;

                if((dataTypeId != null) && (rateTypeIds != null) && data.dataTypes){
                    jQuery.each(data.dataTypes, function(index, d1) {
                        if (d1.data_type_id == dataTypeId) {
                            selectedDataTypeId = d1.data_type_id;
                            if (data.rateTypes && Object.keys(data.rateTypes).length > 0) {
                                jQuery.each(data.rateTypes, function(index, d2) {
                                    if (d2.rate_type_id == rateTypeId) {
                                        selectedRateTypeId = d2.rate_type_id;
                                        return false
                                    }
                                })
                            }
                            return false
                        }
                    })
                }
                
                // 集計率区分が存在しない場合、集計区分以下が前回の集計率区分を前提にしているためconditionsを取得し直す
                if((selectedDataTypeId != null) && (selectedRateTypeId == null)) {
                  isRecallApiForAssPlus = true;
                  params['rate_type_ids'] = [];
                  recallOnairDateChangeConditionsApi(params);
                }
                
                if (!isRecallApiForAssPlus) {
                    changeDataTypes(data, selectedDataTypeId)
                    changeRateTypes(data, selectedRateTypeId)
                }
            }
            if (!isRecallApiForAssPlus) {
                changePeriodTypes(data)
                changeAggregateTypes(data)
                changePeriodTerm(data)
                changeTargetGroups(data)
                changeTargets(data)
            }
        }
    }).done(function () {
        if (!isRecallApiForAssPlus) {
            enableBtnSearch()
        }
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
        if (!isRecallApiForAssPlus) {
            loading("hide")
        }
    })
  })


  $(document).on("change", "#area", function(){
    loading("show")
    disableBtnSearch()
    isOnairDateForcus = false
    let params = (!$('#current_cart_id').length) ? getApiCommonParams() : getApiCommonParamsCart()
    if (location.href.indexOf("program_guide") == -1) {
      params = $.extend({
        'multi_callsign': true,
      }, params)
    }
    
    $.ajax({
        url: "/agency/api/change_conditions",
        type: 'GET',
        data: $.extend({}, { type: 'area'}, params),
//        timeout: 10000,
        dataType: 'json',
        success: function (data) {
            changeBroadcasters(data)
            changeYearMonthPrograms(data)
            changeEnableOnairDates(data)
            changeDataTypes(data)
            changeRateTypes(data)
            changeTargetGroups(data)
            changeTargets(data)
            changePeriodTerm(data)
            changeAggregateTypes(data)
            changePeriodTypes(data)
            changeDefaultSelect(data)
            
            setProgramGuideCmDefaultLength(data);
        }
    }).done(function() {
        enableBtnSearch()
        togglePopulation();
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
  })

  $(document).on("change", "input[name='callsign']", function(){
    callsignChanged()
  })

  $(document).on("click", "input[name='callsign[]']", function(event){
    const checked = $('input[name="callsign[]"]:checked').map(function() { return $(this).val() }).get()
    if (checked.length === 0) {
      event.preventDefault()
    } else {
      callsignChanged()
    }
  })

  $(document).on("change", "#data_type_id", function(){
    loading("show")
    let self = this
    disableBtnSearch()
    isOnairDateForcus = false
    let params = (!$('#current_cart_id').length) ? getApiCommonParams() : getApiCommonParamsCart()
    $.ajax({
        url: "/agency/api/change_conditions",
        type: 'GET',
        data: $.extend({}, { type: 'data_type'}, params),
//        timeout: 10000,
        dataType: 'json',
        success: function (data) {
            changeRateTypes(data)
            changeTargetGroups(data)
            changeTargets(data)
            changePeriodTerm(data)
            changeAggregateTypes(data)
            changePeriodTypes(data)
            changRateTypeString();
        }
    }).done(function () {
        enableBtnSearch()
    }).fail(function (data) {
        if (data && data.statusText == "timeout") {
            errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
        } else if (data && data.status == 0) {
            errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
        } else if (data && data.status >= 500) {
            errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
        }  else if (data && data.status == 422 && data.responseJSON) {
            errNotify([data.responseJSON.errMsg]);
        }
    }).always(function() {
        loading("hide")
    })
    togglePopulation();

  })

  $(document).on("change", ".rate_type_ids", function(){
    loading("show");
    disableBtnSearch()
    isOnairDateForcus = false
    let params = (!$('#current_cart_id').length) ? getApiCommonParams() : getApiCommonParamsCart()
    
    $.ajax({
        url: "/agency/api/change_conditions",
        type: 'GET',
        data: $.extend({}, { type: 'rate_type'}, params),
//        timeout: 10000,
        dataType: 'json',
        success: function (data) {
            changePeriodTypes(data)
            changeAggregateTypes(data)
            changeTargetGroups(data)
            changeTargets(data)
            changePeriodTerm(data)
            changRateTypeString();
        }
    }).done(function() {
        enableBtnSearch()
    }).fail(function (data) {
        if (data && data.statusText == "timeout") {
            errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
        } else if (data && data.status == 0) {
            errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
        } else if (data && data.status >= 500) {
            errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
        }  else if (data && data.status == 422 && data.responseJSON) {
            errNotify([data.responseJSON.errMsg]);
        }
    }).always(function() {
        loading("hide")
    })
  })

  $(document).on("change", "#aggregate_type_id", function(){
    loading("show");
    disableBtnSearch()
    isOnairDateForcus = false
    let params = (!$('#current_cart_id').length) ? getApiCommonParams() : getApiCommonParamsCart()
    $.get('/agency/api/change_conditions', $.extend({}, { type: 'aggregate_type'}, params),function(data){
      changePeriodTerm(data)
      changeTargetGroups(data)
      changeTargets(data)
    }).done(function () {
      enableBtnSearch()
    }).always(function() {
        loading("hide")
    })
  })

  $(document).on("change", "#target_groups", function(){
    loading("show");
    disableBtnSearch()
    isOnairDateForcus = false
    let params = (!$('#current_cart_id').length) ? getApiCommonParams() : getApiCommonParamsCart()
    
    $.ajax({
        url: "/agency/api/change_conditions",
        type: 'GET',
        data: $.extend({}, { type: 'taeget_group'}, params),
//        timeout: 10000,
        dataType: 'json',
        success: function (data) {
            changeTargets(data)
        }
    }).done(function() {
        enableBtnSearch()
    }).fail(function (data) {
        if (data && data.statusText == "timeout") {
            errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
        } else if (data && data.status == 0) {
            errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
        } else if (data && data.status >= 500) {
            errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
        }  else if (data && data.status == 422 && data.responseJSON) {
            errNotify([data.responseJSON.errMsg]);
        }
    }).always(function() {
        loading("hide")
    })
  })

  $(document).on("change", "#period_type_id", function(){
    loading("show");
    disableBtnSearch()
    isOnairDateForcus = false
    let rateTypeIds = getRateTypes()
    if(rateTypeIds.length){
      let params = (!$('#current_cart_id').length) ? getApiCommonParams() : getApiCommonParamsCart()
      $.ajax({
          url: "/agency/api/change_conditions",
          type: 'GET',
          data: $.extend({}, { type: 'period_type'}, params),
//          timeout: 10000,
          dataType: 'json',
          success: function (data) {
              changePeriodTerm(data)
              changeAggregateTypes(data)
              changeTargetGroups(data)
              changeTargets(data)
          }
      }).done(function() {
          enableBtnSearch()
      }).fail(function (data) {
          if (data && data.statusText == "timeout") {
              errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
          } else if (data && data.status == 0) {
              errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
          } else if (data && data.status >= 500) {
              errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
          }  else if (data && data.status == 422 && data.responseJSON) {
              errNotify([data.responseJSON.errMsg]);
          }
      }).always(function() {
          loading("hide")
      })
    }
  })

/*
  $(document).on('change', 'input:radio.rate_type_ids', function() {
      let id = $('input:radio:checked.rate_type_ids').val();
      let l = $('label[for=rate_type_id_' + id + ']').text();
      $('.rate_str_1').text(l);
  });
*/
  $("#cart_select").on("change", function() {
    if (parseInt(this.value) !== -1) {
      searchPosition()
    }
  })

  $(".btn_search").on("click", function() {
    searchPosition()
  })

  $(".month-previous").on("click", function(e) {
    changeOnairDate('month-previous');
  });

  $(".month-next").on("click", function(e) {
    changeOnairDate('month-next');
  });

  var chkSearchHight = function () {
    if($('#search_info_lists').length){
      const search_info_list_height = $('#frame_search_info_list').height() || 0;
      const commercial_length_height = $('#frame_commercial_length').height() || 0;
      const future_program_height = $('#frame_future_program').height() || 0;
      let searchHight = search_info_list_height + commercial_length_height + future_program_height + 95;
      if ($('#search_menu').length) {
        $('#search_menu').css('margin-top', searchHight);
      }
    }
  }

  var resizeTimer;
  var interval = 500;
  var userAgent = window.navigator.userAgent;

  // resizeイベント登録
  var evt = document.createEvent('UIEvents');
  evt.initUIEvent('resize', true, false, window, 0);
  window.dispatchEvent(evt);

  // loadイベント登録
  $(document).ready(function() {
    chkSearchHight();
  });

  //リサイズ
  $(window).on('resize', function () {
    if (resizeTimer !== false) {
      clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(function () {
      chkSearchHight();
    }, interval);
  });
  //メニュー開閉
  $("#menu_btn").on("click", function(){
    setTimeout(function () {
      chkSearchHight();
    }, 1000);
  });
  
  dispSearchConditionRateInput();
  changRateTypeString();
  initCartInfo('.cart_items');
  togglePopulation();
})
