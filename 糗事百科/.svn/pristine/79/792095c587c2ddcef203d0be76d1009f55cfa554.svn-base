// 改变样式表
// 1是夜晚模式，2是白天模式
var lightStyle = $api.dom('.light-style');
var darkStyle = $api.dom('.dark-style');
var theme = $api.getStorage('theme');
if (theme) {

} else{
    theme = 2;
    
}
window.changeTheme = function(index){
    $api.setStorage('theme',index);
    if (index == 1) {
        $api.attr(lightStyle,'disabled','disabled');
        $api.removeAttr(darkStyle,'disabled');
    } else{
        $api.attr(darkStyle,'disabled','disabled');
        $api.removeAttr(lightStyle,'disabled');
    }
};
changeTheme(theme);