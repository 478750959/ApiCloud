var logc = 0;
var latc = 0;
var provincec = '';
var cityc = '';
var districtc = '';
var addressc = '';
var filter_distance = 1000;//单位：m
/**
 * 进程内只能调用一次，否则退出时黑屏
 */
function getlocation(flag) {//flag，是否要重新定位
    if (0 && !flag && latc && logc) locationCallback({latitude: latc, longitude: logc}, '');
    else {
        if (!isSML) {
            var params = {
                accuracy: '100m',
                filter: filter_distance,//单位m
                autoStop: false,
                callback: locationCallback
            };
            Y.baiduStartLocation(params);//定位
        } else {
            //locationCallback('39.977539', '116.309357');
        }
    }
}
/**
 * APP打开时报一次，后续移动超过filter_distance才上报
 */
function locationCallback(ret, err) {
    var lat = ret.latitude;
    var log = ret.longitude;
    if (!lat || !log) {
        return;
    }
    var move_distance = getFlatternDistance(lat, log, latc, logc);
    if (int(move_distance) < filter_distance) return;//如果移动范围不大，不上报服务器，不刷新列表
    logc = log;
    latc = lat;
    setstorage('location', '{"log":"' + logc + '", "lat":"' + latc + '"}');//得到即保存在缓存
    //上传用户位置信息
    saveUserLocaton(logc, latc);

    //得到地址，上传，并刷新首页内容列表
    var saveAddr = function (ret2, err2) {//上传所在的省市，地区
        if (!ret2.lat || !ret2.lon || !ret2.province) return;
        var location = getStorJson('location');
        provincec = location.province = ret2.province;
        cityc = location.city = ret2.city;
        districtc = location.district = ret2.district;
        addressc = location.address = ret2.add;
        setStorJson('location', location);
        //根据地址更新首页内容，没有登录也更新
        ueppscript('root', 'content1', 'loadListAll(\'\', \'\')');
        ueppscript('root', 'forum_listct', 'loadList(\'\', \'0\', \'\')');
        saveUserLocaton('', '', provincec, cityc, districtc, addressc);//再次上传，分两次上传是避免baidumap api出现问题时，还能保存坐标。
    };
    var params = {
        lon: logc,
        lat: latc,
        callback: saveAddr
    };
    Y.baiduGetNameFromLoation(params);
}
/**
 * 如果用户登录，上传经纬度，地址信息
 */
function saveUserLocaton(log, lat, province, city, district, address){
    if (!uid) return;
    var location = getStorJson('location');
    log = log || logc || location.log;
    lat = lat || latc || location.lat;
    province = province || provincec || location.province;
    city = city || cityc || location.city;
    district = district || districtc || location.district;
    address = address || addressc || location.address;

    province = province ? encodeURIComponent(province) : '';
    city = city ? encodeURIComponent(city) : '';
    district = district ? encodeURIComponent(district) : '';
    address = address ? encodeURIComponent(address) : '';

    //上传经纬度，地址
    var url = login_url + "&mod=logging&action=location&longitude=" + log + "&latitude=" + lat+ "&province=" + province + "&city=" + city + "&district=" + district + "&address=" + address;
    $.getJSON(url, function (json) {//记录用户的位置
        if (json.status == '0') {
        } else if (json.status == '1') {//保存成功

        } else {//需要登录
            //console.log('locationCallback: locate failed ~');
        }
    });

}
//获取移动的距离,地球椭圆模型
function getFlatternDistance(lat1, lng1, lat2, lng2) {
    var EARTH_RADIUS = 6378137.0;    //单位M
    var PI = Math.PI;
    var getRad = function (d) {
        return d * PI / 180.0;
    };
    var f = getRad((lat1 + lat2) / 2);
    var g = getRad((lat1 - lat2) / 2);
    var l = getRad((lng1 - lng2) / 2);
    if (lat1 == lat2 && lng1 == lng2) return 0;
    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);

    var s, c, w, r, d, h1, h2;
    var a = EARTH_RADIUS;
    var fl = 1 / 298.257;

    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;

    s = sg * (1 - sl) + (1 - sf) * sl;
    c = (1 - sg) * (1 - sl) + sf * sl;

    w = Math.atan(Math.sqrt(s / c));
    r = Math.sqrt(s * c) / w;
    d = 2 * w * a;
    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;

    return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
}