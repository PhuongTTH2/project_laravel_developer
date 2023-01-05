var template_id = null;
function doEdit()
{
    let param = { 
        '_token' : $('input[name="_token"]').val(),
        'name': $('.edit_template').find('input[name=template_name]').val()
    };

    if (template_id) {
        param.template_id = template_id;
    }

    $.post('/admin/license-template/api/update', param,function(res){
        if (res.result === false) {
            return $.notify({message: res.errors.map(function(item){ return '・' + item }).join('<br />')},{type: 'danger'});
        }
        location.href = '/admin/license-template';

    }).fail(function(e) {
        return $.notify({message: "テンプレート更新に失敗しました。"},{type: 'danger',});
    });
}


function editTemplate(id)
{
    let modal = $(".edit_template");
    let configs = {
        headerColor: '#54c4d8',
        background: '#e1f3ff',
        width: '40%',
        padding: 20,
    };
    let title = 'ライセンステンプレート新規作成';
    template_id = null;

    modal.find('.block_template_id').hide();
    modal.find('input[name=edit_template]').val('登録');
    if (id != null ) {
        title = 'ライセンステンプレート編集';
        modal.find('input[name=edit_template]').val('更新');
        modal.find('.block_template_id').show();
        configs.onOpening = function() {
            $.get('/admin/license-template/api/get/'+id, null,function(res){
                $(".edit_template").find('input[name=template_name]').val(res.name)
                $(".edit_template").find('.template_id').text(res.id)
                template_id = res.id;
            });
        }(id);
    }
    modal.iziModal(configs);
    modal.iziModal('setTitle',title);
    modal.iziModal('open');
}

function deleteConfirm(id)
{
    $.get('/admin/license-template/api/get/'+id, null,function(res){
        $(".del_confirm").iziModal({
            onOpening: function(modal) {
                let form = $('form[name="form_delete"]');
                form.find('.template_name').text(res.name)
                form.attr('action', '/admin/license-template/' + res.id);
            }
        }).iziModal('open');
    }).fail(function(e) {
        if (e.status === 404) {
            return $.notify({message: "テンプレートが見つかりませんでした。"},{type: 'danger',});
        } else {
            return $.notify({message: "システムエラーが発生しました。"},{type: 'danger',});
        }
    });
}