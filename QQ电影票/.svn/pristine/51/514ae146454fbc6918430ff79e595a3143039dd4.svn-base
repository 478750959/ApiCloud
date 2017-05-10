
// 判断打开欢迎页还是直接进首页调出indexframegroup
var indexOrWelcome = function(fn){

    if($api.getStorage('firstStart')){
        api.setFrameGroupAttr({
            name: 'welcome',
            hidden:true
        });
        api.setFrameAttr({
            name: 'dot_slider',
            hidden:true
        });
        api.execScript({
            name: 'root',
            script: 'openIndexFrameGroup();'
        });
    } else {
        fn && fn();
    }
};

// 城市快捷入口frame
var openCityListWin = function(){
	api.openWin({
        name: 'city_list',
        url: './city_list.html',
        rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        },
        bounces: false,
        delay: 100
    });
    api.setFrameAttr({
		name: 'fast_city',
        hidden: 'true'
	});
};
// 主页menu切换
var changeIndexMenu = function(num){
    api.setFrameGroupIndex ({
        name: 'index_frameGroup',
        index: num,
        scroll: true
    });
};

// 活动页主窗口
var openActGroup = function(num){
    $api.setStorage('actgroup',num);
    api.openWin({
        name: 'act_win',
        url: '../actgroup/actgroup_win.html',
        bounces: false,
        rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        }
    });
};
// 活动页menu切换
var changeActMenu = function(num){
    api.setFrameGroupIndex ({
        name: 'act_frameGroup',
        index: num,
        scroll: true
    });
};

// 主页展示样式按钮切换
var changeIndexStyleBtn = function(style){
    style = style || '';
    api.execScript({
        name: 'root',
        script: 'changeBtn("'+style+'")'
    });
};

// 主页调用切换样式
var showStyle = function(name,style){
    changeIndexStyleBtn(style);
    api.execScript({
        frameName: name,
        script: 'changeStyle("'+style+'")'
    });
};


//某个影片的详情页
var goDetail = function(json){
    var options = json || {type: '-1'};
    api.openWin({
        name: 'movie_detail',
        url: '../details/movie_detail.html',
        bounces: false,
        rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        },
        delay: 300
    });
    // api.alert({msg:'未完成'});
};
//某个影院的详情页
var goCinemaDetail = function(json){
    var options = json || {type: '-1'};
    api.openWin({
        name: 'cinema_detail',
        url: '../details/cinema_detail.html',
        bounces: false,
        rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        },
        delay: 300
    });
    // api.alert({msg:'未完成'});

};

//某个活动的详情页
var goActDetail = function(json){
    var options = json || {type: '-1'};
    api.openWin({
        name: 'act_detail',
        url: '../details/act_detail.html',
        bounces: false,
        rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        },
        delay: 300
    });
    // api.alert({msg:'未完成'});

};

// 打开index页的百度地图
var openIndexMap = function(options){
    // api.alert({msg:'1'});
    api.execScript({
        name: 'root',
        script: 'openBaiduMap();'
    });
};
// 关闭index页的百度地图
var closeIndexMap = function(){
    api.execScript({
        name: 'root',
        script: 'closeBaiduMap();'
    });
};
// 在index的百度地图中按条件搜索 
var searchIndexMap = function(options){
    api.execScript({
        name: 'root',
        script: 'searchInMap();'
    });
};