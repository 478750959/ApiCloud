//+++++++++++++++++++++++++++++++++++
//									+
//		      index.js				+
//									+
//+++++++++++++++++++++++++++++++++++

/**
 * DESC:初始化Slide。
 * @author solotiger
 * @since 2014-12-18
 */
//function initSlide() {
//	var slide = $api.byId('slide');
//	var pointer = $api.domAll('#pointer a');
//	window.mySlide = Swipe(slide, {
//		// startSlide: 2,
//		auto : 5000,
//		continuous : true,
//		disableScroll : true,
//		stopPropagation : true,
//		callback : function(index, element) {
//			var actPoint = $api.dom('#pointer a.active');
//			$api.removeCls(actPoint, 'active');
//			$api.addCls(pointer[index], 'active');
//		},
//		transitionEnd : function(index, element) {
//
//		}
//	});
//}

apiready = function() {
	var header = $api.byId('header');
	$api.fixIos7Bar(header);
	var headerPos = $api.offset(header);
	api.openFrame({
		name : 'home',
		url : 'html/home.html',
		bounces : false,
		rect : {
			x : 0,
			y : headerPos.h,
			w : 'auto',
			h : 'auto'
		}
	});
	//初始化Slide。
//	initSlide();
};


function openInfo(){
	api.openWin({
		name : 'myinfo',
		url : 'html/framework.html',
		pageParam : {
			'index' : 0,
			'depName' : '我的信息',
			'type':'myinfo'
		},
	});
}
