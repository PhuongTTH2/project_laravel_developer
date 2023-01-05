function errSystem() {
    errNotify(['・システムエラーが発生しました。管理者にお問い合わせください。']);
}

function checkTargetGroupCodeByRate(params) {
    let result = [];
    if (params['rate_type_ids'].length > 0) {
        $.ajax({
            url: "/agency/api/check_target_group",
            type: "get",
            data: params,
            async: false,
            success: function(data) {
                result["result"] = data.result;
            },
            error: function(jqXHR) {
                if (jqXHR.status == 504) {
                    //Gateway Time-out
                    result["result"] = false;
                    result["msg"] = "・サーバに接続できませんでした。しばらく経ってからアクセスしてください。";
                } else if (jqXHR.status == 0) {
                    // ネットワーク切断時のエラー
                    result["result"] = false;
                    result["msg"] = "・サーバに接続できませんでした。しばらく経ってからアクセスしてください。";
                } else if (jqXHR.status >= 500) {
                    // 5XX 系統のエラー
                    result["result"] = false;
                    result["msg"] = "・サーバに接続できませんでした。しばらく経ってからアクセスしてください。";
                } else {
                    errSystem();
                }
            }
        });
    }
    return result
}

function checkTermOnairDate() {
    return checkRangeDate($('#planning_from_date').val(), $('#planning_to_date').val());
}
function checkRangeDate(from, to) {
    from = new Date(from).getTime() / 1000;
    to = new Date(to).getTime() / 1000;
    if (from > to) {
        return false;
    }
    return true;
}

function initSelectBox(elm) {
    elm.css({
        'color': ''
    }).empty();
}

function alertSelectBox(elm) {
    elm.css({
        'color': 'red'
    });
}

function isDecimal(val) {
    return (val.match(/^(-?[0-9]+\.)?[0-9]+$/));
}

function searchPosition() {

    if (valid()) {
        // loading('show');

        if ($('#cart_item').length > 0) {
            $('#choice_cart_id').val($('#cart_item').val());
        } else {
            $('#choice_cart_id').val($('#cart_select').val());
        }
        $('#search').submit();
    }
}

