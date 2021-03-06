if (typeof ui == 'undefined') var ui = {};
ui.ListAttrDlg = {

id: '',

is_change: false,

init:
function init () {
    ui.ListAttrDlg.id = '#list_attr_dlg';

    $('#btn_list_attr_update').click(function (event) {
        var err = ui.FormChecker.check_config_error(
            ui.ListAttrDlg.id + ' input');
        if ( err.count != 0 ) {
            toast.set(err.count + " " + _('errors_found_aborting')).show();
        } else {
            ui.ListAttrDlg.update();
        }
    });

    $('#list_attr_slug').keyup(
    function(event){
        ui.ListAttrDlg.limit_test(this, 20);
        return false;
    });
    $('#list_attr_desc').keyup(
    function(event){
        ui.ListAttrDlg.limit_test(this, 100);
        return false;
    });
},

limit_test:
function limit_test(widget, limit) {
    ui.FormChecker.test_text_len_limit(widget, limit);
},

update:
function update() {
    var slug = $('#list_attr_slug').val();
    var description = $('#list_attr_desc').val();
    var mode = $('#list_attr_privacy').prop('checked')?'public':'private';

    if (ui.ListAttrDlg.create_new) {
        toast.set(_('creating_list')).show();
        globals.twitterClient.create_list(slug, description, mode,
        function (result) {
            toast.set(_('create_list_success')).show();
            globals.list_attr_dialog.close();
        });
    } else {
        toast.set(_('updating_list')).show();
        globals.twitterClient.update_list(ui.ListAttrDlg.owner
        , slug, description, mode,
        function (result) {
            toast.set(_('update_list_success')).show();
            globals.list_attr_dialog.close();
        });
    }
},

load:
function load(screen_name, slug) {
    if (slug == '') {
        ui.ListAttrDlg.create_new = true;
    } else {
        ui.ListAttrDlg.create_new = false;
    }
    ui.ListAttrDlg.owner = screen_name;
    
    globals.twitterClient.show_list(screen_name, slug,
    function (list_obj) {
        $('#list_attr_slug').val(list_obj.slug);
        $('#list_attr_desc').val(list_obj.description);
        if (list_obj.mode === 'public') {
            $('#list_attr_privacy').attr('checked', true).prop('checked', true);
        } else {
            $('#list_attr_privacy').attr('checked', false).prop('checked', false);
        }
    });
}

}
    
