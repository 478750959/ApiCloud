//定义数据API接口的appKey
var appKey = "5ed1ca988555463cae6707d46309322e";

//定义相关变量
var page = 1;

//加载首页推荐内容
function loadRecommendData(){

	api.showProgress({
        title: '加载中...',
        modal: false
    });
    
	var pn = rd(0,99);
	var network = api.connectionType;
	
	$.ajax({
		type:"get",
		url:"http://apis.haoservice.com/lifeservice/cook/query",
		data:{
			"key":appKey,
			"menu":"家常",
			"rn":10,
			"pn":pn
		},
		dataType:"json",
		success:function(ret){
			var pageHtml = "";
			if(ret.error_code==0){
				$.each(ret.result,function(index,item){
					if(network == "wifi"){
						var getTpl = $api.html($api.byId("pageTpl"));
						laytpl(getTpl).render(item, function(html){
						    pageHtml = pageHtml + html;
						});
					}
					else{
						if($api.getStorage('showImgOn3G') == "true"){
							var getTpl = $api.html($api.byId("pageTpl"));
							laytpl(getTpl).render(item, function(html){
							    pageHtml = pageHtml + html;
							});
						}
						else{
							var getTpl = $api.html($api.byId("pageTplNoImg"));
							laytpl(getTpl).render(item, function(html){
							    pageHtml = pageHtml + html;
							});
						}
					}
				})
				$api.html($api.byId("pageListCont"),pageHtml);
			}
			else{
				api.toast({
				    msg: '数据引擎异常，请稍候再试。',
				    duration:2000,
				    location: 'bottom'
				});
			}
			
			api.refreshHeaderLoadDone();			
			api.hideProgress();
		}
	});
}

//加载分类列表内容
function loadListData(cid){
	api.showProgress({
        title: '加载中...',
        modal: false
    });
    
    var network = api.connectionType;
    
    $.ajax({
		type:"get",
		url:"http://apis.haoservice.com/lifeservice/cook/index",
		data:{
			"key":appKey,
			"cid":cid,
			"rn":10,
			"pn":page
		},
		dataType:"json",
		success:function(ret){
			var pageHtml = "";
			if(ret.error_code==0){
				if(ret.result.length<=0){
					api.toast({
					    msg: '没有更多内容了',
					    duration:2000,
					    location: 'bottom'
					});
				}
				else{
					$.each(ret.result,function(index,item){
						if(network == "wifi"){
							var getTpl = $api.html($api.byId("pageTpl"));
							laytpl(getTpl).render(item, function(html){
							    pageHtml = pageHtml + html;
							});
						}
						else{
							if($api.getStorage('showImgOn3G') == "true"){
								var getTpl = $api.html($api.byId("pageTpl"));
								laytpl(getTpl).render(item, function(html){
								    pageHtml = pageHtml + html;
								});
							}
							else{
								var getTpl = $api.html($api.byId("pageTplNoImg"));
								laytpl(getTpl).render(item, function(html){
								    pageHtml = pageHtml + html;
								});
							}
						}
					})
					$api.append($api.byId("pageListCont"),pageHtml);
					page++;
				}
			}
			else{
				api.toast({
				    msg: '数据引擎异常，请稍候再试。',
				    duration:2000,
				    location: 'bottom'
				});
			}
			
			api.refreshHeaderLoadDone();			
			api.hideProgress();
		}
	});
}

