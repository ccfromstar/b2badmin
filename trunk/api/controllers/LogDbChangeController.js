/**
 * Created by teng on 19.11.2014.
   Edited by xiaoC on 2014.12.10.
 */
var Utils = require('./utils.js');
var crypto = require('crypto');

var LIMIT = 10;
var _tablename = "log_db_change";

module.exports = {
  getAll: function (req, res) {
  	var page = parseInt(req.param('page'));
    var limit = parseInt(req.param('max'));
    page = (page && page > 0) ? page : 1;
    limit = (limit && limit > 0) ? limit : LIMIT;

    _getAll(page,limit, function (data) {
      res.send(data);
    });
  },
  getAllbyKey: function (req, res) {
  	var page = parseInt(req.param('page'));
    var limit = parseInt(req.param('max'));
    var key = req.param('key');
    page = (page && page > 0) ? page : 1;
    limit = (limit && limit > 0) ? limit : LIMIT;

    _getAllbyKey(page,limit,key, function (data) {
      res.send(data);
    });
  },
  getbyId: function (req,res) {
  	var id = parseInt(req.param('id'));
  	_getbyId(id, function (data) {
      res.send(data);
    });
  },
  update: function (req,res) {
  	var columnname = req.param('columnname');
  	var oldvalue = req.param('oldvalue');
  	var newvalue = req.param('newvalue');
  	var editorid = req.param('editorid');
  	var id = parseInt(req.param('id'));
  	_update(columnname,oldvalue,newvalue,editorid,id, function (data) {
      res.send(data);
    });
  },
  getoptionbyId: function (req,res) {
  	var id = parseInt(req.param('id'));
  	_getoptionbyId(id, function (data) {
      res.send(data);
    });
  }
}

/**
 * md5 加密
 * @param data
 * @returns {string}
 */
function md5(data) {
    return crypto.createHash('md5').update(data).digest('hex').toUpperCase();
}

function _getoptionbyId(id,callback) {
  ApiModel.query("select * from "+_tablename+" where id = "+id ,function(error,obj){
    var _read = "";
  var i = 0;
  _read = _read + "<option value='-'>选择字段</option>";
  _read = _read + _setOption("公司ID|id|"+obj[i].id+"|");
  _read = _read + _setOption("公司全称|name|"+obj[i].name+"|");
  _read = _read + _setOption("公司简称|short_name|"+obj[i].short_name+"|");
  _read = _read + _setOption("城市|city|"+obj[i].city+"|");
  _read = _read + _setOption("地址|address|"+obj[i].address+"|");
  _read = _read + _setOption("区号|telephone_area_code|"+obj[i].telephone_area_code+"|");
  _read = _read + _setOption("电话|telephone|"+obj[i].telephone+"|");
  _read = _read + _setOption("传真|fax|"+obj[i].fax+"|");
  _read = _read + _setOption("logo|logo|"+obj[i].logo+"|<img src='http://www.huiyoulun.com/files/"+obj[i].logo+"' style='width:100px' alt='没有图片'>");
  _read = _read + _setOption("开户行|bank|"+obj[i].bank+"|");
  _read = _read + _setOption("账号|account_number|"+obj[i].account_number+"|");
  _read = _read + _setOption("账户名|account_name|"+obj[i].account_name+"|");
  _read = _read + _setOption("是否是卖家|role_seller|"+obj[i].role_seller+"|1-卖家<br/>0-买家");
  return callback(_read);
  });
}

function _setOption(col){
  var o = "";
  var tmp = col.split("|");
  o = o + "<option value='"+tmp[1]+"|"+tmp[2]+"'>"+tmp[0]+"</option>";
  return o;
}

function _update(columnname,oldvalue,newvalue,editorid,id,callback) {
  var updateSQL = "update "+_tablename+" set "+ columnname + "='" + newvalue + "' where id = " + id;
  ApiModel.query(updateSQL,function(error,res){
  	  //创建修改记录
  	  var insertSQL = "insert into log_db_change (user_id,table_name,column_name,old_value,new_value,time) values ("+editorid+",'"+_tablename+"','"+columnname+"','"+oldvalue+"','"+newvalue+"',now())";
  	  ApiModel.query(insertSQL,function(error,res1){
      	return callback(res1);
  	  });
  });
}