function valid() {

    let msgs = []

    let campaign_from = $('#campaign_from_date_datepicker').val();
    let campaign_to = $('#campaign_to_date_datepicker').val();
    if (!campaign_from.length || !campaign_to.length) {
        // msgs.push('・キャンペーン期間が指定されていません。');
        return;
    } else {
        if (!isYYYYMMDD(campaign_from) || !isYYYYMMDD(campaign_to)) {
            msgs.push('・キャンペーン期間に誤りがあります。');
        } else if (!checkRangeDate(campaign_from, campaign_to)) {
            msgs.push('・キャンペーン期間に誤りがあります。');
        }
    }

    let from = $('#planning_from_date').val();
    let to = $('#planning_to_date').val();
    let isOkOnairDate = true;

    if (!from.length || !to.length) {
        msgs.push('・プランニング期間が指定されていません。');
        isOkOnairDate = false;
    } else {
        if (!isYYYYMMDD(from) || !isYYYYMMDD(to)) {
            msgs.push('・プランニング期間に誤りがあります。');
            isOkOnairDate = false;
        }

        if (!checkTermOnairDate()) {
            msgs.push('・プランニング期間に誤りがあります。');
            isOkOnairDate = false;
        }

        if ((new Date(from)).getMonth() != (new Date(to)).getMonth()) {
            msgs.push('・プランニング期間は同月内で指定してください。');
            isOkOnairDate = false;
        }
    }

    if (msgs.length == 0) {
        // キャンペーン期間とプランニング期間の範囲チェック
        if (!checkRangeDate(campaign_from, from) ||
            !checkRangeDate(to, campaign_to)) {
            msgs.push('・プランニング期間にキャンペーン期間外の期間が設定されています。');
        }
    }

    let ids = [];
    if ($('.pt_sb_codes').length) {
        ids = getCheckBoxVal('.pt_sb_codes');
        if (!ids.length) {
            msgs.push('・PT/SBが選択されていません。');
        }
    }
    if ($('.rate_type_ids').length) {
        ids = getCheckBoxVal('.rate_type_ids');
        if ($('#rate_rating').length && $('#cost_rate_rating').length) {
            if ($('#rate_rating').val().length || $('#cost_rate_rating').val().length) {
                if (!$('#rate_type_id_1:checked').length) {
                    msgs.push('・集計率区分(' + $('#rate_str').text() + ')と絞込み条件が一致していません。');
                }
            }
        }

        if ($('#rate_pc7').length && $('#cost_rate_pc7').length) {
            if ($('#rate_pc7').val().length || $('#cost_rate_pc7').val().length) {
                if (!$('#rate_type_id_2:checked').length) {
                    msgs.push('・集計率区分(P+C7)と絞込み条件が一致していません。');
                }
            }
        }
    }

    if ($('.day_of_week_ids').length) {
        ids = getCheckBoxVal('.day_of_week_ids');
        if (!ids.length) {
            msgs.push('・曜日が選択されていません。');
        }
    }

    if ($('.rate_type_ids').length) {
        ids = getCheckBoxVal('.rate_type_ids');
        if (!ids.length) {
            msgs.push('・集計率区分が選択されていません。');
        }
    }
    if ($('#rate_type_id').length) {
        id = getSelectBoxVal('#rate_type_id');
        if (!id.length) {
            msgs.push('・集計率区分が選択されていません。');
        }
    }

    if ($('.callsign').length) {
        ids = getCheckBoxVal('.callsign');
        if (!ids.length) {
            msgs.push('・放送局が選択されていません。');
        }
    }

    // if ($('#cost_rate_rating').length) {
    //     if ($('#cost_rate_rating').val().length) {
    //         if (!isDecimal($('#cost_rate_rating').val())) {
    //             msgs.push('・パーコスト視聴率には整数もしくは少数を入力してください。')
    //         }
    //     }
    // }
    //
    // if ($('#cost_rate_pc7').length) {
    //     if ($('#cost_rate_pc7').val().length) {
    //         if (!isDecimal($('#cost_rate_pc7').val())) {
    //             msgs.push('・パーコストP+C7には整数もしくは少数を入力してください。');
    //         }
    //     }
    // }
    //
    // if ($('#rate_rating').length) {
    //     if ($('#rate_rating').val().length) {
    //         if (!isDecimal($('#rate_rating').val())) {
    //             msgs.push('・視聴率には整数もしくは少数を入力してください。');
    //         }
    //     }
    // }
    // if ($('#rate_pc7').length) {
    //     if ($('#rate_pc7').val().length) {
    //         if (!isDecimal($('#rate_pc7').val())) {
    //             msgs.push('・P+C7には整数もしくは少数を入力してください。');
    //         }
    //     }
    // }

    if ($('#targets').length) {
        if ($('#targets').val() == -1) {
            //msgs.push('・特性が設定されていません。')
        }
    }

    if (isOkOnairDate) {
        if ($('.day_of_week_ids').length) {
            let converts = {
                0: 6,
                1: 0,
                2: 1,
                3: 2,
                4: 3,
                5: 4,
                6: 5,
            };
            let onairDateFrom = new Date($('#planning_from_date').val());
            let onairDateTo = new Date($('#planning_to_date').val());

            ids = getCheckBoxVal('.day_of_week_ids');
            var termDay = Math.ceil((onairDateTo - onairDateFrom) / 86400000);
            let weeks = [];
            if (termDay <= 7) {
                do {
                    weeks.push(String(converts[onairDateFrom.getDay()]));
                    onairDateFrom.setDate(onairDateFrom.getDate() + 1);
                } while (onairDateFrom.getTime() <= onairDateTo.getTime());
            }
            if (weeks.length && ids.length) {
                let duplications = weeks.concat(ids).filter(function(x, i, self) {
                    return self.indexOf(x) !== self.lastIndexOf(x);
                });
                if (!duplications.length) {
                    msgs.push('・指定した想定タイムテーブルの曜日がCM枠のセールス枠期間内に含まれていません。');
                }
            }
        }
    }

    let result = checkTargetGroupCodeByRate(getApiCommonParams());
    
    if (("result" in result) && result["result"] === false) {
      if ("msg" in result) {
          msgs.push(result["msg"])
      }
      else {
          msgs.push('・ライセンスに無い特性グループが選択されています。')
      }
    }

    if (msgs.length) {
        errNotify(msgs);
        return false;
    }
    return true
}

