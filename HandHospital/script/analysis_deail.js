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



