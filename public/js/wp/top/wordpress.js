let parent = window.parent

$(function(){
    $(document).ready(function(){
        let height = document.documentElement.scrollHeight;
        parent.postMessage(JSON.stringify({action: "setHeight", height: height }), '*')
        if($('.time-table').length > 0) {
            $('.time-table select').attr('disabled', true);
            parent.postMessage(JSON.stringify({action: "callApiIsShowConditions" }), '*')
        }
        if($('.position').length > 0) {
            $('.position select').attr('disabled', true);
            parent.postMessage(JSON.stringify({action: "callApiIsShowAuctionBanner" }), '*')
        }
    })

    $(document).on("change", ".time-table select", function(){
        let area_id = $(this).val()
        parent.postMessage(JSON.stringify({action: "callApiChangeConditionsTimeTable", area_id: area_id }), '*')
    })

    $(document).on("change", ".position select", function(){
        let area_id = $(this).val()
        parent.postMessage(JSON.stringify({action: "callApiChangeConditionsPosition", area_id: area_id }), '*')
    })

})

window.addEventListener('message', function(event) {

    let data = JSON.parse(event.data)
    let area_id = null
    if (data.action == 'setConditionAreasTimeTable') {
        // JSではデータがorder_num_2順に取得できない場合があるので並び替える
        areas = [];
        jQuery.each(data.areas, function (index, d) {
            areas.push(d);
        });
        areas.sort(function(a, b) {
            return a["order_num_2"] - b["order_num_2"];
        });
        
        let elm = $('.time-table select')
        jQuery.each(areas, function (index, d) {
            elm.append(
                $('<option/>').val(d.id).text(d.area_name).attr('selected', (index === 0))
            )
            area_id = elm.val()
        })
        $('.time-table select').attr('disabled', (area_id === null));
        parent.postMessage(JSON.stringify({action: "callApiChangeConditionsTimeTable", area_id: area_id }), '*')
    }

    if (data.action == 'setConditionAreasPosition') {
        // JSではデータがorder_num_2順に取得できない場合があるので並び替える
        areas = [];
        jQuery.each(data.areas, function (index, d) {
            areas.push(d);
        });
        areas.sort(function(a, b) {
            return a["order_num_2"] - b["order_num_2"];
        });
        
        let elm = $('.position select')
        let area_id = null
        jQuery.each(areas, function (index, d) {
            elm.append(
                $('<option/>').val(d.id).text(d.area_name).attr('selected', (index === 0))
            )
            area_id = elm.val()
        })
        $('.position select').attr('disabled', (area_id === null));
        parent.postMessage(JSON.stringify({action: "callApiChangeConditionsPosition", area_id: area_id }), '*')
    }


    let form;
    let hiddenIsTop = $('<input>').attr({
        type: 'hidden',
        name: 'is_top',
        value: true
    });
    if (data.action == 'setVisibleTimeTable') {
        if (data.visible) {
            $('.time-table').show()

            form = $('#time-table').parents('form')
            form.attr('action', '/agency/program_guide')
            form.attr('target', '_parent')
            hiddenIsTop.appendTo(form);
        } else {
            $('.time-table').hide()
        }
    }

    if (data.action == 'setVisiblePosition') {
        if (data.visible) {
            $('.position').show()

            form = $('#position').parents('form');
            form.attr('action', '/agency/positions')
            form.attr('target', '_parent')
            hiddenIsTop.appendTo(form);
        } else {
            $('.position').hide()
        }
    }

    if (data.action == 'setVisibleAuctionBanner') {
        if (data.visible) {
            $('.auction_banner').show()
        } else {
            $('.auction_banner').hide()
        }
    }

    if (data.action == 'changeConditionsTimeTable') {
        changeBroadcasters(data.broadcasters, '.time-table', 'radio')
    }

    if (data.action == 'changeConditionsPosition') {
        changeBroadcasters(data.broadcasters, '.position', 'checkbox')
    }

    let height = document.documentElement.scrollHeight;
    parent.postMessage(JSON.stringify({action: "setHeight", height: height }), '*')

}, false)

function changeBroadcasters(broadcasters, elementName, type){
    let elm = $(elementName+' .broadcast')
    let suffix = '<br>'
    let checked
    if(broadcasters){
        elm.empty()
        let count = 0;
        jQuery.each(broadcasters, function(index, d) {
            if (broadcasters.length - 1 == index) {
                suffix = ''
            }

            checked = '';
            if (elementName === '.position') {
                checked = "checked"
            } else {
                if (count == 0) {
                    checked = "checked";
                }
            }

            let addElement =  $('<input>', {
                'type': type,
                'name': 'callsign[]',
                'value': d.callsign,
            }).prop("checked", checked);

            if (type == 'checkbox') {
                elm.append(addElement).append(d.broadcaster_name + '<div style="float:right;" id="ic_block_'+d.callsign+'"><img src="/img/tv.gif" width="18px" alt="" class="ic_tv">' + (d.cu_entry == true ? '<img src="/img/cu.gif" width="18px" alt="" class="ic_cu"></div>' : '<span style="margin-right:18px" class="ic_cu"></span></div>') + suffix + '<div display="none" style="clear:both"></div>');
            } else {
                elm.append(addElement).append(d.broadcaster_name + suffix);
            }
            count++;
        })
    }
}