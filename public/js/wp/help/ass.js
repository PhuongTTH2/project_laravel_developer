window.addEventListener('message', function(event) {

    let data = JSON.parse(event.data)

    if (data.action == 'setHeight') {
        setHeight(event, data)
    }

    if (data.action == 'callApiIsAuthAss') {
        apiIsAuthAss(event)
    }


}, false)

function setHeight(event, data) {
    $('#contents_wp').height(data.height)
}

function apiIsAuthAss(event) {
    $.get('/wordpress/api/auth_ass', null,function(response) {
        event.source.postMessage(JSON.stringify({action: "hideAuthMenu", auth: response.result }), '*')
    });
}
