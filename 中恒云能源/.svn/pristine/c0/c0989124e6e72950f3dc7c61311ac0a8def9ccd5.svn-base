var DOMAIN = "http://doc.bichonfrise.cn/";
var TIP_SYSBUSY_ERR = "系统繁忙,请稍后再试!";
var TIP_TELPWD_ERR = "手机号或密码错误!"; 
var TIP_REPEATPWD_ERR = "两次输入密码不一致!";
var TIP_TEL_FORMAT_ERR = "手机号格式错误!";
var TIP_PWD_FORMAT_ERR = "密码格式错误!";
var TIP_NAME_FORMAT_ERR = "昵称长度错误!";
var TIP_CODE_FORMAT_ERR = "验证码格式错误!";
var TIP_VERIFYCODE_FAIL = "验证失败";
var TIP_GETCODE_SUCC = "获取验证码成功!";
var TIP_USEREXIST_ERR = "该手机号已被注册!";
var TIP_GETCODE_TOOFREQ = "获取验证码太频繁!";
var TIP_OLDPWD_ERR = "原密码错误!";
var TIP_NAME_TOO_LONG_ERR = "昵称过长了!";
var TIP_SUB_SUCC = "提交成功!";
var TIP_LOGIN_FIRST = "您尚未的登录,请先登录!";
var TIP_UPDATE_LOCAL_INFO = "刷新用户本地信息失败";
var TIP_NO_CONTENT = "请输入内容!";
/**
 * [openWin 打开窗口]
 * @param  {[type]} winName [窗口名称]
 * @param  {[type]} winPath [文件路径]
 * @param  {[type]} param   [参数]
 * @return {[type]}         []
 */
var openWin = function(winName,winPath,param){
	api.openWin({
	    name: winName,
	    url: winPath + winName + ".html",
	    bounces: false,
	    pageParam: param
	});
	return false;
}
/**
 * [openWinLogin 判断用户登陆后才会打开页面]
 * @param  {[type]} winName [窗口名称]
 * @param  {[type]} winPath [文件路径]
 * @param  {[type]} param   [参数]
 * @return {[type]}         [description]
 */
var openWinLogin = function(winName,winPath,param){
	var token = getUserToken();
	if (token == "") {
		popToast(TIP_LOGIN_FIRST);
		return;
	};
	api.openWin({
	    name: winName,
	    url: winPath + winName + ".html",
	    bounces: false,
	    pageParam: param
	});
	return false;
}
/**
 * [closeToWin 关闭指定窗口]
 * @param  {[type]} winName [窗口名称]
 * @return {[type]}         []
 */
var closeToWin = function(winName){
	api.closeToWin({
	    name: winName,
	});
}
/**
 * [closeWin 关闭窗口]
 * @param  {[type]} winName [窗口名称]
 * @return {[type]}         []
 */
var closeWin = function(winName){
	if (winName == null || winName == undefined) {
		api.closeWin();
	}
	else{
		api.closeWin({
		    name: winName
		});
	}
}
/**
 * [popToast 弹出提示]
 * @param  {[type]} msg [弹出消息]
 * @return {[type]}     [description]
 */
var popToast = function(msg){
	api.toast({
	    msg: msg,
	    duration: 2000,
	    location: 'bottom'
	});
}
var popAlert = function(msg){
	api.alert({
	    title: '温馨提示', 
	    msg:msg,
	});
}
/**
 * [checkTelValid 检查手机号是否可用]
 * @param  {[type]} telStr [手机号码]
 * @return {[type]}        [description]
 */
var checkTelValid = function(telStr){
	var reTel = /^1\d{10}$/;
	if (reTel.test(telStr)){
		return true;
	}
	else{
		return false;
	}
}
/**
 * [checkPwdValid 检查密码是否可用]
 * @param  {[type]} pwdStr [密码]
 * @return {[type]}        [description]
 */
var checkPwdValid = function(pwdStr){
	return pwdStr.length >= 6 && pwdStr.length <= 16;
}
/**
 * [checkCodeValid 检查验证码是否可用]
 * @param  {[type]} codeStr [验证码]
 * @return {[type]}         [description]
 */
