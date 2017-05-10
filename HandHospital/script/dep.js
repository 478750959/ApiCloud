//+++++++++++++++++++++++++++++++++++
//									+
//		      dep.js				+
//									+
//+++++++++++++++++++++++++++++++++++

var values;

apiready = function() {
	
	api.showProgress({
		title : '加载中...',
		modal : false
	});

	api.ajax({
		url : DEP_URL + "?cmd=getDoctorByDep",
		method : 'post',
		cache : false,
		timeout : 3000,
		data : {
			values : {
				depId : api.pageParam.index,
			}
		}
	}, function(ret, err) {
		if (ret) {
			if (ret.resultCode == RESULT_CODE_SUCCESS) {
				values = ret.result;
				$.each(values, function(index, item){
    				item.doctorImg = IMAGE_URL + item.doctorImg;
				});
				var content = $api.byId('main');
				var tpl = $api.byId('doctor-template').text;
				var tempFn = doT.template(tpl);
				content.innerHTML = tempFn(values);
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

/**
 * DESC:order
 * @author solotiger
 * @since 2014-12-18
 */
function order(index) {
	api.openWin({
		name : 'order_dep',
		url : 'framework.html',
		pageParam : {
			'doctor' : values[index],
			'index' : 0,
			'depId' : api.pageParam.index,
			'depName' : '预约',
			'type':'order_framework'
		},
	});
}