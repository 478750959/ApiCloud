/**
 * 输出loag
 * @param String s 需要输出的信息
 * @param String a 添加的标注信息
 */
function logs(s,a){
    return;
    if(typeof s == 'object'){
        s = JSON.stringify(s);
    }
    a = a ? a : "";
    if(!isPhone){
        console.log(a+s);
    }else{
        uexLog.sendLog(a+s);
    }
}

function uescript(wn, scr){
	uexWindow.evaluateScript(wn,'0',scr);
}

function ueppscript(wn, pn, scr){
	uexWindow.evaluatePopoverScript(wn,pn,scr);
}

function openwin(winName,url,anim){
	uexWindow.open(winName, "0", url, anim, "", "", "4", "275");
}

function closewin(anim, wndName){
	var a = '-1';
	if(anim) a=anim;
	uexWindow.close(a,wndName);
}

/**展示弹动效果结束后显示的网页，在uexWindow.onBounceStateChange中调用
 * @param type, 0为顶端恢复弹动，1为底部恢复弹动
 */
function resetBV(type){
	uexWindow.resetBounceView(type);
}
function setPageBounce(downcb, upcb){
	var s = ['0', '0'];
	var str = '';
	uexWindow.onBounceStateChange = function (type,status){
		//logs('onBounceStateChange-->type='+type+', status='+status);
		if(downcb && type==0 && status==2) downcb();
		if(upcb && type==1 && status==2) upcb();
	}
	
	uexWindow.setBounce("1");
	
	if(downcb){
		s[0] = '1';
		uexWindow.notifyBounceEvent("0","1");
		str = '{"pullToReloadText":"下拉刷新..."}';
		if(!isSML) uexWindow.setBounceParams('0', str);
	}
	uexWindow.showBounceView("0","#E6E6E6",s[0]);
	
	if(upcb){
		s[1] = '1';
		uexWindow.notifyBounceEvent("1","1");
		str = '{"pullToReloadText":"上拉加载更多..."}';
		if(!isSML) uexWindow.setBounceParams('1', str);
	}
	uexWindow.showBounceView("1","#E6E6E6",s[1]);
}
function hiddenPageBounce(){
	uexWindow.showBounceView("0","#E6E6E6","0");
	uexWindow.showBounceView("1","#E6E6E6","0");
}
function showPageBounce(){
	uexWindow.showBounceView("0","#E6E6E6","1");
	uexWindow.showBounceView("1","#E6E6E6","1");
}

function setHtml(id, html) {
	if ("string" == typeof(id)) {
		var ele = $$(id);
		if (ele != null) {
			ele.innerHTML = html == null ? "" : html;
		}
	} else if (id != null) {
		id.innerHTML = html == null ? "" : html;
	}
}

function getValue(id){
	var e = $$(id);
	if(e) return e.value;
}

function setValue(id, vl){
	var e = $$(id);
	if(e) e.value = vl;
}

/**
 * 判断是否是空
 * @param value
 */
function isDefine(value){
    if(typeof(value) == 'undefined' || value == null || value == "" || value == "undefined" || value == undefined || value == "null" || value == "(null)" || value == 'NULL'){
        return false;
    }
    else{
        value = value+"";
        value = value.replace(/\s/g,"");
        if(value == ""){
            return false;
        }
        return true;
    }
}

/**
 * getJSON请求数据的错误回调函数
 * @param {Object} err 返回的错误对象
 */
function getJSONError(err){
    $closeToast();
    resetBV(0);
    resetBV(1);
    if (err.message == 'network error!') {
        alert('网络未连接');
    }else if (err.message == 'json parse failed!') {
        alert('json解析失败');
    }else if (err.message == 'file does not exist!') {
        alert('文件不存在');
    }else if (err.message == 'read file failed!') {
        alert('文件读取错误');
    }else {
        alert('发现未知错误');
    }
}

