let dirUrl = '/' + location.pathname.split("/")[1];
function errSystem(){
  errNotify(['・システムエラーが発生しました。管理者にお問い合わせください。'])
}
function checkTargetGroupCodeByRate(params){
  let result = null
  if(params['rate_type_ids'].length > 0) {
    $.ajax({
      url : dirUrl + "/analyze_all/api/check_target_group",
      type : "get",
      data: $.extend({}, {'onair_date_from': $('#onair_date_from').val(), 'onair_date_to': $('#onair_date_to').val()}, params),
      async: false,
      success : function(data) {
        result = data.results
      },
      error: function() {
        errSystem()
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
    $('#search').submit()
  }
}

function getCheckBoxValTarget(target, selector){
  let checks = $(target).find(selector+':checked')
  ids = []
  if(checks.length){
    ids = checks.map(function(){
      return $(this).val();
    }).get();
  }
  return ids
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
  if($('.rate_type_ids').length){
    ids = getCheckBoxVal('.rate_type_ids')
    if($('#rate_rating').length && $('#cost_rate_rating').length) {
      if($('#rate_rating').val().length || $('#cost_rate_rating').val().length) {
        if(!$('#rate_type_id_1:checked').length) {
          msgs.push('・集計率区分('+$('#rate_str').text()+')と絞込み条件が一致していません。')
        }
      }
    }

    if($('#rate_pc7').length && $('#cost_rate_pc7').length) {
      if($('#rate_pc7').val().length || $('#cost_rate_pc7').val().length) {
        if(!$('#rate_type_id_2:checked').length) {
          msgs.push('・集計率区分(P+C7)と絞込み条件が一致していません。')
        }
      }
    }
  }

  $.each($('.target'), function(index, target) {
      let targetNum = $(target).data('taegrt_num');
      if($(target).find('.rate_type_ids').length){
        ids = getCheckBoxValTarget($(target), '.rate_type_ids');
        if(!ids.length) {
          msgs.push('・【ターゲット'+targetNum+'】集計率区分が選択されていません。')
        }
      }
  });


  if($('.callsign').length){
    ids = getSelectBoxVal('.callsign')
    if(!ids.length) {
      msgs.push('・放送局が選択されていません。')
    }
  }

  if ($('#cost_rate_rating').length) {
    if($('#cost_rate_rating').val().length){
      if(!isDecimal($('#cost_rate_rating').val())){
        msgs.push('・パーコスト視聴率には整数もしくは少数を入力してください。')
      }
    }
  }

  if ($('#cost_rate_pc7').length) {
    if($('#cost_rate_pc7').val().length){
      if(!isDecimal($('#cost_rate_pc7').val())){
        msgs.push('・パーコストP+C7には整数もしくは少数を入力してください。')
      }
    }
  }
/*
  if ($('#rate_rating').length) {
    if($('#rate_rating').val().length){
      if(!isDecimal($('#rate_rating').val())){
        msgs.push('・視聴率には整数もしくは少数を入力してください。')
      }
    }
  }
*/
  if ($('#rate_pc7').length) {
    if($('#rate_pc7').val().length){
      if(!isDecimal($('#rate_pc7').val())){
        msgs.push('・P+C7には整数もしくは少数を入力してください。')
      }
    }
  }

  if ($('#targets').length) {
    if($('#targets').val() == -1){
      //msgs.push('・特性が設定されていません。')
    }
  }
  let params = {};

  let data_type_id = [];
  let rate_type_ids = [];
  let aggregate_type_id = [];
  let target_group_code = [];
  let target_code = [];
  let period_type_id = [];

  $.each($('.target'), function(index, target) {

    let taegrtNum = $(target).data("taegrt_num");
    let tmpPamras = getApiCommonParams($(target));

    params['callsign'] = tmpPamras['callsigns'];
    params['onair_date_from'] = tmpPamras['onair_date_from'];
    params['onair_date_to'] = tmpPamras['onair_date_to'];
    params['commercial_year_months'] = tmpPamras['commercial_year_months'];
    data_type_id[taegrtNum] = tmpPamras['data_type_id'];
    rate_type_ids[taegrtNum] = tmpPamras['rate_type_ids'];
    aggregate_type_id[taegrtNum] = tmpPamras['aggregate_type_id'];
    target_group_code[taegrtNum] = tmpPamras['target_group_code'];
    target_code[taegrtNum] = tmpPamras['target_code'];
    period_type_id[taegrtNum] = tmpPamras['period_type_id'];
  });

  params['data_type_id'] = data_type_id;
  params['rate_type_ids'] = rate_type_ids;
  params['aggregate_type_id'] = aggregate_type_id;
  params['target_group_code'] = target_group_code;
  params['target_code'] = target_code;
  params['period_type_id'] = period_type_id;

  let results = checkTargetGroupCodeByRate(params)
  $.each(results, function(targetNum, result) {
    if (result === false) {
        msgs.push('・【ターゲット'+targetNum+'】ライセンスに無い特性グループが選択されています。')
    }
  });

//  if (result === false) {
//    msgs.push('・ライセンスに無い特性グループが選択されています。')
//  }

  if (msgs.length) {
      errNotify(msgs)
      return false
  }
  return true
}
function getElement(selector){
    return $(selector)
}

function errNotify(msgs){
  $.notify({message: msgs.join('<br>')},{type: 'danger'})
}

function getApiCommonParams(target){
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

  let rateTypeIds = getRateTypes(target)
  let paramCallsigns = []
  if($('#callsign').length) {
    let selCallsign = $('#callsign').val()
    if(selCallsign instanceof Array){
      paramCallsigns = selCallsign
    } else {
      paramCallsigns.push(selCallsign)
    }
  }

  let results = {
    commercial_year_months: commercialYearMonths,
    area_id: $('#area').length ? $('#area').val() : null,
    callsigns: paramCallsigns,
    data_type_id: (!target) ? null : target.find('.data_type_id').val(),
    rate_type_ids: rateTypeIds,
    aggregate_type_id: (!target) ? null : target.find('.aggregate_type_id').val(),
    target_group_code: (!target) ? null : target.find('.target_groups').val(),
    target_code: (!target) ? null : target.find('.target_code').val(),
    period_type_id: (!target) ? null : target.find('.period_type_id').val(),
    onair_date_from: $('#onair_date_from').val(),
    onair_date_to: $('#onair_date_to').val()
  }
  return results
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


function getRateTypes(target){
  if(target) {
    let checks = target.find('.rate_type_ids:checked')
    ids = []
    if(checks.length){
      ids = checks.map(function(){
        return $(this).val();
      }).get();
    }
    return ids
  }
}

function changeBroadcasters(data){
  let elm = $('#callsign')
  initSelectBox(elm)
  if(data.broadcasters){
    let selected = ''
    jQuery.each(data.broadcasters, function(index, d) {
      elm.append(
        $('<option/>').val(d.callsign).text(d.broadcaster_name).attr('selected', (index === 0))
      )
    })

    if (!location.pathname.match(/program_guide/)) {
      elm.attr({'size':data.broadcasters.length})
    }
  }
}
function changeDataTypes(target, data){
  let targetNum = $(target).data('taegrt_num')
  let elm = getElement(target.find('.data_type_id'))
  initSelectBox(elm)
  if(data.dataTypes && Object.keys(data.dataTypes).length > 0){
    jQuery.each(data.dataTypes, function(index, d) {
      elm.append(
        $('<option/>').val(d.data_type_id).text(d.display_name).attr('selected', (index === 0))
      )
    })
  } else {
    elm.append(
      $('<option/>').val(-1).text('指定条件でのデータ種類は存在しません')
    )
  }
}

function changeRateTypes(target, data){

  let targetNum = $(target).data('taegrt_num')
  let elm = getElement(target.find('.rate_types'))
  initSelectBox(elm)
  if(data.rateTypes && Object.keys(data.rateTypes).length > 0){
    jQuery.each(data.rateTypes, function(index, d) {
      let key = 'rate_type_id_'+targetNum+'_'+d.rate_type_id
      let input = $('<input/>').attr({
        'id': key,
        'type': 'radio',
        'class': 'rate_type_ids',
        'name': 'rate_type_ids['+targetNum+'][]',
      }).val(d.rate_type_id)

      if (index === 0) {
        input.attr({'checked': 'checked'});
      }

      let label = $('<label/>').attr({
        'for': key,
        'class': 'rate_type_ids',
        'name': 'rate_type_ids['+targetNum+']',
      }).text(d.display_name)
      elm.append(input)
      elm.append(label)

      $('#refine_conditions').find('input').val(null)
    });
    $(target).find('.rate_str_1').text(data.rateTypeStr[0]);
    $(target).find('.rate_str_2').text(data.rateTypeStr[1]);
    dispSearchConditionRateInput(target)
  }
}
function changeTargetGroups(target, data){
  let targetNum = $(target).data('taegrt_num')
  let elm = getElement(target.find('.target_groups'))
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
function changeTargets(target, data){
  let elm = getElement(target.find('.target_code'))
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

function changePeriodTerm(target, data){
  let elm = getElement(target.find('.period_term'))
  initSelectBox(elm)
  if(!data.periodTerms || !data.periodTerms.length){
    elm.append(
      $('<option/>').val(-1).text('指定条件での集計対象期間は存在しません。')
    )
  } else{
    if(data.periodTerms && data.periodTerms.length){
      jQuery.each(data.periodTerms, function(index, d) {
        elm.append(
          $('<option/>').val(d.period_from_date_ym+'_'+d.period_to_date_ym).text(d.period_string)
        )
      })
    }
  }
}

function changeAggregateTypes(target, data){
  let elm = getElement(target.find('.aggregate_type_id'))
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

function changePeriodTypes(target, data){
  let elm = getElement(target.find('.period_type_id'))
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


  if(!data.enableOnairDates.min_onair_date || !data.enableOnairDates.max_onair_date){
    elm.text('無し')
  } else{
    let minOnairDate = data.enableOnairDates.min_onair_date;
    let maxOnairDate = data.enableOnairDates.max_onair_date;

    elm.text([minOnairDate, maxOnairDate].join('～'));

    let arrMaxOnairDates = maxOnairDate.split('-');
    let minOnairDateTxtBox =  [arrMaxOnairDates[0], arrMaxOnairDates[1], '01'].join('-');

    $(selectorName).datepicker('setDaysOfWeekDisabled', []);
    $('#onair_date_from, #onair_date_to').datepicker('setStartDate', minOnairDate);
    $('#onair_date_from, #onair_date_to').datepicker('setEndDate', maxOnairDate);

    if(data.positionTerms != null) {
      let from = new Date(data.positionTerms.from.date.replace(/\-/, "/"));
      let to = new Date(data.positionTerms.to.date.replace(/\-/, "/"));
      $('#onair_date_from').datepicker('setDate', [from.getFullYear(), from.getMonth() + 1, + from.getDate()].join('-'));
      $('#onair_date_to').datepicker('setDate', [to.getFullYear(), to.getMonth() + 1, + to.getDate()].join('-'));
    }


//    $('#onair_date_from').datepicker('setDate', minOnairDateTxtBox);
//    $('#onair_date_to').datepicker('setDate', maxOnairDate);

    $(selectorName).datepicker('setDaysOfWeekDisabled', []);
  }
}

function changeDefaultSelect(target, data) {
    if (data.default_target) {
        if (data.default_target.data_type_id) {
            getElement(target.find('.data_type_id')).val(data.default_target.data_type_id);
        }
        if (data.default_target.target_group_code) {
            getElement(target.find('.target_groups')).val(data.default_target.target_group_code);
        }
        if (data.default_target.target_code) {
            getElement(target.find('.target_code')).val(data.default_target.target_code);
        }
    } else {
        getElement(target.find('.data_type_id')).val(target.find('.data_type_id>option').get(0).value);
        getElement(target.find('.target_groups')).val(target.find('.target_groups>option').get(0).value);
        getElement(target.find('.target_code')).val(target.find('.target_code>option').get(0).value);
    }
}

function changeOnairDate(type){
      $.get(urlChangeConditions, $.extend({}, { 'type': type}, getApiCommonParams()),function(data){

        isOnairDateForcus = false
        //set onair date
        if(data.positionTerms != null) {
          let from = new Date(data.positionTerms.from.date.replace(/\-/, "/"));
          let to = new Date(data.positionTerms.to.date.replace(/\-/, "/"));
          $('#onair_date_from').datepicker('setDate', [from.getFullYear(), from.getMonth() + 1, + from.getDate()].join('-'));
          $('#onair_date_to').datepicker('setDate', [to.getFullYear(), to.getMonth() + 1, + to.getDate()].join('-'));
        }


//        $('#onair_date_from').datepicker('setDate', data.onairDates['from']);
//        $('#onair_date_to').datepicker('setDate', data.onairDates['to']);
        isOnairDateForcus = true



        //attach change event
        $('#onair_date_from').change();
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

function changRateTypeString(target){
  let targetNum = target.data('taegrt_num')
  let id = target.find('input:radio:checked.rate_type_ids').val();
  let l = $('label[for=rate_type_id_' +targetNum+'_' + id + ']').text();
  target.find('.rate_str_1').text(l);
}

function dispSearchConditionRateInput(target){
    let rateTypeIds = $(target).find('input.rate_type_ids').map(function(){
        return $(this).val();
    }).get();

    $(target).find('.sc_rate_type').hide();
    $(target).find('.sc_rate_type:has(.rate_str_1):eq(0)').show();

    $(target).find('.rate_rating_suffix').hide();
    // for TVI
    if($(target).find('#data_type_id').val() != 4) {
       $(target).find('.per_cost').show();
        $(target).find('.rate_rating_suffix').show();
    }
}

function calc(self){
  let price = $(self).val();

  let int_rate = {};
  let int_pc7 = {};
  let rec_contents = $(self).parents(".rec_contents");
  $.each(rec_contents.find(".int_rate"), function(index, d) {
      if ($(d).val() > 0) {
          int_rate[$(d).data("target_num")] = $(d).val();
      }
  });
  $.each(rec_contents.find(".int_pc7"), function(index, d) {
      if ($(d).val() > 0) {
          int_pc7[$(d).data("target_num")] = $(d).val();
      }
  });

  if(int_rate || int_pc7){
      params = {
          'id': rec_contents.data("cm_id"),
          'price': price,
          'int_rate': int_rate,
          'int_pc7': int_pc7,
      }

      $.get('/'+location.pathname.split("/")[1]+'/analyze_all/api/calc', params,function(r){
          if (!Object.keys(r).length) {
          } else {
              if (r.resultRates) {
                  $.each(r.resultRates, function(targetNum, d) {
                      if (r.resultRates[targetNum] == 0) {
                        r.resultRates[targetNum] = '';
                      }
                      rec_contents.find(".cost_rate_rating_"+targetNum)[0].innerText = number_format(r.resultRates[targetNum]);
                  });
              }
              if (r.resultPc7) {
                  $.each(r.resultPc7, function(targetNum, d) {
                      if (r.resultPc7[targetNum] == 0) {
                          r.resultPc7[targetNum] = '';
                      }
                      rec_contents.find(".cost_rate_pc7_"+targetNum)[0].innerText = number_format(r.resultPc7[targetNum]);
                  });
              }
          }
      })
    }
}

var urlChangeConditions = dirUrl + '/analyze_all/api/change_conditions';
var isOnairDateForcus = false
$(function(){

  let target = null

  $(document).on("focus", "#onair_date_from, #onair_date_to", function(e){
    isOnairDateForcus = true
  })

  $(document).on("change", "#onair_date_from, #onair_date_to", function(e){
    if (!isOnairDateForcus) {
      return false
    }

    // all target
    $.each($('.target'), function(index, target) {
      let params = getApiCommonParams($(target))
      $.get(urlChangeConditions, $.extend({}, { type: 'onair_date'}, params),function(data){
        changeAggregateTypes($(target), data)
        changePeriodTerm($(target), data)
        changeTargetGroups($(target), data)
        changeTargets($(target), data)
      })
    })

  })

  $(document).on("change", "#area", function(){
    isOnairDateForcus = false

    // all target
    $.each($('.target'), function(index, target) {
      let params = getApiCommonParams($(target))
      $.get(urlChangeConditions, $.extend({}, { type: 'area'}, params),function(data){
        changeBroadcasters(data)
        changeEnableOnairDates(data)
        changeDataTypes($(target), data)
        changeRateTypes($(target), data)
        changeTargetGroups($(target), data)
        changeTargets($(target), data)
        changePeriodTerm($(target), data)
        changeAggregateTypes($(target), data)
        changePeriodTypes($(target), data)
        changeDefaultSelect($(target), data)
      })
    })
  })

  $(document).on("change", "#callsign", function(){
    isOnairDateForcus = false
    // all target
    $.each($('.target'), function(index, target) {
      let params = getApiCommonParams($(target))
      $.get(urlChangeConditions, $.extend({}, { type: 'callsign'}, params),function(data){
        changeEnableOnairDates(data)
        changeDataTypes($(target), data)
        changeRateTypes($(target), data)
        changePeriodTerm($(target), data)
        changeAggregateTypes($(target), data)
        changeTargetGroups($(target), data)
        changeTargets($(target), data)
        changePeriodTypes($(target), data)
        changeDefaultSelect($(target), data)
      })
    })
  })

  $(document).on("change", ".data_type_id", function(){
    isOnairDateForcus = false
    let target = $(this).parents('.target')
    let params = getApiCommonParams(target)
   $.get(urlChangeConditions, $.extend({}, { type: 'data_type'}, params),function(data){
      changeRateTypes($(target), data)
      changeTargetGroups($(target), data)
      changeTargets($(target), data)
      changePeriodTerm($(target), data)
      changeAggregateTypes($(target), data)
      changePeriodTypes($(target), data)
    })
  })

  $(document).on("change", ".rate_type_ids", function(){
    isOnairDateForcus = false
    let target = $(this).parents('.target')
    let targetNum = $(target).data('taegrt_num');
    let params = getApiCommonParams(target)
    $.get(urlChangeConditions, $.extend({}, { type: 'rate_type'}, params),function(data){
      changePeriodTypes($(target), data)
      changeAggregateTypes($(target), data)
      changeTargetGroups($(target), data)
      changeTargets($(target), data)
      changePeriodTerm($(target), data)

      changRateTypeString($(target));
    })
  })

  $(document).on("change", ".aggregate_type_id", function(){
    isOnairDateForcus = false
    let target = $(this).parents('.target')
    let params = getApiCommonParams(target)
    $.get(urlChangeConditions, $.extend({}, { type: 'aggregate_type'}, params),function(data){
      changePeriodTerm($(target), data)
      changeTargetGroups($(target), data)
      changeTargets($(target), data)
    })
  })

  $(document).on("change", ".target_groups", function(){
    isOnairDateForcus = false
    let target = $(this).parents('.target')
    let params = getApiCommonParams(target)
   $.get(urlChangeConditions, $.extend({}, { type: 'taeget_group'}, params),function(data){
      changeTargets($(target), data)
    })
  })

  $(document).on("change", ".period_type_id", function(){
    isOnairDateForcus = false
    let target = $(this).parents('.target')
    let rateTypeIds = getRateTypes(target)
    if(rateTypeIds.length){
      let params = getApiCommonParams(target)
      $.get(urlChangeConditions, $.extend({}, { type: 'period_type'}, params),function(data){
        changePeriodTerm($(target), data)
        changeAggregateTypes($(target), data)
        changeTargetGroups($(target), data)
        changeTargets($(target), data)
      })
    }
  })

  $("#cart_select").on("change", function() {
    searchPosition()
  })

  $("#btn_search").on("click", function() {
    searchPosition()
  })

  $.each($('.target'), function(index, target) {
    dispSearchConditionRateInput(target);
    changRateTypeString($(target));
  });

  $(".month-previous").on("click", function(e) {
    changeOnairDate('month-previous');
  });

  $(".month-next").on("click", function(e) {
    changeOnairDate('month-next');
  });
})
