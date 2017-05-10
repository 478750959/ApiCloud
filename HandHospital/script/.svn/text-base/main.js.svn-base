//+++++++++++++++++++++++++++++++++++
//									+
//		      main.js				+
//									+
//+++++++++++++++++++++++++++++++++++

var prevPid = '', curPid = '', thirdPid = '';
var frameArr = [];

apiready = function() {
	var pageParam = api.pageParam;
	openTab(pageParam.type);
};

/**
 * DESC:打开TAB方法
 * @author solotiger
 * @param {Object} type
 * @since 2014-12-18
 */
function openTab(type) {

	type = type || 'healthy';
	
	if(type == 'callnum'){
		if (!$api.getStorage('user')) {
			api.openWin({
				name : 'login',
				url : 'framework.html',
				pageParam : {
					'index' : 0,
					'depName' : '登录',
					'type' : 'login'
				},
			});
			return false;
		}
	}
	
	var actTab = $api.dom('li.active');
	$api.removeCls(actTab, 'active');
	var thisTab = $api.byId(type);
	$api.addCls(thisTab, 'active');

	var header = $api.byId('header');
	$api.fixIos7Bar(header);
	var headerPos = $api.offset(header);
	var main = $api.byId('main');
	var mainPos = $api.offset(main);
	
	//保存
	thirdPid = prevPid;
	prevPid = curPid;
	curPid = type;
	if (prevPid !== curPid) {
		if(prevPid === 'more' && thirdPid !== curPid){
			api.setFrameAttr({
				name : thirdPid,
				hidden : true
			});
		}
		if (isOpened(type)) {
			api.setFrameAttr({
				name : type,
				hidden : false
			});
			api.bringFrameToFront({
			    from:type
			});
		} else {
			if (type != 'more') {
				api.openFrame({
					name : type,
					url : type + '.html',
					bounces : false,
					opaque : true,
					vScrollBarEnabled : false,
					pageParam : {
						headerHeight : headerPos.h
					},
					rect : {
						x : 0,
						y : headerPos.h,
						w : headerPos.w,
						h : mainPos.h
					}
				});
			} else {
				api.openFrame({
					name : type,
					url : type + '.html',
					bounces : false,
					opaque : true,
					vScrollBarEnabled : false,
					bgColor: 'rgba(0,0,0,0.5)',
					pageParam : {
						headerHeight : headerPos.h
					},
					rect : {
						x : 0,
						y : headerPos.h,
						w : headerPos.w,
						h : mainPos.h
					}
				});
			}
		}

		if (prevPid) {
			if (type != 'more') {
				api.setFrameAttr({
					name : prevPid,
					hidden : true
				});
			}
		}

		if (!isOpened(type)) {
			//save frame name
			frameArr.push(type);
		}
		
		if(type != 'more'){
			var headerText = $api.byId('headerText');
			headerText.innerHTML = $api.dom('a.' + type).innerHTML;
		}
	}else{
		if (type === 'more' && isOpened(type)) {
			api.setFrameAttr({
				name : type,
				hidden : false
			});
		} 
	}
}

function isOpened(frmName) {
	var i = 0, len = frameArr.length;
	var mark = false;
	for (i; i < len; i++) {
		if (frameArr[i] === frmName) {
			mark = true;
			return mark;
		}
	}
	return mark;
}

function openInfo() {
	api.openWin({
		name : 'order',
		url : 'framework.html',
		pageParam : {
			'index' : 0,
			'depName' : '我的信息',
			'type':'myinfo'
		},
	});
}

function closeMain() {
	api.closeWin({
		animation : {
			type : 'none',
			subType : 'from_bottom',
			duration : 500
		}
	});
}