//加载搜索结果列表
function loadSearchListData(key){
	api.showProgress({
        title: '加载中...',
        modal: false
    });
    
    var network = api.connectionType;
    
    $.ajax({
		type:"get",
		url:"http://apis.haoservice.com/lifeservice/cook/query",
		data:{
			"key":appKey,
			"menu":key,
			"rn":10,
			"pn":page
		},
		dataType:"json",
		success:function(ret){
			var pageHtml = "";
			if(ret.error_code==0){
				if(ret.result.length<=0){
					api.toast({
					    msg: '没有更多内容了',
					    duration:2000,
					    location: 'bottom'
					});
				}
				else{
					$.each(ret.result,function(index,item){
						if(network == "wifi"){
							var getTpl = $api.html($api.byId("pageTpl"));
							laytpl(getTpl).render(item, function(html){
							    pageHtml = pageHtml + html;
							});
						}
						else{
							if($api.getStorage('showImgOn3G') == "true"){
								var getTpl = $api.html($api.byId("pageTpl"));
								laytpl(getTpl).render(item, function(html){
								    pageHtml = pageHtml + html;
								});
							}
							else{
								var getTpl = $api.html($api.byId("pageTplNoImg"));
								laytpl(getTpl).render(item, function(html){
								    pageHtml = pageHtml + html;
								});
							}
						}
					})
					$api.append($api.byId("pageListCont"),pageHtml);
					page++;
				}
			}
			else{
				api.toast({
				    msg: '数据引擎异常，请稍候再试。',
				    duration:2000,
				    location: 'bottom'
				});
			}
			
			api.refreshHeaderLoadDone();			
			api.hideProgress();
		}
	});
}

//加载菜谱详细内容
function loadDetail(id){

	api.showProgress({
        title: '加载中...',
        modal: false
    });

	$.ajax({
		type:"get",
		url:"http://apis.haoservice.com/lifeservice/cook/queryid",
		data:{
			"key":appKey,
			"id":id
		},
		dataType:"json",
		success:function(ret){
			if(ret.error_code==0){

				var getTpl = $api.html($api.byId("pageTpl"));
				laytpl(getTpl).render(ret.result, function(html){
				    $api.html($api.byId("detailCont"),html);
				});
				
			}
			else{
				api.toast({
				    msg: '数据引擎异常，请稍候再试。',
				    duration:2000,
				    location: 'bottom'
				});
			}
					
			api.hideProgress();
		}
	});

}

//加载收藏列表
function loadFavoritesData(type){
	api.showProgress({
        title: '加载中...',
        modal: false
    });
    
    var userId = api.deviceId;
    var network = api.connectionType;
    
	var model = api.require('model');   
	model.config({
	  appId:'A6960480793365',
	  appKey:'D243D208-BE23-8FFC-54D2-57BB1E6BD5CF',
	  host:'https://d.apicloud.com'
	});
	
	var query = api.require('query');
	query.createQuery(function(ret, err){
		if(ret && ret.qid){
			var queryId = ret.qid;
			if(type=="load"){
				query.skip({qid:queryId, value:(page-1)*10});
			}
			query.whereEqual({qid:queryId, column:"uid", value:userId})
			query.limit({qid:queryId, value:10});
			query.desc({qid:queryId, column:"createdAt"});
			model.findAll({class:"favorites", qid:queryId}, function(ret, err){
				if(ret){
					var pageHtml = "";
					
					if(ret.length<=0){
						api.toast({
						    msg: '没有更多内容了',
						    duration:2000,
						    location: 'bottom'
						});
					}
					else{
						$.each(ret,function(index,item){
                			if(network == "wifi"){
								var getTpl = $api.html($api.byId("pageTpl"));
								laytpl(getTpl).render(item, function(html){
								    pageHtml = pageHtml + html;
								});
							}
							else{
								if($api.getStorage('showImgOn3G') == "true"){
									var getTpl = $api.html($api.byId("pageTpl"));
									laytpl(getTpl).render(item, function(html){
									    pageHtml = pageHtml + html;
									});
								}
								else{
									var getTpl = $api.html($api.byId("pageTplNoImg"));
									laytpl(getTpl).render(item, function(html){
									    pageHtml = pageHtml + html;
									});
								}
							}
                		});
                		
                		$api.append($api.byId("personalCenter"),pageHtml);
	            		
	            		if(type=="load"){
	            			page++
	            		}
	            		else{
	            			page = 2;
	            		}
						
					}
					
					api.refreshHeaderLoadDone();
					api.hideProgress();
				}
				else{}
			});
		}
	});
}

