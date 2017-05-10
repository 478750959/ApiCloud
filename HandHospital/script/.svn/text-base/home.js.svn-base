//+++++++++++++++++++++++++++++++++++
//									+
//		      main.js				+
//									+
//+++++++++++++++++++++++++++++++++++

/**
 * DESC:初始化Slide。
 * @author solotiger
 * @since 2014-12-18
 */
function initSlide() {
	var slide = $api.byId('slide');
	var pointer = $api.domAll('#pointer a');
	window.mySlide = Swipe(slide, {
		// startSlide: 2,
		auto : 5000,
		continuous : true,
		disableScroll : true,
		stopPropagation : true,
		callback : function(index, element) {
			var actPoint = $api.dom('#pointer a.active');
			$api.removeCls(actPoint, 'active');
			$api.addCls(pointer[index], 'active');
		},
		transitionEnd : function(index, element) {

		}
	});
}

apiready = function() {
	//初始化Slide。
	initSlide();

	setTimeout("rotate()", 1000)

};

function rotate() {
	Img.rotate('order', 360);
}

/**
 * DESC:约入口。
 * @author solotiger
 * @since 2014-12-18
 */
function openWin(type,winName) {
	
	if(type == 'callnum'){
		if (!$api.getStorage('user')) {
			api.openWin({
				name : 'login',
				url : 'framework.html',
				pageParam : {
					'index' : 0,
					'depName' : '登录',
					'type' : 'login'
				},
			});
			return false;
		}
	}
	
	if (type === 'order' || type === 'callnum' || type === 'healthy' || type == 'report') {
		api.openWin({
			name : 'main',
			url : 'main.html',
			pageParam: {type: type},
		});
	} else {
		api.openWin({
			name : 'framework_more_' + type,
			url : 'framework.html',
			pageParam : {
				'index' : 0,
				'depName' : winName,
				'type' : type
			},
		}); 
	}
}

/**
 * DESC:旋转的效果
 * @author solotiger
 * @since 2014-12-18
 */
var Img = function() {
	var T$ = function(id) {
		return document.getElementById(id);
	}
	var ua = navigator.userAgent, isIE = /msie/i.test(ua) && !window.opera;
	var i = 0, sinDeg = 0, cosDeg = 0, timer = null;
	var rotate = function(target, degree) {
		target = T$(target);
		var orginW = target.clientWidth, orginH = target.clientHeight;
		clearInterval(timer);
		function run(angle) {
			if (isIE) {// IE
				cosDeg = Math.cos(angle * Math.PI / 180);
				sinDeg = Math.sin(angle * Math.PI / 180);
				with (target.filters.item(0)) {
					M11 = M22 = cosDeg;
					M12 = -( M21 = sinDeg);
				}
				target.style.top = (orginH - target.offsetHeight) / 2 + 'px';
				target.style.left = (orginW - target.offsetWidth) / 2 + 'px';
			} else if (target.style.MozTransform !== undefined) {// Mozilla
				target.style.MozTransform = 'rotate(' + angle + 'deg)';
			} else if (target.style.OTransform !== undefined) {// Opera
				target.style.OTransform = 'rotate(' + angle + 'deg)';
			} else if (target.style.webkitTransform !== undefined) {// Chrome Safari
				target.style.webkitTransform = 'rotate(' + angle + 'deg)';
			} else {
				target.style.transform = "rotate(" + angle + "deg)";
			}
		}

		timer = setInterval(function() {
			i += 10;
			run(i);
			if (i > degree - 1) {
				i = 0;
				clearInterval(timer);
			}
		}, 10);
	}
	return {
		rotate : rotate
	}
}();
