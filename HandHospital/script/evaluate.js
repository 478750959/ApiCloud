//+++++++++++++++++++++++++++++++++++
//									+
//		  order_evaluate.js			+
//									+
//+++++++++++++++++++++++++++++++++++

apiready = function() {
	var doctorId = api.pageParam.doctorId;
	
	if(!doctorId){
		doctorId = api.pageParam.doctor.doctorId;
	}

	api.showProgress({
		title : '获取中...',
		modal : false
	});

	api.ajax({
		url : DEP_URL + "?cmd=getDoctorEvaluate",
		method : 'post',
		cache : false,
		timeout : 3000,
		data : {
			values : {
				doctorId : doctorId
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
