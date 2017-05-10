/**
 * 初始化推送引擎，在登陆成功和页面初始化时调用
 */

var jpush;
//ios下应用在前台的推送回调是直接进行的，不需要人为点击，因此要想避免直接跳转，需要增加是否在前台的判断
//应用打开或resume后两秒，视为前台，2s的时间用来处理关闭和pause的情况下的推送足够了
var foreground = 0;
var app_start = 1;//app从推送启动，不要重复menunotice
function initPush(uid_temp){
    jpush = api.require('ajpush');
    if(!jpush) return;
    //初始化
    if(isAndroid){
        jpush.init(function (ret) {
            if (ret && ret.status) {
                //alert("jpush初始化状态:"+ret.status);
            }
        });
    }

    //绑定别名
    var param_jpush = {alias: 'myalias', tags: ['all']};
    param_jpush.alias = "uid_" + uid_temp;
    jpush.bindAliasAndTags(param_jpush, function(){
        //alert("jpush.setAlias:"+ret.statusCode);
    });
    //监听推送消息
    if(isAndroid){
        //在Android平台，使用极光推送发送通知、消息等类型推送时，极光推送模块会往设备状态栏上发送通知，当通知被点击后，APICloud会将本次推送的内容通过事件监听回调的方式交给开发者
        api.addEventListener({name: 'appintent'}, JPushCB_EventListener);
        //jpush.setListener(JPushCB_Listener);
        //部分设备不支持appintent，点击通知后无效果。
    }else{
        jpush.setListener(JPushCB_Listener);
        //从后台唤醒后8s，视为在前台，前台时的推送提醒是jpush自动触发回调的
        Y.eventListener({
            name: 'resume',
            enable: true,
            callback : function(){
                setTimeout(function(){
                    foreground = 1;
                }, 8000);}
        });
        //挂起进入后台时，改变标记，这样当用户点击状态栏提醒时，按后台推送进行跳转
        Y.eventListener({
            name: 'pause',
            enable: true,
            callback : function(){
                foreground = 0;
            }
        });
        //从关闭到启动后15s设为在前台，ios4需要时间较长
        setTimeout(function(){
            app_start = 0;
            foreground = 1;
        }, 15000);
    }
    //写入用户启动app的信息存入日志表，便于跟踪统计。appId为config.js里定义的常量
    var isPhone = (window.navigator.platform != "Win32");
    var isAndroid = (window.navigator.userAgent.indexOf('Android')>=0)?true : false;
    var isiPhone = (window.navigator.userAgent.indexOf('iPhone')>=0)?true : false;
    var isiPad = (window.navigator.userAgent.indexOf('iPad')>=0)?true : false;
    if (isAndroid) {
        sendAppInfoHistory(appId, uid, "2");
    }else if(isiPhone||isiPad){
        sendAppInfoHistory(appId, uid, "1");
    }else{
        sendAppInfoHistory(appId, uid, "0");//其他设备,有可能是appcan模拟器发送的。
    }
}

/**
 * JPush setListener回调函数。ret是json，透传的消息内容extra。
 * android下用户点击状态栏进入此函数，ios下前台时，不点击，直接进入此函数
 */
