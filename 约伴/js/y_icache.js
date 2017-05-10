/**
 *
 */
var zy_dl_opid = 1000;
var zy_dl_session = {};
var zy_dl_taskcount = 0;
var zy_muticount = 5;
var downloading = {};//正在下载的不能有重复的地址，否则图像没有内容
var lstor = (window.localStorage ? window.localStorage : (new Object));

function zy_initcache(cb) {
    uexFileMgr.cbGetFileRealPath = function (opCode, dataType, path) {
        zy_dl_session.rp = path;//lakers在Y.D.fsRoot中直接
        if (cb) cb();
    };
    uexFileMgr.getFileRealPath("wgt://");
}

function zy_imgcache(sel, key, url, cb, err, dest, ext) {
    uexDownloaderMgr.onStatus = function (opCode, fileSize, percent, status, savePath) {//lakers 增加的参数是为了在apicloud中获取下载保存地址，//todo 在appcan中不知是否可用
        var s = zy_dl_session[opCode];
        var success = function(){
            uexDownloaderMgr.closeDownloader(opCode);
            uexDownloaderMgr.clearTask(s.url);//lakers.o= rul
            //lstor[s.key] = s.dest.replace("wgt://", zy_dl_session.rp);//把图片路径保存在localstorage里面，其实此处不需要replace了 //apicloud正式包不能使用保存的s.dest
            lstor[s.key] = savePath;//apicloud下使用，将原先的fs://替换成api返回的物理地址
            if (s.cb) s.cb(s.sel, lstor[s.key]);
            else if($$(s.sel) && $$(s.sel).style)  $$(s.sel).style.backgroundImage = "url(" + lstor[s.key] + ")";
            zy_cleartask(opCode);
        };
        //根据文件是否存在判断更加安全

        switch (int(status)) {
            case 0 :
                break;
            case 1 :
                if(!savePath){
                    errorDownload(opCode);
                    return;
                }
                Y.fsExist({path:savePath, callback: function(ret, err){
                    if(ret.exist){
                        success();
                    }
                }});
                break;
            case 2 :
                errorDownload(opCode);
                return;
        }
    };
    uexDownloaderMgr.cbCreateDownloader = function (opCode, dataType, data) {
        if (data == 0) {
            var s = zy_dl_session[opCode];
            if (!s.dest) {
                var d = new Date();
                s.dest = zy_dl_session.rp + "data/icache/" + d.valueOf() + opCode + "."
                    + (s.ext ? s.ext : "jpg");
            }else s.dest = zy_dl_session.rp + "data/icache/" + s.dest;//lakers 将"wgt://"改为fs://,在Y.D的包里面定义
            uexDownloaderMgr.download(opCode, s.url, s.dest, '0');
        } else {
            errorDownload(opCode);
        }
    };

    uexFileMgr.cbIsFileExistByPath = function (opId, dataType, data) {
        if (int(data)) {
            var s = zy_dl_session[opId];
            setTimeout(function () {
                if (s.cb)
                    s.cb(s.sel, s.rp);
                else
                    if($$(s.sel)) $$(s.sel).style.backgroundImage = "url(" + s.rp + ")";
                zy_cleartask(opId);
            }, 0);
        }else {
            uexDownloaderMgr.createDownloader(opId);
        }
    };
    //console.log('lstor[key]:' + lstor[key] + ',$$(sel):' + $$(sel) + ',$$(sel).tagName:' + $$(sel).tagName);
    if (lstor[key] && $$(sel)) {
        if($$(sel).tagName == 'IMG') $$(sel).src = lstor[key];
        else if($$(sel).style) $$(sel).style.backgroundImage = "url(" + lstor[key] + ")";//相册中使用的是div
        return;
    }

    zy_dl_opid++;
    zy_dl_session[zy_dl_opid] = {};
    zy_dl_session[zy_dl_opid].sel = sel;
    zy_dl_session[zy_dl_opid].key = key;
    zy_dl_session[zy_dl_opid].cb = cb;
    zy_dl_session[zy_dl_opid].err = err;
    zy_dl_session[zy_dl_opid].url = url;
    zy_dl_session[zy_dl_opid].dest = dest;
    zy_dl_session[zy_dl_opid].ext = ext;
    zy_dl_session[zy_dl_opid].state = 0;
    zy_runcache();
}
function zy_cleartask(id) {
    zy_dl_taskcount--;
    delete downloading[zy_dl_session[id].url];
    delete zy_dl_session[id];
    zy_runcache();
}
function errorDownload(opCode){
    uexDownloaderMgr.closeDownloader(opCode);
    if (zy_dl_session[opCode].err)
        zy_dl_session[opCode].err();
    zy_cleartask(opCode);
}
function zy_runcache() {
    if (zy_dl_taskcount < zy_muticount) {
        for (var i in zy_dl_session) {//同时创建多个下载
            var s = zy_dl_session[i];
            if (s.state == 0 && !downloading[s.url]) {
                s.state = 1;
                downloading[s.url] = 1;
                zy_dl_taskcount++;
                s.rp = lstor[s.key];
                if (s.rp)
                    uexFileMgr.isFileExistByPath("" + i, s.rp);
                else
                    uexDownloaderMgr.createDownloader(i);
                return;
            }
        }
    }
}
/**
 * 在setting_content中重新写了，暂时没用
 */
function zy_clearcache() {
    lstor.clear();
    uexFileMgr.deleteFileByPath(zy_dl_session.rp + "/data/icache");
}