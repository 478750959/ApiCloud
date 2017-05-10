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