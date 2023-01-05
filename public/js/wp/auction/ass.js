let event = null;
let data = null;
const actions = {
    callApiAuctions: function(){
        $.get('/agency/auctions/api/'+$('input[name="auction_code"]').val()+'/list', null,function(response) {
            event.source.postMessage(JSON.stringify({action: "updateAuctions", "response": response }), '*')
        });
    },
    setHeight: function(){
        $('#contents_wp').height(data.height)
    }
}

window.addEventListener('message', function(e) {
    event = e;
    data = JSON.parse(event.data);
    actions[data.action]();
}, false);
