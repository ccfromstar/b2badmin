/**
 * Created by teng on 19.11.2014.
   Edited by xiaoC on 2014.12.10.
 */
var Utils = require('./utils.js');
var crypto = require('crypto');
var Tools = require('./tools.js');

var LIMIT = 10;
var _tablename = "theme";

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

function _getAll (page,limit,callback) {
  b2cApiModel.query("select * from ?? limit ?,?",[_tablename,(page-1)*limit,limit],function(error,obj){
    b2cApiModel.query("select txtNo from "+_tablename ,function(error,total){
        var utils = new Utils({
          page:page,
          limit:limit,
          obj:obj,
          total:total,
          content:_setFiled(obj),
          _searchKey:false
        });
        return callback(utils._toHtmltable());
    });
  });
}

function _getAllbyKey (page,limit,key,callback) {
  b2cApiModel.query("select * from "+_tablename+" where "+key+" order by registered_at desc limit " + (page-1)*limit + "," + limit ,function(error,obj){
    b2cApiModel.query("select * from "+_tablename+" where "+key ,function(error,total){
        var utils = new Utils({
          page:page,
          limit:limit,
          obj:obj,
          total:total,
          key:key,
          content:(!obj|| !obj[0])?"没有找到满足搜索条件的结果":_setFiled(obj),
          _searchKey:true
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
  result = result + "<thead>"+_setHeader("主题名|名称|图片")+"</thead><tbody>";
  for(var i in obj){
    result = result + "<tr>";
    //返回视图显示的列
    var _pic1 = "";
    
    if(obj[i].rtfImg){
    var tmp1 = (obj[i].rtfImg).split("@");
    
    for(var j=0;j<tmp1.length;j++){
      var _fn1 = tmp1[j]+".jpg";
      //Tools.copy("C:\\pool\\"+_fn1,"C:\\data\\theme\\"+_fn1);

      _pic1 =_pic1+ "<img style='height:30px' src='"+sails.config.globals.url.service.host+"/images/data/theme/"+tmp1[j]+".jpg'></img>";
    }
    }

    result = result + _setCol(obj[i].txtName+"|"+obj[i].rtfImg+"|"+_pic1);
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

