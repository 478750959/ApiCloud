//+++++++++++++++++++++++++++++++++++
//									+
//		 order_record.js			+
//									+
//+++++++++++++++++++++++++++++++++++

var values = []

apiready = function() {
	api.showProgress({
		title : '提交中...',
		modal : false
	});
	var user = $api.getStorage('user');

	api.ajax({
		url : ORDER_URL + "?cmd=getRegRecords",
		method : 'post',
		cache : false,
		timeout : 3000,
		data : {
			values : {
				userId : user.userId
			}
		}
	}, function(ret, err) {
		if (ret) {
			if (ret.resultCode == RESULT_CODE_SUCCESS) {
				values = ret.result;
				if (values.length <= 0) {
					api.alert({
						msg : '目前暂无预约记录'
					});
				} else {
					$.each(values, function(index, item) {
						item.doctorImg = IMAGE_URL + item.doctorImg;
					});
					var tpl = $('#record-template').text();
					var tempFn = doT.template(tpl);
					$('#main').html(tempFn(values));
				}
			} else {
				api.alert({
					msg : '获取数据失败'
				});
			}
		} else {
			api.alert({
				msg : "网络或者服务器有问题!"
			});
		};
		api.hideProgress();
	});
};

function goEvaluate(doctorId,doctorName,recordId) {
	api.openWin({
		name : 'evaluate_framework',
		url : 'evaluate_framework.html',
		pageParam : {
			'doctorId' : doctorId,
			'recordId' : recordId,
			'title' : doctorName
		}
	});
}