//刷新收藏列表
function refreshFavoritesData(){
	$api.html($api.byId("personalCenter"),"");
	loadFavoritesData();
}

//添加收藏
function createFavorites(el){

	api.showProgress({
        title: '收藏中...',
        modal: false
    });
    
    var itemId = $api.attr(el,'itemId');
    var userId = api.deviceId;
	
	var model = api.require('model');   
	model.config({
	  appId:'A6960480793365',
	  appKey:'D243D208-BE23-8FFC-54D2-57BB1E6BD5CF',
	  host:'https://d.apicloud.com'
	});
    
    var query = api.require('query');
    query.createQuery(function(ret, err){
    	if(ret && ret.qid){
    		var queryId = ret.qid;
    		query.whereEqual({qid:queryId,column:"tid",value:itemId});
    		query.whereEqual({qid:queryId,column:"uid",value:userId});
    		model.findAll({class:"favorites", qid:queryId}, function(ret, err){
    			if(ret.length<=0){
    				$.ajax({
						type:"get",
						url:"http://apis.haoservice.com/lifeservice/cook/queryid",
						data:{
							"key":appKey,
							"id":itemId
						},
						dataType:"json",
						success:function(ret){
							if(ret.error_code==0){

								model.insert({
									class:"favorites",
									value:{
										tid:ret.result.id,
										title:ret.result.title,
										tags:ret.result.tags,
										albums:ret.result.albums,
										uid:userId
									}
								}, function(ret, err){
									if(ret && ret.id){
										api.toast({
										    msg: '收藏成功，请刷新收藏页面查看。',
										    duration:2000,
										    location: 'bottom'
										});
									}
									else{
										api.toast({
										    msg: '收藏失败',
										    duration:2000,
										    location: 'bottom'
										});
									}
								});
								
							}
							else{
								api.toast({
								    msg: '收藏失败',
								    duration:2000,
								    location: 'bottom'
								});
							}
									
						},
						error:function(err){
							api.toast({
							    msg: '收藏失败',
							    duration:2000,
							    location: 'bottom'
							});
						}
					});
    			}
    			else{
    				api.toast({
					    msg: '您已收藏过该信息',
					    duration:2000,
					    location: 'bottom'
					});
    			}
    		});
			api.hideProgress();
    	}
    });
}

//取消收藏
function delFavorites(el){
	api.showProgress({
        title: '取消收藏中...',
        modal: false
    });
    
    var itemId = $api.attr(el,'itemId');
    
    var model = api.require('model');   
	model.config({
	  appId:'A6960480793365',
	  appKey:'D243D208-BE23-8FFC-54D2-57BB1E6BD5CF',
	  host:'https://d.apicloud.com'
	});
	
	var query = api.require('query');
	query.createQuery(function(ret, err){
		if(ret && ret.qid){
			var queryId = ret.qid;
    		model.deleteById({class:"favorites",id:itemId},function(ret,err){
    			if(!err){
	    			api.toast({
					    msg: '取消收藏成功',
					    duration:2000,
					    location: 'bottom'
					});
    			}
    			else{
	    			api.toast({
					    msg: '取消收藏失败',
					    duration:2000,
					    location: 'bottom'
					});
    			}
    		});
    		
    		api.hideProgress();
    		refreshFavoritesData();
		}
	});
	
	
}

//跳转详细内容页面
function openDetail(el){
	var id = $api.attr(el,'itemId');
	
	if(id){
        openWin("detail","detail.html",{id:id});
    }
}

//跳转分类列表页面
function openList(el){
	var cid = $api.attr(el,'cid');
	
	if(cid){
        openWin("list","list.html",{cid:cid});
    }
}