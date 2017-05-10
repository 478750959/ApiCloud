Y.S.appcan = function(s) {
    /**
     *初始化
     */
    Y.CBS = {};

    s.uexWindow = {
        "open" : function(inWndName,inDataType,inData,inAniID,inWidth,inHeight,inFlag,animDuration){
            var animation;
            if(inAniID == '5')
                animation = {//appcan 5:淡入淡出，对应于apicloud为无动画
                    duration: animDuration,
                    type    : 'fade'
                }
            else
                animation = {
                    duration: animDuration
                }
            var bounces = false,
                delay = 100,
                params = {
                    name: inWndName,
                    wndUrl: inData,
                    bounces: bounces,
                    delay: delay,
                    animation: animation
                };
            Y.openWin(params);
        },
        "close" : function(inAnimiId, wndName){//空:无动画，-1：按原路返回
            var subType = '';
            if(parseInt(inAnimiId) == -1) subType = 'from_left';
            var params = {
                name: wndName,
                animation: {
                    type: 'push',
                    subType: subType,
                    duration: 300
                }
            }
            Y.closeWin(params);
        },
        "openPopover" : function(inPopName,inDataType,inUrl,inData,inX,inY,inWidth,inHeight,inFontSize,inFlag,bounces){//'nav',"0",'pop_nav.html',"",x,y,w,h,em,"0"
            var params = {
                frameName: inPopName,
                frameUrl: inUrl,
                rect:{
                    x:inX,
                    y:inY,
                    w:inWidth,
                    h:inHeight
                },
            };
            params.bounces = (bounces && bounces == 'false' ? false : true);
            Y.openFrame(params);
        },
        "closePopover" : function(inPopName){//不可为空
            var params = {
                frameName:inPopName,
            };
            Y.closeFrame(params);
        },
        "evaluatePopoverScript" : function(inWndName,inPopName,inScript){
            var params = {
                winName: inWndName,
                frameName: inPopName,
                script: inScript
            }
            Y.execScript(params);
        },
        "evaluateScript" : function(inWindowName,inType,inScript){//(wn,'0',scr)
            var params = {
                winName: inWindowName,
                frameName: '',
                script: inScript
            }
            Y.execScript(params);
        },
        "toast" : function(inType,inLocation,inMsg,inDuration){//'0','5',json.message,2000
            var params, location;
            if(inType == '1'){//有进度条
                if(inDuration){//目前appcan中当inType==1时，inDruation都没有值，此处重新定义，文件上传这种业务要保持进度一直显示
                    params = {
                        title: inMsg,
                    }
                    Y.S.progressFlag = 1;//记录是否有显示模态的progress
                    Y.showProgress(params);
                }else
                    Y.toastProgress(inMsg);
            } else if(inType == '0'){
                switch(parseInt(inLocation)){
                    case 2:
                        location = "top";
                        break;
                    case 5:
                        location = "middle";
                        break;
                    case 8:
                        location = "bottom";
                        break;
                }
                params = {
                    msg: inMsg,
                    duration: inDuration,
                    location: location
                }
                Y.toast(params);
            }
        },
        "closeToast" : function(){//在appcan中如果要closetoast，一定是有进度的，在apicloud中对应的为showprogress
            if(Y.S.progressFlag){
                Y.hideProgress();
                Y.S.progressFlag = null;
            }
            //不是模态的进度条自动关闭，视觉效果更好
        },

        "actionSheet" : function(inTitle,inCancel,inButtonLables){//inTitle 对话框标题, inCancel 显示在取消按钮上的文本。
            Y.CBS.cbActionSheet = function(ret, err){
                window.uexWindow.cbActionSheet('', '', ret.buttonIndex - 1)
            }

            var params = {
                title           : inTitle,
                cancelTitle     : inCancel,
                buttons         : inButtonLables,
                callback        : Y.CBS.cbActionSheet
            }
            Y.actionSheet(params);
        },
        "prompt" : function(inTitle,inMessage,inDefaultValue,inButtonLables){//'请输入页码：','请输入页码：', '', keycap= ['确定','取消']
            Y.CBS.cbPrompt = function(ret, err){
                var json = {
                    "num": '' + (ret.buttonIndex - 1),
                    "value": ret.text
                }
                jsonstr = JSON.stringify(json);
                window.uexWindow.cbPrompt('', '', jsonstr)//执行cbPrompt
            }
            var params = {
                title: inTitle,
                msg: inMessage,
                buttons: inButtonLables,
                callback: Y.CBS.cbPrompt
            }
            Y.prompt(params);

        },
        "alert" : function(inTitle,inMessage,inButtonLable){
            var params = {
                title: inTitle,
                msg: inMessage,
                buttons: inButtonLable
            }
            Y.alert(params);
        },
        "confirm" : function(inTitle,inMessage,inButtonLables){
            var params = {
                title: inTitle,
                msg: inMessage,
                buttons: inButtonLables,
                callback: window.uexWindow.cbConfirm
            }
            Y.confirm(params);
        },
        "beginAnimition" : function(){
            Y.S.animParam = {};//建立动画的全局参数变量
        },
        "setAnimitionDelay" : function(inDelay){
            Y.S.animParam.delay = inDelay;
        },
        "setAnimitionDuration" : function(inDuration){
            Y.S.animParam.duration = inDuration;
        },
        "setAnimitionAutoReverse" : function(inReverse){
            Y.S.animParam.autoreverse = inReverse;
        },
        "setAnimitionRepeatCount" : function(inCount){
            Y.S.animParam.repeatCount = inCount;
        },
        "makeTranslation" : function(inToX,inToY,inToZ){//dx,dy,'0'
            Y.S.animParam.translation = {
                x: inToX,
                y: inToY,
                z: inToZ
            };
        },
        "commitAnimition" : function(){
            Y.S.animParam.callback = window.uexWindow.onAnimationFinish;
            Y.animation(Y.S.animParam);
            //delete Y.S.animParam;//因为还要回调，不能删除
        },
        "setBounce" : function(opId){//指定当前浮动窗口是否可以有弹动效果1,支持；0不支持
            //初始化参数存储
            Y.S.hbParams = Y.S.bbParams = {};
            Y.S.bounces = parseInt(opId);
        },
        /**注册接收弹动事件
         * inType 为0，则为顶端弹动，为1,则底部弹动。inStatus 0，则为不接收uexWindow.onBounceStateChange方法回调，为1,则接收。
         */
        "notifyBounceEvent" : function(inType,inStatus){
            if(!Y.S.hbParams) Y.S.hbParams = {};
            if(!Y.S.bbParams) Y.S.bbParams = {};
            var notify = parseInt(inStatus);
            if(inType == '0'){//顶部
                Y.S.hbParams.onBounceStateChange = notify;
            }else if(inType == '1'){
                Y.S.bbParams.onBounceStateChange = notify;
            }
        },
        "setBounceParams" : function(inType,inJson){//将参数按照Y规范保存
            if(!Y.S.hbParams) Y.S.hbParams = {};
            if(!Y.S.bbParams) Y.S.bbParams = {};
            var json = eval('(' + inJson +')');
            if(!json) return;
            if(inType == '0'){
                Y.S.hbParams.loadingImgae= json.imagePath;//只支持res://格式
                Y.S.hbParams.textColor= json.textColor;
                Y.S.hbParams.textDown= json.pullToReloadText;
                Y.S.hbParams.textUp= json.releaseToReloadText;
            }else if(inType == '1'){//上拉不可定制
                //Y.S.bbParams  = {bounces : true};
            }
        },
        /**
         * inType 其值为0表示支持网页顶端弹动，为1则支持网页底部弹动。
         * inColor 弹动显示部位的颜色值。inColor 的值为 “#”3位，或者“#”6位，以及,rgba()格式。
         * inFlag flag为1 ，则是显示内容，为0,则不显示。
         */
        "showBounceView" : function(inType,inColor,inFlag){//画出弹动的页面内容
            if(!Y.S.hbParams) Y.S.hbParams = {};
            if(!Y.S.bbParams) Y.S.bbParams = {};
            if(!parseInt(inFlag) || !parseInt(Y.S.bounces)){
                //delete Y.S.hbParams;
                return;
            }
            if(!parseInt(inType)){
                var callback = Y.S.hbParams.onBounceStateChange ? window.uexWindow.onBounceStateChange : '';
                var params = {
                    visible : parseInt(inFlag),
                    loadingImgae : Y.S.hbParams.loadingImgae,//只支持res://格式
                    bgColor : Y.S.hbParams.bgColor || inColor,
                    textColor :Y.S.hbParams.textColor || '#838695',//优先使用inColor,t-gra
                    textDown : Y.S.hbParams.textDown,
                    textUp : Y.S.hbParams.textUp,
                    //type 对应的部位值，int型数据，0为窗口顶端，1为窗口底部。state 当type=0时，值0为向下拉，1为超越边界，2为向上返回到最初状态；当type=1时，0为向上拉，1为超越边界，2为向下返回到最初状态。
                    callback: callback //type=0,status=2 appan对应的程序中只处理status=2的情况
                }
                Y.setRefreshHeaderInfo(params);
            }else if(inType == '1' && parseInt(inFlag)){
                var callback = Y.S.bbParams.onBounceStateChange ? window.uexWindow.onBounceStateChange : '';
                var params = {callback: callback};
                Y.listenScrollToBottom(params);
            }
            //delete Y.S.bounces;
            delete Y.S.hbParams;
            delete Y.S.bbParams
        },
        "resetBounceView" : function(){ },//apicloud自动处理
        "setPopoverFrame" : function(inPopName,inX,inY,inWidth,inHeight){//更改指定name的Popover的位置和大小
            var hidden = false;
            if(inWidth == 0 || inHeight ==0){
                hidden = true;
            }
            var params = {
                name: inPopName,
                rect:{
                    x: inX,
                    y: inY,
                    w: inWidth,
                    h: inHeight
                },
                hidden: hidden
            }
            Y.setFrameAttr(params);
        },
        /**
         *注册按键事件
         */
        "setReportKey" : function(inKeyCode,inEnable){
            var params, name;
            switch(parseInt(inKeyCode)){//按照Y的规范
                case 0:
                    name = 'keyback';
                    break;
                case 1:
                    name = 'keymenu';
                    break;
            }
            params = {
                name: name,
                callback : window.uexWindow.onKeyPressed,
                enable: parseInt(inEnable)
            }
            Y.eventListener(params);
        }
    };
    s.uexImageBrowser = {
        "pick" : function(){//打开系统图片库浏览所有本地图片列表,供选取并返回路径。
            var params = {
                sourceType: 'album',//相册
                targetWidth: 500,//高度压缩为1000
                targetHeight: 500,
                callback: window.uexImageBrowser.cbPick ? window.uexImageBrowser.cbPick : ''
            }
            Y.imagesGet(params);
        },
        /**
         *imageUrlSet 图片url的数组，支持的文件路径协议:wgt://… ,file://…,http://…
         *activeIndex  当不用九宫格方式显示时，当前要显示的图片在集合中的索引，该索引从0开始，若索引值小于或大于imageUrlSet中的元素个数，否则默认显示第一张图片
         *showFlag 图片显示的方式，是否用九宫格方式显示。“0”或””：表示九宫格方式，“1”：表示直接显示
         */
        "open" : function(imageUrlSet,activeIndex,showFlag){
            var params = {
                imageUrls: imageUrlSet,
                showList: 1 - parseInt(showFlag),//appcan和apicloud是相反的
                activeIndex: activeIndex
            }
            Y.imagesOpen(params);
        },
    };
    s.uexCamera = {
        "open" : function(){
            var params = {
                sourceType: 'camera',
                targetWidth: 500,//高度压缩为500
                targetHeight: 500,
                saveToPhotoAlbum: true,
                callback: window.uexCamera.cbOpen
            }
            Y.imagesGet(params);
        },
    };
    s.uexControl = {
        "openInputDialog" : function(inputType,inputHint,btnText){//'0','','发送'
            var params = {
                sendImg     : '',
                callback    : function(ret){window.uexControl.cbInputCompleted('', 0, ret.msg);}
            }
            Y.inputOpen(params);
        }
    };
    s.uexLog = {
        "sendLog" : function(inLog){
            var params={
                txt: inLog
            }
        }
    };
    s.uexWidgetOne = {
        get platformVersion(){
            return Y.systemVersion();
        },
        get platformName(){
            return Y.systemType();
        },
        "getCurrentWidgetInfo" : function(){//获取appname，appid在更新，推广，推送中需要用到，appid在apicloud中获取不到，暂不用

        },
        "getPlatform" : function(){
            var data = Y.systemType();
            if(data == 'iphone') return 0;
            else if(data == 'android') return 1;
        },
        "cleanCache" : function(){
            Y.clearCache();
            window.uexWidgetOne.cbCleanCache(0, 0, 0);//opId,dataType,inData
        },
    };
    s.uexWidget = {
        "checkUpdate" : function(){
            var params = {
                callback: window.uexWidget.cbCheckUpdate
            }
            Y.checkUpdate(params);
        },
        "installApp" : function(inAppPath){
            var params = {
                appUri: inAppPath
            }
            Y.installApp(params);
        },
        /**inAppInfo  启动第三方应用的必须信息，在android上为第三方应用的action(字符串类型,如：android.intent.action.VIEW)；在iphone上为第三方应用在设备上注册的scheme，如：alipay://;。
         *inFilter 过滤条件，即要传递给第三方应用数据的MimeType，如text/html等，为任意类型。此参数在iphone上不起作用。。
         *inDataInfo 传递给第三方应用的数据。比如：调用UC浏览器打开"http://www.sohu.com"。
         */
        "loadApp" : function(inAppInfo,inFilter,inDataInfo){
            var params = {
                iosUrl: inDataInfo,
                appParam: '',
                androidPkg: inAppInfo,
                mimeType: inFilter,
                uri: inDataInfo
            }
            Y.openApp(params);
        },
        "finishWidget" : function(inResultInfo){//自己定义要传给调用widget的参数，appcan中传''
            var widgetId = 'A6960886767610';//来自apicloud config.xml
            var params = {
                id : widgetId,
                retData: {name:'closeWidget'},
                silent: true
            }
            Y.closeWidget(params);
        },
        "setPushInfo" : function(uId,uNickName){//appcan都可为空,apicloud不能为空
            var params = {
                userName: uNickName,
                userId: uId
            }
            Y.pushBind(params);
        },
        /**
         * 指定一个当有Push消息来时通知页面的回调函数，如果应用开启了推送功能，那么当有消息推送进来时，
         * 平台将调用指定的inCallbackFunction函数通知页面，页面可通过uexWidget.getPushInfo接口获取推送进来的内容。
         */
        "setPushNotifyCallback" : function(/*inCallbackFunction*/){//
            Y.CBS.cbsetPushNotifyCallback = function(ret){
                if(ret && ret.data){// ret: {data:[]} ,消息内容，对象数组
                    //var jsonstr = JSON.stringify(ret.data);
                    //Y.S.pushData = jsonstr;//保存供pushGetData使用
                    //inCallbackFunction && eval('(' + inCallbackFunction +'())');//inCallbackFunction是函数
                    window.uexWidget.cbGetPushInfo('', 0, ret.data);
                    //Y.S.pushData = '';
                }else{
                    alert('push setListener:false');
                }
            }

            Y.pushAutoNotify(true);
            /*Y.pushAutoNotify(false, Y.CBS.cbsetPushNotifyCallback);
            var params = {
                name: 'resume',
                enable: true,
                callback : function(){Y.pushAutoNotify(false, Y.CBS.cbsetPushNotifyCallback);}
            }
            Y.eventListener(params);
            params = {
                name: 'pause',
                enable: true,
                callback : function(){Y.pushAutoNotify(true);}
            }
            Y.eventListener(params);*/
        },
        //数据已经保存在Y.S.pushData中,暂时无用
        "getPushInfo" : function(){
            if(Y.S.pushData){
                window.uexWidget.cbGetPushInfo('', 0, Y.S.pushData);
            }
        },

    };
    s.uexXmlHttpMgr = {
        "open" : function(inXmlHttpID,inMethods,inUrl,inTimeOut){
            Y.S.xhrParams = [];
            Y.S.xhrParams[inXmlHttpID] = {
                method : inMethods.toLowerCase(),//get,post
                url    : inUrl,
                timeout: inTimeOut,
                data   : {}
            };
        },
        "setPostData" : function(inXmlHttpID,inDataType,inKey,inValue){//inDataType,0:text,1: binary
            if(inDataType == '0'){//字符
                Y.S.xhrParams[inXmlHttpID]['data']['values'] = Y.S.xhrParams[inXmlHttpID]['data']['values'] || {};
                Y.S.xhrParams[inXmlHttpID]['data']['values'][inKey] = inValue;
            }else if(inDataType == '1'){
                Y.S.xhrParams[inXmlHttpID]['data']['files'] = Y.S.xhrParams[inXmlHttpID]['data']['files'] || {};
                Y.S.xhrParams[inXmlHttpID]['data']['files'][inKey] = inValue;
            }
            //console.log('setPostData'+inValue);
        },
        "send" : function(inXmlHttpID){
            Y.CBS.cbXhrSend = function(ret,err){
                //console.log('ret'+ret);
                if(ret){//ajax的ret就是返回数据，没有status
                    window.uexXmlHttpMgr.onData(inXmlHttpID, 1, ret);//成功标志
                }else{
                    window.uexXmlHttpMgr.onData(inXmlHttpID, -1, err.msg);//appcan中提示网络错误
                }
            }
            var xhrParams = Y.S.xhrParams[inXmlHttpID];
            var params = {
                method  : xhrParams.method ,
                url     : xhrParams.url    ,
                timeout : xhrParams.timeout,
                dataType: 'text',//todo 在html中使用JSON.parse,在服务器端输出的是jsonstr，不依赖于hybird对json的支持
                data    : xhrParams.data   ,
                callback: Y.CBS.cbXhrSend,
            }
            Y.ajax(params);
        },
        "close" : function(inXmlHttpID){//非appcan下忽略

        },
    };
    s.uexUploaderMgr = {
        "createUploader" : function(inOpCode,inTargetAddress){//opid, self.url(inTargetAddress 上传的服务器地址)
            Y.S.uploadParams = [];
            Y.S.uploadParams[inOpCode] = {
                method : 'post',
                url    : inTargetAddress,
                data   : {}
            };
            window.uexUploaderMgr.cbCreateUploader(inOpCode, 0, 0);//appcan中第三个参数data=0代表CreateUploader成功
        },
        /**
         * inOpCode 操作id（整型）.
         * inFilePath 文件路径.
         * inInputName 页面当中input标签的name属性.
         * inCompress  如果上传的是图片，该参数表示按质量压缩的压缩级别，png无效。 0：不压缩。既不压缩尺寸也不压缩质量 1：一级压缩。100％，只压缩图片尺寸，不压缩图片质量 2：二级压缩。75％ 3：三级压缩。50％ 4：四级压缩。25％ 级别越高，压缩后的文件越小
         * inWidthLimit 如果上传的是图片，该参数表示按尺寸压缩的最大宽度。该宽度表示图片压缩的宽度限制，默认是640像素。当图片的宽度超过该宽度就会压缩成该宽度的图片，高度会等比压缩。
         **/
        "uploadFile" : function(inOpCode,inFilePath,inInputName,inCompress,inWidthLimit){
            Y.CBS.cbUploadFile = function(ret, err){
                status = ret ? 1 : 0;//ret是服务器的jsonexit(ret)
                //apicloud协议规定ret.body服务器返回的数据，但实际也只是将服务器的返回作为ret，当前为1|aid，在onstatus中进行处理
                window.uexUploaderMgr.onStatus(inOpCode, '', '', ret, status)//opId,fileSize,percent,serverPath,status(uex.cUpLoading 0, uex.cFinishUpLoad 1, uex.cUpLoadError 2)
            }
            var uploadParams = Y.S.uploadParams[inOpCode];
            var params = {
                method  : uploadParams.method ,
                url     : uploadParams.url    ,
                dataType: 'text',//传文件的返回使用text
                data    : {
                    values: {name: 'yueha'},//必须要有name，但是没有实际作用
                    files: {file: inFilePath}/*'fs://picture/p-6d2f5f24.jpg'也可以*/
                },
                callback: Y.CBS.cbUploadFile,
            }
            Y.ajax(params);
        },
        "closeUploader" : function(inOpCode){
            //do nothing
        }
    };

    s.uexDownloaderMgr = {
        "createDownloader" : function(opId){//opId
            Y.S.dlParams = [];
            Y.S.dlParams[opId] = {
                opId   : opId
            };
            //创建始终成功
            window.uexDownloaderMgr.cbCreateDownloader(opId,2 ,0);//dataType:uex.cInt(值为2), data:成功返回uex.cSuccess(值为0)或失败返回uex.cFailed(值为1)
        },
        "closeDownloader" : function(opId){//opcode
            if (!Y.S.dlParams[opId]) return;
            var params = {
                url: Y.S.dlParams[opId]['url']
            };
            Y.cancelDownload(params);
            delete Y.S.dlParams[opId];
        },
        "download" : function(inOpCode,inDLUrl,inSavePath,inMode){//opCode, s.url, s.dest, '0'
            Y.CBS.cbDownload = function(ret, err){
                if (ret) {
                    window.uexDownloaderMgr.onStatus(inOpCode, ret.fileSize, ret.percent, ret.state, ret.savePath);//appcan : opCode, fileSize, percent, status
                } else{
                    window.uexDownloaderMgr.onStatus(inOpCode, '', '', 2);//appcan和apicloud一致。下载状态，0表示正在下载，1表示下载完成，2表示下载出错。
                };
            }
            Y.S.dlParams[inOpCode]['url'] = inDLUrl;//保存url，canceldownload时需要传入
            var params = {
                url         : inDLUrl,
                savePath    : inSavePath,
                report      : false,
                cache       : true,
                allowResume : parseInt(inMode),//1支持断点续传,0不支持
                callback    : Y.CBS.cbDownload
            };
            Y.download(params);
        },
        "clearTask" : function(inDLUrl,inClearMode){// zy_dl_session[opCode][rul]
            //do nothing
        },
    };
    s.uexFileMgr = {
        /**
         * 在不同的文件协议间转换，所有的文件操作的路径都调用此函数处理 //todo 放在Y包中处理，s和d中只要配置好文件协议即可，具体处理不管
         */
        "_replaceFsProtocol": function(path){
            return Y.fsProtocol({"path": path, "protocol" : 'wgt://'});//将path中的wgt://替换成fs://
        },
        "getFileRealPath" : function(inPath){//根据相对路径获取绝对路径 todo 目前只针对根目录
            callback = window.uexFileMgr.cbGetFileRealPath;
            fsDir = s.uexFileMgr._replaceFsProtocol(inPath);
            callback(0, 0, fsDir);
            /*var params = {
                callback: window.uexFileMgr.cbGetFileRealPath
            };
            Y.fsRoot(params);*/
        },
        /**回调参数
         * dataType  返回数据的数据类型为uex.cInt(值为2)
         * data 返回的int型的数据,uex.cTrue (值为1)表示存在，uex.cFalse(值为0)表示不存在
         */
        //todo 能否判断sdcard目录
        "isFileExistByPath" : function(inOpCode,inPath){//inOpCode必须有
            var opId = inOpCode;
            if(arguments.length == 1){//保持兼容,两种情况都有在使用
                inPath = inOpCode;
                opId = 0;
            }
            Y.CBS.cbFileExistByPath = function(ret, err){
                if(ret.exist){
                    window.uexFileMgr.cbIsFileExistByPath(opId, 2, 1)
                }else{
                    window.uexFileMgr.cbIsFileExistByPath(opId, 2, 0)
                }
            }
            var params = {
                path        : s.uexFileMgr._replaceFsProtocol(inPath),
                callback    :  Y.CBS.cbFileExistByPath,
            };
            Y.fsExist(params);
        },
        /**回调参数
         * dataType  返回数据的数据类型为uex.cInt(值为2)
         * data 返回的int型的数据，成功为0，或失败为1
         */
        "deleteFileByPath" : function(inPath){//
            Y.CBS.cbDeleteFile = function(ret, err){
                if (ret.status) {
                    window.uexFileMgr.cbdeleteFileByPath && window.uexFileMgr.cbdeleteFileByPath(0, 2, 1);//1成功，0失败
                }else {
                    window.uexFileMgr.cbdeleteFileByPath && window.uexFileMgr.cbdeleteFileByPath(0, 2, 0);
                };
            }
            var params = {
                path        : s.uexFileMgr._replaceFsProtocol(inPath),
                callback    : Y.CBS.cbDeleteFile,
            };
            Y.fsRemove(params);
        },
        /**
         * opCode 操作id
         * inPath 创建的目录路径，wgt://协议打头。表示定位到当前应用的沙盒目录
         * inMode 打开方式, 1只读方式打开,2可写方式打开,4新建方式打开,8电子书方式打开
         */
        "openFile" : function(opCode,inPath,inMode){
            Y.CBS.cbOpenFile = function(ret){
                Y.S.fsHandle[opCode] = ret.fd;
                window.uexFileMgr.cbOpenFile(opCode, 2, 0);//0成功，1失败
            }
            var flags = '';
            if(parseInt(inMode) == 1) flags = 'read';
            else if(parseInt(inMode) == 2) flags = 'read_write ';
            else{};
            var params = {
                path        : s.uexFileMgr._replaceFsProtocol(inPath),
                flags       : flags,
                callback    : Y.CBS.cbOpenFile,
            }
            Y.fsOpen(params);
        },
        "readFile" : function(opCode,inLen){// inLen 读取文件的大小，-1表示全部读取
            if(-1 == inLen) inLen = 0;
            Y.CBS.cbReadFile = function(ret, err){
                window.uexFileMgr.cbReadFile(opCode, 0, ret.data);//  0表明为文本
            }
            var params = {
                fd    : Y.S.fsHandle[opCode],
                length  : inLen,
                callback: Y.CBS.cbReadFile
            }
            Y.fsRead(params);
        },
        "closeFile" : function(opCode){// inOpId
            var params = {
                fd : Y.S.fsHandle[opCode]
            }
            Y.fsClose(params);
        }
    };
    s.uexLocation = {
        "openLocation" : function(){

        },
        "onChange" : function(){

        },
        "closeLocation" : function(){

        }
    }
    s.uexSMS = {
        "open" : function(){
            contactSms
        },
    }
    s.uexContact = {//暂时仅支持查询所有联系人
        "searchItem" : function(nameKey){
            Y.CBS.cbSearchItem = function(ret, err){
                if(ret.status){
                    window.uexContact.cbSearchItem(0, 1, ret.contacts);
                }else window.uexContact.cbSearchItem(0, 0, []);
            }
            var params = {
                ids: [],
                callback: Y.CBS.cbSearchItem
            };
            Y.contactQuery(params);
        }
    }
};

