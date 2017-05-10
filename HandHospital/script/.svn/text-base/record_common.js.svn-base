//+++++++++++++++++++++++++++++++++++
//									+
//		 record_common.js			+
//									+
//+++++++++++++++++++++++++++++++++++

var TITLE_ARRAY = [
	["门诊日期","门诊部门"],
	["住院时间","病人名字"],
	["化验编号","化验名称"],
	["检查编号","检查名称"]
];

var URL_ARRAY = ['?cmd=getSurgeryBean','?cmd=getHospitalBean','?cmd=getAnalysisBean','?cmd=getCheckBean'];

var HTML_ARRAY = ['outpatient_detail','hospital_detail','analysis_detail','check_detail'];

var DETAIL_TTTLE_ARRAY = ['门诊信息','住院信息','化验信息','检查信息'];

var index = 0;

var result = [];

var values;

apiready = function() {
	var pageParam = api.pageParam;
	index = pageParam.index;
	index = index || 0;
	$(".header_bg .left").html(TITLE_ARRAY[index][0]);
	$(".header_bg .middle").html(TITLE_ARRAY[index][1]);
	
	api.showProgress({
		title : '加载中...',
		modal : false
	});
	
	var user = $api.getStorage('user');
	api.ajax({
		url : HEALTH_URL + URL_ARRAY[index],
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
				
				$.each(values, function(i, item){
					var json = {};
					if(index == 0) {//我的门诊记录
						json = {
							"name" : item.outpatientDept,
							"num" : item.outpatientDate
						};
					}else if(index == 1){
						json = {
							"name" : item.PatientName,
							"num" : item.illDate
						};
					}else if(index == 2){
						json = {
							"name" : item.Num,
							"num" : item.className
						};
					}else if(index == 3){
						json = {
							"name" : item.checkNum,
							"num" : item.checkName
						};
					}
					result.push(json);
				});
				var tpl = $('#record-template').text();
				var tempFn = doT.template(tpl);
				$('#content').html(tempFn(result));
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

function openDetail(i){
	api.openWin({
		name : HTML_ARRAY[index],
		url : 'framework.html',
		pageParam : {
			'index' : 0,
			'depName' : DETAIL_TTTLE_ARRAY[index],
			'bean' : values[i],
			'type':HTML_ARRAY[index]
		},
	});
}


