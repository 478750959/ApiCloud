var fid = '57';
var plugin_name = 'dating';
var plugin_title = '神秘约会';
var uid = getstorage('UID');
/**
 * 参加或者查看要约
 */
function go2members(_tid, _fid, _from_uid, _subject, _applied){
    if(!_tid) _tid = tid;
    if(!_fid) _fid = fid;
    if(!_from_uid) _from_uid = auid;
    if(!_subject) _subject = subject;

    if((typeof(applied) != 'undefined')) _applied = applied;//详情页面有applied全局变量

    if(!checkLogin()) return;
    if(uid == _from_uid){//发布者本人自己查看要去的成员列表
        var json_params = {"tid": _tid ,"fid": _fid , "subject": _subject};
        setStorJson('params', json_params);
        openwin('dating_member','member.html','10');
    }else if(int(_applied)){//使用全局的applied来判断，因为可能取消要约，列表页面暂时在客户端不做处理，服务器也会提示的
        uexWindow.toast('0', '5', '你已经要约，请不要重复提交', '2000');
    }else{//其他人，做要去的操作，需要先打开单身名片。
        if(!check_single_card()) return;
        uexWindow.cbConfirm = function (opId, dataType, data) {
            if(int(data) == 1) {
                apply_submit(_tid);
            }
        };
        var confirmtitle = '确认要约？';
        var str = '要约后，发布人将可以看到你的详细信息！';
        var mycars =['取消', '确定'];
        uexWindow.confirm(confirmtitle, str, mycars);
    }
}
function alert_anonymous(fuid, verified){
    if(verified || fuid == uid){
        go2user5(fuid);
    }else uexWindow.toast('0', '5', '你发出要约，并且被接受后，才能看到TA的详细信息！', '2500');
}
function check_single_card(){
    var o_rolemodule = getStorJson('role_status');
    if(!int(o_rolemodule['single'])){//单身名片没有打开
        uexWindow.cbConfirm = function (opId, dataType, data) {
            if (int(data) == 1) {
                var str = '{"view":"me", "uid":"' + uid  + '", "rolemoduleid":"' + 1 + '", "title":"单身名片"}';
                setstorage('params', str);
                openwin('manage_role', '../../manage_role.html', '10');
            }
        };
        var confirmtitle = '需要开启单身名片';
        var str = '请开启单身名片后再约TA！';
        var mycars =['取消', '开启单身名片'];
        uexWindow.confirm(confirmtitle, str, mycars);
        return false;
    }
    return true;
}
function apply_submit(tid){
    if(going) return;
    going = 1;
    uexWindow.toast('1', '5', '正在提交，请稍候...', '');//500ms后关闭toast
    var value = '';
    var url = forum_url + '&mod=ajax&action=activityapplies&submit=1&tid='+tid;
    $.getJSON(url, function(json) {
        going = 0;
        //var str = '报名成功';
        var str = '要约成功，请耐心等待TA的回应';    // 更新提示语 by tom 20150331

        if(json==0) str = '要约失败';
        else if(json && (int(json.status) == 0 || int(json.status) == 2)){//2参加过
            if (json.message)  str = json.message;
        } else{
            if(current_win == 'dating_detail'){
                uescript('dating_detail', 'joinResult("1")');
                ueppscript('dating_list', 'content', "add_count('member', " + tid + ");");
                applied = 1;
            }
            var obj = $$('m_count_' + tid);
            //增加计数
            if(obj) obj.innerHTML = force_int(obj.innerHTML) + 1;
        }
        uexWindow.toast('0', '5', str, 1500);
    }, 'json', getJsonErr, 'POST', '', '');
}
function add_count(type, tid, count){
    var obj;
    if(type == 'reply'){
        obj = $$('t_count_' + tid);
    }else if(type == 'member'){
        obj = $$('m_count_' + tid);
    }
    obj.innerHTML = force_int(obj.innerHTML) + int(count ? count : 1);
}
//显示约会详细内容的回调，在lis_content和detail_content中都有
function j2vCb_list(d,c){
    var str = '';
    var other  = (uid != d.from_uid);
    if(c.length>1)
    {
        switch(c[1])
        {
            case 'avatar':
                if(int(d.verified) || uid == d.from_uid){//已经接受，显示真实头像
                    var src = ucurl + d.from_uid;
                    var avatarid = 'suid_'+ d.tid + '_' + d.from_uid;
                    pushCacheCall(function(){
                        dis_imgcache(avatarid,src,src,imgLoadSuc,imgLoadErr,null, '', '1');
                    });
                }else{
                    str = (d.gender == 2 ? 'im-female' : 'im-male');
                }
                break;
            case 'img':
                if(d.img){
                    var picid = 'i'+d.tid;
                    str = '<div class="ub-img5 tx-c">'
                            +'<img src="" class="list_pic" id="'+picid+'"/>'
                        +'</div>';
                    pushCacheCall(function(){
                        dis_imgcache(picid, d.img, d.img, imgLoadSucSrc, imgLoadErrSrc, null, '', '1');
                    });
                }
                break;
            case 'relation':
                var relation = [];
                if(parseInt(d.degree) == 1) relation.push('好友');
                else if(parseInt(d.degree) == 2) relation.push('好友');
                if(parseInt(d.same_company)) relation.push('同事');
                if(parseInt(d.same_graduateschool)) relation.push('校友');
                var rule = '';
                for(var key in relation){
                    str += rule + relation[key];
                    rule = '*';
                }
                break;
            case 'profile':
                var profile = [];
                if(int(d.age)) profile.push(d.age + '岁');
                if(int(d.height)) profile.push(d.height + 'cm');
                if(d.occupation) profile.push(d.occupation);
                var rule = '';
                for(var key in profile){
                    str += rule + profile[key];
                    rule = ',';
                }
                break;
            case 'info':
                var c_style = get_c_style();
                str = (d.starttimefrom ? '<div class="ub ub-ac uinn">' +
                        '<div class="umh2 umw1 ub-img8 im-dtime-gra umar-r"></div>' +
                        '<div class="t-gra ub-f1 ' + c_style + '">' + d.starttimefrom +'</div>' +
                    '</div>' : '')
                    +(d.place ? '<div class="ub ub-ac uinn" id="info_place">' +
                        '<div class="umh2 umw1 ub-img8 im-dplace-gra umar-r" id="place_img"></div>' +
                        '<div class="t-gra ub-f1 ' + c_style + '">' + d.place + '</div>' +
                    '</div>' : '');
                break;
            case 'bg_style':
                str = get_bg_style();
                break;
            case 'bg_style_1'://第二次用到bg_style时不能调用get_bg_style,直接使用前次调用的结果
                str = bg_color;
                break;
            case 'c_style'://字体的颜色，根据背景色变化，深色配浅色
                str = get_c_style();
                break;
            case 'i_style'://icon的颜色，根据背景色变化
                str = get_i_style();
                break;
            case 'verify'://验证会员
                var verity_style = 'color:#C55; border-color:#C55;';
                if(int(d.verify)){
                    if(color_type == deep_type) verity_style = 'color:white; border-color:white;';
                    str = '<div class="ub umar-r ub-ac"><strong class="user-v" style="'+ verity_style +'">验</strong></div>';
                }
                break;
            case 'distance':
                str = get_distance(d.distance);
                break;
        }
    }
    return str;
}
