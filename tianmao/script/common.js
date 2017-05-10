// 主页面切换frame
    var changeFrameInRoot = function(index){
        api.execScript({
            name: 'root',
            script: 'changeIndexFrame('+index+')'
        });
    };
// 主页面切换frame end


// 用于链接到淘宝链接
    var toDetail = function(obj){
        var url = $api.attr(obj,'data-url');
        var title = $api.attr(obj,'data-title');

        api.execScript({
            name: 'root',
            script: 'indexToDetail("'+title+'","'+url+'")'
        });
    };
// 
// 打开分类列表
    var openClassify = function(){
        api.execScript({
            name: 'root',
            script: 'indexOpenClassify()'
        });
    };
// 
// 语音识别
    var openSpeechRec = function(){
        api.execScript({
            name: 'root',
            script: 'indexOpenSpeechRec()'
        });
    };
// 
// 二维码
    var openScanner = function(){
        api.execScript({
            name: 'root',
            script: 'indexOpenScanner()'
        });
    };
// 
// 通用header的window
    var openCommon = function(name,title){

        api.execScript({
            name: 'root',
            script: 'indexOpenCommon("'+name+'","'+title+'")'
        });
    }
// 
// 打开分享浮动窗口
    var openShareframe = function(){

        api.execScript({
            name: 'root',
            script: 'indexOpenShareframe()'
        });
    }
// 
// 请先登录提示
    var showToast = function(){
        api.toast({
            msg: '请先登录',
            duration: 2000,
            location: 'middle'
        });
    };

// 
// // fun进入topic详细页
//     var funToTopic = function(){
//         // arguments
//         api.openFrame({
//             name: 'shareframe',
//             url: '../detailframes/shareframe.html',
//             bounces: false,
//             rect: {
//                 x: 0,
//                 y: 0,
//                 w: 'auto',
//                 h: 'auto'
//             }
//         });
//     };
// // 