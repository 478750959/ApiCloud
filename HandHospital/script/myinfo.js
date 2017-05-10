//+++++++++++++++++++++++++++++++++++
//									+
//		      myinfo.js				+
//									+
//+++++++++++++++++++++++++++++++++++

apiready = function() {
	api.addEventListener({
		name : 'viewappear'
	}, function() {
		var user = $api.getStorage('user');
		if (user) {
			$("#userinfo").html(user.realName);
			$("#exit").show();
		} else {
			$("#userinfo").html("注册/登录");
			$("#exit").hide();
		}
	});

	$("#exit").on('click', function(e) {

		api.confirm({
			title : '提示',
			msg : '确定要退出当前用户吗?',
			buttons : ['确定', '取消']
		}, function(ret, err) {
			if (ret.buttonIndex == 1) {
				$api.rmStorage('user');
				$("#userinfo").html("注册/登录");
				$("#exit").hide();
			}
		});
	});
};

function openLogin() {
	if (!$api.getStorage('user')) {
		openWin('login', '登录');
	}
}

function openWin(type, title) {
	if(CHECK_LOGIN()){
		api.openWin({
			name : type,
			url : 'framework.html',
			pageParam : {
				'index' : 0,
				'depName' : title,
				'type' : type
			},
		});
	}
}
