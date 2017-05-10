//previous page id, current page id
var prevPid = '', curPid = '';
//save opened frame name
var frameArr = [];

//frame whether open
function isOpened(frmName){
    var i = 0, len = frameArr.length;
    var mark = false;
    for(i; i<len; i++){
        if(frameArr[i] === frmName){
            mark = true;
            return mark;
        }
    }
    return mark;
}

//toggle header
function showHeader(type){
    if(!type){return;}
    var header = $api.dom('#header .active');
    $api.removeCls(header,'active');
    var thisHeader = $api.dom('#header .'+type);
    $api.addCls(thisHeader,'active');
}
//open tab
function openTab(type){
    localStorage.removeItem('currPageSearchFlag');
    localStorage.removeItem('currPageSearchType');
    localStorage.removeItem('currPageSearchCase');
    showHeader(type);
    var width = api.winWidth;
    var nav = $api.byId('nav');
    var navPos = $api.offset(nav);
    var header = $api.byId('header');
    var headerPos = $api.offset(header);
    var height = api.winHeight - navPos.h - headerPos.h;
    localStorage.mainHeaderPos=headerPos.h;
    localStorage.mainHeight=height;
    type = type || 'main';

    var actTab = $api.dom('#nav .active');
    $api.removeCls(actTab,'active');
    var thisTab = $api.dom('#nav .'+ type);
    thisTab = thisTab.parentNode;
    $api.addCls(thisTab,'active');

    //record page id
    prevPid = curPid;
    curPid = type;
    var userName=localStorage.userName;
    if(prevPid !== curPid){

        // alert(type+':'+isOpened(type));
    
        if(isOpened(type)){
            api.setFrameAttr({
                name: type,
                hidden: false
            });
            // api.bringFrameToFront({
            //     from: type
            // });
        }else{
            api.openFrame({
                name: type,
                url: './html/'+ type +'.html',
                bounces: true,
                opaque: true,
                vScrollBarEnabled: false,
                rect: {
                    x: 0,
                    y: headerPos.h,
                    w: width,
                    h: height
                }
            });
        }
        // api.animation({
        //     name: type,
        //     duration: 400,
        //     alpha: 0.6
        // });

        if(prevPid){
            api.setFrameAttr({
                name: prevPid,
                hidden: true
            });
            
            // api.sendFrameToBack({
            //     from: prevPid
            // });
        }

        if(!isOpened(type)){
            //save frame name
            frameArr.push(type);
        }
        
    }
    
}



//search activity
var searchActOpened = false;

function closeFramGroup(){
    api.closeFrameGroup({
        name: 'searchAct'
    });

    var actLi = $api.dom('#header .activity li.active');
    $api.removeCls(actLi,'active');
    searchActOpened = false;
}
function searchAct(el,type){
    if(!el || !type){return;}

    var header = $api.byId('header');
    var pos = $api.offset(header);

    var index = 0;  //frame group index
    if(type === "type"){
        index = 1;
    }

    if(!searchActOpened){
        api.openFrameGroup ({
            name: 'searchAct',
            scrollEnabled: false,
            rect:{x: 0, y: pos.h, w: 'auto', h: 'auto'},
            index: index,
            frames:[{
                name: 'searchActBy-city',
                url: 'html/searchActBy-city.html',
                bounces: false,
                opaque: false,
                bgColor: 'rgba(51,51,51,0.6)',
                vScrollBarEnabled: false
            },{
                name: 'searchActBy-type',
                url: 'html/searchActBy-type.html',
                bounces: false,
                opaque: false,
                bgColor: 'rgba(51,51,51,0.6)',
                vScrollBarEnabled:false
            }]
        }, function(ret, err){
            
        });

        searchActOpened = true;
    }else{
        api.setFrameGroupIndex ({
            name: 'searchAct',
            index: index
            // ,scroll: true
        });
        api.setFrameGroupAttr({
            name: 'searchAct',
            hidden: false
        });
    }

    //toggle active style
    var curLi = el.parentNode;
    //close frame group
    if($api.hasCls(curLi,'active')){
        // api.closeFrameGroup({
        //     name: 'searchAct'
        // });
        api.setFrameGroupAttr({
            name: 'searchAct',
            hidden: true
        });
        // searchActOpened = false;
    }
    $api.toggleCls(curLi,'active');

    var lis = $api.domAll('#header .activity li');
    var i = 0, len = lis.length;

    for(i; i<len; i++){
        var thisLi = lis[i];
        if(thisLi === curLi){
            continue;
        }else{
            if($api.hasCls(thisLi,'active')){
                $api.removeCls(thisLi,'active');
            }
        }
    }

}

function setting(){
    api.openWin({
        name: 'setting',
        url: 'html/setting.html',
        opaque: true,
        vScrollBarEnabled:false
    });
}

apiready = function(){
    var header = $api.byId('header');
    $api.fixIos7Bar(header);

    //status bar style
    api.setStatusBarStyle({
        style: 'light'
    });

//  openTab('main');

	
};