function getElement(selector) {
    if ($('#current_cart_id').length) {
        return $($('.conditions_cart_' + $('#current_cart_id').val())).find(selector);
    } else {
        return $(selector);
    }
}

function changeConditionsCart() {
    let params = getApiCommonParamsCart();
    //params.cart_id = cartId

    $.get('/agency/api/change_conditions', $.extend({}, {
            type: 'cart'
        }, params),
        function(data) {
            rateTypeIds;
            changeDataTypes(data);
            changeRateTypes(data);
            changePeriodTypes(data);
            changeTargetGroups(data);
            changeTargets(data);
            changePeriodTerm(data);
        });
}

function errNotify(msgs) {
    $.notify({
        message: msgs.join('<br>')
    }, {
        type: 'danger'
    });
}

function getApiCommonParamsCart() {
    let cartId = $('#current_cart_id').val();
    let baseSelector = $('.conditions_cart_' + cartId);

    let rateTypeIds = getRateTypesCart(baseSelector);
    if (!rateTypeIds.length) {
        rateTypeIds = [1, 2];
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
        cart_id: cartId
    }
}

function getApiCommonParams() {
    let commercialYearMonths = [];
    let onairDateFroms = null;
    let onairDateTos = null;

    if ($('#planning_from_date').val().length) {
        onairDateFroms = $('#planning_from_date').val().split('-');
        commercialYearMonths.push(onairDateFroms[0] + onairDateFroms[1]);
    }
    if ($('#planning_to_date').val().length) {
        onairDateTos = $('#planning_to_date').val().split('-');
        commercialYearMonths.push(onairDateTos[0] + onairDateTos[1]);
    }

    let rateTypeIds = getRateTypes();
    if (!rateTypeIds.length) {
        // rateTypeIds = [1,2]
    }

    let paramCallsigns = $('input[id^=callsign_]:checked').map(function(i, elm) {
        return $(elm).val();
    }).toArray();

    return {
        commercial_year_months: commercialYearMonths,
        area_id: $('#area_id').val(),
        callsigns: paramCallsigns,
        data_type_id: $('#data_type_id').val(),
        rate_type_ids: rateTypeIds,
        aggregate_type_id: $('#aggregate_type_id').val(),
        target_group_code: $('#target_groups').val(),
        target_code: $('#targets').val(),
        period_type_id: $('#period_type_id').val(),
        onair_date_from  : $('#planning_from_date').val(),
        onair_date_to    : $('#planning_to_date').val(),
        planning: true,
        ignores: {
            dataTypes: (typeof strange_data_types !== 'undefined')? strange_data_types : []
        }
    }
}

function getCartCommonParams() {
    let period_from_date = null;
    let period_to_date = null;
    if ($('#periodTerm').length) {
        periods = $('#periodTerm').val().split('_');
        period_from_date = periods[0];
        period_to_date = periods[1];
    }
    rateTypeIds = getRateTypeIds();
    return {
        'area_id': $('#area').val(),
        'data_type_id': $('#data_type_id').val(),
        'rate_type_id_1': Number($.inArray("1", rateTypeIds) != -1),
        'rate_type_id_2': Number($.inArray("2", rateTypeIds) != -1),
        'aggregate_type_id': $('#aggregate_type_id').val(),
        'target_group_code': $('#target_groups').val(),
        'target_code': $('#targets').val(),
        'period_type_id': $('#period_type_id').val(),
        'period_from_date': period_from_date,
        'period_to_date': period_to_date,
        'planning': true,
    }
}

function getRateTypeIds() {
    return $('.rate_type_ids:checked').map(function() {
        return $(this).val();
    }).get();
}

function getCheckBoxVal(selector) {
    let checks = $(selector + ':checked');
    ids = [];
    if (checks.length) {
        ids = checks.map(function() {
            return $(this).val();
        }).get();
    }
    return ids;
}

function getSelectBoxVal(selector) {
    let checks = $(selector + ' option:selected');
    ids = [];
    if (checks.length) {
        ids = checks.map(function() {
            return $(this).val();
        }).get();
    }
    return ids;
}


function getRateTypes() {
    return [$('#rate_type_id').val()];
}

function getRateTypesCart(baseSelector) {
    return [$('#rate_type_id').val()];
}

