//+++++++++++++++++++++++++++++++++++
//									+
//		  order_framework.js		+
//									+
//+++++++++++++++++++++++++++++++++++

var INFO_TAB = 1;
var FLOOR_TAB = 2;
var MAP_TAB = 3;
var curTab = -1;

var headH;

apiready = function() {
	var pageParam = api.pageParam;
	headH = pageParam.headH;
	//默认显示医院简介TAB
	openInfo();
};

/**
 * DESC:显示医院简介
 * @author solotiger
 * @since 2014-12-18
 */
function openInfo() {
	if (curTab != INFO_TAB) {
		openFrame("hpinfo");
		if (curTab == MAP_TAB) {
			var map = api.require('baiduMap');
			map.close();
		} else if (curTab == FLOOR_TAB) {
			api.closeFrame({
				name : 'hpfloor'
			});
		}
		curTab = INFO_TAB;
		$('.left').addClass('active');
		$('.right').removeClass('active');
		$('.middle').removeClass('active');
	}
}

/**
 * DESC:显示楼层导航
 * @author solotiger
 * @since 2014-12-18
 */
function openFloor() {
	if (curTab != FLOOR_TAB) {
		openFrame("hpfloor");

		if (curTab == MAP_TAB) {
			var map = api.require('baiduMap');
			map.close();
		} else if (curTab == INFO_TAB) {
			api.closeFrame({
				name : 'hpinfo'
			});
		}
		curTab = FLOOR_TAB;
		$('.left').removeClass('active');
		$('.right').removeClass('active');
		$('.middle').addClass('active');
	}
}

function openFrame(type) {
	var header = $api.byId('header');
	var headerPos = $api.offset(header);

	api.openFrame({
		name : type,
		url : type + '.html',
		bounces : false,
		rect : {
			x : 0,
			y : headH + headerPos.h + 8,
			w : 'auto',
			h : 'auto'
		}
	});
}

function openMap() {
	if (curTab != MAP_TAB) {
		var map = api.require('baiduMap');
		var header = $api.byId('header');
		var headerPos = $api.offset(header);
        var bodyHeight = window.innerHeight;
		map.open({
			x : 0,
			y : headH + headerPos.h + 8,
			width : headerPos.w + 16,
			height : bodyHeight - headH + 16
		}, function(ret, err) {
			if (ret.status) {

			}
		});

		if (curTab == FLOOR_TAB) {
			api.closeFrame({
				name : 'hpfloor'
			});
		} else if (curTab == INFO_TAB) {
			api.closeFrame({
				name : 'hpinfo'
			});
		}
		curTab = MAP_TAB;
		$('.left').removeClass('active');
		$('.right').addClass('active');
		$('.middle').removeClass('active');
	}
}
