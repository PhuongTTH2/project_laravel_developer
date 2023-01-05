$(function () {
    $('.date_time_picker').attr('autocomplete', 'off');
    $('#summernote').summernote({
      'width': '900px',
      'height': '300px',
      toolbar: [
      ['style', ['bold', 'italic', 'underline', 'fontsize', 'color', 'clear']],
      ['para', ['paragraph', 'link', 'picture']],
      ['ope', ['undo', 'codeview']]
      ]
    });
    $('.date_time_picker').datetimepicker({
      locale: 'ja',
    });

    $('#form_search').submit(function() {
        let start = $('input[name="start_time"]').val();
        let end = $('input[name="end_time"]').val();
        if (start.length > 0 && end.length > 0) {
            if(start > end) {
                $.notify({message: '表示期間の指定に誤りがあります。'},{type: 'danger'});
                return false;
            }
        }
        return true;
    });

    $('#formCreate').submit(function() {
        let ele = $('#summernote');
        if (ele.summernote('codeview.isActivated')) {
            ele.summernote('codeview.deactivate');
        }
    });
});