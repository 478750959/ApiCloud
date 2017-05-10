function delWord(el) {
    var input = $api.prev(el, '.txt');
    input.value = '';
}

function ensure() {
    var newPwd = $api.byId('newPwd').value;
    var newPwd2 = $api.byId('newPwd2').value;
    var uid = $api.getStorage('uid');
    if (newPwd !== newPwd2) {
        api.alert({
            msg: '确认密码与新密码不一致'
        });
    }
    if (newPwd && newPwd2 && newPwd === newPwd2) {
        var updatePasswordUlr = '/user/' + uid;
        var bodyParam = {
            password: newPwd
        };
        ajaxRequest(updatePasswordUlr, 'put', JSON.stringify(bodyParam), function (ret, err) {
            if (ret) {
                setTimeout(function () {
                    api.alert({
                        msg: '修改成功'
                    }, function (ret, err) {
                        api.closeWin();
                    });
                }, 200);
            } else {
                api.alert({
                    msg: err.msg
                });
            }
        })
    }
}

var inputWrap = $api.domAll('.input-wrap');
var i = 0, len = inputWrap.length;
for (i; i < len; i++) {
    var txt = $api.dom(inputWrap[i], '.txt');
    var del = $api.dom(inputWrap[i], '.del');
    (function (txt, del) {
        $api.addEvt(txt, 'focus', function () {
            if (txt.value) {
                $api.addCls(del, 'show');
            }
            $api.addCls(txt, 'light');
        });
        $api.addEvt(txt, 'blur', function () {
            $api.removeCls(del, 'show');
            $api.removeCls(txt, 'light');
        });
    })(txt, del);

}


apiready = function () {
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
};