function _getbyId(id,callback) {
  ApiModel.query("select * from "+_tablename+" where id = "+id ,function(error,obj){
      return callback(_createtable(obj));
  });
}

function _createtable(obj) {
	//查看时候的HTML字段内容
	var _read = "";
	var i = 0;
	_read = _read + _setHeader("名称|字段名|数据|备注");
	_read = _read + _setColwithTR("公司ID|id|"+obj[i].id+"|");
	_read = _read + _setColwithTR("公司全称|name|"+obj[i].name+"|");
	_read = _read + _setColwithTR("公司简称|short_name|"+obj[i].short_name+"|");
  _read = _read + _setColwithTR("城市|city|"+obj[i].city+"|");
  _read = _read + _setColwithTR("地址|address|"+obj[i].address+"|");
  _read = _read + _setColwithTR("区号|telephone_area_code|"+obj[i].telephone_area_code+"|");
  _read = _read + _setColwithTR("电话|telephone|"+obj[i].telephone+"|");
  _read = _read + _setColwithTR("传真|fax|"+obj[i].fax+"|");
  _read = _read + _setColwithTR("logo|logo|"+obj[i].logo+"|<img src='http://www.huiyoulun.com/files/"+obj[i].logo+"' style='width:100px' alt='没有图片'>");
  _read = _read + _setColwithTR("开户行|bank|"+obj[i].bank+"|");
  _read = _read + _setColwithTR("账号|account_number|"+obj[i].account_number+"|");
  _read = _read + _setColwithTR("账户名|account_name|"+obj[i].account_name+"|");
  _read = _read + _setColwithTR("是否是卖家|role_seller|"+obj[i].role_seller+"|1-卖家<br/>0-买家");
	return _read;
}

function _getAll (page,limit,callback) {
  ApiModel.query("select a.*,b.name from "+_tablename+" a LEFT JOIN user b ON a.user_id = b.id order by time desc limit " + (page-1)*limit + "," + limit  ,function(error,obj){
    ApiModel.query("select * from "+_tablename ,function(error,total){
      var utils = new Utils({
      		page:page,
      		limit:limit,
      		obj:obj,
      		total:total,
      		content:(!obj|| !obj[0])?"没有数据维护记录":_setFiled(obj)
      });
      return callback(utils._toHtmltable());
  	});
  });
}

function _getAllbyKey (page,limit,key,callback) {
  ApiModel.query("select * from "+_tablename+" where "+key+" limit " + (page-1)*limit + "," + limit ,function(error,obj){
    ApiModel.query("select * from "+_tablename+" where "+key ,function(error,total){
      var utils = new Utils({
      		page:page,
      		limit:limit,
      		obj:obj,
      		total:total,
      		key:key,
      		content:_setFiled(obj)
      });
      return callback(utils._toHtmltable());
  	});
  });
}

function _setCol(col){
	var r = "";
	var tmp = col.split("|");
	for(var i=0;i<tmp.length;i++){
		r = r + "<td>"+tmp[i]+"</td>";
	}
	return r;
}

function _setColwithTR(col){
	var r = "<tr>";
	var tmp = col.split("|");
	for(var i=0;i<tmp.length;i++){
		r = r + "<td>"+tmp[i]+"</td>";
	}
	r = r + "</tr>";
	return r;
}

function _setHeader(header){
	var r = "";
	var tmp = header.split("|");
	r = r + "<tr>"
	for(var i=0;i<tmp.length;i++){
		r = r + "<th>"+tmp[i]+"</th>";
	}
	r = r + "</tr>";
	return r;
}

function _setFiled(obj){
	var result = "";
	result = result + "<thead>"+_setHeader("修改人|表名|字段名|旧值|新值|修改日期")+"</thead><tbody>";
	for(var i in obj){
		result = result + "<tr>";
		//返回视图显示的列
		result = result + _setCol(obj[i].name+"|"+obj[i].table_name+"|"+obj[i].column_name+"|"+obj[i].old_value+"|"+obj[i].new_value+"|"+(new Date(obj[i].time)).Format("yyyy-MM-dd hh:mm:ss"));
		result = result + "</tr>";
	}
	return result;
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

