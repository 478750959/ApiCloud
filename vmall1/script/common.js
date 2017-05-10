function openWin(name,pId) {
	// api.closeFrameGroup({name:'product_group'});
	// var aa = parseInt(Math.random()*1000)+'aa';
	api.openWin({
		name:name,
		url:name+'.html',
            pageParam:{pId:pId},
            reload:true,
            delay:100
	});
}

function openFrame(name) {
	api.openFrame({
		name:name,
		url:name+'.html'
	});
}