/**
 ************************目标apicloud***********************
 */
Y.D.apicloud = function(d){
    d.openWin = function(p){
        if(!p.name || p.name=='') p.name = p.wndUrl;
        var params = {
            name: p.name,
            url: p.wndUrl,
            bounces: p.bounces,
            delay: p.delay,
            //animation: {duration: p.animation.duration}//目前的动画效果导致在iphone下没有滑动
        }
        api.openWin(params);
    }
    d.closeWin = function(p){//name, type, subType
        var params = p;
        api.closeWin(params);
    }
    d.closeToWin = function(p){//name, type, subType
        var params = p;
        api.closeToWin(params);
    }
    d.openFrame = function(p){//frameName,url,rect:{x,d,w,h},bounces
        var params = {
            name: p.frameName,
            url: p.frameUrl,
            rect:{
                x:p.rect.x || 0,
                y:p.rect.y || 0,
                w:p.rect.w,
                h:p.rect.h
            },
            opaque: p.opaque,
            hScrollBarEnabled: p.hScrollBarEnabled,
            bounces: p.bounces
        };
        api.openFrame(params);
    }
    d.closeFrame = function(p){
        var params = {
            name: p.frameName,
        };
        api.closeFrame(params);
    }
    d.openFrameGroup = function(p){
        var params = p;
        api.openFrameGroup(params,function(ret,err){
            p.callback && p.callback(ret, err);
        });
    }
    d.setFrameGroupIndex = function(p){
        var params = p;
        api.setFrameGroupIndex(params);
    };
    d.execScript = function(p){//winName,frameName,func,param
        var params = {
            name: p.winName || api.winName,
            frameName: p.frameName,
            script: p.script
        };
        api.execScript(params);
    };
    d.showProgress = function(p){
        var params = p;
        api.showProgress(params);
    };
    d.hideProgress = function(p){
        api.hideProgress();
    };
    d.toast = function(p){
        var params = {
            msg: p.msg,
            duration:p.duration,
            location: p.location
        }
        api.toast(params);
    };
    d.actionSheet = function(p){
        var params = p;
        api.actionSheet(params, function(ret,err){
            p.callback && p.callback(ret, err);
        });
    }
    d.prompt = function(p){
        var params = {
            title: p.title,
            msg: p.msg,
            text: p.text,
            buttons: p.buttons,
        }
        api.prompt(params,
            function(ret,err){
                p.callback && p.callback(ret,err);
            }
        );
    };
    d.alert = function(p){
        var params = {
            title: p.title,
            msg: p.msg,
            buttons: p.buttons,
        }
        api.alert(params,
            function(ret,err){
                if(!ret || !ret.status) {
                    api.alert({msg: err.message});
                    return;
                }
                p.callback && p.callback(ret, err)//callback以一个对象作为参数
            });
    };
    d.confirm = function(p){
        var params = {
            title: p.title,
            msg: p.msg,
            buttons: p.buttons,
        }
        api.confirm(params,
            function(ret,err){
                if(!ret) {
                    api.alert({msg: '发生错误！'});
                    return;
                }
                var num = '' + (ret.buttonIndex - 1);//apicloud = appcan+1
                p.callback && p.callback('', '', num)//执行cbPrompt
            }
        );
    };
    d.animation = function(p){//还有更多的参数可以添加
        var params = {
            delay: p.delay,
            duration: p.duration,
            autoreverse: p.autoreverse,
            repeatCount: p.repeatCount,
            translation: p.translation
        }
        api.animation(params, p.callback);
    };
    d.setRefreshHeaderInfo = function(p){
        var params = p;
        api.setRefreshHeaderInfo(params,function(ret, err){//ret 事件发生时传递的参数，可能为空
            p.callback && p.callback(0, 2)////type=0 顶端,status=2有刷新动作
            api.refreshHeaderLoadDone();
        });
    };
    d.listenScrollToBottom = function(p){
        api.addEventListener({
            name: 'scrolltobottom'
        }, function(ret, err){//ret 事件发生时传递的参数，可能为空
            p.callback && p.callback(1, 2)////type=0 底端,status=2有刷新动作
        });
    }
    d.setFrameAttr = function(p){
        var params = p;
        api.setFrameAttr(params);
    };
    d.imagesOpen = function(p){
        d.api_imageBrowser = d.api_imageBrowser || api.require('imageBrowser');
        d.api_imageBrowser.openImages(p);
    };
    d.imagesGet = function(p){
        var params = p;
        api.getPicture(params,
        function(ret, err){
            if(!ret){
                api.alert({msg: '无法获取图像，请检查获取相册和拍照的权限是否开启'});
                return;
            }
            var opId = '';//appcan中不起作用
            var dataType = 0;//返回数据的数据类型为uex.cText(值为0)。
            var data = ret.data;//返回选择的图片文件在SDCARD上的路径(绝对路径)//todo
            p.callback && p.callback(opId, dataType, data);
        });
    };

    d.inputOpen = function(p){
        d.api_inputField = d.api_inputField || api.require('inputField');
        d.api_inputField.open(p, function(ret,err) {
            p.callback && p.callback(ret);
        });
        if(p.keyboard){//不能放在open的回调之内
            setTimeout(function(){d.inputKeyboard({show: 1});}, 100);//如果在open之后立即弹出，需要有时间延迟
        }
    };
    d.inputKeyboard = function(p){
        d.api_inputField = d.api_inputField || api.require('inputField');
        if(p.show){
            d.api_inputField.becomeFirstResponder();//显示键盘
        }else{
            d.api_inputField.resignFirstResponder();//隐藏键盘
        }

    };
    d.systemVersion = function(){
        return api.systemVersion;
    };
    d.appVersion = function(){
        return api.appVersion;
    };
    d.systemType = function(){
        return api.systemType;
    };
    d.clearCache = function(){
        api.clearCache();
    };
    d.checkUpdate = function(p){
        d.api_mam = d.api_mam || api.require('mam');
        //api.showProgress({text:'检查中...'});在外面控制
        d.api_mam.checkUpdate(function(ret,err){
            //api.hideProgress();
            if (!ret || !ret.status) {
                if(err && err.msg) api.alert({msg: err.msg});
                return;
            }
            //if(!ret.result.update) return;
            var data = {
                result : !ret.result.update,//appcan中result==0表示有更新
                url : ret.result.source,
                name : ''
            }
            var str = JSON.stringify(data);
            p.callback && p.callback(0, 0, str);//返回的类型为1：json,对index.html处的应用做了修改，接受string
        })
    }

    d.installApp = function(p){
        var params = {
            appUri: p.appUri
        }
        api.installApp(params);
    }
    d.openApp = function(p){
        var params = p
        api.openApp(params);
    }
    d.closeWidget = function(p){
        var params = p;
        api.closeWidget(params);
    }
    d.pushBind = function(p){
        d.api_push = d.api_push || api.require('push');
        var params = {
            userName: p.userName,
            userId: p.userId
        }
        d.api_push.bind(params, function(ret,err){
            if(ret && ret.status){

            }else{
                api.alert({msg:err.msg});
            }
        });
    }

    d.pushJoinGroup = function(p){
        var params = p;
        d.api_push = d.api_push || api.require('push');
        d.api_push.joinGroup(params,function(ret,err){
            if(ret && ret.status){

            }else{
                api.alert({msg:err.msg});
            }
        });
    }
    d.pushLeaveGroup = function(p){
        var params = p;
        d.api_push = d.api_push || api.require('push');
        d.api_push.leaveGroup(params,function(ret,err){//leavelGroup, 官方笔误
            if(ret && ret.status){

            }else{
                api.alert({msg:err.msg});
            }
        });
    };
    d.pushSetPreference = function(p){
        var params = p;
        d.api_push = d.api_push || api.require('push');
        d.api_push.setPreference(params);
        //alert('pushSetPreference:' + params.notify);
    }
    d.ajax = function(p){
        var params = p
        api.ajax(params,function(ret,err){
            p.callback && p.callback(ret, err);
        })
    }
    d.cancelDownload = function(p){
        api.cancelDownload(p);
    };
    d.download = function(p){
        var params = p;
        api.download(params, function(ret,err){
            p.callback && p.callback(ret, err);
        });
    };

    /**
     * 不同的平台文件操作协议名称不一样
     */
    d.fsProtocol = function(p){
        var params = p;
        var path = params.path.replace(params.protocol, 'fs://');
        return path;
    };

    /**
     * 显示图片时需要真实的路径fs系统路径
     */
    /*d.fsRoot = function(p){
        var wgtRootDir = api.wgtRootDir;//=file:///storage/emulated/0/UZMap/wgt/A6960886767610
        wgtRootDir = wgtRootDir.replace('/wgt/','/') +'/';
        p.callback && p.callback(0, 0, wgtRootDir);
    };*/
    d.fsExist = function(p){
        var params = p;
        d.api_fs = d.api_fs || api.require('fs');
        d.api_fs.exist(params,function(ret,err){
            //console.log("ret.exist: " + ret.exist);
            p.callback && p.callback(ret, err);
        });
    };
    d.fsRemove = function(p){
        var params = p;
        d.api_fs = d.api_fs || api.require('fs');
        d.api_fs.remove(params, function(ret,err){
            p.callback && p.callback(ret, err);
        });
    };
    d.fsCreate = function(p){
        d.api_fs = d.api_fs || api.require('fs');
        d.api_fs.createFile({
            path: p.path
        },function(ret,err){
            p.callback && p.callback(ret, err);
        });
    }
    d.fsOpen = function(p){
        var params = p;
        d.api_fs = d.api_fs || api.require('fs');
        d.api_fs.open(params, function(ret, err){
            if (ret && ret.status) {
                p.callback && p.callback(ret);//0成功，1失败
            }else{
                api.alert({msg:err.msg});
            }
        });
    }
    d.fsRead = function(p){
        var params = p;
        d.api_fs = d.api_fs || api.require('fs');
        d.api_fs.read(params, function(ret,err){
            if (ret.status && ret.data) {
                p.callback && p.callback(ret, err);
            }else{
                api.alert({msg:err.msg});
            }
        });
    }
    d.fsWrite = function(p){
        var params = p;
        d.api_fs = d.api_fs || api.require('fs');
        d.api_fs.write(params, function(ret,err){
            if (ret.status) {
                p.callback && p.callback(ret);
            }else{
                api.alert({msg:err.msg});
            }
        });
    }
    d.fsClose = function(p){
        var params = p;
        d.api_fs = d.api_fs || api.require('fs');
        d.api_fs.close(params, function(ret,err){
            if (ret.status) {
            }else{
                api.alert({msg:err.msg});
            }
        });
    }
    d.navigationBarOpen = function(p){
        var params = p;
        d.api_navigationBar = d.api_navigationBar || api.require('navigationBar');
        d.api_navigationBar.open(params, function(ret,err){
            p.callback && p.callback(ret, err);
        });
    }
    d.navigationBarConfig = function(p){
        var params = p;
        d.api_navigationBar = d.api_navigationBar || api.require('navigationBar');
        d.api_navigationBar.config(params, function(ret,err){
            if(!ret){
                api.alert({msg:err.msg});
            }
        });
    }
    d.navigationBarShow = function(p){
        var params = p;
        d.api_navigationBar = d.api_navigationBar || api.require('navigationBar');
        d.api_navigationBar.show();
    }
    d.navigationBarHide = function(p){
        var params = p;
        d.api_navigationBar = d.api_navigationBar || api.require('navigationBar');
        d.api_navigationBar.hide();
    }
    d.listViewOpen = function(p){
        var params = p;
        d.api_listView = d.api_listView || api.require('listView');
        d.api_listView.open(params, function(ret,err){
            p.callback && p.callback(ret, err);
        });
    }
    d.listViewReloadData = function(p){
        var params = p;
        d.api_listView = d.api_listView || api.require('listView');
        d.api_listView.reloadData(params);
    }
    d.listViewShow = function(p){
        var params = p;
        d.api_listView = d.api_listView || api.require('listView');
        d.api_listView.show();
    }
    d.listViewHide = function(p){
        var params = p;
        d.api_listView = d.api_listView || api.require('listView');
        d.api_listView.hide();
    }
    d.listViewaClose = function(p){
        var params = p;
        d.api_listView = d.api_listView || api.require('listView');
        d.api_listView.close();
    }
    d.contactQuery = function(p){
        var params = p;
        d.api_contact = d.api_contact || api.require('contact');
        d.api_contact.queryContact({}, function(ret, err){//如果ids为空，查询全部，不要传
            p.callback && p.callback(ret, err);
        });
    }
    d.contactOpen = function(p){
        var api_contact = api_contact || api.require('contact');
        api_contact.openContact(function(ret,err) {
            p.callback && p.callback(ret, err);
        });
    }
    d.sms = function(p){
        var params = p;
        api.sms(params,function(ret, err){
            if(ret.status){
                //api.alert({msg:'发送成功'});//如果发送了可以提醒，但是用户取消时不要提醒
            } else{
                api.alert({msg:'不能发送短信'});
            }
        });
    }
    d.baiduStartLocation = function(p){//只有baidulocation才能定时发出定位信息，其中android为每30s，ios为每次到前台时
        var params = p;
        var baiduMap = api.require('baiduLocation');
        baiduMap.startLocation(params,function(ret, err){
            if(ret.status){
                p.callback && p.callback(ret, err);
            } else{
                //api.alert({msg:err.msg});
            }
        });
    };
    d.baiduStopLocation = function(){
        var baiduMap = api.require('baiduLocation');
        baiduMap.stopLocation();
    };
    d.baiduGetLocation = function(p){
        var baiduMap = api.require('baiduLocation');
        baiduMap.getLocation(function(ret, err){
            if(ret.status){
                p.callback && p.callback(ret, err);
            } else{
                //api.alert({msg:err.msg});
            }
        });
    };
    d.baiduGetNameFromLoation = function(p){
        var baiduMap = api.require('baiduMap');//不能用 ||的方式，因为可能使用baidu的多种接口
        var params = p;
        baiduMap.getNameFromLocation(params,function(ret,err){
            if (ret.status){
                p.callback && p.callback(ret, err);
            } else{
                //api.alert({title:'获取城市错误',msg:err.msg});
            }
        });
    };
    d.baiduGetLoationFromName = function(p){
        var baiduMap = api.require('baiduMap');
        var params = p;
        baiduMap.getLocationFromName(params,function(ret,err){
            if (ret.status){
                p.callback && callback(ret, err);
            } else{
                api.alert({title:'搜索错误',msg:err.msg});
            }
        });
    };
    /**
     *注册监听事件
     */
    d.eventListener = function(p){
        if(p.name == 'push'){
            d.api_push = d.api_push || api.require('push');
            if(p.enable){
                d.api_push.setListener(function(ret, err){
                   p.callback && p.callback(ret, err);
                });
            }else{
                d.api_push.removeListener();
            }
            return;
        }//
        var params = {
            name : p.name
        }
        if(p.enable){
            api.addEventListener(params, function(ret, err){
                if(1 || ret){//ret可能为空
                    var keyCode;

                    switch(params.name){
                        case 'keyback':
                            keyCode = 0;
                            p.callback && p.callback(keyCode);
                            break;
                        case 'keymenu':
                            keyCode = 1;
                            p.callback && p.callback(keyCode);
                            break;
                        case 'resume':
                            p.callback && p.callback();
                            break;
                        case 'pause':
                            p.callback && p.callback();
                            break;
                        case 'noticeclicked':
                            p.callback && p.callback(ret);
                            break;
                        default :
                            p.callback && p.callback(ret);
                            break;
                    }
                }
            });
        }else{
            api.removeEventListener(params);
        }
    };
    d.notification = function(p){
        var params = p;
        api.notification(params);
    };
    d.cancelNotification = function(p){
        var params = p;
        api.cancelNotification(params);
    };
    d.fixIos7Bar = function(el){
        var strDM = api.systemType;
        if (strDM == 'ios') {
            var strSV = api.systemVersion;
            var numSV = parseInt(strSV,10);
            var fullScreen = api.fullScreen;
            var iOS7StatusBarAppearance = api.iOS7StatusBarAppearance;
            if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
                el.style.paddingTop = '20px';
            }
            /*api.setStatusBarStyle({
                style: 'dark'
            });*/
        }
    }
    d.initApi = function(){
        api.parseTapmode();
        var header;
        if(document.getElementById('header')){
            header = document.getElementById('header');
            if(header) d.fixIos7Bar(header);
        } else{
            for(var i = 1; i < 5; i ++ ){
                if(document.getElementById('header' + i)){
                    header = document.getElementById('header' + i);
                    if(header) d.fixIos7Bar(header);
                }
            }
        }
    }
};

