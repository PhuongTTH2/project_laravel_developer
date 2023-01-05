let parent = window.parent
$.get('/wordpress/api/auth_ass', null,function(response) {
    if(!response.result) {
        $('.auth').hide();
    }
});

let resizeTimer;
let interval = Math.floor(2500 / 60 * 10);
let heightDocument = null;
$(function(){
    $(document).ready(function(){
        heightDocument = document.documentElement.scrollHeight;
        parent.postMessage(JSON.stringify({action: "setHeight", height: heightDocument }), '*')
    })
    $('.sow-accordion-panel').on('click', function(){
        let self = this;

        if (resizeTimer !== false) {
            clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(function () {
            let height = ($(".sow-accordion-panel-content:visible").length == 0) ? heightDocument : document.documentElement.scrollHeight;
            parent.postMessage(JSON.stringify({action: "setHeight", height: height }), '*')
       }, interval);
    })
})
