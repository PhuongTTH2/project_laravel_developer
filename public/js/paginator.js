function contentsPaging(configs){

  $('ul.pagination').hide();
  $(configs.container).jscroll({
    autoTrigger: true,
    loadingHtml: '<div class="content_lds-ellipsis"><div class="lds-ellipsis">Loading...<div></div><div></div><div></div><div></div></div></div>',
    padding: 20,
    nextSelector: '.pagination li.active + li a',
    contentSelector: configs.container,
    loadingFunction: function() {
//      loading('show');
    },
    callback: function() {
      $('#table_tbody_position_list').append($(this).find('.row_content'));
      $(this).find('table').remove();
      $('ul.pagination').hide();
      $('.jscroll-added').remove();
//      loading('hide');
    }
  });
}
