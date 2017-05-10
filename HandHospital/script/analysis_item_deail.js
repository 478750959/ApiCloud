//+++++++++++++++++++++++++++++++++++
//									+
//		 record_common.js			+
//									+
//+++++++++++++++++++++++++++++++++++

apiready = function() {
	api.showProgress({
		title : '加载中...',
		modal : false
	});
	
	api.ajax({
		url : HEALTH_URL + "?cmd=getAnalysisItemBean",
		method : 'post',
		cache : false,
		timeout : 30,
		data : {
			values : {
				eventNo : 'eventNo'
			}
		}
	}, function(ret, err) {
		if (ret) {
			if (ret.resultCode == RESULT_CODE_SUCCESS) {
				var tpl = $('#record-template').text();
				var tempFn = doT.template(tpl);
				$('#content').html(tempFn(ret.result));
				api.parseTapmode();
			}else{
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



