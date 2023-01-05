$(function(){
    $('#contents_wp').on('load', function(){
        let body = document.getElementById('contents_wp').contentWindow.document.querySelector('body');
        body.style.overflow = 'hidden';
    })
})
