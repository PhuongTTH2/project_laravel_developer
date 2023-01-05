
$(function(){
    $('#contents_wp').on('load', function(){
        setInput()
    })
})

window.addEventListener('message', function(event) {

    let data = JSON.parse(event.data)

    if (data.action == 'setHeight') {
        setHeight(event, data)
    }

    if (data.action == 'executeLogin') {
        executeLogin(event, data)
    }

    if (data.action == 'getInputError') {
        getInputError(event)
    }

}, false)

function setHeight(event, data) {
    $('#contents_wp').height(data.height)
}

function executeLogin(event, data) {
    $('*[name=account]').val(data.account)
    $('*[name=password]').val(data.password)
    $('*[name=login]').click()
}


function setInput() {
    let account_error = $('#account_error').text();
    let password_error = $('#password_error').text();
    let errors = [];

    if(account_error.length) errors.push(account_error);
    if(password_error.length) errors.push(password_error);

    if(errors.length) {
        $.notify({message: errors.map(function(item){ return '・' + item }).join('<br />')},{type: 'danger'});
    }
}