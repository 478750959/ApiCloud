//+++++++++++++++++++++++++++++++++++
//									+
//		    order_doctor.js			+
//									+
//+++++++++++++++++++++++++++++++++++

var ret = []
apiready = function() {
	var pageParam = api.pageParam;
	var tpl = $('#doc-template').text();
	var tempFn = doT.template(tpl);
	$("#doctorBg").html(tempFn(pageParam.doctor));
	
	for (var i = 1; i <= 8; i++) {
		var json = {
			"time" : "星期一 上午",
			"datetime" : '2015-5-8',
			"cost" : '200',
			"num" : '20'
		};
		ret.push(json);
	}
	var tpl = $('#select-template').text();
	var tempFn = doT.template(tpl);
	$("#select-content").html(tempFn(ret));
	var user = $api.getStorage('user');
	$("#orderName").html(user.realName);
};

/**
 * DESC:选择日期
 * @author solotiger
 * @since 2014-12-18
 */
function select(thisobj,index){
	$('.radiochecked').removeClass("radiochecked");
	$('.radiospan').addClass("radionocheck");
	$(thisobj).find('.radiospan').removeClass("radionocheck");
	$(thisobj).find('.radiospan').addClass("radiochecked");
}

/**
 * DESC:确认预约
 * @author solotiger
 * @since 2014-12-18
 */
function order(){
	api.showProgress({
		title : '预约中...',
		modal : false
	});
	var user = $api.getStorage('user');
	
	api.ajax({
		url : ORDER_URL + "?cmd=addRegRecord",
		method : 'post',
		cache : false,
		timeout : 3000,
		data : {
			values : {
				userId : user.userId,
				depId : api.pageParam.depId,
				ram : "上午",
				weekDay : "星期一",
				regTime : "2015-5-18",
				doctorId : api.pageParam.doctor.doctorId,
			}
		}
	}, function(ret, err) {
		if (ret) {
			if (ret.resultCode == RESULT_CODE_SUCCESS) {
				api.alert({
					msg : '预约成功'
				});
				api.closeWin();
			}else{
				api.alert({
					msg : '预约失败'
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
