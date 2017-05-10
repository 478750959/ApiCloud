//+++++++++++++++++++++++++++++++++++
//									+
//		 record_common.js			+
//									+
//+++++++++++++++++++++++++++++++++++

apiready = function() {
	var pageParam = api.pageParam;
	var tpl = $('#record-template').text();
	var tempFn = doT.template(tpl);
	$('#content').html(tempFn(pageParam.bean));
	api.parseTapmode();
	
};

function openMedicine(eventNo){
	api.openWin({
		name : 'outpatient_medicine',
		url : 'framework.html',
		pageParam : {
			'index' : 0,
			'depName' : '药品明细',
			'type':'outpatient_medicine'
		},
	});
}

function openFee(eventNo){
	api.openWin({
		name : 'outpatient_fee',
		url : 'framework.html',
		pageParam : {
			'index' : 0,
			'depName' : '费用明细',
			'type':'outpatient_fee'
		},
	});
}


