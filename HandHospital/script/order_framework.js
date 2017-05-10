//+++++++++++++++++++++++++++++++++++
//									+
//		  order_framework.js		+
//									+
//+++++++++++++++++++++++++++++++++++

var DOCTOR_TAB = 1;
var EVALUATE_TAB = 2;
var curTab = -1;

var headH;

apiready = function() {
	var pageParam = api.pageParam;
	headH = pageParam.headH;
	//默认显示专家预约TAB
	showDoctor();
};

/**
 * DESC:显示专家预约项
 * @author solotiger
 * @since 2014-12-18
 */
function showDoctor() {
	if (curTab != DOCTOR_TAB) {
		openFrame("order_doctor");
		curTab = DOCTOR_TAB;
		$('.left').addClass('active');
		$('.right').removeClass('active');
		api.closeFrame({name: 'order_evaluate'});
	}
}

/**
 * DESC:显示患者评价项
 * @author solotiger
 * @since 2014-12-18
 */
function showEvaluate() {
	if (curTab != EVALUATE_TAB) {
		openFrame("order_evaluate");
		curTab = EVALUATE_TAB;
		$('.left').removeClass('active');
		$('.right').addClass('active');
		api.closeFrame({name: 'order_doctor'});
	}
}

function openFrame(type){
	var header = $api.byId('header');
	var headerPos = $api.offset(header);
	
	api.openFrame({
		name : type,
		url : type + '.html',
		bounces : false,
		pageParam: api.pageParam,
		rect : {
			x : 0,
			y : headH + headerPos.h + 8,
			w : 'auto',
			h : 'auto'
		}
	});
}
