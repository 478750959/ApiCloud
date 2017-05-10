//+++++++++++++++++++++++++++++++++++
//									+
//		     news.js				+
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

var isLoading = false;
var pagenumber = 0;
var bannerLoading = false;
var news = [];
apiready = function() {
	//初始化Slide。
	getBanner();
	getContent();
	
	//上拉刷新
	api.addEventListener({
		name : 'scrolltobottom'
	}, function(ret, err) {
		getContent();
	});
};

function getBanner() {
	
	bannerLoading = true;
	
	api.showProgress({
		title : '加载中...',
		modal : false
	});

	api.ajax({
		url : MORE_URL + "?cmd=getAllContent",
		method : 'post',
		cache : false,
		timeout : 30,
		data : {
			values : {
				page : 1,
				rows : 3,
				isRecommend : true
			}
		}
	}, function(ret, err) {
		if (ret) {
			if (ret.resultCode == RESULT_CODE_SUCCESS) {
				var values = ret.result.rows;
				$.each(values, function(index, item){
    				item.title_img = IMAGE_URL + item.title_img;
				});
				var content = $api.byId('banner-content');
                var tpl = $api.byId('banner-template').text;
                var tempFn = doT.template(tpl);
                content.innerHTML = tempFn(values);
                initSlide();
			} else {
				api.alert({
					msg : '获取数据失败'
				});
			}
		} else {
			api.alert({
				msg : "网络或者服务器有问题!"
			});
		};
		bannerLoading = false;
		if(!isLoading){
			api.hideProgress();
		}
	});
}


function getContent() {
	
	if (isLoading) {
		return;
	}
	
	api.showProgress({
		title : '加载中...',
		modal : false
	});
	
	isloading = true;
	
	pagenumber++;
	
	api.ajax({
		url : MORE_URL + "?cmd=getAllContent",
		method : 'post',
		cache : false,
		timeout : 30,
		data : {
			values : {
				page : pagenumber,
				rows : 5,
				isRecommend : false
			}
		}
	}, function(ret, err) {
		if (ret) {
			if (ret.resultCode == RESULT_CODE_SUCCESS) {
				var values = ret.result.rows;
				if(values.length > 0){
					$.each(values, function(index, item){
    					item.title_img = IMAGE_URL + item.title_img;
    					var arrayObj = new Array();
    					$.each(item.content_img.split(",\r\n"), function(index, item){
    						if(item != ''){
    							arrayObj.push(IMAGE_URL + item);
    						}
						});
    					item.arrimgs = arrayObj;
    					news.push(item);
					});
	                var tpl = $api.byId('content-template').text;
	                var tempFn = doT.template(tpl);
//	                content.innerHTML = tempFn(values);
	                $('#content').append(tempFn(values));
				}else{
					pagenumber--;
					api.toast({
					    msg: '已无数据可加载!',
					    duration:2000,
					    location: 'bottom'
					});
				}
			} else {
				pagenumber--;
				api.alert({
					msg : '获取数据失败'
				});
			}
		} else {
			pagenumber--;
			api.alert({
				msg : "网络或者服务器有问题!"
			});
		};
		api.hideProgress();
	});
}

function openWin(content_id){
	var bean;
	for ( i = 0; i < news.length; i++) {
		if (news[i].content_id == content_id) {
			bean = news[i];
			break;
		}
	}
	api.openWin({
		name : 'news_detail',
		url : 'framework.html',
		pageParam : {
			'index' : 0,
			'depName' : '新闻',
			'bean' : bean,
			'type':'news_detail'
		},
	});
}
