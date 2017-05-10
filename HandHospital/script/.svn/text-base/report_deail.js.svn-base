//+++++++++++++++++++++++++++++++++++
//									+
//		 record_common.js			+
//									+
//+++++++++++++++++++++++++++++++++++

apiready = function() {
	
	var pageParam = api.pageParam;
	var user = $api.getStorage('user');
	api.ajax({
		url : HEALTH_URL + '?cmd=getAnalysisBean',
		method : 'post',
		cache : false,
		timeout : 30,
		data : {
			values : {
				userId : user.userId,
				eventNo : 'eventNo'
			}
		}
	}, function(ret, err) {
		if (ret) {
			if (ret.resultCode == RESULT_CODE_SUCCESS) {
				values = ret.result;
				if(ret.result.length > 0){
					var tpl = $('#record-template').text();
					var tempFn = doT.template(tpl);
					$('#content').html(tempFn(ret.result[0]));
					api.parseTapmode();
				}
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

function openDetail(eventNo){
	api.openWin({
		name : 'analysis_item_detail',
		url : 'framework.html',
		pageParam : {
			'index' : 0,
			'depName' : '具体项目',
			'type':'analysis_item_detail'
		},
	});
}



