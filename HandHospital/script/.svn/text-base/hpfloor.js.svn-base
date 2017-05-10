//+++++++++++++++++++++++++++++++++++
//									+
//		      hpfloor.js			+
//									+
//+++++++++++++++++++++++++++++++++++

apiready = function() {

	api.showProgress({
		title : '加载中...',
		modal : false
	});

	api.ajax({
		url : MORE_URL + "?cmd=getAllBuilding",
		method : 'post',
		cache : false,
		timeout : 3000
	}, function(ret, err) {
		if (ret) {
			if (ret.resultCode == RESULT_CODE_SUCCESS) {
				var content = $api.byId('main');
				var tpl = $api.byId('floor-template').text;
				var tempFn = doT.template(tpl);
				content.innerHTML = tempFn(ret.result);
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

/**
 * DESC:floorDetail
 * @author solotiger
 * @since 2014-12-18
 */
function floorDetail(floorId) {
	alert(floorId);
}