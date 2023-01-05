$(function($) {
    $("#ass_file_uploader").click(function() {
      var fileUploder = $("#ass_file");
      fileUploder.click();
    });
    $("#ass_file").change(function() {
      var regex = /\\|\\/;
      var array = $(this).val().split(regex);
      $("#upload_file_name").val(array[array.length - 1]);
    });
    
    /* sticky header */
    /* テーブル幅取得 */

    //ロードリサイズの処理
    var tablewidth = $('.import_cm_table tbody').width();
    $('.import_cm_table thead').width(tablewidth);
    $(window).on('load resize', function(){
      var tablewidth = $('.import_cm_table tbody').width();
      $('.import_cm_table thead').width(tablewidth);
      //$('.import_cm_table tbody').width(tablewidth);
    });
    
    //スクロールの処理
    $(window).on('scroll', function() { 
      //thead横スクロール対応
      $(this).scrollLeft();
      
      if($('.import_cm_table thead').length) {
          var tblLeftPosition = $('.import_cm_table thead').offset().left;
          tblLeftPosition = tblLeftPosition - $(this).scrollLeft();
          $('.import_cm_table thead').css('left', tblLeftPosition);
      }
    });
    
    //サイドメニュー開閉時テーブル幅調整
    var menuBtn = $("#menu_btn");
    menuBtn.on("click", function(){
      setTimeout(function(){
        //テーブル横幅調整
        var tablewidth = $('.import_cm_table tbody').width();
        $('.import_cm_table thead').width(tablewidth);
      },500);
    });

    if ($("#sidebar ul.sidemenu").hasClass("menu_open")) {
      //theadの横位置調整
      setTimeout(function(){
        //テーブル横幅調整 メニュー開いている時にズレるので setTimeout
        var tblw = $('.import_cm_table tbody').width();
        $('.import_cm_table thead').width(tblw);
      },500);
    } else {
      //テーブル横幅調整
      var tblw = $('.import_cm_table tbody').width();
      $('.import_cm_table thead').width(tblw);
    }

    paramsDataPickers = {
      language: 'ja',
      format: "yyyy-mm-dd",
      autoclose: true,
      todayHighlight: true,
      weekStart: 1
    }
    if($('.onair_date').length) {
        $('.onair_date').datepicker(paramsDataPickers)
    }

    if(!$('input[name=onair_date_from]').val() && !$('input[name=onair_date_to]').val()) {
        updateOnairDate();
    }
});

$(window).on('load resize', function(){
    var h = $(window).height() - 147 - 120;
    $(".table_box").css("max-height", h + 'px');
});

function goEdit(type)
{
    let commercials = [];
    $("input:checkbox[name='commorcial[]']:checked").each(function() {
        commercials.push($(this).val());
        $('form[name=go_edit]').append($('<input/>', {type: 'hidden', name: 'commercial_ids[]', value: $(this).val()}));
    });

    if (commercials.length === 0) {
        return $.notify({message: 'CM枠を選択してください。'},{type: 'danger'});
    }

    $('form[name=go_edit]').attr('action', "/station/edit_cm/" + type + '/list');
//    $('form[name=go_edit]').append($('<input/>', {type: 'hidden', name: 'param', value: commercials}));
    $('form[name=go_edit]').submit();

}

function goUpdate()
{
    if ($("input:checked[name='commorcial[]']").length === 0) {
        $.notify({message: 'CM枠を選択してください。'},{type: 'danger'});
    }
}
function checkAll(e)
{
    $("input[name='commorcial[]']").prop('checked', e.checked);
}
function checkAllAjust(e) 
{
    let checked = ($("input:checked[name='commorcial[]']").length == $("input[name='commorcial[]']").length);
    $('input[name=check_all]').prop('checked', checked);
}

function confirmRemove()
{
    $('#modal_confirm_remove').iziModal({
        padding: 20
    }).iziModal('open');
}
function confirmUpdate()
{
    $('#modal_confirm_update').iziModal({
        padding: 20
    }).iziModal('open');
}
function confirmModal(type)
{
    $('#modal_confirm').iziModal({
        padding: 20
    }).iziModal('open');
}

function checkCommercial(type, isExecute)
{
    if (isExecute) {
        $('.btn_execute').prop('disabled', true)
    }
    
    let params = {
        'latest_updateds': $('input[name="latest_updateds[]"]').map(function(index, element){ return $(element).val(); }).toArray(),
        'commercial_ids': $('input[name="commercial_ids[]"]').map(function(index, element){ return $(element).val(); }).toArray(),
        '_token' : $('input[name=_token]').val(),
        'type': type,
        'num_target': $('select[name=num_target]').val(),
        'start_position': $('input[name=start_position]').val(),
        'code_ass_plus': $('input[name=code_ass_plus]').val(),
        'callsign': $('input[name=callsign]').val(),
        'end_position': $('input[name=end_position]').val(),
        'channel': $('input[name=channel]').val(),
        'price': $('input[name=price]').val(),
        'onair_date': $('input[name=onair_date]').val(),
        'program_start_time': $('input[name=program_start_time]').val(),
        'day_of_week_id': $('input[name=day_of_week_id]').val(),
        'sales_start_time': $('input[name=sales_start_time]').val(),
        'position': $('input[name=position]').val(),
        'sales_end_time': $('input[name=sales_end_time]').val(),
        'pt_sb_code': $('input[name=pt_sb_code]').val(),
        'cancel_limit_time': $('input[name=cancel_limit_time]').val(),
        'length': $('input[name=length]').val(),
        'program_title': $('input[name=program_title]').val()
    };
    $.post('/station/edit_cm/api/validate_update', params,function(res){
        if(!res.result) {
            $('.btn_execute').prop('disabled', false)
            $.notify({message: res.errors.join('<br>')},{type: 'danger'});
            return false;
        }

        if (isExecute) {
            $('form[name=do_execute]').submit();
        } else {
            confirmModal();
        }
    });
}

function updateOnairDate()
{
    let commercialYm = $('select[name="commercial_ym"]').val();
    if (!commercialYm) {
        return false;
    }

    params = [
      commercialYm.substr(0,4),
      commercialYm.substr(4)
    ].join('/');

    $.get('/station/api/get_onair_date_term/'+params, null, function(res) {
        if (res.result === false) {
            $.notify({message: res.errors.join('<br>')},{type: 'danger'});
            return false;
        }

        let elemFrom = $('input[name=onair_date_from]');
        let elemTo = $('input[name=onair_date_to]');

        elemFrom.datepicker('setStartDate', res.termsOnairDate.min);
        elemFrom.datepicker('setEndDate', res.termsOnairDate.max);
        elemTo.datepicker('setEndDate', res.termsOnairDate.min);
        elemTo.datepicker('setEndDate', res.termsOnairDate.max);
  
        elemFrom.datepicker('setDate', res.termsOnairDate.min)
        elemTo.datepicker('setDate', res.termsOnairDate.max)
        
    });
}