// 初期化フラグ
var initCartsRate = [];
var res_data;
function errNotify(msgs){
    $.notify({message: msgs.join('<br>')},{type: 'danger'});
}

function getApiCommonParamsCart(cartId){
    if (initCartsRate[cartId]) {
        // 通常時
        let baseSelector = $('.conditions_cart_' + cartId);

        let rateTypeIds = getRateTypesCart(baseSelector);
        if(!rateTypeIds.length){
            rateTypeIds = null;//[1,2];
        }

        return {
            commercial_year_months: null,
            area_id: $('#area_' + cartId).val(),
            callsigns: null,
            data_type_id: $('#data_type_id_' + cartId).val(),
            rate_type_ids: rateTypeIds,
            aggregate_type_id: $('#aggregate_type_id_' + cartId).val(),
            target_group_code: $('#target_groups_' + cartId).val(),
            target_code: $('#targets_' + cartId).val(),
            period_type_id: $('#period_type_id_' + cartId).val(),
            'onair_date_from'  : $('#onair_date_from_' + cartId).val(),
            'onair_date_to'    : $('#onair_date_to_' + cartId).val(),
            cart_id: cartId
        }
    } else {
        // 初期
        let form = $('#app_form_' + cartId);
        let rateTypeIds = [];
        if (0 < form.find('input[name=rate_type_id_1]').val()) rateTypeIds.push(form.find('input[name=rate_type_id_1]').val());
        if (0 < form.find('input[name=rate_type_id_2]').val()) rateTypeIds.push(form.find('input[name=rate_type_id_2]').val());

        // areaIdが登録されてなかったとき用
        if (form.find('input[name=area_id]').val() == '') {
            form.find('input[name=area_id]').val( $('#area_' + cartId).val() );
        }

        return {
            'cart_id'          : cartId,
            'area_id'          : form.find('input[name=area_id]').val(),
            'data_type_id'     : form.find('input[name=data_type_id]').val(),
            'aggregate_type_id': form.find('input[name=aggregate_type_id]').val(),
            'target_group_code': form.find('input[name=target_group_code]').val(),
            'target_code'      : form.find('input[name=target_code]').val(),
            'period_type_id'   : form.find('input[name=period_type_id]').val(),
            'rate_type_ids'    : rateTypeIds,
            'callsign': null,
            'commercial_year_months': null,
            'onair_date_from'  : $('#onair_date_from_' + cartId).val(),
            'onair_date_to'    : $('#onair_date_to_' + cartId).val(),
        }
    }
}

function getCartCommonParams(cartId){
    let baseSelector = $('.conditions_cart_' + cartId);

    let period_from_date = null;
    let period_to_date = null;
    if($('#periodTerm_' + cartId).length) {
        periods = $('#periodTerm_' + cartId).val().split('_');
        if (periods.length == 2) {
            period_from_date = periods[0];
            period_to_date = periods[1];
        }
    }
    rateTypeIds = getRateTypesCart(baseSelector);
    if (rateTypeIds.length === 0) {
        rateTypeIds = [0, 0];
    } else if (rateTypeIds.length == 1) {
        if (rateTypeIds[0] == 1) {
            rateTypeIds[1] = 0;
        } else if (rateTypeIds[0] == 2) {
            rateTypeIds[0] = 0;
            rateTypeIds[1] = 2;
        } else {
            rateTypeIds[1] = 0;
        }
    }
    return {
        'cart_id': cartId,
        'area_id': $('#area_' + cartId).val(),
        'data_type_id': $('#data_type_id_' + cartId).val(),
        'rate_type_id_1': rateTypeIds[0],
        'rate_type_id_2': rateTypeIds[1],
        'aggregate_type_id': $('#aggregate_type_id_' + cartId).val(),
        'target_group_code': $('#target_groups_' + cartId).val(),
        'target_code': $('#targets_' + cartId).val(),
        'period_type_id': $('#period_type_id_' + cartId).val(),
        'period_from_date': period_from_date,
        'period_to_date': period_to_date,
        'population_type_id': $('#population_type_id_' + cartId).val(),
    }
}

function getRateTypeIds(){
    return $('.rate_type_ids:checked').map(function(){ return $(this).val() }).get();
}

function getRateTypesCart(baseSelector){
    let checks = $(baseSelector).find('.rate_type_ids:checked');
    ids = [];
    if (checks.length) {
        ids = checks.map(function(){
          return $(this).val();
        }).get();
    }
    return ids;
}