function fucCheckLength(strTemp) {
	var i, sum;
	sum = 0;
	for (i = 0; i < strTemp.length; i++) {
		if ((strTemp.charCodeAt(i) >= 0) && (strTemp.charCodeAt(i) <= 255))
			sum = sum + 1;
		else
			sum = sum + 2;
	}
	return sum;
}

function setstorage(objName,objValue){
	var sto = window.localStorage;
	if(sto) sto.setItem(objName,objValue);
}
function getstorage(objName){
	var ret = '';
	var sto = window.localStorage;
	if(sto) ret=sto.getItem(objName);
	return ret;
}
function clearstorage(objName){
	var sto = window.localStorage;
	if(sto){
		if(objName) sto.removeItem(objName);
		else storage.clear();
	}
}
function setStorJson(objName, json){
	if(json) setstorage(objName,JSON.stringify(json));
}
function getStorJson(objName){
	var ret = {};
	var str = getstorage(objName);
    //if(str) str = str.replace(/\"/g, "&quot;");
    if(str) ret=JSON.parse(str);
	return ret;
}

function checkKey(k){
	return getstorage(k)?1:'';
}

function my_page_switch(p1,p2,cb){
	if(p1 != p2){
		var a = $$(p1);
		var b = $$(p2);
		
		if(a){
	        a.style.display="none";
		}
        if(b){
            b.style.display="block";
        }
		if(cb) cb(p2);
	}
}
function createEle(t){
	return document.createElement(t);
}

var cacheCall = [];
var cacheCallIndex = 0;
function initCacheCall(){
    cacheCallIndex ++;
    //一个页面因下拉导致的列表刷新，同时可以存在10次。避免后续的刷新冲掉前面调用的队列
    if(cacheCallIndex == 10) cacheCallIndex = 0;
}
function pushCacheCall(f){
    if (typeof(f) !== 'function') return;
    cacheCall[cacheCallIndex] = cacheCall[cacheCallIndex] || [];
    cacheCall[cacheCallIndex].push(f);
}
function imgCacheCall(){
    if(!cacheCall[cacheCallIndex]) return;
    for(var i=0, length=cacheCall[cacheCallIndex].length; i < length; i++){
        (cacheCall[cacheCallIndex][i])();
    }
    cacheCall[cacheCallIndex] = [];
    initCacheCall();
}

var imgmod = '1';
var g_uid = getstorage('UID');
if(g_uid){
    var simgid = 'showimage'+g_uid;
    imgmod = getstorage(simgid);
}
function dis_imgcache(sel,key,url,cb,err,dest,ext,head){//head 受无图模式控制
    if(imgmod != '1' && head){//用户登录且打开无图模式，不显示图片
        //url = 'images/mylogo.png';
        //key = url;
        return;
    }
    if(!url) return;
    zy_imgcache(sel,key,url,cb,err,dest,ext);
}
function imgLoadErr(id){
	var e = $$(id);
	if(e && e.style) e.style.cssText = "background-image: url(images/mylogo.png)";
}
function imgLoadSuc(id, src){
	var e = $$(id);
	if(e && e.style) e.style.cssText = "background-image: url("+src+")";
}
function imgLoadErrSrc(id){
	var e = $$(id);
	//logs('imgLoadErrSrc()-->id='+id);
	if(e) e.src = "images/mylogo.png";
}
function imgLoadSucSrc(id, src){
	var e = $$(id);
	//logs('imgLoadSucSrc()-->id='+id+', e='+e+',src='+src);
	if(e) e.src = src;
}
function cleanCache(){
    if(getstorage('simulate')) cleanCacheCb(0,0,0);
    else{
        uexWidgetOne.cbCleanCache = cleanCacheCb;
        uexWidgetOne.cleanCache();
    }
}