var usetting = getStorJson('usetting');
var jpush_repeat_ios = force_int(usetting['jpush_repeat_ios']);//极光推送，在ios下前台时同一信息获取两次,服务器中可配置这一特点是否存在
var newPushIos = 1;//如果不使用此开关，真的有两条完全相同的推送时，后面的将不会提醒和跳转
function JPushCB_Listener(ret) {
    //ret.extra在ios下是json对象，在android下是json字符串
    var keys = "";
    var values = "";
    if (isAndroid) {
        var extra = JSON.parse(ret.extra);//{"keys":"talk","values":"talk_3-557598"}
        keys = extra.keys;//"talk"
        values = extra.values;//"talk_3-557598"
        doPushBiz(keys, values);//用户点击后，执行push跳转逻辑
    }else{
        jpush = jpush || api.require('ajpush');
        jpush.setBadge({
            badge:0
        });
        //alert("jpush.setListener->title:"+ret.title+" content:"+ret.content+" msgid:"+ret.id+" extra:"+ret.extra);
        keys = ret.extra.keys;//"talk"
        values = ret.extra.values;//"talk_3-557598"

        //ios若app在前台时，因为会自动截获消息但是无提示通知。需要手动触发通知事件，然后再点击该通知后触发回调(经测试可以触发通知，但不需要截获通知)。
        //jpush在ios下调用此方法两次，ret.id为undefined，所以需要根据内容来过滤掉一次
        var msgid_push=getstorage('msgid_push');
        if(force_int(jpush_repeat_ios) && !newPushIos && msgid_push == ret.content){
            newPushIos = 1;
            return;
        }
        //20150222:jpush接口改动导致ret.id="undefined",因此需要存储ret.content来替换。
        setstorage('msgid_push', ret.content);
        newPushIos = 0;//下一次来的推送，如果内容一样必定是重复的

        doPushBiz(keys, values);
        if(foreground){//ios并且前端时才需要状态栏提醒
            Y.notification({//用声音提示
                title: ret.content,
                content: ret.content,
                extra: JSON.stringify(ret.extra),
                updateCurrent: false
            });
        }
    }
}

/**
 JPush addEventListener回调函数。ret默认是json，android时使用
 */
function JPushCB_EventListener(ret, err) {
    //ret.extra在ios下是json对象，在android下是json字符串
    //alert("ajpush ret:"+ret+";err:"+err);
    if (ret && ret.appParam.ajpush) {
        var ajpush = ret.appParam.ajpush;
        JPushCB_Listener(ajpush);
    }
}

/**
 * 处理推送消息的业务逻辑。接收到消息推送后的事件回调，android下，以及ios下的关闭，后台等5中情况都是用户点击状态栏提醒触发。
 * ios下前台时自动触发，需要特别处理。
 */
function doPushBiz(keys, values) {
    if (keys == "talk") {
        //alert("app是否前台foreground:"+foreground);
        if(!int(foreground)){//5种情况是一样的
            //在后台跳转
            var need_refresh = pages[3] && pages[3].ld;//如果为true,则navselected中不会刷新，只会切换
            navSelected(3);
            if(need_refresh){
              ueppscript('root', 'content3', 'loadList()');////调用main_msg里消息列表刷新逻辑（此逻辑会更新pm数,同时显示tab小红点）
            }
            //alert("app在后台:"+foreground);
            
            setTimeout(function () {//问题在于跳转后，列表中的小红点不能消除
                setstorage('currentRoomId', values);//加入某个聊天室。
                setstorage('currentRoomId_title', "聊天");//标题。
                ueppscript('root', 'content3', 'go2new5_new()');//进入聊天界面
            }, 1500);//1500ms后跳转，如果太早，小红点先消除，再显示，结果还是显示
        }else{//ios若app在前台时，因为会自动截获消息，因此只更新列表，不跳转至聊天界面
            //在前台，仅刷新
            talk_check('1');
        }
        
    } else if(keys == 'share_tag' || keys == 'share_trend') {//推荐
        if(!app_start) menuNotice(keys, 1);//显示tab小红点
        if(!int(foreground)){
            //后台跳转
        	gotoNotifypage(keys, values);
        }
    } else {//提醒if(keys == "reminder" || keys == "friendrequest")
        if(!int(foreground)){//android下，回调在用户点击状态栏提醒时触发，页面转向
            navSelected(3);//先打开，便于下面一句消除小红点
            setTimeout(function(){
                gotoNotifypage(keys, values);
            }, 1500);
        }else{//ios下，app在前台时，不是用户点击状态栏提醒触发，不能直接跳转，只是刷新小红点，不需要访问服务器，所以不使用menuNotice，
            setstorage('rn', 1);//不需要单独获取，直接计数为1
            zy_anim_pop('msgn', 'uhide');//消息tab显示小红点
            if (pages[3] && pages[3].ld) ueppscript('root', 'content3', 'rminders();');//聊天上的提醒栏目显示小红点
        }
    }
}