//+++++++++++++++++++++++++++++++++++
//									+
//		      order.js				+
//									+
//+++++++++++++++++++++++++++++++++++
var ret = []

apiready = function() {
	api.showProgress({
		title : '加载中...',
		modal : false
	});

	api.ajax({
		url : DEP_URL + "?cmd=getAllDep",
		method : 'post',
		cache : false,
		timeout : 3000
	}, function(ret, err) {
		if (ret) {
			if (ret.resultCode == RESULT_CODE_SUCCESS) {
				var values = ret.result;
				$.each(values, function(index, item){
    				item.depImg = IMAGE_URL + item.depImg;
				});
				var content = $api.byId('dep');
				var tpl = $api.byId('li-template').text;
				var tempFn = doT.template(tpl);
				content.innerHTML = tempFn(values);
			}else{
				api.alert({
					msg : ret.resultMessage
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

function openDep(index,depName) {
	if(CHECK_LOGIN()){
		api.openWin({
			name : 'framework_dep',
			url : 'framework.html',
			pageParam : {
				'index' : index,
				'depName' : depName,
				'type':'dep'
			},
		});
	}
}
