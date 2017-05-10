//+++++++++++++++++++++++++++++++++++
//									+
//		      more.js				+
//									+
//+++++++++++++++++++++++++++++++++++

apiready = function() {

};

/**
 * DESC:约入口。
 * @author solotiger
 * @since 2014-12-18
 */
function openWin(type, winName) {
	api.openWin({
		name : 'framework_more_' + type,
		url : 'framework.html',
		pageParam : {
			'index' : 0,
			'depName' : winName,
			'type' : type
		},
	});

	hideSelf();
}

function hideSelf() {
	api.setFrameAttr({
		name : 'more',
		hidden : true
	});
}