var checkCodeValid = function(codeStr){
	return codeStr.length > 0;
}
var checkNameValid = function(nameStr){
	return nameStr.length > 0 && nameStr.length <= 20;
}

/**
 * [ajaxReq ajax请求]
 * @param  {[type]} url  [url链接]
 * @param  {[type]} data [传递的数据]
 * @param  {[type]} _cb  [回调函数]
 * @return {[type]}      [description]
 */
var ajaxReq = function(url, data, _cb, debug){
	api.showProgress({
	    title: '加载中',
	    text: '加载中...',
	    modal:  true
	});
	api.ajax({
	    url: DOMAIN + url,
	    method: 'post',
	    timeout: 30,
	    dataType: 'json',
	    returnAll:false,
	    data:data,
	},function(ret,err){
		api.hideProgress();
		if (debug) {
			popAlert(ret);
		}
	    if (ret) {
	        _cb(ret,data);
	    } else {
	        api.alert({
	        	title:"温馨提示",
	            msg:('错误码：'+err.code+'；错误信息：'+err.msg+'网络状态码：'+err.statusCode + "|" + url + "params=" + $api.jsonToStr(data))
	        });
	    };
	});
}

/**
 * [getUserInfo 查询用户信息]
 * @return {[type]} [用户信息]
 */
var getUserInfo = function(){
	var userInfo = $api.getStorage('userInfo');
	if (userInfo == undefined) {
		return false;
	}
	return $api.strToJson(userInfo);
}
/**
 * [setUserInfo 设置用户信息]
 * @param {[type]} userInfo [成功 或 失败]
 */
var setUserInfo = function(userInfo){
	return $api.setStorage('userInfo', $api.jsonToStr(userInfo));
}
/**
 * [getUserToken 获取用户令牌]
 * @return {[type]} [description]
 */
var getUserToken = function(){
	var userInfo = getUserInfo();
	if (userInfo === false) {
		return '';
	};
	if (userInfo['data']['userInfo']['User'] == undefined) {
		return '';
	};
	return userInfo['data']['userInfo']['User']['token'];
}
/**
 * [clearAllInfo 清除本地信息]
 * @return {[type]} [description]
 */
var clearAllInfo = function(){
	$api.clearStorage();
}
/**
 * [getUserField 按照字段查询 userInfo数据]
 * @param  {[type]} field [字段名称]
 * @return {[type]}       [description]
 */
var getUserField = function(field){
	var userInfo = getUserInfo();
	if (userInfo === false) {
		return false;
	}
	return userInfo['data']['userInfo']['User'][field];
}
/**
 * [refreshUserInfo 刷新本地用户数据]
 * @return {[type]} [不做错误提示]
 */
var refreshUserInfo = function(_cb){
	var token = getUserToken();
	var data = {
		values:{
			token:token
		}
	};
	ajaxReq("/AppUser/userInfo",data,function(ret){
		switch(ret['code']){
			case 0:{
				setUserInfo(ret);
				if (_cb) {
					_cb();
				};
				break;
			}
			default:{
				
				break;
			}
		}
	});
}
/**
 * [execScript 执行指定窗口脚本]
 * @param  {[type]} funcName  [执行函数名称]
 * @param  {[type]} winName   [窗口名称]
 * @param  {[type]} frameName [frame 名称]
 * @return {[type]}           [description]
 */
var execScript = function(funcName, winName,frameName){
	var data = {
		name:winName,
		script:funcName,
	}
	if (arguments.length == 3) {
		data['frameName'] = frameName;
	}
	api.execScript(data);
}

/**
 * [getValById 按照 ID 查询值]
 * @param  {[type]} id [id]
 * @return {[type]}    [description]
 */
var getValById = function(id){
	var obj = $api.byId(id);
	return $api.val(obj);
}
/**
 * [setValById 按照 id 设置值]
 * @param {[type]} id  [id]
 * @param {[type]} val [值]
 */
var setValById = function(id,val){
	var obj = $api.byId(id);
	return $api.val(obj, val);
}
/**
 * [getTextById 按照 id查文本]
 * @param  {[type]} id [id]
 * @return {[type]}    [description]
 */
var getTextById = function(id){
	var obj = $api.byId(id);
	return $api.text(obj);
} 
/**
 * [getHtmlById 按照id查 html]
 * @param  {[type]} id [id]
 * @return {[type]}    [description]
 */
