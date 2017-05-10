/*用到JPush.js中的全局变量foreground*/
/**
 * 导航栏提示，在以下情况被调用：1.登陆成功，2.onload且有uid，3.推送 4，页面的下拉刷新会针对单项进行提示更新
 * 在缓存中记录的提醒数据在每次app启动时会被刷新掉。
 * 如果是启动app过程中，多个地方导致的提醒刷新，则直接退出，因为启动时在onload中会刷新所有的提醒
 * updatelist： onload，登陆中，单项下拉中调用不需要刷新列表,推送时需要刷新
 */
function menuNotice(type, updatelist) {
    if (type == 'all') {
        menuNotice('share_tag', updatelist);
        menuNotice('share_trend', updatelist);
        menuNotice('talk', updatelist);
        menuNotice('plugin_reminder', updatelist);
        menuNotice('reminder', updatelist);
        return;
    }
    //var keys = json.keys;
    switch (type) {
        case 'share_tag' ://活动
            getShareCount(updatelist, 'share_tag');
            break;
        case 'share_trend' ://攻略
            getShareCount(updatelist, 'share_trend');
            break;
        case 'talk' ://聊天
            talk_check(updatelist);//
            break;
        case 'plugin_reminder' ://人脉菜单中插件提醒
            plugin_reminder_check();//
            break;
        default ://提醒
            reminder_check();
            break;
    }
}
/**
 * 点击提醒的红点时，sn-1
 */
function cancelNotification(type) {//点击条目时要调用
    var sn = getstorage('sn');
    var pm = getstorage('pm');//聊天小红点数
    var rn = getstorage('rn');
    var p_rn = getstorage('p_rn');
    var cancelShare = function(name){
        var sn_name = 'sn_' + name;
        var sn_type = getstorage(sn_name);
        var new_sn = Math.max(force_int(sn) - 1, 0);
        var new_sn_type = Math.max(force_int(sn_type) - 1, 0);
        setstorage(sn_name, new_sn_type);//减单项
        setstorage('sn',new_sn);//减总数
        if (new_sn < 1 ) zy_anim_push('sharen', 'uhide');
        if (new_sn_type < 1 ) zy_anim_push('sharen_' + name, 'uhide');
    };

    switch (type) {
        case 'share_tag' ://活动
            cancelShare('activity');
            break;
        case 'share_trend' ://攻略
            cancelShare('trend');
            break;
        case 'talk' ://聊天
            var new_pm = force_int(pm) - 1;
            setstorage('pm', new_pm);
            if (int(new_pm + rn) <= 0) {
                // alert("影藏图标");
                zy_anim_push('msgn', 'uhide');//隐藏图标
            }
            break;
        case 'reminder' ://提醒
            setstorage('rn', 0);
            if (force_int(pm) <= 0) {
                zy_anim_push('msgn', 'uhide');//隐藏图标
            }
            break;
        case 'plugin_reminder'://人脉插件提醒
            var new_p_rn = force_int(p_rn) - 1;
            setstorage('p_rn', new_p_rn);
            if (force_int(new_p_rn) <= 0) {
                zy_anim_push('plugin_rn', 'uhide');//隐藏图标
                setstorage('plugin_reminder', '');
            }
            break;
    }
}

/**获取朋友新约伴的条目数，按tid个数计数，存入local storage, 如果提醒总数>0，就小红点提示
 * 总计数= 活动 + 攻略之和，分别保存到localstorage
 */
function getShareCount(updatelist, type) {
    //if (!uid) return;
    var url, frameName, sn_name, name, sn_other, other_name;
    if(type == 'share_trend'){//攻略
        var fid = forums['trend']['fid'];
        name = 'trend';
        other_name = 'sn_activity';
        sn_name = 'sn_trend';
        url = forum_url + "&mod=forumdisplay&fid=" + fid + '&new_count=1';
        frameName = 'forum_listct';
    }else{//活动,share_tag
        name = 'activity';
        other_name = 'sn_trend';
        sn_name = 'sn_activity';
        url = newest_url + '&mod=hot&new_count=1';
        frameName = 'content1';
    }

    var old_sn = force_int(getstorage('sn'));//旧的约伴总数，暂时用不到
    var old_sn_type = force_int(getstorage(sn_name));
    sn_other = force_int(getstorage(other_name));
    $.getJSON(url, function (json) {
        var new_sn_type = force_int(json.new_count);
        var new_sn = new_sn_type + sn_other;
        setstorage(sn_name, new_sn_type);//保存新的单项sn
        setstorage('sn', new_sn);//保存总的sn
        //约伴单项活动，攻略的小红点
        if (new_sn_type > old_sn_type && updatelist && pages[1] && pages[1].ld){
            ueppscript('root', frameName, 'updateLists();');//刷新
            zy_anim_pop('sharen_' + name, 'uhide');
        } else if(new_sn_type > 0) zy_anim_pop('sharen_' + name, 'uhide');
        else zy_anim_push('sharen_' + name, 'uhide');
        //约伴菜单小红点
        if (new_sn < 1)  zy_anim_push('sharen', 'uhide');
        else zy_anim_pop('sharen', 'uhide');

    }, 'json', getJsonErr, 'GET', '', '');
}
//var timid = '';
function reminder_check() {
    if (isSML) return;
    var url = forum_url + "&mod=ajax&action=pm_checknew";
    $.getJSON(url, function (json) {
        if (json) {
            var rn = force_int(json.newprompt);
            if (rn > 0) {
                setstorage('rn', 1);//不需要单独获取，直接计数为1
                zy_anim_pop('msgn', 'uhide');
                if (pages[3] && pages[3].ld) ueppscript('root', 'content3', 'rminders();');
            } else {
                setstorage('rn', 0);
                zy_anim_push('msgn', 'uhide');
            }
        }
    }, 'json', null, 'GET', '', '');
}
/**
 * 获取插件提醒,将有提醒的插件的个数length和提醒的内容保存，如果有提醒，则显示菜单的小红点
 */
