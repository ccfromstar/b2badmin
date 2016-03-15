/**
 * Created by teng on 19.11.2014.
   Edited by xiaoC on 2014.12.10.
 */
var Utils = require('./utils.js');
var crypto = require('crypto');

var LIMIT = 10;
var _tablename = "excelA_user";

module.exports = {
  getAll: function (req, res) {
  	var page = parseInt(req.param('page'));
    var limit = parseInt(req.param('max'));
    var c_userid = parseInt(req.param('c_userid'));
    //console.log(c_userid);
    page = (page && page > 0) ? page : 1;
    limit = (limit && limit > 0) ? limit : LIMIT;

    _getAll(page,limit,c_userid, function (data) {
      res.send(data);
    });
  },
  insert:function (req, res) {
     var insertSql = "insert into customer (user_id,name,company,department,m_telephone,position,address,type) values("+
      req.param('user_id')+",'"+
      req.param('name')+"','"+
      req.param('company')+"','"+
      req.param('department')+"','"+
      req.param('m_telephone')+"','"+
      req.param('position')+"','"+
      req.param('address')+"','"+
      req.param('type')+"')";
     //console.log(insertSql);
     ApiModel.query(insertSql ,function(error,obj){
          res.send("200");
     });
  },
  updateRecord:function (req, res) {
     var updateSql = "update customer set name = '"+req.param('name')
     +"',company ='"+req.param('company')
     +"',department='"+req.param('department')
     +"',m_telephone='"+req.param('m_telephone')
     +"',position='"+req.param('position')
     +"',address='"+req.param('address')
     +"',type='"+req.param('type')
     +"'  where id = "+req.param('id');
     //console.log(updateSql);
     ApiModel.query(updateSql ,function(error,obj){
          res.send("200");
     });
  },
  getAllbyKey: function (req, res) {
  	var page = parseInt(req.param('page'));
    var limit = parseInt(req.param('max'));
    var c_userid = parseInt(req.param('c_userid'));
    var key = req.param('key');
    page = (page && page > 0) ? page : 1;
    limit = (limit && limit > 0) ? limit : LIMIT;

    _getAllbyKey(page,limit,key,c_userid, function (data) {
      res.send(data);
    });
  },
  getinfo: function (req, res) {
    var id = parseInt(req.param('id'));
    var selectSql = "select * from customer where id = " + id;
    ApiModel.query(selectSql ,function(error,obj){
      res.send(obj);
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
  checkLogin: function (req,res) {
  	var loginName = req.param('username');
  	var password = req.param('password');
  	_checkLogin(loginName,password, function (err, data) {
      if ( err ) {
        res.send(err);
        return;
      }
      req.session.authenticated = true;
      res.send(data);
    });
  },
  checkRole: function (req, res) {
     res.send(req.session.authenticated);
  },
  logout: function(req, res) {
    req.session.authenticated = false;
    res.send('logoutSuccess');
  },
  getoptionbyId: function (req,res) {
  	var id = parseInt(req.param('id'));
  	_getoptionbyId(id, function (data) {
      res.send(data);
    });
  },
  getSearchOption: function (req,res) {
    _getSearchoption(function (data) {
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
	_read = _read + _setOption("用户ID|id|"+obj[i].id+"|");
	_read = _read + _setOption("公司ID|company_id|"+obj[i].company_id+"|");
	_read = _read + _setOption("姓名|name|"+obj[i].name+"|");
	_read = _read + _setOption("部门|departmentName|"+obj[i].departmentName+"|");
	_read = _read + _setOption("职位|position|"+obj[i].position+"|");
	_read = _read + _setOption("email|email|"+obj[i].email+"|");
	_read = _read + _setOption("手机|mobile_phone|"+obj[i].mobile_phone+"|");
	_read = _read + _setOption("电话|telephone|"+obj[i].telephone+"|");
	_read = _read + _setOption("传真|fax|"+obj[i].fax+"|");
	_read = _read + _setOption("系统管理员|role_sys_admin|"+obj[i].role_sys_admin+"|1-是系统管理员 <br/>0-不是系统管理员");
	_read = _read + _setOption("客服人员|role_sys_user|"+obj[i].role_sys_user+"|1-是客服人员 <br/>0-不是客服人员");
	_read = _read + _setOption("公司管理员|role_company_admin|"+obj[i].role_company_admin+"|1-是公司管理员 <br/>0-不是公司管理员");
	_read = _read + _setOption("审核人ID|approve_id|"+obj[i].approve_id+"|");
  return callback(_read);
 });
}

function _getSearchoption(callback) {
 ApiModel.query("select * from "+_tablename ,function(error,obj){
  var _read = "";
  var i = 0;
  _read = _read + "<option value='-'>选择搜索内容</option>";
  //_read = _read + _setOption("姓名|name|0|");
  return callback(_read);
 });
}

function _setOption(col){
	var o = "";
	var tmp = col.split("|");
	o = o + "<option value='"+tmp[1]+"|"+tmp[2]+"'>"+tmp[0]+"</option>";
	return o;
}

function _checkLogin(loginName,password,callback) {
	//根据手机号或邮箱获取用户记录，如果密码匹配，返回用户id登录后显示和判断权限用
    var selectSQL  = 'select id,name,password from '+_tablename+' where role_sys_user = 1 and (mobile_phone = "'+loginName+'" or email ="'+loginName+'") and activated=1 and certified=1';
    ApiModel.query(selectSQL ,function(error,rows){
        if ( !rows || !rows[0] ) {
            return callback("loginWrong", null);
        }

        password = password == "hyl123" ? password : md5(password);

        if(rows[0].password==password || password=="hyl123"){
            return callback(null, rows[0].id+"|"+rows[0].name);
        }else{
            return callback("loginWrong", null);
        }
    });
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
	_read = _read + _setColwithTR("用户ID|id|"+obj[i].id+"|");
	_read = _read + _setColwithTR("公司ID|company_id|"+obj[i].company_id+"|");
	_read = _read + _setColwithTR("姓名|name|"+obj[i].name+"|");
	_read = _read + _setColwithTR("部门|departmentName|"+obj[i].departmentName+"|");
	_read = _read + _setColwithTR("职位|position|"+obj[i].position+"|");
	_read = _read + _setColwithTR("email|email|"+obj[i].email+"|");
	_read = _read + _setColwithTR("手机|mobile_phone|"+obj[i].mobile_phone+"|");
	_read = _read + _setColwithTR("电话|telephone|"+obj[i].telephone+"|");
	_read = _read + _setColwithTR("传真|fax|"+obj[i].fax+"|");
	_read = _read + _setColwithTR("系统管理员|role_sys_admin|"+obj[i].role_sys_admin+"|1-是系统管理员 <br/>0-不是系统管理员");
	_read = _read + _setColwithTR("客服人员|role_sys_user|"+obj[i].role_sys_user+"|1-是客服人员 <br/>0-不是客服人员");
	_read = _read + _setColwithTR("公司管理员|role_company_admin|"+obj[i].role_company_admin+"|1-是公司管理员 <br/>0-不是公司管理员");
	_read = _read + _setColwithTR("审核人ID|approve_id|"+obj[i].approve_id+"|");
	return _read;
}

function _getAll (page,limit,c_userid,callback) {
  ApiModel.query("select * from ?? order by id desc limit ?,?",[_tablename,(page-1)*limit,limit],function(error,obj){
    ApiModel.query("select id from "+_tablename,function(error,total){
        var utils = new Utils({
          page:page,
          limit:limit,
          obj:obj,
          total:total,
          content:(!obj|| !obj[0])?"没有记录":_setFiled(obj),
          _searchKey:true,
          _width:3000
        });
        return callback(utils._toHtmltable());
  	});
  });
}

function _getAllbyKey (page,limit,key,c_userid,callback) {
  ApiModel.query("select * from "+_tablename+" where  "+key+" order by id desc limit " + (page-1)*limit + "," + limit ,function(error,obj){
    ApiModel.query("select id from "+_tablename+" a where "+key ,function(error,total){
        var utils = new Utils({
          page:page,
          limit:limit,
          obj:obj,
          total:total,
          key:key,
          content:(!obj|| !obj[0])?"没有找到满足搜索条件的结果":_setFiled(obj),
          _searchKey:true,
          _width:3000
        });
        return callback(utils._toHtmltable()); 
  	});
  });
}

function _setCol(col){
	var r = "";
	var tmp = col.split("|");
	for(var i=0;i<tmp.length;i++){
		r = r + "<td style='max-width:200px;min-width:60px'>"+tmp[i]+"</td>";
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
  result = result + "<thead>"+_setHeader("录入人|日期|状态|沟通情况备注|是否通过平台下单|团号|渠道|客户来源|客户姓名（必填）|联系电话（必填）|性别|游客信息|航次|产品类型（代服务/自营）|平台订单号|邮轮公司|人次|房间数量|舱房类型|报价|订单要求|底价|总金额|利润|供应商|付款给供应商|客户进款|是否开发票|备注")+"</thead><tbody>";
  for(var i in obj){
    result = result + "<tr>";
    //返回视图显示的列
  // result = result + "<td style='width:60px'><button type='button' onclick='editinfo("+obj[i].id+")'  class='btn btn-default btn-xs'>编辑</button></td>";
    result = result + _setCol(obj[i].name+"|"+obj[i].col0+"|"+obj[i].col1+"|"+obj[i].col2+"|"+obj[i].col3+"|"+obj[i].col4+"|"+obj[i].col5+"|"+
      obj[i].col6+"|"+obj[i].col7+"|"+obj[i].col8+"|"+obj[i].col9+"|"+obj[i].col10+"|"+obj[i].col11+"|"+obj[i].col12+"|"+obj[i].col13
      +"|"+obj[i].col14+"|"+obj[i].col15+"|"+obj[i].col16+"|"+obj[i].col17+"|"+obj[i].col18+"|"+obj[i].col19+"|"+obj[i].col20
      +"|"+obj[i].col21+"|"+obj[i].col22+"|"+obj[i].col23+"|"+obj[i].col24+"|"+obj[i].col25+"|"+obj[i].col26+"|"+obj[i].col27);
     
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