var getHtmlById = function(id){
	var obj = $api.byId(id);
	return $api.html(obj);
}
/**
 * [setTextById 按照id设置文本]
 * @param {[type]} id   [id]
 * @param {[type]} text [文本]
 */
var setTextById = function(id, text){
	var obj = $api.byId(id);
	return $api.text(obj, text);
}
/**
 * [setHtmlById 按照 ID 设置 html]
 * @param {[type]} id   [id]
 * @param {[type]} html [html]
 */
var setHtmlById = function(id, html){
	var obj = $api.byId(id);
	return $api.html(obj, html);
}
/**
 * [setAttrById 按照id设置attr属性]
 * @param {[type]} id   [id]
 * @param {[type]} attr [attr]
 * @param {[type]} val  [val]
 */
var setAttrById = function(id, name, val){
	var obj = $api.byId(id);
	$api.attr(obj, name, val);
}
var getAttrById = function(id, name){
	var obj = $api.byId(id);
	return $api.attr(obj, name);
}
/**
 * [removeClsById 按照id删除class属性]
 * @param  {[type]} id  [id]
 * @param  {[type]} cls [class]
 * @return {[type]}     [description]
 */
var removeClsById = function(id, cls){
	var obj = $api.byId(id);
	$api.removeCls(obj, cls);
}
/**
 * [addClsById 按照id添加class属性]
 * @param {[type]} id  [description]
 * @param {[type]} cls [description]
 */
var addClsById = function(id,cls){
	var obj = $api.byId(id);
	$api.addCls(obj, cls);
}
/**
 * [addCssById 按照id添加css]
 * @param {[type]} id  [description]
 * @param {[type]} css [description]
 */
var addCssById = function(id,css){
	var obj = $api.byId(id);
	$api.css(obj, css);
}
/**
 * [getCssById 按照id获取css]
 * @param  {[type]} id   [description]
 * @param  {[type]} prop [description]
 * @return {[type]}      [description]
 */
var getCssById = function(id,prop){
	var obj = $api.byId(id);
	$api.cssVal(obj, prop);
}
/**
 * [focusById 按照id设置焦点]
 * @param  {[type]} id [id]
 * @return {[type]}    [description]
 */

var focusById = function(id){
	setTimeout("$api.byId('" + id + "').focus();",600);
}
/**
 * [blurById 按照id取消焦点]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
var blurById = function(id){
	setTimeout("$api.byId('" + id + "').blur();",600);
}
/**
 * [getPicture 从相册打开选择图片]
 * @param  {[type]} width  [图片宽度]
 * @param  {[type]} height [图片高度]
 * @param  {[type]} _cb    [回调函数]
 * @return {[type]}        [description]
 */
var getPicture = function(_cb, width, height, data){
	var options = {
	    sourceType: 'library',
	    allowEdit: true,
	    quality: 100,
	};
	if (arguments.length == 3) {
		options['targetWidth'] = width;
		options['targetHeight'] = height;
	};
	api.getPicture(options, function(ret, err){ 
	    if (ret) {
	    	if (ret.data != "") {
	    		_cb(ret,data);
	    	}
	    } else{
	    	//popToast($api.jsonToStr(err));
	    }
	});
}
/**
 * [refreshHeader 下拉头部刷新,请再回调函数调用refreshHeaderLoadDone结束刷新]
 * @param  {[type]} img       [刷新时展示的图片,使用widget协议]
 * @param  {[type]} bgColor   [背景颜色]
 * @param  {[type]} textColor [文本颜色]
 * @param  {[type]} _cb       [回调函数]
 * @return {[type]}           [description]
 */
var refreshHeader = function(img,bgColor,textColor,_cb){
	api.setRefreshHeaderInfo({
			visible: true,
		    loadingImg: img,
		    bgColor: bgColor,
		    textColor: textColor,
		    textDown: '下拉刷新...',
		    textUp: '松开刷新...',
		    showTime: true
		},
		function(ret, err){
			_cb(ret,err);
		}
	);
	
}
/**
 * [echoImage 延迟加载图片]
 * @return {[type]} [description]
 */
