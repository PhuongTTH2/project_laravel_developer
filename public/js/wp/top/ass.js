window.addEventListener('message', function(event) {

    let data = {};
    try { data = JSON.parse(event.data); } catch (e) {}
    if (data.action == 'setHeight') {
        setHeight(event, data)
    }

    if (data.action == 'callApiIsShowConditions') {
        apiIsShowConditions(event)
    }

    if (data.action == 'callApiIsShowAuctionBanner') {
        apiIsShowAuctionBanner(event)
    }

    if (data.action == 'callApiChangeConditionsTimeTable') {
        apiChangeConditions(event, 'timetable')
    }

    if (data.action == 'callApiChangeConditionsPosition') {
        apiChangeConditions(event, 'position')
    }

}, false)

function setHeight(event, data) {
    $('#contents_wp').height(data.height)
}

function apiIsShowConditions(event) {
    $.get('/wordpress/api/is_show_conditions', null, function(data) {
        if (data.timetable) {
            $.get('/wordpress/api/get_condition_areas', null, function(data) {
                event.source.postMessage(JSON.stringify({action: "setConditionAreasTimeTable", areas: data.areas }), '*')
            })
            event.source.postMessage(JSON.stringify({action: "setVisibleTimeTable", visible: true }), '*')
        } else {
            event.source.postMessage(JSON.stringify({action: "setVisibleTimeTable", visible: false }), '*')
        }
        if (data.position) {
            $.get('/wordpress/api/get_condition_areas', null, function(data) {
                event.source.postMessage(JSON.stringify({action: "setConditionAreasPosition", areas: data.areas }), '*')
            })
            event.source.postMessage(JSON.stringify({action: "setVisiblePosition", visible: true }), '*')
        } else {
            event.source.postMessage(JSON.stringify({action: "setVisiblePosition", visible: false }), '*')
        }
    })
}

function apiIsShowAuctionBanner(event) {
    $.get('/wordpress/api/is_show_auction_banner', null, function(data) {
        if (data.auction_banner) {
            event.source.postMessage(JSON.stringify({action: "setVisibleAuctionBanner", visible: true }), '*')
        } else {
            event.source.postMessage(JSON.stringify({action: "setVisibleAuctionBanner", visible: false }), '*')
        }
    })
}

function apiChangeConditions(event, type) {

    let data = JSON.parse(event.data)

    $.get('/wordpress/api/change_conditions', $.extend({}, {areaId: data.area_id}), function(data) {
        if (type == 'timetable') {
            event.source.postMessage(JSON.stringify({action: "changeConditionsTimeTable", broadcasters: data.broadcasters }), '*')
        }
        if (type == 'position') {
            event.source.postMessage(JSON.stringify({action: "changeConditionsPosition", broadcasters: data.broadcasters }), '*')
        }
    })
}
