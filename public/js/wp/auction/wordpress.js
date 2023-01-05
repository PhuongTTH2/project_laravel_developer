let parent = window.parent
let event = null;
let data = null;

const actions = {
    updateAuctions: function(){
        let auctionCommercials = data.response.auctions;

        let eleAuction = $(".auction").first();
        $(".auctions").empty();
        if (auctionCommercials.length) {
            const formatter = new Intl.NumberFormat('ja-JP');
            $(auctionCommercials).each(function(index, ac){
                let isView = (ac.permission && !ac.is_finish);
                if (isView) {
                    $(eleAuction).find('.program_title').text(ac.program_title);
                    $(eleAuction).find('.broadcaster_name').text(ac.broadcaster_name);
                    $(eleAuction).find('.onair_date').text(ac.onair_date.substr(0, 10));
                    $(eleAuction).find('.position').text(ac.position);
                    $(eleAuction).find('.length').text(ac.length);
                    $(eleAuction).find('.count').text(ac.count);
                    $(eleAuction).find('.price_max').text(formatter.format(ac.price_start/ 1000));
                    $(eleAuction).find('.link_ass').attr("href", ac.ass_link);
                    $(eleAuction).find('.status').text((ac.is_bid_self) ? '入札中' : '');

                    $(".auctions").append(eleAuction.clone());
                }
            });
        }
        $(".auctionclass").show();
        let height = document.documentElement.scrollHeight;
        parent.postMessage(JSON.stringify({action: "setHeight", height: height }), '*')
    },
}

$(function() {
    let auctionIds = [];
    $('.auction').each(function(index, element){
        auctionIds.push($(element).data('auction-id'))
    })
    let request = {
        'auctionIds': auctionIds
    };

    $(document).ready(function(){
        parent.postMessage(JSON.stringify({action: "callApiAuctions", "request": request}), '*')
    })
});

window.addEventListener('message', function(e) {
    event = e;

    data = JSON.parse(event.data);
    if (actions[data.action]) {
        actions[data.action]();
    }
}, false)