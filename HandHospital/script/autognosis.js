//+++++++++++++++++++++++++++++++++++
//									+
//		      hpfloor.js			+
//									+
//+++++++++++++++++++++++++++++++++++

var ret = []

apiready = function() {
	for (var i = 1; i <= 10; i++) {
		var json = {
			"type" : "头部" + i,
		};
		ret.push(json);
	}
	
	var content = $api.byId('main');
	var tpl = $api.byId('autognosis-template').text;
	var tempFn = doT.template(tpl);
	content.innerHTML = tempFn(ret);
};

/**
 * DESC:autognosisDetail
 * @author solotiger
 * @since 2014-12-18
 */
function autognosisDetail(type) {
	alert(type);
}