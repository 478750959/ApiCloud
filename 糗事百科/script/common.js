// 记录窗口，子窗口状态的函数
    var addWin = function(name){
        var obj = $api.getStorage('win');
        obj[name] = '1';
        $api.setStorage('win',obj);
    };
    var removeWin = function(name){
        var obj = $api.getStorage('win');
        obj[name] = '';
        $api.setStorage('win',obj);
        api.closeWin({
            name: name
        });
    };
    var addFrame = function(name){
        var obj = $api.getStorage('frame');
        obj[name] = '1';
        $api.setStorage('frame',obj);
    };
    var removeFrame = function(name){
        var obj = $api.getStorage('frame');
        obj[name] = '';
        $api.setStorage('frame',obj);
        api.closeFrame({
            name: name
        });
    }
// 记录窗口，子窗口状态的函数 end
// 全窗口执行changeTheme
    var allChangeTheme = function(index){
        var windows = $api.getStorage('win');
        var frames = $api.getStorage('frame');
        // 
        for (var i in windows) {

            if (windows[i] == 1) {
                api.execScript({
                    name: i,
                    script: 'changeTheme('+index+');'
                });
            } else{} 
        }
        for (var j in frames) {
            if (frames[j] == 1) {
                api.execScript({
                    frameName: j,
                    script:'changeTheme('+index+');'
                });
            } else{} 
        }

    };
// 全窗口执行changeTheme end
// indexToQiushiDetail(this);" data-id="90000099"
// 进入糗事详情
    var indexToQiushiDetail = function(obj){
        var id = $api.attr(obj,'data-id');
        var str = 'toQiushiDetail('+id+')';
        api.execScript({
            name: 'root',
            script: str
        });
    };
// 进入糗事详情 end
// 进入糗友资料
    var indexToProfile = function(obj,index){
        var id = $api.attr(obj,'data-id');
        var type = $api.attr(obj,'data-type') || 'ta';
        var str;
        if (index) {
            str = "toProfile("+id+",'"+type+"','"+index+"')";
        } else{
            str = "toProfile("+id+",'"+type+"')";
        }
        api.execScript({
            name: 'root',
            script: str
        });
    };
// 进入糗友资料 end
// 进入糗事选项
    var indexToShareOption = function(obj){
        var id = $api.attr(obj,'data-id');
        var str = "toShareOption("+id+")";
        api.execScript({
            name: 'root',
            script: str
        });
    };
    var myQiushiToShareOption = function(obj){
        var id = $api.attr(obj,'data-id');
        var str = "toShareOption("+id+")";
        api.execScript({
            name: 'my-qiushi',
            script: str
        });
    };
    var qiushiDetailToShareOption = function(obj){
        var id = $api.attr(obj,'data-id');
        var str = "toShareOption("+id+")";
        api.execScript({
            name: 'my-qiushi',
            script: str
        });
    };
// 进入糗事选项 end
myQiushiToShareOption