function changeDataTypes(cartId, data){
    let elm = $('#data_type_id_' + cartId);

    let selectedValue = elm.val();
    elm.empty();
    if(data.dataTypes && Object.keys(data.dataTypes).length > 0){
        jQuery.each(data.dataTypes, function(index, d) {
            elm.append(
                $('<option/>').val(d.data_type_id).text(d.display_name)
            )
        })
    }
}

function changeAggregateTypes(cartId, data){
    let elm = $('#aggregate_type_id_' + cartId);
    let selectedValue = elm.val();
    elm.empty();
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

function changePeriodTypes(cartId, data){
    let elm = $('#period_type_id_' + cartId);
    let selectedValue = elm.val();
    elm.empty();
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

function changeRateTypes(cartId, data){
    let elm = $('#rate_types_' + cartId);
    elm.empty();

    if(data.rateTypes && Object.keys(data.rateTypes).length > 0){
        jQuery.each(data.rateTypes, function(index, d) {
            let key = 'rate_type_id_' + d.rate_type_id;
            let input = $('<input/>').attr({
                'id': key + '_' + cartId,
                'type': 'radio',
                'class': 'rate_type_ids search_menu',
                'name': 'rate_type_ids[]'
            }).val(d.rate_type_id);

            let label = $('<label/>').attr({
                'for': key + '_' + cartId,
                'class': 'rate_type_ids search_menu',
                'name': 'rate_type_ids[]',
            }).text(d.display_name);

            elm.append(input).trigger('create');
            elm.append(label).trigger('create');
        });
        elm.find('input:eq(0)').prop('checked', true);
    }
}

function changeTargetGroups(cartId, data){
    let elm = $('#target_groups_' + cartId);

    let selectedValue = elm.val();
    elm.empty();
    if(data.targetGroups && Object.keys(data.targetGroups).length > 0){
        jQuery.each(data.targetGroups, function(index, d) {
            elm.append(
                $('<option/>').val(d.target_group_code).text(d.target_group_name)
            );
        });
    }
    if (elm.find('option').length == 0) {
        elm.append(
          $('<option/>').val(-1).text('指定条件での特性グループは存在しません')
        );
    }
}

function changeTargets(cartId, data){
    let elm = $('#targets_' + cartId);

    let selectedValue = elm.val();
    elm.empty();
    if(data.targets && Object.keys(data.targets).length > 0){
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

function changePeriodTerm(cartId, data){
    let elm = $('#periodTerm_' + cartId);

    let selectedValue = elm.val();
    elm.empty();

    let period = (data.periodTerms && data.periodTerms.length) ? data.periodTerms : [];
    if(!period || !period.length){
        elm.append(
            $('<option/>').val(0).text('指定条件での集計対象期間は存在しません。')
        );
    } else {
        if(period && period.length){
            jQuery.each(period, function(index, d) {
                elm.append(
                    $('<option/>').val(d.period_from_date_ym+'_'+d.period_to_date_ym).text(d.period_string)
                );
            });
        }
    }
}

function changeDefaultSelect(cartId, data) {
    if (data.default_target) {
        if (data.default_target.data_type_id) {
            $('#data_type_id_' + cartId).val(data.default_target.data_type_id);
        }
        if (data.default_target.target_group_code) {
            $('#target_groups_' + cartId).val(data.default_target.target_group_code);
        }
        if (data.default_target.target_code) {
            $('#targets_' + cartId).val(data.default_target.target_code);
        }
    }
}

function reFormValue(toElement, fromElement) {
    toElement.val(fromElement.val());
}

function onchangelogger(type, elm) {
    // let cartId = $(elm).prop('id').split('_').slice(-1)[0];
    // console.log("cart:" + cartId + " change event:" + type);
}
function onupdateparamlogger(type, params) {
    // console.log('api:' + type, params);
}

$(function(){
    function cartChangeCondition(cartId) {
        let params = getCartCommonParams(cartId);
        onupdateparamlogger('all', params);
        $.ajax({
            url: "/agency/cart/api/change_conditions",
            type: 'GET',
            data: $.extend({}, { type: 'all'}, params),
//            timeout: 10000,
            dataType: 'json',
        }).done(function(data) {
            // form内に書き戻し
            reFormValue($('#app_form_' + cartId).find('input[name=area_id]'), $('#area_' + cartId));
            reFormValue($('#app_form_' + cartId).find('input[name=data_type_id]'), $('#data_type_id_' + cartId));
            $('#app_form_' + cartId).find('input[name=rate_type_id_1]').val( params['rate_type_id_1'] );
            $('#app_form_' + cartId).find('input[name=rate_type_id_2]').val( params['rate_type_id_2'] );
            reFormValue($('#app_form_' + cartId).find('input[name=period_type_id]'), $('#period_type_id_' + cartId));
            reFormValue($('#app_form_' + cartId).find('input[name=aggregate_type_id]'), $('#aggregate_type_id_' + cartId));
            reFormValue($('#app_form_' + cartId).find('input[name=target_group_code]'), $('#target_groups_' + cartId));
            reFormValue($('#app_form_' + cartId).find('input[name=target_code]'), $('#targets_' + cartId));
            $('#app_form_' + cartId).find('input[name=period_from_date]').val(params['period_from_date']);
            $('#app_form_' + cartId).find('input[name=period_to_date]').val(params['period_to_date']);
        }).fail(function(data) {
            if (data && data.statusText == "timeout") {
                errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
            } else if (data && data.status == 0) {
                errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
            } else if (data && data.status >= 500) {
                errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
            }
        }).always(function() {
            loading('hide');
        });
    }

    $(document).on("change", "[id^=area]", function(){
        onchangelogger('area', this);

        let thisElm = $(this);
        let cartId = $(this).prop('id').split('_').slice(-1)[0];
        let params = getApiCommonParamsCart(cartId);
        $.get('/agency/api/change_conditions', $.extend({}, { type: 'area'}, params),function(data){
            changeDataTypes(cartId, data);
            changeRateTypes(cartId, data);
            changePeriodTypes(cartId, data);
            changeTargetGroups(cartId, data);
            changeTargets(cartId, data);
            changePeriodTerm(cartId, data);
            changeAggregateTypes(cartId, data);

            changeDefaultSelect(cartId, data);
            cartChangeCondition(cartId);
        });
    });

    $(document).on("change", "[id^=data_type_id]", function(){
        onchangelogger('data_type', this);

        let thisElm = $(this);
        let cartId = $(this).prop('id').split('_').slice(-1)[0];
        let params = getApiCommonParamsCart(cartId);
        loading('show');
        $.ajax({
            url: '/agency/api/change_conditions',
            type: 'GET',
            data: $.extend({}, { type: 'data_type'}, params),
//            timeout: 10000,
            dataType: 'json',
        }).done(function(data) {
            changeRateTypes(cartId, data);
            changePeriodTypes(cartId, data);
            changeTargetGroups(cartId, data);
            changeTargets(cartId, data);
            changePeriodTerm(cartId, data);
            changeAggregateTypes(cartId, data);

            cartChangeCondition(cartId);
        }).fail(function(data) {
            loading('hide');
            if (data && data.statusText == "timeout") {
                errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
            } else if (data && data.status == 0) {
                errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
            } else if (data && data.status >= 500) {
                errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
            } else if (data && data.status == 422) {
                errNotify([data.errMsg]);
            }
        });

        // Exportボタン初期化
        $('#app_form_' + cartId).find('input[name^=cart_output_]').attr('disabled', false);

        // 全国BS
        if(sessionStorage.getItem('isBS')) {
            // 効率表非活性
            $('#app_form_' + cartId).find('input[name=cart_output_cross_count]').attr('disabled', true);
            // 絵柄表非活性
            $('#app_form_' + cartId).find('input[name=cart_output_picture_list]').attr('disabled', true);
        }

        // TVI対応マジックナンバー
        if (params['data_type_id'] == 4) {
            // Exportボタン全て非活性
            $('#app_form_' + cartId).find('input[name^=cart_output_]').attr('disabled', true);
        }
    });

    $(document).on("change", "[id^=rate_type_id_]", function(){
        onchangelogger('rate_type', this);

        let thisElm = $(this);
        let cartId = $(this).prop('id').split('_').slice(-1)[0];
        let params = getApiCommonParamsCart(cartId);
        let typIdName = $(this).prop('id');
        loading('show');
        $.ajax({
            url: '/agency/api/change_conditions',
            type: 'GET',
            data: $.extend({}, { type: 'rate_type'}, params),
//            timeout: 10000,
            dataType: 'json',
        }).done(function(data) {
            changePeriodTypes(cartId, data);
            changeTargetGroups(cartId, data);
            changeTargets(cartId, data);
            changePeriodTerm(cartId, data);
            changeAggregateTypes(cartId, data);

            cartChangeCondition(cartId);
        }).fail(function(data) {
            loading('hide');
            if (data && data.statusText == "timeout") {
                errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
            } else if (data && data.status == 0) {
                errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
            } else if (data && data.status >= 500) {
                errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
            }
        });
    });

    $(document).on("change", "[id^=target_groups]", function(){
        onchangelogger('target_groups', this);

        let thisElm = $(this);
        let cartId = $(this).prop('id').split('_').slice(-1)[0];
        let params = getApiCommonParamsCart(cartId);
        loading('show');
        $.ajax({
            url: '/agency/api/change_conditions',
            type: 'GET',
            data: $.extend({}, { type: 'taeget_group'}, params),
//            timeout: 10000,
            dataType: 'json',
        }).done(function(data) {
            changeTargets(cartId, data);

            cartChangeCondition(cartId);
        }).fail(function(data) {
            loading('hide');
            if (data && data.statusText == "timeout") {
                errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
            } else if (data && data.status == 0) {
                errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
            } else if (data && data.status >= 500) {
                errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
            }
        });
    });

    $(document).on("change", "[id^=targets]", function(){
        onchangelogger('targets', this);

        let thisElm = $(this);
        let cartId = $(this).prop('id').split('_').slice(-1)[0];
        let params = getCartCommonParams(cartId);

        loading('show');
        cartChangeCondition(cartId);
    });

    $(document).on("change", "[id^=period_type_id]", function(){
        onchangelogger('period_type', this);

        let thisElm = $(this);
        let cartId = $(this).prop('id').split('_').slice(-1)[0];
        let rateTypeIds = getRateTypesCart('.conditions_cart_' + cartId);
        if(rateTypeIds.length){
            let params = getApiCommonParamsCart(cartId);
            loading('show');
            $.ajax({
                url: '/agency/api/change_conditions',
                type: 'GET',
                data: $.extend({}, { type: 'period_type'}, params),
//                timeout: 10000,
                dataType: 'json',
            }).done(function (data) {
                changeTargetGroups(cartId, data);
                changeTargets(cartId, data);
                changePeriodTerm(cartId, data);
                changeAggregateTypes(cartId, data);

                cartChangeCondition(cartId);
            }).fail(function (data) {
                loading('hide');
                if (data && data.statusText == "timeout") {
                    errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
                } else if (data && data.status == 0) {
                    errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
                } else if (data && data.status >= 500) {
                    errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
                }
            });
        }
    });

    $(document).on("change", "[id^=aggregate_type_id]", function(){
        onchangelogger('aggregate_type', this);

        let thisElm = $(this);
        let cartId = $(this).prop('id').split('_').slice(-1)[0];
        let params = getApiCommonParamsCart(cartId);
        loading('show');
        $.ajax({
            url: "/agency/api/change_conditions",
            type: 'GET',
            data: $.extend({}, { type: 'aggregate_type'}, params),
//            timeout: 10000,
            dataType: 'json',
        }).done(function(data) {
            changeTargetGroups(cartId, data);
            changeTargets(cartId, data);
            changePeriodTerm(cartId, data);

            cartChangeCondition(cartId);
        }).fail(function(data) {
            loading('hide');
            if (data && data.statusText == "timeout") {
                errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
            } else if (data && data.status == 0) {
                errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
            } else if (data && data.status >= 500) {
                errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
            }
        });
    });

    $(document).on('change', '[id^=periodTerm]', function() {
        onchangelogger('periodTerm', this);

        let cartId = $(this).prop('id').split('_').slice(-1)[0];

        loading('show');
        cartChangeCondition(cartId);
    });

    $(document).on('change', '[id^=population_type_id]', function() {
        let cartId = $(this).prop('id').split('_').slice(-1)[0];
        let params = getCartCommonParams(cartId);
        onupdateparamlogger('population_type', params);
        loading('show');
        $.ajax({
            url: "/agency/cart/api/change_conditions",
            type: 'GET',
            data: $.extend({}, { type: 'population_type'}, params),
//            timeout: 10000,
            dataType: 'json',
        }).done(function(data) {
            $('#app_form_' + cartId).find('input[name=population_type_id]').val(params['population_type_id']);
        }).fail(function(data) {
            if (data && data.statusText == "timeout") {
                errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
            } else if (data && data.status == 0) {
                errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
            } else if (data && data.status >= 500) {
                errNotify(["・サーバに接続できませんでした。しばらく経ってからアクセスしてください。"]);
            }
        }).always(function() {
            loading('hide');
        });
    });
});
