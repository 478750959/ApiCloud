apiready = function() {
	
	api.toast({
	    msg: '请保证您的信息的完整!',
	    duration:2000,
	    location: 'bottom'
	});
	
	var user = $api.getStorage('user');

	$("#realName").val(user.realName);
	$("#phoneNumber").val(user.phoneNumber);
	$("#userId").val(user.userId);
	$("#idCardNum").val(user.idCardNum ? user.idCardNum : "");
	$("#ybCardNum").val(user.ybCardNum ? user.ybCardNum : "");
	$("#medicalCardNum").val(user.medicalCardNum ? user.medicalCardNum : "");
	$("#sex").val(user.sex);

	if (user.sex == 1) {
		$("#male").removeClass("radionocheck");
		$("#male").addClass("radiochecked");
		$("#female").removeClass("radiochecked");
		$("#female").addClass("radionocheck");
	} else {
		$("#female").removeClass("radionocheck");
		$("#female").addClass("radiochecked");
		$("#male").removeClass("radiochecked");
		$("#male").addClass("radionocheck");
	}

};

/**
 * 选择性别
 * @param {Object} male
 */
function selectSex(male) {
	$("#sex").val(male);
	alert($("#sex").val());
	if (male == 1) {
		$("#male").removeClass("radionocheck");
		$("#male").addClass("radiochecked");
		$("#female").removeClass("radiochecked");
		$("#female").addClass("radionocheck");
	} else {
		$("#female").removeClass("radionocheck");
		$("#female").addClass("radiochecked");
		$("#male").removeClass("radiochecked");
		$("#male").addClass("radionocheck");
	}
}

function save() {
	if (FROM_NOT_NULL("modifyUser")) {
		api.showProgress({
			title : '数据提交中...',
			modal : false
		});
//		alert(JSON.stringify(FROM_TO_JSON("modifyUser")));
		api.ajax({
			url : USER_URL + "?cmd=modifyUser",
			method : 'post',
			cache : false,
			timeout : 3000,
			data : {
				values : FROM_TO_JSON("modifyUser")
			}
		}, function(ret, err) {
			if (ret) {
				if (ret.resultCode == RESULT_CODE_SUCCESS) {
					//保存基本的用户信息
					$api.setStorage('user', ret.result);
				}
				api.alert({
					msg : ret.resultMessage
				});
			} else {
				api.alert({
					msg : "网络或者服务器有问题!"
				});
			};
			api.hideProgress();
		});
	}
}
