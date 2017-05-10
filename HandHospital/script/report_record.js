//+++++++++++++++++++++++++++++++++++
//									+
//		 ort_record.js			+
//									+
//+++++++++++++++++++++++++++++++++++

var index = 0;

var ret = []

apiready = function() {
	for (var i = 1; i <= 12; i++) {
		var json = {
			"title" : "这是一个报告单" + i,
			"time" : "2014-12-12",
			"name": "姓名" + i
		};
		ret.push(json);
	}
	
	var tpl = $('#record-template').text();
	var tempFn = doT.template(tpl);
	$('#content').html(tempFn(ret));
};