function changeBroadcasters(data) {
    let elm = $('#callsign_box');
    if (data.broadcasters) {
        $('.broadcaster').off('change');
        $('#broadcaster_all_check').off('change');
        elm.empty();
        jQuery.each(data.broadcasters, function(index, b) {
            elm.append(
                $('<div class="form-group">').append(
                    $('<input id="callsign_' + b.id + '" value="' + b.callsign + '" type="checkbox" name="callsign[]" class="broadcaster callsign" checked>')
                ).append(
                    $('<label for="callsign_' + b.id + '">' + b.broadcaster_name + '</label>')
                )
            );
        });
        broadcasterChangeAll($('.broadcaster'), $('#broadcaster_all_check'));
        $('.broadcaster').eq(0).change();
        hideBroadcasterCheck();
    }
}

function changeDataTypes(data) {
    let elm = getElement('#data_type_id');
    initSelectBox(elm);
    if(data.dataTypes && Object.keys(data.dataTypes).length > 0){
        jQuery.each(data.dataTypes, function(index, d) {
            if (strange_data_types.indexOf(Number(d.id)) < 0) {
                let option =
                    elm.append(
                        $('<option/>').val(d.data_type_id).text(d.display_name)
                    );
            }
        });
    } else {
        elm.append( $('<option/>').val(-1).text('指定条件でのデータ種類は存在しません') );
    }
    switchExEstimatePopulation();
}

function changeRateTypes(data) {
    let elm = getElement('#rate_type_id');
    initSelectBox(elm);
    if(data.rateTypes && Object.keys(data.rateTypes).length > 0){
        jQuery.each(data.rateTypes, function(index, d) {
            elm.append( $('<option/>').val(d.rate_type_id).text(d.display_name) );
        });
    } else {
        elm.append( $('<option/>').val(-1).text('指定条件での集計率区分は存在しません') );
    }
}

function changePeriodTypes(data) {
    let elm = getElement('#period_type_id');
    initSelectBox(elm);
    if(data.periodTypes && Object.keys(data.periodTypes).length > 0){
        jQuery.each(data.periodTypes, function(index, d) {
            elm.append( $('<option/>').val(d.period_type_id).text(d.display_name) );
        });
    } else {
        elm.append( $('<option/>').val(-1).text('指定条件での集計区分は存在しません') );
    }
}

function changeTargetGroups(data) {
    let elm = getElement('#target_groups');
    initSelectBox(elm);
    if (data.targetGroups && Object.keys(data.targetGroups).length > 0) {
        jQuery.each(data.targetGroups, function(index, d) {
            elm.append(
                $('<option/>').val(d.target_group_code).text(d.target_group_name)
            );
        });
    } else {
        elm.append(
            $('<option/>').val(-1).text('指定条件での特性グループは存在しません')
        );
    }
}

function changeTargets(data) {
    let elm = getElement('#targets');
    initSelectBox(elm);
    if (data.targets && Object.keys(data.targets).length > 0) {
        jQuery.each(data.targets, function(index, d) {
            elm.append(
                $('<option/>').val(d.target_code).text(d.target_name)
            );
        });
    } else {
        elm.append(
            $('<option/>').val(-1).text('指定条件での特性は存在しません')
        );
    }
}

function changePeriodTerm(data) {
    let elm = getElement('#periodTerm');
    initSelectBox(elm);

    let period = (data.periodTerms && data.periodTerms.length) ? data.periodTerms : [];
    if (!period || !period.length) {
        elm.append(
            $('<option/>').val(-1).text('指定条件での集計対象期間は存在しません。')
        );
    } else {
        if (period && period.length) {
            jQuery.each(period, function(index, d) {
                elm.append(
                    $('<option/>').val(d.period_from_date_ym + '_' + d.period_to_date_ym).text(d.period_string)
                );
            });
        }
    }
}

function changeAggregateTypes(data) {
    let elm = getElement('#aggregate_type_id');
    initSelectBox(elm);

    if(data.aggregateTypes && Object.keys(data.aggregateTypes).length > 0){
        jQuery.each(data.aggregateTypes, function(index, d) {
            elm.append(
                $('<option/>').val(d.aggregate_type_id).text(d.display_name)
            );
        });
    } else {
        elm.append(
            $('<option/>').val(-1).text('指定条件での集計率取得方法は存在しません')
        );
    }
}

