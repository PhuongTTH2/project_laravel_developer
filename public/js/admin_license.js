$(function(){

  $(".data_license_group_modal").iziModal({appendTo: "#form"});

  $('.open_target_groups').on("click", function() {
      $('#'+$(this).data('modal')).iziModal('open')
  })

  $('.set_target_group').on("click", function() {
      $('#'+$(this).data('modal_key')).iziModal('close')
  })

  $('.min60_broadcaster').on("change", function() {
      let selectorMin60 = $('#'+$(this).attr("id").replace( 'min60_', ''));
      if ($(this).prop('checked')) {
          if (selectorMin60.val() == 0) {
              selectorMin60.val(1);
          }
      } else {
          selectorMin60.val(null);
      }
  })

  $('.broadcaster').on("change", function() {
      let val = $(this).val();
      if (val == 0) {
          $('#min60_'+$(this).attr("id")).prop("checked",false);
      }
  })

  //check target group all
  $('.group_all_toggle').on("click", function() {
  let chk = $(this).prev().prop("checked")
  $(this).prev().prop("checked", !chk)
  $(this).closest('.data_license_group_modal').find('.tg_checks').prop('checked', !chk)
})

//set select target group
$('.set_target_group').on("click", function() {
  $('#'+$(this).data('tg_key')).text('')
  $('#'+$(this).data('modal_key')).iziModal('close')
  let checkes = $(this).closest('.data_license_group_modal').find('.tg_checks:checked')
  let targetGroups = []
  checkes.each(function() {
    targetGroups.push($(this).val())
  })

  $('#val_'+$(this).data('tg_key')).val(null) 
  if(targetGroups.length) {
      let strTargetGroups = targetGroups.join(',')
      $('#val_'+$(this).data('tg_key')).val(strTargetGroups) 
      if (strTargetGroups.length > 25) {
        strTargetGroups = strTargetGroups.slice(0, 25)+'...'
      }
      
     $('#'+$(this).data('tg_key')).text(strTargetGroups)
  }
})

$('.min60_broadcaster').on("change", function() {
  let selectorMin60 = $('#'+$(this).attr("id").replace( 'min60_', ''))
  if ($(this).prop('checked')) {
    if (selectorMin60.val() == 0) {
      selectorMin60.val(1)
    }
  } else {
    selectorMin60.val(null)
  }
})

$('.broadcaster').on("change", function() {
  let val = $(this).val()
  if (val == 0) {
    $('#min60_'+$(this).attr("id")).prop("checked",false)
  }
})

paramsDataPickers = {
  language: 'ja',
  format: "yyyy-mm-dd",
  autoclose: true,
  todayHighlight: true,
  weekStart: 1
}
$('input[name=effective_date]').datepicker(paramsDataPickers)
});

function saveLicense()
{
  let now = new Date();
  now = [now.getFullYear(), ("0"+(now.getMonth()+1)).slice(-2), ("0"+now.getDate()).slice(-2)].join('-');
  if($('input:text[name=effective_date]').val() === now) {
      $(".modal_confirm_effective_date").iziModal({
          headerColor: '#54c4d8',
          background: '#e1f3ff',
          width: '40%',
          padding: 20,
          title: 'ライセンス適用日について'
      }).iziModal('open');
  } else {
      $('form[name=form_save]').submit();
  }
}