//+++++++++++++++++++++++++++++++++++
//									+
//		      framework.js			+
//									+
//+++++++++++++++++++++++++++++++++++

apiready = function() {
	var header = $api.byId('header');
	$api.fixIos7Bar(header);
	var headerPos = $api.offset(header);
	
	var pageParam = api.pageParam;
	var headerText = $api.byId('headerText');
	headerText.innerHTML = pageParam.depName;
	
	pageParam.headH = headerPos.h;
	
	api.openFrame({
		name : pageParam.type + "_" + pageParam.index,
		url : pageParam.type + '.html',
		pageParam: pageParam,
		bounces : false,
		rect : {
			x : 0,
			y : headerPos.h,
			w : 'auto',
			h : 'auto'
		}
	});
};

/**
 * DESC:关闭
 * @author solotiger
 * @since 2014-12-18
 */
function closeSelf() {
	api.closeWin();
}