function changeEnableOnairDates(data) {
    let elm = getElement('#enable_onair_dates');
    elm.text(null);
    let selectorName = '#planning_from_date, #planning_to_date';

    //初期化
    $(selectorName).datepicker('setDaysOfWeekDisabled', [0, 1, 2, 3, 4, 5, 6]);
    $(selectorName).datepicker('setDate', null);

    if (data.enableOnairDates === null) {
        elm.text('無し');
    }
    else if (!data.enableOnairDates.min_onair_date || !data.enableOnairDates.max_onair_date) {
        elm.text('無し');
    } else {
        let minOnairDate = data.enableOnairDates.min_onair_date;
        let maxOnairDate = data.enableOnairDates.max_onair_date;

        elm.text([minOnairDate, maxOnairDate].join('～'));

        $('#planning_from_date, #planning_to_date').datepicker('setStartDate', minOnairDate);
        $('#planning_from_date, #planning_to_date').datepicker('setEndDate', maxOnairDate);

        if(data.positionTerms != null) {
            let from = new Date(data.positionTerms.from.date.replace(/\-/, "/"));
            let to = new Date(data.positionTerms.to.date.replace(/\-/, "/"));
            $('#planning_from_date').datepicker('setDate', [from.getFullYear(), from.getMonth() + 1, + from.getDate()].join('-'));
            $('#planning_to_date').datepicker('setDate', [to.getFullYear(), to.getMonth() + 1, + to.getDate()].join('-'));
            
            $('#campaign_from_date_datepicker').datepicker('setDate', [from.getFullYear(), from.getMonth() + 1, + from.getDate()].join('-'));
            $('#campaign_to_date_datepicker').datepicker('setDate', [to.getFullYear(), to.getMonth() + 1, + to.getDate()].join('-'));
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
    }
}

function changePlanningDate(type){
    if ($('.callsign').length) {
        ids = getCheckBoxVal('.callsign');
        if (!ids.length) {
            errNotify(['・放送局が選択されていません。']);
            return;
        }
    }

    loading("show")
    disableBtnPlanning()
    $.ajax({
        url: '/agency/api/change_conditions',
        type: 'GET',
        data: $.extend({}, { 'type': type}, getApiCommonParams()),
//        timeout: 120000,
        dataType: 'json',
        success: function (data) {
            isOnairDateForcus = false
            //set onair date
            if (data.positionTerms != null) {
                let from = new Date(data.positionTerms.from.date.replace(/\-/, "/"));
                let to = new Date(data.positionTerms.to.date.replace(/\-/, "/"));
                $('#planning_from_date').datepicker('setDate', [from.getFullYear(), from.getMonth() + 1, +from.getDate()].join('-'));
                $('#planning_to_date').datepicker('setDate', [to.getFullYear(), to.getMonth() + 1, +to.getDate()].join('-'));
            }
            isOnairDateForcus = true

            //attach change event
            $('#planning_from_date').change();
        }
    }).done(function () {
        enableBtnPlanning()
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
    });
}

function changeCampaignDate(type){
    if ($('.callsign').length) {
        ids = getCheckBoxVal('.callsign');
        if (!ids.length) {
            errNotify(['・放送局が選択されていません。']);
            return;
        }
    }

    let params = getApiCommonParams();
    params.commercial_year_months = [];
    if ($('#campaign_from_date_datepicker').val().length) {
        onairDateFroms = $('#campaign_from_date_datepicker').val().split('-');
        params.commercial_year_months.push(onairDateFroms[0] + onairDateFroms[1]);
    }
    if ($('#campaign_to_date_datepicker').val().length) {
        onairDateTos = $('#campaign_to_date_datepicker').val().split('-');
        params.commercial_year_months.push(onairDateTos[0] + onairDateTos[1]);
    }
    params.onair_date_from = $('#campaign_from_date_datepicker').val();
    params.onair_date_to = $('#campaign_to_date_datepicker').val();

    loading("show")
    disableBtnPlanning()
    $.ajax({
        url: '/agency/api/change_conditions',
        type: 'GET',
        data: $.extend({}, { 'type': type}, params),
//        timeout: 120000,
        dataType: 'json',
        success: function (data) {
            isOnairDateForcus = false
            //set onair date
            if (data.positionTerms != null) {
                let from = new Date(data.positionTerms.from.date.replace(/\-/, "/"));
                let to = new Date(data.positionTerms.to.date.replace(/\-/, "/"));

                from = [from.getFullYear(), from.getMonth() + 1, +from.getDate()].join('-');
                to = [to.getFullYear(), to.getMonth() + 1, +to.getDate()].join('-');

                $('#campaign_from_date_datepicker').datepicker('setDate', from);
                $('#campaign_to_date_datepicker').datepicker('setDate', to);

                isOnairDateForcus = true
                $('#planning_to_date').datepicker('setDate', to);
                $('#planning_from_date').datepicker('setDate', from);
            } else {
              loading("hide")
            }
        }
    }).done(function() {
        enableBtnPlanning()
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
    });
}

function isYYYYMMDD(str) {
    str = str.replace(/-/g, "");
    if (str == null || str.length != 8 || isNaN(str)) {
        return false;
    }
    let y = parseInt(str.substr(0, 4));
    let m = parseInt(str.substr(4, 2)) - 1;
    let d = parseInt(str.substr(6, 2));
    let dt = new Date(y, m, d);

    return (y == dt.getFullYear() && m == dt.getMonth() && d == dt.getDate());
}

function dispSearchConditionRateInput() {
    let rateTypeIds = getRateTypes();
    $('.sc_rate_type').css('display', 'none');
    if (rateTypeIds.length > 0) {
        jQuery.each(rateTypeIds, function(index, val) {
            $('.sc_rate_type_' + val).css('display', 'inline');
        });
    }
}


function hideBroadcasterCheck() {
    if ($('.broadcaster').length <= 1) {
        $('#broadcaster_all_check').parent().hide();
        $('.broadcaster').prop('disabled', true);
        let ch = $('.broadcaster').eq(0);
        let input = $('<input type="hidden">')
            .prop('name', ch.prop('name'))
            .val(ch.val());
        $('.broadcaster').parent().append(input);
    } else {
        $('#broadcaster_all_check').parent().show();
        $('.broadcaster').prop('disabled', false);
    }
}

function enableBtnPlanning () {
    const btnPlanning = $('#do_planning');
    btnPlanning.css("cssText", "color: #fff !important; pointer-events: auto;");
    btnPlanning.prop("disabled", false);
  }
  
function disableBtnPlanning () {
    //WAKUFINDER_PRJ_103-1105
    //const btnPlanning = $('#do_planning');
    //btnPlanning.css("cssText", "color: #a6a6a6 !important; pointer-events: none;");
    //btnPlanning.prop("disabled", true);
}

function switchExEstimatePopulation () {
    const data_type_id = $('#data_type_id').val();
    const elemFromPopulationTypeId = $('#form_population_type_id');
    elemFromPopulationTypeId.show();
    if (data_type_id != 1) {
        elemFromPopulationTypeId.hide();
    }
}

var isOnairDateForcus = false;
$(function() {

    $(document).ready(function() {
        switchExEstimatePopulation();
    });

    $(document).on("focus", "#planning_from_date, #planning_to_date", function(e) {
        isOnairDateForcus = true;
    });

    $(document).on("change", "#planning_from_date, #planning_to_date", function(e) {

        if (!isOnairDateForcus) {
            return false;
        }
        let planning_from = $('#planning_from_date').val();
        let planning_to = $('#planning_to_date').val();
        if (!checkRangeDate(planning_from, planning_to)) {
            // errNotify(['・プランニング期間に誤りがあります。']);
             loading("hide")
             return false;
        }
        if ((new Date(planning_from)).getMonth() != (new Date(planning_to)).getMonth()) {
            // errNotify(['・プランニング期間は同月内で指定してください。']);
            // return false;
        }
        if (!checkCampaignInPlanning()) {
            // errNotify(['・プランニング期間にキャンペーン期間外の期間が設定されています。']);
            // return false;
        }


        let params = (!$('#current_cart_id').length) ? getApiCommonParams() : getApiCommonParamsCart();
        
        loading("show")
        disableBtnPlanning()
        $.ajax({
            url: '/agency/api/change_conditions',
            type: 'GET',
            data: $.extend({}, {type: 'onair_date'}, params),
//            timeout: 120000,
            dataType: 'json',
            success: function (data) {
                changePeriodTypes(data);
                changeAggregateTypes(data);
                changePeriodTerm(data);
                changeTargetGroups(data);
                changeTargets(data);
            }
        }).done(function() {
            enableBtnPlanning()
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
        });
    });

    $(document).on('focus', '#campaign_from_date_datepicker, #campaign_to_date_datepicker', function(e) {
        isOnairDateForcus = true;
    });

    $(document).on('change', '#campaign_from_date_datepicker, #campaign_to_date_datepicker', function(e) {
        $('#planning_to_date').datepicker('setDate', $('#campaign_to_date_datepicker').val());
        $('#planning_from_date').datepicker('setDate', $('#campaign_from_date_datepicker').val());

        if (!isOnairDateForcus) {
            return false;
        }
        let campaign_from = $('#campaign_from_date_datepicker').val();
        let campaign_to = $('#campaign_to_date_datepicker').val();

        if (!checkRangeDate(campaign_from, campaign_to)) {
            // errNotify(['・キャンペーン期間に誤りがあります。']);
            return false;
        }
        if (!checkCampaignInPlanning()) {
            // errNotify(['・プランニング期間にキャンペーン期間外の期間が設定されています。']);
            return false;
        }
    });


    function checkCampaignInPlanning() {
        let campaign_from = $('#campaign_from_date_datepicker').val();
        let campaign_to = $('#campaign_to_date_datepicker').val();
        let planning_from = $('#planning_from_date').val();
        let planning_to = $('#planning_to_date').val();

        if (!checkRangeDate(campaign_from, planning_from) ||
            !checkRangeDate(planning_to, campaign_to)) {
            return false;
        }
        return true;
    }

    $(document).on("change", "#area_id", function() {
        isOnairDateForcus = false;
        let isHideLoading = true;
        let params = (!$('#current_cart_id').length) ? getApiCommonParams() : getApiCommonParamsCart();
        loading("show")
        disableBtnPlanning();
        $.ajax({
            url: '/agency/api/change_conditions',
            type: 'GET',
            data: $.extend({}, {type: 'area'}, params),
//            timeout: 10000,
            dataType: 'json',
            success: function (data) {
                if (data.broadcasters) {
                  // changeBroadcasters内で$(document).on("change", "input[id^=callsign_])が呼ばれるのでローディングは消さない
                  isHideLoading = false; 
                }
                changeBroadcasters(data);
                changeEnableOnairDates(data);
                changeDataTypes(data);
                changeRateTypes(data);
                changePeriodTypes(data);
                changeTargetGroups(data);
                changeTargets(data);
                changePeriodTerm(data);
                changeAggregateTypes(data);
            }
        }).done(function() {
            enableBtnPlanning()
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
            if (isHideLoading) {
              loading("hide")
            }
        });
    })

    $(document).on("change", "input[id^=callsign_]", function() {
        isOnairDateForcus = false;
        let params = (!$('#current_cart_id').length) ? getApiCommonParams() : getApiCommonParamsCart()
        loading("show")
        disableBtnPlanning()
        $.ajax({
            url: '/agency/api/change_conditions',
            type: 'GET',
            data: $.extend({}, {type: 'callsign'}, params),
//            timeout: 10000,
            dataType: 'json',
            success: function (data) {
                changeEnableOnairDates(data);
                changeDataTypes(data);
                changeRateTypes(data);
                changePeriodTypes(data);
                changePeriodTerm(data);
                changeAggregateTypes(data);
                changeTargetGroups(data);
                changeTargets(data);
                changeDefaultSelect(data);
            }
        }).done(function() {
            enableBtnPlanning()
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
        });
    })
    $(document).on("change", "#broadcaster_all_check", function() {
        isOnairDateForcus = false;
        let params = (!$('#current_cart_id').length) ? getApiCommonParams() : getApiCommonParamsCart()
        loading("show")
        disableBtnPlanning()
        $.ajax({
            url: '/agency/api/change_conditions',
            type: 'GET',
            data:  $.extend({}, {type: 'callsign'}, params),
//            timeout: 10000,
            dataType: 'json',
            success: function (data) {
                changeEnableOnairDates(data);
                changeDataTypes(data);
                changeRateTypes(data);
                changePeriodTypes(data);
                changePeriodTerm(data);
                changeAggregateTypes(data);
                changeTargetGroups(data);
                changeTargets(data);
                changeDefaultSelect(data);
            }
        }).done(function() {
            enableBtnPlanning()
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
        });
    })

    $(document).on("change", "#data_type_id", function() {
        isOnairDateForcus = false;
        switchExEstimatePopulation();
        let params = (!$('#current_cart_id').length) ? getApiCommonParams() : getApiCommonParamsCart()
        loading("show")
        disableBtnPlanning()
        $.ajax({
            url: '/agency/api/change_conditions',
            type: 'GET',
            data:  $.extend({}, {type: 'data_type'}, params),
//            timeout: 10000,
            dataType: 'json',
            success: function (data) {
                changeRateTypes(data);
                changePeriodTypes(data);
                changeTargetGroups(data);
                changeTargets(data);
                changePeriodTerm(data);
                changeAggregateTypes(data);
            }
        }).done(function () {
            enableBtnPlanning()
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
        });
    })

    $(document).on("change", "#rate_type_id", function() {
        isOnairDateForcus = false;
        let params = (!$('#current_cart_id').length) ? getApiCommonParams() : getApiCommonParamsCart()
        loading("show")
        disableBtnPlanning()
        $.ajax({
            url: '/agency/api/change_conditions',
            type: 'GET',
            data:  $.extend({}, {type: 'rate_type'}, params),
//            timeout: 10000,
            dataType: 'json',
            success: function (data) {
                changeTargetGroups(data);
                changeTargets(data);
                changePeriodTerm(data);
                changeAggregateTypes(data);
                changePeriodTypes(data)
            }
        }).done(function () {
            enableBtnPlanning()
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
        });
    })

    $(document).on("change", "#aggregate_type_id", function() {
        isOnairDateForcus = false;
        let params = (!$('#current_cart_id').length) ? getApiCommonParams() : getApiCommonParamsCart()
        loading("show")
        disableBtnPlanning()
        $.get('/agency/api/change_conditions', $.extend({}, {
            type: 'aggregate_type'
        }, params), function(data) {
            changeTargetGroups(data);
            changeTargets(data);
            changePeriodTerm(data);
        }).done(function () {
            enableBtnPlanning()
        }).always(function() {
            loading("hide")
        });
    })

    $(document).on("change", "#target_groups", function() {
        isOnairDateForcus = false;
        let params = (!$('#current_cart_id').length) ? getApiCommonParams() : getApiCommonParamsCart()
        loading("show")
        disableBtnPlanning()
        $.ajax({
            url: '/agency/api/change_conditions',
            type: 'GET',
            data:  $.extend({}, {type: 'taeget_group'}, params),
//            timeout: 10000,
            dataType: 'json',
            success: function (data) {
                changeTargets(data);
            }
        }).done(function () {
            enableBtnPlanning()
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
        });
    })

    $(document).on("change", "#period_type_id", function() {
        isOnairDateForcus = false;
        let rateTypeIds = getRateTypes();
        if (rateTypeIds.length) {
            let params = (!$('#current_cart_id').length) ? getApiCommonParams() : getApiCommonParamsCart()
            loading("show")
            disableBtnPlanning()
            $.ajax({
                url: '/agency/api/change_conditions',
                type: 'GET',
                data: $.extend({}, {type: 'period_type'}, params),
//                timeout: 10000,
                dataType: 'json',
                success: function (data) {
                    changeTargetGroups(data);
                    changeTargets(data);
                    changePeriodTerm(data);
                    changeAggregateTypes(data);
                }
            }).done(function () {
                enableBtnPlanning()
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
            });
        }
    })

    $("#planning_month_previous").on("click", function(e) {
        changePlanningDate('month-previous');
    });

    $("#planning_month_next").on("click", function(e) {
        changePlanningDate('month-next');
    });

    $("#campaign_month_previous").on("click", function(e) {
        changeCampaignDate('month-previous');
    });

    $("#campaign_month_next").on("click", function(e) {
        changeCampaignDate('month-next');
    });

    dispSearchConditionRateInput();
    hideBroadcasterCheck();
    initCartInfo('#cart_select');
})
