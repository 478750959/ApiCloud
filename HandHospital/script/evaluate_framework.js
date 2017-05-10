//+++++++++++++++++++++++++++++++++++
//									+
//		evaluate_framework.js		+
//									+
//+++++++++++++++++++++++++++++++++++

apiready = function() {

	var pageParam = api.pageParam;
	var headerText = $api.byId('headerText');
	headerText.innerHTML = pageParam.title;
	
	open();
};

function open() {
	var header = $api.byId('header');
	$api.fixIos7Bar(header);
	var headerPos = $api.offset(header);
	var main = $api.byId('main');
	var mainPos = $api.offset(main);

	api.openFrame({
		name : 'evaluate',
		url : 'evaluate.html',
		bounces : false,
		opaque : true,
		vScrollBarEnabled : false,
		pageParam : {
			doctorId : api.pageParam.doctorId
		},
		rect : {
			x : 0,
			y : headerPos.h,
			w : headerPos.w,
			h : mainPos.h
		}
	});
}

function comfirm() {

	var title = $('#title').val();
	var content = $('#content').val();

	if (!(title && $api.trimAll(title))) {
		api.alert({
			msg : '请标题!'
		});
		return;
	}

	if (!(content && $api.trimAll(content))) {
		api.alert({
			msg : '请评价内容!'
		});
		return;
	}

	api.showProgress({
		title : '评价中...',
		modal : false
	});
	var user = $api.getStorage('user');

	api.ajax({
		url : DEP_URL + "?cmd=addEvaluate",
		method : 'post',
		cache : false,
		timeout : 3000,
		data : {
			values : {
				userId : user.userId,
				doctorId : api.pageParam.doctorId,
				recordId : api.pageParam.recordId,
				title : title,
				content : content
			}
		}
	}, function(ret, err) {
		if (ret) {
			if (ret.resultCode == RESULT_CODE_SUCCESS) {
				api.alert({
					msg : "评价成功!"
				});
				api.closeFrame({
					name : 'evaluate'
				});
				
				open();

			} else {
				api.alert({
					msg : '评价失败!'
				});
			}
		} else {
			api.alert({
				msg : "网络或者服务器有问题!"
			});
		};
		api.hideProgress();
	});
}