function plugin_reminder_check(){
    var timestamp = getstorage('plugin_reminder_timestamp') || '';//时间戳记录了用户点击神秘约会小红点的时间，从服务器传过来
    var url = forum_url + "&mod=ajax&action=plugin_reminder&timestamp=" + timestamp;//带上上次从服务器返回的时间戳，选择此时间戳之后的提醒
    $.getJSON(url, function (json) {
        if (json){
            var length = zy_tmpl_count(json);
            setstorage('p_rn', length);//有多少个插件，就有多少个提醒计数
            if(length > 0){
                setStorJson('plugin_reminder', json);
                zy_anim_pop('plugin_rn', 'uhide');
                if (pages[2] && pages[2].ld) ueppscript('root', 'content2', 'show_plugin_reminder();');
            }else{
                setstorage('plugin_reminder', '');
                zy_anim_push('plugin_rn', 'uhide');
            }
        }
    }, 'json', null, 'POST', '', '');
}

/**推送内容接管规则
 * 1 刷新列表页面
 * 2 如果是应用刚启动，转向到最后一条提醒对应的页面，改变标志
 * 3 如果应用应用过程中，状态栏notification提醒。（忽略应用在后台的情况，ios下应用在后台也能收到状态栏消息）
 * 4 关闭应用
 */
function gotoNotifypage(keys, values) {
    //alert("invoke gotoNotifypage--keys:"+keys+";values:"+values);
    switch (keys) {
        case 'share_tag' ://活动
            break;
        case 'share_trend' ://攻略
            break;
        case 'talk' ://聊天
            var title = "跟TA聊天";
            ueppscript("root", "content3", "go2new5('" + values + "','" + title + "');");//room_id,title
            break;
        default ://提醒
            //ueppscript("root", "content3", "go2reminders('rn');");//app刚启动时这个页面未加载导致无法跳转至启动页面。
            go2reminders('rn');
            break;
    }
}

/**
 * 跳转至启动提醒页面。（用于推送消息跳转用，函数功能等同于main_msg里go2reminders函数）
 */
function go2reminders(type) {
    //loadList(false);
    var str = (type == 'rn' ? '{"view":"reminder"}' : '{"view":"friendreq"}');
    var wnm = 'morelist';
    var url = 'morelist.html';
    //uescript('root', 'cancelNotification(\'reminder\')');

    zy_anim_push(type, 'uhide');
    setstorage('params', str);
    openwin(wnm, url, '10');
    cancelNotification('reminder');//清掉小红点
}
/**
 * 显示tab下的提醒图标
 */
function talk_check(updatelist) {

    if (pages[3] && pages[3].ld && Int(updatelist)) {
        //调用main_msg里消息列表刷新逻辑（此逻辑会更新pm数,同时显示tab小红点）
        ueppscript('root', 'content3', 'loadList()');
    } else {
        if (1 || Int(updatelist)) {
            //处理app未启动情况
            //var pm = int(getstorage('pm'));
            setstorage('pm', '1');//若从手机消息栏打开时，强制pm=1，从而触发小红点。
            show_talk_tips();
        }
    }
}
/**
 * 显示tab"消息"小红点逻辑。
 */
function show_talk_tips() {
    //显示tab下的提醒图标。//执行显示tab小红点逻辑。
    var new_pm = force_int(getstorage('pm'));
    if (new_pm > 0) {
        zy_anim_pop('msgn', 'uhide');//显示图标
    }
}