function cleanCacheCb(opId,dataType,inData){
    if(inData == 0){
        var lsg = window.localStorage;
        for(var k in lsg){
            if(k != 'contact_query') lsg.removeItem(k);//ios8.3闪退的标记不清除
        }
        //lsg.clear();
        uexFileMgr.deleteFileByPath("wgt://data/icache");
        var d = new Date();
        var ms = d.getTime();
        setstorage('myTime', ms);
    }else{
        uexWindow.toast('0','5','没有清除缓存',2000);
    }
}
function loadLink(url){
	var appInfo = ''; 
	var filter = '';
	var dataInfo = url.toLowerCase();
	var pf = getstorage('platform');
	if(pf==1){
		appInfo = 'android.intent.action.VIEW';
		filter = 'text/html';
	}
	if(dataInfo.indexOf('http://')<0 && dataInfo.indexOf('https://')<0){
		dataInfo = 'http://'+dataInfo;
	}
	uexWidget.loadApp(appInfo, filter, dataInfo);
}
function runbrowser(url)
{
	var brsurl = url;
	uexWindow.cbActionSheet = function(opId, dataType, data)
	{
		if(data=="0") loadLink(brsurl);
	}
	var array = ['启动本地浏览器'];
	uexWindow.actionSheet('', '取消', array);
}

function hyperlinkHandle(evt){
	evt.preventDefault();	

	var toele = evt.toElement;
	if(toele)
	{
		if(toele.tagName=="A")
		{
			//logs('hyperlinkHandle-->url='+toele.href);
			runbrowser(toele.href);
			return true;
		}
		else if(toele.onclick) return true;
	}
	return false;
}

/*查看帖子大图*/
var imglists = [];
function viewimage(e){
	var istr = e.id.substring(4);
	//logs('viewimage--->str='+imglists[istr]);
	uexImageBrowser.open(imglists, istr, '1');
}

function removeNode(id){
	var e = $$(id);
	if(e) e.parentElement.removeChild(e);
}

function disShowAnim(dx, dy, cb){
	uexWindow.beginAnimition();
	uexWindow.setAnimitionDuration('250');
	uexWindow.setAnimitionRepeatCount('0');
	uexWindow.setAnimitionAutoReverse('0');
	uexWindow.makeTranslation(dx,dy,'0');
	uexWindow.commitAnimition();
	if(cb) uexWindow.onAnimationFinish = cb;
}

function getJsonErr(s){
	uexWindow.closeToast();
	resetBV('0');
	resetBV('1');
	if(going) going = 0;
	var str = '返回数据有误！';
	if(s.status=='-1') str = '无网络，连接失败^_^！';
	//str = s.message;
	uexWindow.toast('0','5',str,"1500");
}

function checkLogin(){
	var lid = getstorage('UID');
	if (!lid) {
		/*uexWindow.cbConfirm = function(opId, dataType, data){
	 		if(int(data)==0) openwin('login', 'login.html', '12');
		}
		var mycars = ['确定','取消'];
		uexWindow.confirm('提示', '请先登录', mycars);
		return 0;*/
        //修改为提示，然后直接跳转到登录窗口
        uexWindow.toast('0', '5', '请先登录', '1500');
        setTimeout(function(){
            openwin('login', 'login.html', '10');
        }, 1500);
	}
	return lid;
}

function myConfirm(s, wid){
	uexWindow.closeToast();
	uexWindow.cbConfirm = function(opId, dataType, data){
 		uescript(wid, 'closewin();');
	}
	var mycars = ['确定'];
	uexWindow.confirm('提示', s, mycars);
}

function clearData(cc, num){
	if(cc){
		while(cc.childElementCount>num){
			cc.removeChild(cc.firstElementChild);
		}
	}
}

