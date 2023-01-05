$(function($) {
    $(".file_uploader").click(function() {
        $(this).siblings('.ass_file').click();
    });
    $(".file_button").click(function() {
        $(this).siblings('.ass_file').click();
    });
    $(".ass_file").change(function() {
        var regex = /\\|\\/;
        var array = $(this).val().split(regex);
        
        $(this).siblings('.upload_file_name').val(array[array.length - 1]);
    });
});