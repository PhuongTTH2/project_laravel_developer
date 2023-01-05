// 削除ボタン
function formDelete(btn) {
  var ele = btn.parentNode.parentNode
  ele.style.display = "none"
}

// 追加ボタン
function addForm(btn) {
  var addElement = '<tr><td></td><td><input type="text" name="access_ips[]"><span class="delete_ip_btn fa fa-close" onclick="formDelete(this)" style="margin-left: 4px;"></span></td></tr>';
  var insertPoint = btn.parentNode.parentNode
  $(addElement).insertBefore(insertPoint)
}
function addLicenseTbl(btn) {
      var target = $('.data_license_box')
      if (target.length > 1) {
          var clone = target.eq(0).clone(true)
      } else {
          var clone = target.clone(true)
      }

      let uniqueStr = getUniqueStr()
      clone.find('.data_license').find('input[type="checkbox"]').map(function() {
        $(this)
        .attr(
          'name', 
          $(this).attr('name').replace(/^([^\[]+)\[([^\]]+)\](.+)$/, "$1["+uniqueStr+"]$3")
        )
        .prop('checked', false)
        $(this).attr('id', uniqueStr + $(this).attr('id'))
      })
      clone.find('.data_license').find('label').map(function() {
        $(this).attr('for', uniqueStr + $(this).attr('for'))
      })
      clone.find('.data_license').find('.record').map(function() {
        
        let dataKey = $(this).data('key')
        let splits = dataKey.split('-')
        
        $(this).find('.'+ dataKey).attr({'class': uniqueStr+'-'+splits[1]})
        $(this).attr('data-key', uniqueStr+'-'+splits[1])
        $(this).data('key', uniqueStr+'-'+splits[1])
      })
    

      target.parent().append(clone)
}
function getUniqueStr(){
  return Math.random().toString(36).slice(-8)
}
$(function(){

  $.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });

  let uniqueStr = getUniqueStr()
  $('.data_license').find('input[type="checkbox"]').map(function() {
    let splitNames = $(this).attr('name').split('-')
    let name = splitNames[0]+'['+uniqueStr+']'+splitNames[1]
    $(this).attr('name', name)
    $(this).attr('id', uniqueStr + $(this).attr('id'))
  })
  $('.data_license').find('label').map(function() {
    $(this).attr('for', uniqueStr + $(this).attr('for'))
  })

  $('.data_license').find('.record').map(function() {
    
    let dataKey = $(this).data('key')
    $(this).find('.'+ dataKey).attr({'class': uniqueStr+'-'+dataKey})
    $(this).attr('data-key', uniqueStr+'-'+dataKey)
    $(this).data('key', uniqueStr+'-'+dataKey)
  })
  sessionStorage.clear()
  









  $(".del_confirm").iziModal()
  $(".data_license_group_modal").iziModal()

  /**event click ------------------------------------------------------------------------------------------- */
  $('#group_all').on('click', function() {
    $('#contents_tg').find('input[type="checkbox"]').prop('checked', $(this).prop('checked'))
  })

  /**event click ------------------------------------------------------------------------------------------- */
  $("#set_target_group").on("click", function() {
    let dataKey = sessionStorage.getItem('dataKey')
    let targetGroups = []
    
    $('.data_license_group_modal').find('.group:checked').map(function() {
        if($(this).val().length){
            targetGroups.push($(this).val())
        }
    });
    if(targetGroups.length){
        let lengthMax = 15
        let strTargetGroup = targetGroups.join(',')
        if(strTargetGroup.length < lengthMax){
            $('.' + dataKey).text(strTargetGroup)
        } else {
            $('.' + dataKey).text(strTargetGroup.slice(0,lengthMax) + '....')
        }
    }
    sessionStorage.setItem('targetGroups', JSON.stringify({[dataKey]: targetGroups}))
    $(".data_license_group_modal").iziModal('close')
  })

  /**event click ------------------------------------------------------------------------------------------- */
  $(document).on("click", ".select_target_group", function(){
  //$(".select_target_group").on("click", function() {
    let modal = $('.data_license_group_modal')
    let contents = modal.find("#contents_tg")
    //let dataKey =  $(this).data('key')
    let dataKey = $(this).parent('.record').data('key')

    let = targetGroupsSessions = sessionStorage.getItem('targetGroups')
    let selects = []
    if(targetGroupsSessions){
        tg = JSON.parse(targetGroupsSessions)
        Object.keys(tg).forEach(function (key) {
            if (key == dataKey){
                selects = tg[key]
                return
            }
        });
    }
    sessionStorage.setItem('dataKey', dataKey)
    
    let arrDataKeys = dataKey.split('_')
    params = {
        area_id: arrDataKeys[1],
        data_type_id: arrDataKeys[2]
    }

    $.get('/admin/company/target_groups', params)
    .done(function(res) {
      if(!res.length){
        $.notify({message: '指定した条件のターゲットグループが存在しません。'},{type: 'danger'});
      } else {
        contents.empty()
        res.forEach(function(obj){
          let li = $('<li>')
          checked = ($.inArray(obj.target_group_code, selects) !== -1)

          li.append($('<input>').attr({
            'type':'checkbox',
            'name': 'group',
            'class': 'group',
            'id': 'group_'+obj.target_group_code,
          }).val(obj.target_group_code).prop('checked', checked))
          li.append($('<label>').attr({
            'for':'group_'+obj.target_group_code,
          }).text(obj.target_group_name))
          contents.append(li)
        })
        modal.iziModal('open')
      }
    })
    .fail(function() {})
  })

  let datepickerConfig = {
          language: 'ja',
          format: "yyyy-mm-dd",
          autoclose: true,
            todayHighlight: true
  }

  $('.datepicker_from').datepicker(datepickerConfig);
  $('.datepicker_to').datepicker(datepickerConfig);
  $('.input-daterange').datepicker(datepickerConfig);
});