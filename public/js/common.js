function changeCheckAll(selectors, allSelector){
  selectors.on('change', function(i, elm) {
    let index = $(this).prop('id').split('_').slice(-2)[0];
    let check = $(this).prop('checked');
    let checked = selectors.toArray().reduce(function(prev, current, i, array) {
      return prev & $(current).prop('checked');
    }, true);
    allSelector.prop('checked', checked);
  })
}
function notifyDownload(){
    $.notify({
        message: 'ファイル出力中です。しばらくお待ちください。'
    },{
        type: 'info',
        delay: 4000
    });
}

function getConfigNotifyAnimates(){
    return {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
    };
 }
function notifyError(msg){
    $.notify({message: msg},{type: 'danger'});
}

function initCartInfo(selector) {
  tippy(selector, {
    delay: 100,
    size: 'large',
    duration: 500,
    animation: 'scale',
    allowHTML: true,
    placement: 'left',
    onShow: function(instance) {
        $.ajax({
            url: '/agency/api/cart/' + $(selector).val(),
            type: 'GET',
//            timeout: 10000,
        }).done(function(res) {
            let contents = [];
            if (res.commercials) {
                if (res.price == 0) {
                    contents.push($("<p>", {text: 'カート内にCM枠はありません'}).html());
                } else {
                    contents.push($("<p>", {text: 'カート内合計金額(千円): ' + res.price}).html());
                    $.each(res.commercials, function (cmLength, cmNum) {
                        contents.push($("<p>", {text: 'カート内CM本数(' + cmLength + '秒): ' + cmNum}).html());
                    });
                }
                instance.setContent('<span style="font-size:1.4em; text-align:left">' + contents.join('<br>') + '</span>')
            }
        }).fail(function (data) {
            if (data && data.statusText == "timeout") {
                notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
            } else if (data && data.status == 0) {
                notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
            } else if (data && data.status >= 500) {
                notifyError("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
            }
        })
    }
  });
}

function apiErrNotify(data)
{
    let messages = [];
    if (data && $.inArray(data.statusText, ["timeout", "error"])) {
        messages.push("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
    } else if (data && data.status >= 500) {
        messages.push("・サーバに接続できませんでした。しばらく経ってからアクセスしてください。");
    }

    if (messages.length > 0) {
        return $.notify({message: messages.join('<br>')},{type: 'danger'});
    }
    return;
}