/**
 * ***********************执行源，目标包***********************
 */
Y.D[CONF.cast.d](Y.D);
Y.S[CONF.cast.s](window);

/**
 *******************************Y函数集*************************
 */
~function(y){
    y.openWin = function(p){
        if(!p.name || p.name=='') p.name = p.wndUrl;
        var params = {
            name: p.name || '',
            wndUrl: p.wndUrl || '',
            bounces: p.bounces || '',
            delay: p.delay || '',
            animation: {duration: p.animation.duration || ''}  || ''
        }
        Y.D.openWin(params);
    }
    y.closeWin = function(p){//name, animType, animSubType
        var params = {};
        if(p.animation){
            params.animation = {
                type: p.animation.type || 'push',
                subType: p.animation.subType,
                duration: p.animation.duration || 300 //默认值
            }
        }
        if(p.toName){
            params.name = p.toName;
            Y.D.closeToWin(params);
        }else{
            params.name = p.name;
            Y.D.closeWin(params);
        }
    }
    y.openFrame = function(p){//frameName,url,rect:{x,y,w,h},bounces
        var params = {
            frameName: p.frameName,
            frameUrl: p.frameUrl,
            rect:{
                x:p.rect.x,
                y:p.rect.y,
                w:p.rect.w,
                h:p.rect.h
            },
            bounces: p.bounces,
            opaque: p.opaque,
            bgColor: p.bgColor,
            hScrollBarEnabled: p.hScrollBarEnabled,
        };
        Y.D.openFrame(params);
    }
    y.closeFrame = function(p){
        var params = p? {
            frameName: p.frameName || '',
        } : {};
        Y.D.closeFrame(params);
    }
    y.openFrameGroup = function(p){
        var params = {
            name: p.name,
            background: p.background,
            scrollEnabled: p.scrollEnabled,
            rect: p.rect || {x:0, y:0, w:'auto', h:'auto'},
            index: p.index,
            frames: p.frames,
            callback: p.callback
        }
        Y.D.openFrameGroup(params);
    }

    /**
     * 在指定内容区域打开n个frame
     * @param id
     * @param x
     * @param y
     * @param frames
     * cbNameSwipe左右滑动回调函数名称
     */
    y.conFrameGroup = function(id, x, y, frames, cbNameSwipe){
        var s = window.getComputedStyle($$(id), null);
        var fs = [];
        for (var key in frames){
            fs.push({
                name: frames[key].name,
                url: frames[key].url,
                pageParam: frames[key].pageParam,
                bounces: frames[key].bounces,
                opaque: frames[key].opaque,
                bgColor: frames[key].bgColor || '#FFF'
            });
        }
        Y.openFrameGroup({
            name: id,
            background: '#FFF',
            rect: {x: int(x), y: int(y), w: int(s.width), h: int(s.height)},
            index: 0,
            frames: fs,
            callback: function (ret, err) {
                if(cbNameSwipe){
                    Y.execScript({
                        //name: api.winName,
                        script: cbNameSwipe + '("' + ret.index + '")'
                    })
                }
            }
        });
        //api.setFrameGroupAttr({name: 'homeGroup', hidden: false});
    }
    y.setFrameGroupIndex = function(p){
        var params = {
            name: p.name,
            index: p.index,
            scroll: p.scroll
        };
        Y.D.setFrameGroupIndex(params);
    };
    /**
     * f：函数可以为字符串或函数对象
     * winName：win名称，可以为空，默认为api.winName
     */
    y.execScript = function(p){//winName,frameName,func,param
        var f;
        if(typeof(p.script)=='string'){
            f = p.script;
        }else{
            f = '(' + p.script.toString() + ')(' + JSON.stringify(p.param||'') + ')';
        }
        var params = {
            winName: p.winName || '',
            frameName: p.frameName || '',
            script: f || ''
        };
        Y.D.execScript(params);
    };
    y.toastProgress = function(title, text, time){
        var opts = {};
        var show = function(opts, time){
            opts.modal = false;
            Y.D.showProgress(opts);
            setTimeout(function(){
                Y.D.hideProgress();
            },time);
        };
        if(arguments.length === 1){
            var time = time || 500;
            if(typeof title === 'number'){
                time = title;
            }else{
                opts.title = title+'';
            }
            show(opts, time);
        }else if(arguments.length === 2){
            var time = time || 500;
            var text = text;
            if(typeof text === "number"){
                var tmp = text;
                time = tmp;
                text = null;
            }
            if(title){
                opts.title = title;
            };
            if(text){
                opts.text = text;
            };
            show(opts, time);
        }
        if(title){
            opts.title = title;
        };
        if(text){
            opts.text = text;
        };
        time = time || 500;
        show(opts, time);
    };
    y.showProgress = function(p){
        var params = {
            title : p.title,
            text : p.text,
            modal : p.modal
        };
        Y.D.showProgress(params);
    };
    y.hideProgress = function(p){
        Y.D.hideProgress();
    };
    /**
     *
     */
    y.toast = function(p){
        var params = {
            msg: p.msg || '',
            duration:p.duration || '',
            location: p.location || ''
        }
        Y.D.toast(params);
    };
    y.actionSheet = function(p){
        var params = {
            cancelTitle     : p.cancelTitle,
            buttons         : p.buttons    ,
            style           : p.style      ,
            callback        : p.callback   ,
        }
        if(p.title) params.title = p.title;//apicloud bug
        Y.D.actionSheet(params);
    }
    y.prompt = function(p){
        var params = {
            title: p.title || '',
            msg: p.msg || '',
            text: p.text || '',
            buttons: p.buttons || '',
            callback: p.callback || ''
        }
        Y.D.prompt(params);
    };
    y.alert = function(p){
        var params = {
            title: p.title || '',
            msg: p.msg || '',
            buttons: p.buttons || '',
        }
        Y.D.alert(params);
    };
    y.confirm = function(p){
        var params = {
            title: p.title || '',
            msg: p.msg || '',
            buttons: p.buttons || '',
            callback: p.callback || ''
        }
        Y.D.confirm(params);
    };
    y.animation = function(p){//还有更多的参数可以添加
        var params = {
            delay: p.delay || '',
            duration: p.duration || '',
            autoreverse: p.autoreverse || '',
            repeatCount: p.repeatCount || '',
            translation: p.translation || '',
            callback: p.callback || ''
        }
        Y.D.animation(params);
    };
    y.setRefreshHeaderInfo = function(p){
        var params = {
            visible : p.visible,
            loadingImgae : p.loadingImgae || '',//只支持res://格式
            bgColor : p.bgColor || '',
            textColor : p.textColor || '',
            textDown : p.textDown || '',
            textUp : p.textUp || '',
            showTime: true,
            callback: p.callback || ''
        }
        Y.D.setRefreshHeaderInfo(params);
    };
    y.listenScrollToBottom = function(p){
        var params = {
            callback: p.callback || ''
        }
        Y.D.listenScrollToBottom(params);
    };
    y.setFrameAttr = function(p){
        var params = {
            name: p.name || '',
            rect: p.rect || '',
            hidden : p.hidden,
            bounces: p.bounces || '',
            opaque: p.opaque || '',
            bgColor: p.bgColor || '',
            vScrollBarEnabled: p.vScrollBarEnabled || '',
            hScrollBarEnabled: p.hScrollBarEnabled || ''
        }
        Y.D.setFrameAttr(params);
    };
    y.imagesOpen = function(p){
        var params = {
            imageUrls: p.imageUrls,
            showList: p.showList,
            activeIndex: p.activeIndex
        }
        Y.D.imagesOpen(params);
    };
    y.imagesGet = function(p){
        var params = {
            sourceType          : p.sourceType       ,
            encodingType        : p.encodingType     ,
            mediaValue          : p.mediaValue       ,
            destinationType     : p.destinationType  ,
            allowEdit           : p.allowEdit        ,
            quality             : p.quality          ,
            targetWidth         : p.targetWidth      ,
            targetHeight        : p.targetHeight     ,
            saveToPhotoAlbum    : p.saveToPhotoAlbum ,
            callback            : p.callback         ,
        }
        Y.D.imagesGet(p);
    };
    y.inputOpen = function(p){
        var params = {
            bgColor     : p.bgColor || "#f2f2f2"   ,
            lineColor   : p.lineColor || "#d9d9d9",
            fileBgColor : p.fileBgColor || "#fff",
            borderColor : p.borderColor || "#b3b3b3",
            sendImg     : p.sendImg || "widget://images/send_normal.png",
            sendImgHighlight     : p.sendImgHighlight || "widget://images/send_select.png",
            maxLines: p.maxLines || 4,
            placeholder: p.placeholder || "输入内容",
            keyboard: p.keyboard,//是否open之后弹出
            callback    : p.callback
        }
        Y.D.inputOpen(params);
    }
    y.inputKeyboard = function(p){
        var params = {
            show: p.show
        }
        Y.D.inputKeyboard(params);
    }
    y.systemVersion = function(){
        return Y.D.systemVersion();
    };
    y.appVersion = function(){
        return Y.D.appVersion();
    };
    y.systemType = function(){
        return Y.D.systemType();
    };
    y.clearCache = function(){
        Y.D.clearCache();
    };
    y.checkUpdate = function(p){
        var params = {
            callback: p.callback || ''
        }
        Y.D.checkUpdate(params);
    }
    /**
     * 目标应用的资源文件标识。Android上为apk包的本地路径，如file://xxx；iOS上为应用的itunes地址或安装包对应的plist文件地址，不能为空
     * android: appUri: 'file://xxx.apk'
     * iphone:appUri: 'https://itunes.apple.com/cn/app/qq/id444934666?mt=8'    //itunes地址
     *        appUri: 'https://list.kuaiapp.cn/list/KuaiAppZv7.1.plist'        //安装包对应plist地址
     */
    y.installApp = function(p){
        var params = {
            appUri: p.appUri
        }
        Y.D.installApp(params);
    }
    /**
     *当前仅支持传入url，通过浏览器打开
     */
    y.openApp = function(p){
        var params = {
            //iphone: 传入后引擎自动拼接 iosUrl + appParam
            iosUrl: p.iosUrl || '',
            appParam: p.appParam || '',
            //android
            androidPkg: p.androidPkg || 'android.intent.action.VIEW',
            mimeType: p.mimeType || 'text/html',
            uri: p.uri || ''
        }
        Y.D.installApp(params);
    }
    /**
     * id: 'UZ00000001',
     * retData: {name:'closeWidget'},
     * silent: 是否静默退出，只在主widget中有效,默认false
     * animation: {
             *  type: 'flip',
             *  subType: 'from_bottom',
             *  duration: 500
             * }
     */
    y.closeWidget = function(p){
        var params = {
            id: p.id,
            retData: p.retData,
            silent: p.silent,
            animation: p.animation
        }
        Y.D.closeWidget(params);
    }
    /**
     * userName：用户名称，来自业务系统，不能为空
     * userId：用户Id，来自业务系统，不能为空
     */
    y.pushBind = function(p){
        var params = {
            userName: p.userName || 'default',
            userId: p.userId
        }
        Y.D.pushBind(params);

        var oldGroupName = getstorage('pushBindGroup');
        var groupName = 'uid_' + p.userId;
        if(oldGroupName == groupName) return;
        if(oldGroupName) {
            Y.pushLeaveGroup({
                groupName: oldGroupName
            })
        };
        Y.D.pushJoinGroup({
            groupName: groupName
        });
        setstorage('pushBindGroup', groupName);
    }
    y.pushLeaveGroup = function(p){//老用户退出和新用户绑定时，用到
        Y.D.pushLeaveGroup({
            groupName: p.groupName
        });
    }
    Y.pushAutoNotify = function(auto, callback){
        var params = {
            name: 'push',
            enable: !auto,
        }
        params.callback = auto ? null : callback;
        //Y.eventListener(params);
        Y.D.pushSetPreference({
            notify:auto
        });
    }
    /**参数
     * method  : 异步请求方法类型，默认get
     * url     : 地址不能为空
     * timeout : 超时默认30秒
     * dataType: 'text',返回数据类型，在html中使用json.stringify,在服务器端输出的是jsonstr，不依赖于hybird对json的支持
     * data    : post时的数据
     *   {
     *       body："",      //请求体（字符串类型）
     *       values：{},    //Post参数（JSON对象）
     *       files：{}      //Post文件（JSON对象）
     *   }
     * callback: 返回回调函数
     * cbParams : {//回调的参数
     *       opId : inXmlHttpID,
     *       sucStatus: 1//成功标志
     *   }
     */
    y.ajax = function(p){
        var params = {
            method      : p.method,
            url         : p.url    ,
            timeout     : p.timeout,
            data        : p.data   ,//post时提交的data
            dataType    : p.dataType,//返回数据类型
            callback    : p.callback,
        }
        Y.D.ajax(params);
    }

    y.cancelDownload = function(p){
        Y.D.cancelDownload(p);
    };
    y.download = function(p){
        var params = {
            url        :  p.url,
            savePath   :  p.savePath,
            report     :  p.report,
            allowResume : p.allowResume,
            cache       : p.cache,
            callback    : p.callback,
            cbParams    : p.cbParams
        }
        Y.D.download(params);
    };

    y.fsProtocol  = function(p){
        var params = {
            "path"      : p.path,
            "protocol"  : p.protocol
        };
        return Y.D.fsProtocol(params);
    }
    /*y.fsRoot = function(p){
        var params = {
            callback: p.callback
        };
        Y.D.fsRoot(params);
    };*/
    /**
     * ret.exist,存在
     */
    y.fsExist = function(p){
        var params = {
            path        : p.path,
            callback    : p.callback,
        };
        Y.D.fsExist(params);
    };
    y.fsRemove = function(p){
        var params = {
            path        : p.path,
            callback    : p.callback,
        };
        Y.D.fsRemove(params);
    };

    y.fsCreate = function(p){
        var params = {
            path : p.path,
            callback: p.callback
        }
        Y.D.fsCreate(params);
    }
    y.fsOpen = function(p){
        var params = {
            path        : p.path    ,
            flags       : p.flags   ,
            callback    : p.callback,
        }
        Y.D.fsOpen(params);
    }
    y.fsRead = function(p){
        var params = {
            fd      : p.fd,
            length  : p.length,
            callback: p.callback
        }
        Y.D.fsRead(params);
    }
    y.fsWrite = function(p){
        var params = {
            fd      : p.fd,
            data    : p.data,
            offset  : p.offset,
            callback: p.callback
        }
        Y.D.fsWrite(params);
    }
    y.fsClose = function(p){
        var params = {
            fd : p.fd,
        }
        Y.D.fsClose(params);
    }
    y.fsReadFromFile = function(path, callback){
        var params = {
            path        : path ,
            flags       : 'read_write' ,
            callback    : function(ret){
                var fd = ret.fd;
                var p = {
                    fd      : fd,
                    length  : 0,
                    offset  : 0,
                    callback: function(ret_read, err){
                        callback && callback(ret_read.data);//将读取的数据用callback函数处理
                        y.fsClose({fd: fd});
                    }
                }
                y.fsRead(p);
            },
        }
        y.fsOpen(params);
    };
    y.fsWriteToFile = function(data, path){
        var params = {
            path        : path ,
            flags       : 'read_write' ,
            callback    : function(ret){
                var fd = ret.fd;
                var p = {
                    fd      : fd,
                    data    : data,
                    offset  : 0,
                    callback: function(ret){
                        y.fsClose({fd: fd});
                    }
                }
                y.fsWrite(p);
            },
        }
        y.fsOpen(params);
    };
    y.navigationBarShow = function(p){
        var params = p;
        Y.D.navigationBarShow(params);
    }
    y.navigationBarHide = function(p){
        var params = p;
        Y.D.navigationBarHide(params);
    }
    y.navigationBarOpen = function(p){
        var params = p;
        Y.D.navigationBarOpen(params);
    }
    y.navigationBarConfig = function(p){
        var params = p;
        Y.D.navigationBarConfig(params);
    }
    y.listViewOpen = function(p){
        var params = p;
        Y.D.listViewOpen(params);
    }
    y.listViewReloadData = function(p){
        var params = p;
        Y.D.listViewReloadData(params);
    }
    y.listViewShow = function(p){
        var params = p;
        Y.D.listViewShow(params);
    }
    y.listViewHide = function(p){
        var params = p;
        Y.D.listViewHide(params);
    }
    y.listViewaClose = function(p){
        var params = p;
        Y.D.listViewaClose(params);
    }
    y.contactQuery = function(p){
        var params = p;
        Y.D.contactQuery(params);
    }
    y.contactOpen = function(p){
        var params = p;
        Y.D.contactOpen(params);
    }
    /** 打开通讯录，指定文本，发送短信
     * p: {text: xxx}
     */
    y.contactSms = function(p){
        var params = p;
        var cbOpen = function(ret, err){
            if(ret.status){
                var phone;
                var phones = ret.phones;
                var numbers = [];
                var re = /1(?:[38]\d|4[57]|5[01256789])\d{8}/;
                for(j = 0; j < phones.length; j++){
                    if(isAndroid){//android
                        phone = phones[j].phone.replace(/^\+86|^86|-/g, '');
                        //console.log(phone);
                        if(phone && re.test(phone))//检查合法的手机号
                            numbers.push(phone);
                    }else{
                        for(var key in phones[j]){
                            phone = phones[j][key].replace(/^\+86|^86|-/g, '');
                            //console.log(phone);
                            if(phone && re.test(phone))//检查合法的手机号
                                numbers.push(phone);
                        }
                    }
                }
                y.sms({
                    numbers: numbers,
                    text: params.text
                });
            }
        }
        Y.D.contactOpen({
            callback: cbOpen
        });
    }
    y.sms = function(p){
        var params = {
            numbers: p.numbers,//['number1', 'number2']
            text: p.text
        };
        Y.D.sms(params);
    }

    /** ret
     *  longitude:116.213                      //经度
     *  latitude:39.213                        //纬度
     *  timestamp:1396068155591                //时间戳
     */
    y.baiduStartLocation = function(p){//位置变动时返回新的定位
        var params = {
            accuracy: p.accuracy,//'100m' 定位时只返回精度范围内的坐标, 取值范围10m， 100m, 1km, 3km
            filter: p.filter,//1, 位置更新所需最小距离（单位米）
            autoStop: p.autoStop,//获取到位置信息后是否自动停止定位,默认为true
            callback: p.callback
        }
        Y.D.baiduStartLocation(params);
    }
    y.baiduStopLocation = function(){
        Y.D.baiduStopLocation();
    }
    /** ret
     *  longitude:116.213                      //经度
     *  latitude:39.213                        //纬度
     *  timestamp:1396068155591                //时间戳
     */
    y.baiduGetLocation = function(p){//只获取当前定位
        var params = {
            callback: p.callback
        }
        Y.D.baiduGetLocation(params);
    }
    /** ret
     * status:                 //是否查找成功
     * lon:                    //返回经度
     * lat:                    //返回纬度
     * add                     //地址
     * province:               //所在省份
     * city:                   //所在城市
     * district:               //所在县区
     * streetName:             //街道名
     * streetNumber:           //街道号
     */
    y.baiduGetNameFromLoation = function(p){
        var params = {
            lon: p.lon,
            lat: p.lat,
            callback: p.callback//
        };
        Y.D.baiduGetNameFromLoation(params);
    }
    /** ret
     * status:         //是否查找成功
     * lon:            //返回经度
     * lat:            //返回纬度
     */
    y.baiduGetLoationFromName = function(p){
        var params = {
            city: p.city,//不能为空
            address: p.address,//不能为空
            callback: p.callback
        };
        Y.D.baiduGetLoationFromName(params);
    }

    /**监听事件enable： 增加或取消
     * name           callback参数
     * ------------------------
     * keyback        inKeyCode/keyCode = '0'
     * keymenu        inKeyCode/keyCode = '1'
     * push           无
     */
    y.eventListener = function(p){
        var params = {
            name        : p.name,
            callback    : p.callback,
            enable      : p.enable
        }
        Y.D.eventListener(params);
    }
    y.notification = function(p){
        var params = {
            //sound: 'default'
        }
        //if(p.length){
            params.notify = {
                title: p.title,
                content: p.content,
                extra: p.extra,
                updateCurrent: p.updateCurrent
            }
       // }
        Y.D.notification(params);
    }
    y.cancelNotification = function(p){
        var params = {
            id : p.id
        }
        Y.D.cancelNotification(params);
    };
    y.log = function(data, path){
        var logPath = path || 'fs://log.txt';
        var str = data;
        if(typeof data == 'object') str = JSON.stringify(data);
        var fscreateAndWrite = function(fdata, fpath){
            Y.fsCreate({
                path:   fpath,
                callback:function(ret, err){//在回调中写文件更加安全
                    if(ret.status) Y.fsWriteToFile(fdata, fpath);
                }
            });
        }
        //如果存在，先删除再创建，否则直接创建
        Y.fsExist({path: logPath, callback: function(ret, err){
            if(ret.exist) {
                Y.fsRemove({
                    path: logPath,
                    callback : function(ret, err){//即使成功删除，ret也为null
                        fscreateAndWrite(str, logPath);
                    }
                });
            }else fscreateAndWrite(str, logPath);
        }});
    };
    Y.wechatInstalled = function(p){
        var appBundle;
        if (api.systemType == 'ios'){
            appBundle = 'wechat://';
        } else {
            appBundle = 'com.tencent.mm';
        }
        api.appInstalled({
            appBundle: appBundle
        },function(ret,err){
            if (ret.installed) {
                p.callback && p.callback(ret.installed);
            } else {

            }
        });
    }

    y.initApi = function(){
        Y.D.initApi();
    }
}(Y);