var echoImage = function(){
	echo.init({
	    offset: 100,
	    throttle: 250,
	    unload: false,
	    callback: function (element, op) {
	      console.log(element, 'has been', op + 'ed')
	    }
	  });
}

/**
 * [scrollById 按照id滑动]
 * @param  {[type]} id    [id]
 * @param  {[type]} width [width]
 * @return {[type]}       [description]
 */
var scrollById = function(id,width){
	var scrollerLiArr = $api.domAll("#scroller ul li");
	var allWdith = width*scrollerLiArr.length;
	var scrollerObj = $api.byId('scroller');
	$api.css(scrollerObj, 'width:' + allWdith + "px");
	scrollerUlObj = $api.dom("#scroller ul");
	$api.css(scrollerUlObj, 'width:100%;display:block;overflow:hidden;');
	var scroller = new IScroll("#" + id,
		{ 
			scrollX: true, 
			scrollY: false,
			preventDefault:false,
		});
	
}

var closeShare = function(){
	addClsById('share','hide');
	addClsById('share-mask','hide');
}
var showShare = function(){
	removeClsById('share','hide');
	removeClsById('share-mask','hide');
}
var shareToWeibo = function(id,title,description){
	var weibo = api.require('weibo');
	weibo.shareWebPage({
		apiKey:'3472369888',
	    text: title,
	    title: title,
	    description: description,
	    thumb: 'widget://image/common/icon_doc.jpg',
	    //thumb:'http://yiliao.bichonfrise.cn/files/icon_ganlanzhi.jpg',
	    contentUrl: 'http://doc.bichonfrise.cn/Index/tieziDetail?id=' + id,
	},function(ret,err){
	    if (ret.status) {
	        api.alert({title: '温馨提示',msg: '分享成功', buttons: ['确定']});
	    }
	});
}
var shareToQQ = function(id,title,description){
	var obj = api.require('qq');
	obj.shareNews({
	    url:'http://doc.bichonfrise.cn/Index/tieziDetail?id=' + id,
	    title:title,
	    description:description,
	    imgUrl:'http://yiliao.bichonfrise.cn/files/icon_doc.png',
	    callback:function(ret, err){
			popAlert($api.jsonToStr(ret) + "err=" + $api.jsonToStr(err));
		}
	});
}
var shareToWeixin = function(id,title,description){
	var wx = api.require('wx');
	wx.shareWebpage({
	    apiKey: 'wx9419ca22547a5bf7',
	    scene: 'timeline',
	    title: title,
	    description: description,
	    thumb: 'widget://image/common/icon_doc.jpg',
	    contentUrl: 'http://doc.bichonfrise.cn/Index/tieziDetail?id=' + id,
	}, function(ret, err){
	    if(ret.status){
	    }else{
	    }
	});
}
/**
 * [popConfirm 弹出确认框]
 * @param  {[type]} msg    [description]
 * @param  {[type]} _cbYes [description]
 * @param  {[type]} _cbNo  [description]
 * @return {[type]}        [description]
 */
var popConfirm = function(msg,_cbYes,_cbNo){
	api.confirm({
	    title: '温馨提示',
	    msg: msg,
	    buttons:['确定', '取消']
	},function(ret,err){
	    if(ret.buttonIndex == 1){
	    	if (_cbYes) {
	    		_cbYes();
	    	};
	    	
	    }
	    else{
	    	if (_cbNo) {
	    		_cbNo();
	    	};
	    }
	});
}
/**
 * [addEventById 为指定 ID 的元素添加事件]
 * @param {[type]} id   [description]
 * @param {[type]} type [description]
 * @param {[type]} _cb  [description]
 */
var addEventById = function(id,type,_cb){
	var obj = $api.byId(id);
	$api.addEvt(obj, type, _cb);
}
/**
 * [initComment 初始化评论框]
 * @param  {[type]} id        [description]
 * @return {[type]}           [description]
 */
var initComment = function(id){
	$api.addEvt($api.byId(id), 'focus', function(event){
		$api.addCls($api.dom("body"), 'fixed');
	});
	$api.addEvt($api.byId(id), 'blur', function(event){
		$api.removeCls($api.dom("body"), 'fixed');
	});
}

