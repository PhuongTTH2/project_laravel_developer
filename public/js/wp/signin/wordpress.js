let parent = window.parent

$(function(){

    if (location.pathname == '/' && $('#login', parent.document).length == 0) {
        location.href = '/login'
    }

    $(document).ready(function(){
        let height = document.documentElement.scrollHeight;
        parent.postMessage(JSON.stringify({action: "setHeight", height: height }), '*')
    })

    $(document).on("click", "*[name=login]", function(){
        submitForm()
    })

    $("body").on("keydown", function(e){
        if (e.keyCode === 13) {
            submitForm()
        }
    })

})

window.addEventListener('message', function(event) {

    let data = JSON.parse(event.data)

    if (data.action == 'setInput') {
        if (data.account_error != '') {
            $('#account_error').text(data.account_error)
            $('#account_error').show()
        } else {
            $('#account_error').hide()
        }
        if (data.password_error != '') {
            $('#password_error').text(data.password_error)
            $('#password_error').show()
        } else {
            $('#password_error').hide()
        }
    }

}, false)

function submitForm() {
    let account = $('*[name=account]').val()
    let password = $('*[name=password]').val()
    parent.postMessage(JSON.stringify({action: "executeLogin", account: account, password: password }), '*')
}