function my_con(id,url,x,y, bounces){
	var s=window.getComputedStyle($$(id),null);
	var ht = int(s.height)+int(y);
	if(isSML) ht = int(s.height);
	logs('my_con-->id='+id+', x='+x+', y='+y+', ht='+ht+', width='+Int(s.width)+', fontSize='+Int(s.fontSize));
	uexWindow.openPopover(id,"0",url,"",int(x),int(y),int(s.width),ht,int(s.fontSize),"0",bounces);
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function trim(s) {
    var count = s.length;
    var st = 0; // start
    var end = count - 1; // end

    if (s == "")
        return s;
    while (st < count) {
        if (s.charAt(st) == " ")
            st++;
        else
            break;
    }
    while (end > st) {
        if (s.charAt(end) == " ")
            end--;
        else
            break;
    }
    return s.substring(st, end + 1);
}
function setCss(el, css){
    if(typeof css == 'string' && css.indexOf(':') > 0){
        el.style && (el.style.cssText += ';' + css);
    }
};
/**设置安卓back和menu按键事件监听
 * @b: back键，1为监听。
 * @m: menu键，1为监听。
 * @cb1: back键监听处理回调方法。
 * @cb2: menu键监听处理回调方法。
 */
function addKeyListener(b, m, cb1, cb2){
    uexWindow.onKeyPressed = function(keyCode){
        if(keyCode==0){
            if(cb1)  cb1();
            //uexWidget.finishWidget(''); //退出应用
        }
        else{
            if(cb2) cb2();
        }
    }
    if(b) uexWindow.setReportKey('0', '1');
    if(m) uexWindow.setReportKey('1', '1');
}
function get_forumname(fid){
    return get_forum_value(fid, 'forumname');
}
function get_module(fid){
    return get_forum_value(fid, 'module');
}
function get_forum_value(fid, type){
    var key = '', forum, fids;
    for(key in forums){
        forum = forums[key];
        fids = forum['all_fid'];
        for(var indexof in fids){
            if(fids[indexof] == fid){
                if(type == 'module') return key;
                else if(type == 'forumname') return forum['name'];
            }
        }
    }
}
function isUndefined(variable) {
    return typeof variable == 'undefined';
}
function loadJS(src) {
    var script = document.createElement("script");
    script.type = 'text/javascript';
    script.src = src;
    document.body.appendChild(script);
}
/**获取通讯录,存为文件
 * 调用：index.html onload中
 * upload: 是否上传到服务器，并生成好友
 * cbShow: 显示好友的回调
 */
var contact_going = 0;
function save_contact(upload, cbShow){
    if(isSML) return;
    //android data = [{"name":"张万州", "phones":[{"label":"呼叫手机", "phone":"13641800334"}]}, {"name":"张万州2", "phones":[{"label":"呼叫手机", "phone":"13641800334"}]}];
    //ios    data = [{"name":"张万州", "phones":[{"工作", "13641800334"}]}, {"name":"张万州2", "phones":[{"家庭":"13641800334"}]}];
    var path = 'fs://mobile_contacts.txt';
    uexContact.cbSearchItem = function(opCode,dataType,data){//opCode可忽略,
        try{
            cbShow && setTimeout(function(){uexWindow.closeToast();}, 600);
            contact_going = 0;
            if(dataType != 1) {
                //api.alert({title:'抱歉，无法查看手机好友', msg:'请在手机"设置"里开启"通讯录"访问权限'});
                return;
            }
            if(data.length == 0){
                //通讯录为空
                //api.alert({title:'抱歉，无法查看手机好友', msg:'请在手机"设置"里开启"通讯录"访问权限null'});
                return;
            }
            upload && _upload_contact_data(data, cbShow);
            Y.fsCreate({
                path:   path,
                callback:function(ret, err){//在回调中写文件更加安全
                    var str = '';
                    str = JSON.stringify(data);
                    if(ret.status) Y.fsWriteToFile(str, path);
                }
            });
        }catch(e){}
    };
    if(contact_going) return;
    try{
        Y.fsExist({path: path, callback: function(ret, err){
            if(ret.exist) return;
            contact_going = 1;
            cbShow && uexWindow.toast('1','5','正为你搜索手机好友...',"1");//点击手机好友时用到，调用searchItem耗时较长
            //ios8.3已经调用过获取过通讯录但是又没有文件存在，则为闪退，打开app时不再同步通讯录
            //漏掉能同步但是又在打开后很快关掉app的ios8.3用户,这些用户后续点手机好友时有cbshow，还是可以获取通讯录
            //闪退的用户查看手机好友始终闪退
            if(!cbShow && Y.systemType() == 'ios' && Y.systemVersion().indexOf('8.3') == 0){
                var contact_query = getstorage('contact_query');
                //alert('b4 return:' + contact_query);
                if(force_int(contact_query)) return;
            }
            setstorage('contact_query', '1');//调用之前，标记下，表明调用过了
            uexContact.searchItem('');
        }});
    }catch(e){}
}

/** 将原始的通讯录记录文件解析，上传到服务器，匹配好友，可显示
 *  调用：1 登录成功有uid后，2 点击查看手机好友时
 * @param cbShow 显示到界面的函数
 * @needcheck 是否检查已经同步过
 */
function upload_contact_file(cbShow, needcheck){
    if(isSML) return;
    var path = 'fs://mobile_contacts.txt';
    try{
        Y.fsExist({path: path, callback:function(ret, err){
            if(ret.exist) Y.fsReadFromFile(path, function(fileStr){//读取文件中的内容为字串
                if(!fileStr) return;
                var json = JSON.parse(fileStr);
                _upload_contact_data(json, cbShow, needcheck);
            });
            else{//如果没有文件，就从头做起
                save_contact(true, cbShow);
            }
        }});
    }catch(e){}
}
/**将json格式的通讯录数据上传服务器，匹配好友，可显示
 * data : json,来自通讯录文件
 */
function _upload_contact_data(data, cbShow, needcheck){
    var upload = function(){
        try{
            var re = /1(?:[38]\d|4[57]|5[01256789])\d{8}/;
            var k, i, j;
            var perpage = 10000;//每次只传送1000条,going的控制也将失效，//改为1万条，暂时不用客户端对条数的控制逻辑，
            var haveShow = 0;
            for(k = 0; k < Math.ceil(data.length / perpage); k++){
                var value, phones, phone;
                var contacts = [];//[{type=0, key=i, value}]
                var length = Math.min(data.length - k * perpage, perpage);
                for (i = 0; i < length; i++) {
                    value = data[k + i];
                    contacts[i] = {type: '0', key: 'contact_' + i};//字符
                    contacts[i].value = value.name;//value： name#phonenumber1#phonenumber2...
                    //一条通讯录记录有多个手机
                    for(j = 0; j < value.phones.length; j++){
                        phones = value.phones;
                        if(isAndroid){//android
                            phone = phones[j].phone.replace(/^\+86|^86|-/g, '');
                            if(phone && re.test(phone))//检查合法的手机号
                                contacts[i].value += '#' + phone;
                        }else{
                            for(var key in phones[j]){
                                phone = phones[j][key].replace(/^\+86|^86|-/g, '');
                                if(phone && re.test(phone))//检查合法的手机号
                                    contacts[i].value += '#' + phone;
                            }
                        }
                    }
                }
                //上传服务器时，如果已经是用户，就加为1度好友
                if(zy_tmpl_count(contacts) < 1) return;//如果没有联系人，不要访问服务器
                var url = home_url + '&mod=space&do=friend&view=mobile_contacts&upload=1' /*+ encodeURIComponent(str)*/;
                $.getJSON(url, function(json){
                    if(json && json.list && cbShow && haveShow == 0){//haveShow==0，第一页始终为真，控制暂时没用，
                        //将好友显示到界面上
                        haveShow = 1;
                        cbShow(json);
                    }
                }, 'json', getJsonErr, 'POST', contacts, '');
            }
        }catch(e){}
    };

    if(needcheck){
        if(going) return;
        var url = home_url + '&mod=space&do=friend&view=mobile_contacts&ifuploaded=1';
        going = 1;
        $.getJSON(url, function(json){
            going = 0;
            if(!int(json.uploaded)){
                upload();
            }
        });
    }else upload();
}
/*
* 根据服务器返回的折扣数组生成折扣字串，显示在列表和主题详情中
*/
function get_discount(discounts, showAll){
    var record = function(value){
        var rule;
        if(!value['money'] || !value['rule'] || !value['credit']) return '';
        if(value['rule'] == '='){
            rule = '每';
        }else if(value['rule'] == '>'){
            rule = '满';
        }
        var r_str = rule + value['credit'] + '优惠' + value['money'] + '元';
        return r_str;
    }
    var str = '', space = '约伴点数';
    if(showAll){//显示所有优惠，用在详情中
        for(var key in discounts) {//id：第几条，money：多少元，rule： >满 =每，credit：约伴点数
            var value = discounts[key];
            var r_str = record(value);
            if(!r_str) continue;
            str += space + r_str;
            space = '<br>'
        }
    }else{//显示一条...，用在列表中
        for(var key in discounts) {//id：第几条，money：多少元，rule： >满 =每，credit：约伴点数
            var value = discounts[key];
            var r_str = record(value);
            if(!r_str) continue;
            if(str) {
                str += ' ...';//如果已经存在，加上省略号
                break;
            }else str += space + r_str;
        }
    }
    return str ? str : '无优惠信息';
}
//选择report的message
function report_action(report_data){
    var o_message = ['广告信息', '情色暴力', '人身攻击', '无关内容'];
    var submitReport = function(data){
        if(!zy_tmpl_count(data) || typeof data != 'object' || !data.message) uexWindow.toast('', '5', '举报内容有误', '1500');
        var rtype = data.rtype || '',
            rid = data.rid || '',
            tid = data.tid || '',
            fid = data.fid || '',
            uid = data.uid || '',
            message = data.message;
        message = encodeURIComponent(message);
        if(going) return;
        var url = misc_url + '&mod=report&reportsubmit=1&rtype=' + rtype + '&rid=' + rid + '&tid=' + tid + '&fid=' + fid + '&uid=' + uid + '&message=' + message ;
        going = 1;
        $.getJSON(url, function(json){
            going = 0;
            if(int(json.status)){
                uexWindow.toast('0', '5', '举报成功！我们将在24小时之内尽快处理', '2000');
            }else{
                uexWindow.toast('0', '5', '举报失败', '2000');
            }
        });
    }
    var cbaction = function(ret, err){//获取用户选择的举报内容
        if(ret.buttonIndex < 1 || ret.buttonIndex > o_message.length) return;//取消时返回5
        report_data.message = o_message[ret.buttonIndex - 1];
        submitReport(report_data);//提交举报
    };

    var params = {
        title           : '请选择要举报原因：',
        cancelTitle     : '取消',
        buttons         : o_message,
        callback        : cbaction
    };
    setTimeout(function(){Y.actionSheet(params);}, 200);
}
function reportBarOpen() {
    var navigationBarCB = function (ret, err) {
        if (!ret) {
            Y.alert({title: "出错了", msg: err["msg"]});
            return;
        }
        Y.navigationBarHide();
    };

    var itemBg = '#FFFFD7';
    var params = {
        //y: 42,
        h: 35,
        style: "left_to_right",
        items: [
            {
                //title: "严禁色情与广告骚扰以及人身攻击，违者账户将永久封杀。欢迎举报",
                title: "严禁情色与非法内容，违者封帐号，欢迎举报",
                bg: itemBg
            }
        ],
        itemSize: {
            w: window.innerWidth
        },
        font: {
            size: 12,
            sizeSelected: 12,
            color: "#333",
            colorSelected: "#333"
        },
        bg: itemBg,
        alpha: 0.7,
        fixedOn: 'content',
        callback: navigationBarCB
    };
    Y.navigationBarOpen(params);
    setTimeout(function(){Y.navigationBarHide();}, 3000);
}
function get_distance(kilometer){
    var s = force_int(kilometer);
    if(!s) return '';
    if(s < 1000) str = s + "m";//10m
    else if(s < 10000) str = (s/1000).toFixed(1) + "km";//9.8km
    else str = Math.round(s/1000) + "km";//110km
    return str;
}
