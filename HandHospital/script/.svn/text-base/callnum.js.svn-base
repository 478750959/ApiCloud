//+++++++++++++++++++++++++++++++++++
//									+
//		      callnum.js			+
//									+
//+++++++++++++++++++++++++++++++++++

apiready = function() {

	api.showProgress({
		title : '加载中...',
		modal : false
	});

	var user = $api.getStorage('user');

	api.ajax({
		url : USER_URL + "?cmd=getLineup",
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
				var values = ret.result;
				$.each(values, function(index, item) {
					item.depImg = IMAGE_URL + item.depImg;
				});
				var content = $api.byId('content');
				var tpl = $api.byId('line-template').text;
				var tempFn = doT.template(tpl);
				content.innerHTML = tempFn(values);
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

/**
 * DESC:关闭
 * @author solotiger
 * @since 2014-12-18
 */
function openWin() {
	api.openWin({
		name : 'num',
		url : 'framework.html',
		pageParam : {
			'index' : 0,
			'depName' : '科室实时叫号',
			'type' : 'num'
		},
	});
}