module.exports = Utils;

function Utils(utils) {
	this.page = utils.page;       //页数，从1开始
	this.limit = utils.limit;     //每页记录数
	this.obj = utils.obj;         //limit限制后的结果集
	this.total = utils.total;     //limit没有限制的结果集
	this.key = utils.key;      	  //查询条件语句
	this.content = utils.content; //HTML字段内容
	this._searchKey = utils._searchKey;
	this._width = utils._width;
}

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

Utils.prototype._toHtmltable = function _toHtmltable() {
	//把json数据在后台转换为html表格后通过ajax接口传到客户端，可以防止别人通过请求直接拿到我们的json数据，因为是带有html格式的
	var page = this.page;
	var limit = this.limit;
	var obj = this.obj;
	var total = this.total;
	var key = this.key;
	var content = this.content;
	var _searchKey = this._searchKey;
	var _width = this._width;
	var result = "";
	var m_width = 945;
	//Search
	var _key = key?key:"";
	if(_searchKey){
		//result = result + "<td><input type='text' class='form-control' id='search_sql' placeholder='请输入您要查询的内容' value='"+_key+"'></input></td>";
		result = result + "<table id='_searchBtn' style='margin-top:5px;'><tr>";
		result = result + "<td id='_newtd' style='display:none;padding-right:5px'><button type='button' id='_new' style='display:none' class='btn btn-default btn-xs'><span style='padding-right:5px' class='glyphicon glyphicon-plus'></span>新建</button></td>";
		result = result + "<td ><button type='button' onclick='_search(1);' class='btn btn-default btn-xs'><span style='padding-right:5px' class='glyphicon glyphicon-search'></span>搜索</button></td>";
		result = result + "<td style='padding-left:5px'><button type='button' onclick='_getAll();' class='btn btn-default btn-xs'><span style='padding-right:5px' class='glyphicon glyphicon-list'></span>查看全部</button></td>";
		result = result + "<td style='padding-left:5px'><button id='refresh' type='button' onclick='toPage("+page+");' class='btn btn-default btn-xs'><span style='padding-right:5px' class='glyphicon glyphicon-refresh'></span>刷新</button></td>";
		result = result + "</tr></table>";
	}
	//Pageer
	var totalpage = Math.ceil((total.length)/limit);
	var isFirstPage = page == 1 ;
	if(!obj){console.log("obj not!");}
	if(!total){console.log("total not!");}
	var isLastPage = ((page -1) * limit + obj.length) == total.length;

	var previous_css = isFirstPage?"disabled":"";
	var next_css = isLastPage?"disabled":"";

	var previous_click = isFirstPage?"":"onclick='toPage("+(page-1)+");'";
	var next_click = isLastPage?"":"onclick='toPage("+(page+1)+");'";

	//result = result + "<ul class='pager'>";
	//result = result + "<li class='"+previous_css+"'><a href='#' "+previous_click+">上一页</a></li>";
	//result = result + "<li class='"+next_css+"'><a href='#' "+next_click+">下一页</a></li>";
	//result = result + "</ul>";
	_width = _width?_width:m_width;
	result = result + "<div style='width:"+_width+"px'>";
	result = result + "<table style='margin-top:5px;' class='table table-striped table-bordered'>";
	result = result + content;
	result = result + "</tbody></table></div>";
	result = result + "<div style='width:100%;text-align:center'>";
	result = result + "<button type='button' "+previous_click+" "+previous_css+" class='btn btn-default btn-xs'><span class='glyphicon glyphicon-chevron-left'></span></button>";
	result = result + " 当前第"+page+"页/共"+totalpage+"页&nbsp;"+total.length+"条数据 ";
	result = result + "<button type='button' "+next_click+" "+next_css+" class='btn btn-default btn-xs'><span class='glyphicon glyphicon-chevron-right'></span></button>";
	result = result + "</div>";

	return result;
}

