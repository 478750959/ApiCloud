function navigationBarOpen() {
    var navigationBarCB = function (ret, err) {
        if (!ret) {
            Y.alert({title: "出错了", msg: err["msg"]});
            return;
        }
        var module = '';
        /*switch (ret.index) {

        }*/
        var fid = types[ret.index]['fid'];
        ueppscript('root', 'forum_listct', 'go2ForumLists("' + fid + '");');
    };
    var itemAlpha = 1;
    var itemBg = '#F7F7F7';
    var types = [{title:"全部", fid: 76}, {title:"旅行", fid: 44}, {title:"运动", fid: 47}, {title:"美食", fid: 46}, {title:"电影", fid: 43},
        {title:"游戏", fid: 75},{title:"音乐", fid: 45},{title:"艺术", fid: 41}, {title:"理财", fid: 74}, {title:"教育", fid: 42}];
    var items = [];
    for(var key in types){
        var value = types[key];
        items[key] = {
            title: value.title,
            bg: itemBg,
            alpha: itemAlpha,
            bgSelected: '#E7E7E7'
        }
    }
    var params = {
        //y: 42,
        h: 42,
        style: "left_to_right",
        items: items,
        itemSize:{
            w: int(api.frameWidth / 5)
        },
        selectedIndex: 0,
        font: {
            size: 16,
            sizeSelected: 16,
            color: "#666",
            colorSelected: "#B47"
        },
        bg: itemBg,
        alpha: itemAlpha,
        fixed: true,
        fixedOn: 'forum_listct',
        callback: navigationBarCB
    };
    Y.navigationBarOpen(params);
    //console.log(api.frameWidth); //360
}

function go2ForumLists(module){//参数支持module名称和fid
    var fid, title;
    if(isNaN(module)){//不是数字的字符串，表明为module name
        fid = forums[module].fid;
    }else{//fid
        fid = module;
        module = get_module(fid);
    }
    //title = forums[module].long_name;
    //setstorage('params', '{"fid":"'+fid+'", "title":"'+title+'"}');
    //openwin('forum_listct', 'forum_listct.html', '10');
    ueppscript('root', 'forum_listct', "updatelist(" + fid + ")");
}

