//+++++++++++++++++++++++++++++++++++
//									+
//		      num.js				+
//									+
//+++++++++++++++++++++++++++++++++++

var ret = []
var num = 1;
apiready = function() {
	for (var i = 1; i <= 12; i++) {
		var json = {
			"depName" : "科室" + i,
			"num" : 0
		};
		ret.push(json);
	}

	var content = $api.byId('content');
	var tpl = $api.byId('num-template').text;
	var tempFn = doT.template(tpl);
	content.innerHTML = tempFn(ret);

	setInterval("update()", 1000);

};
/**
 * DESC:update
 * @author solotiger
 * @since 2014-12-18
 */
function update() {

	if (num > 20) {
		num = 1;
	}
	$('.content .right').each(function() {
		$(this).html(num);
	});
	num++;
}
