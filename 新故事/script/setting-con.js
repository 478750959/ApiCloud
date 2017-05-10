function modifyNick(nickname) {
    nickname = nickname || '';
    api.openWin({
        name: 'modifyNick',
        url: 'modifyNick.html',
        opaque: true,
        pageParam: {
            nickname: nickname
        },
        vScrollBarEnabled: false
    });
}

function modifyPwd() {
    api.openWin({
        name: 'modifyPwd',
        url: '../html/modifyPwd.html',
        opaque: true,
        vScrollBarEnabled: false
    });
}

function loginBtn() {
    api.openWin({
        name: 'userLogin',
        url: '../html/userLogin.html',
        opaque: true,
        vScrollBarEnabled: false
    });
}

function loginOut() {

    var common_url = 'https://d.apicloud.com/mcm/api';
    var appId = 'A6974887568667';
    var key = '09652FAC-1E1B-D3C4-90BB-2BC09472893F';
    var now = Date.now();
    var appKey = SHA1(appId + "UZ" + key + "UZ" + now) + "." + now;
    var logoutUlr = '/user/logout';
    api.showProgress({
        title: '正在注销...',
        modal: false
    });
    api.ajax({
        url: common_url + logoutUlr,
        method: 'post',
        cache: false,
        timeout: 20,
        headers: {
            "Content-type": "application/json",
            "X-APICloud-AppId": appId,
            "X-APICloud-AppKey": appKey,
            "authorization": $api.getStorage('usr').token
        }
    }, function (ret, err) {
        if (ret) {
            $api.clearStorage();
            api.execScript({
                name: 'root',
                script: 'openTab("top");'
            });
            setTimeout(function () {
                api.closeToWin({
	                name: 'root'
                });
            }, 100);
        } else {
            alert(JSON.stringify(err));
        }
        api.hideProgress();
    });
}

function toRegister() {
    api.openWin({
        name: 'userLogin',
        url: 'userLogin.html',
        opaque: true,
        vScrollBarEnabled: false
    });
}

//清除下载缓存文件、拍照临时文件、网页缓存文件等
function clearData() {
    api.clearCache();
    
   // $api.clearStorage ()

    setTimeout(function () {
        api.alert({
            msg: '缓存已清空!'
        });
    }, 300);
}

function openAbout() {
    api.openWin({
        name: 'about',
        url: './about.html'
    });
}

function init() {
    api.showProgress({
        title: '加载中...',
        modal: false
    });
    var uid = $api.getStorage('usr').uid;
   
     //alert('uid'+uid);
    
   
    var getUserById = '/user/' + uid;
    ajaxRequest(getUserById, 'get', '', function (ret, err) {
        if (ret) {
            var content = $api.byId('content');
            var tpl = $api.byId('template').text;
            var tempFn = doT.template(tpl);
            content.innerHTML = tempFn(ret);
        } else {
            // alert(ret);
            api.toast({msg: err.msg})
        }
        api.hideProgress();
    })
}
function ajaxRequest(url, method, bodyParam, callBack) {
    var common_url = 'https://d.apicloud.com/mcm/api';
    var appId = 'A6974887568667';
    var key = '09652FAC-1E1B-D3C4-90BB-2BC09472893F';
    var now = Date.now();
    var appKey = SHA1(appId + "UZ" + key + "UZ" + now) + "." + now;
   // alert(common_url + url);
    api.ajax({
        url: common_url + url,
        method: method,
        cache: false,
        timeout: 20,
        headers: {
            "Content-type": "application/json",
            "X-APICloud-AppId": appId,
            "X-APICloud-AppKey": appKey
        },
        data: {
            body: bodyParam
        }
    }, function (ret, err) {
        callBack(ret, err);
    });
} 
	
	  
	  
	
function SHA1(msg) {

    function rotate_left(n, s) {
        var t4 = ( n << s ) | (n >>> (32 - s));
        return t4;
    };

    function lsb_hex(val) {
        var str = "";
        var i;
        var vh;
        var vl;

        for (i = 0; i <= 6; i += 2) {
            vh = (val >>> (i * 4 + 4)) & 0x0f;
            vl = (val >>> (i * 4)) & 0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    };

    function cvt_hex(val) {
        var str = "";
        var i;
        var v;

        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    };


    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;

    msg = Utf8Encode(msg);

    var msg_len = msg.length;

    var word_array = new Array();
    for (i = 0; i < msg_len - 3; i += 4) {
        j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
            msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
        word_array.push(j);
    }

    switch (msg_len % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
            break;

        case 2:
            i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
            break;

        case 3:
            i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
            break;
    }

    word_array.push(i);

    while ((word_array.length % 16) != 14) word_array.push(0);

    word_array.push(msg_len >>> 29);
    word_array.push((msg_len << 3) & 0x0ffffffff);


    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {

        for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
        for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;

        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;

    }

    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

    return temp.toLowerCase();

}	
apiready = function () {
    init();
};