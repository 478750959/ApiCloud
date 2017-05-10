apiready = function(){
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
    
    var pos = $api.offset(header);
    api.openFrame({
        name: 'setting-con',
        url: 'setting-con.html',
        rect:{
            x: 0,
            y: pos.h,
            w: 'auto',
            h: 'auto'
        },
        bounces: true,
        vScrollBarEnabled: false
    });
};