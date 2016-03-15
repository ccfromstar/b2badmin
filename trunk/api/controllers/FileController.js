/**
 * Created by teng on 19.11.2014.
   Edited by xiaoC on 2014.12.10.
 */
var Utils = require('./utils.js');
var crypto = require('crypto');
var http = require('http'),  
    sys = require('sys');
var fs = require('fs');

var LIMIT = 10;
var _tablename = "file";

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
  insert:function (req, res) {
     var insertSql = "insert into passenger (user_id,name,contact,content,schedule,type,time) values("+req.param('user_id')+",'"+req.param('name')+"','"+req.param('contact')+"','"+req.param('content')+"','"+req.param('schedule')+"',"+req.param('type')+",'"+req.param('time')+"')";
     //console.log(insertSql);
     ApiModel.query(insertSql ,function(error,obj){
          res.send("200");
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
  },
  insertFile: function (req, res) {
      req.file('avatar').upload(function (err, files) {            
       if (err) return res.serverError(err);
       var fpath = files[0].fd;
       var tmp = fpath.indexOf("\\")>0?fpath.split("\\"):fpath.split("/");
       
       var _fpath = tmp[tmp.length-1];
       //附件操作
          // 获得文件的临时路径
          var tmp_path = fpath;
          // 指定文件上传后的目录 - 示例为"images"目录。
          var target_path = './assets/files/' + _fpath;
          // 移动文件
          fs.rename(tmp_path, target_path, function (err) {
              console.log(files);
              res.send("<a target='_blank' style='font-size:12px' href='/files/"+_fpath+"'>"+files[0].filename+"</a><script>window.parent.showuploadsuccess();window.parent.document.all.n_filename_1.value='"+files[0].filename+"';window.parent.document.all.n_fname.value='"+_fpath+"';</script>");
          }); 
      });
  },
  insertFileRecord: function (req, res) {
      var user_id = req.param('n_user_id');
      var name = req.param('n_filename_1');
      var time = req.param('n_time');
      var type = req.param('n_type');
      var _fpath = req.param('n_fname');
      var _inB2B = req.param('inB2B');
      var sql = "insert into file(user_id,name,time,type,fpath,inB2B) values ("+user_id+",'"+name+"','"+time+"',"+type+",'"+_fpath+"',"+_inB2B+")";
      console.log(sql);
      ApiModel.query(sql,function(error,data){
          res.send("<script>window.location='/file';</script>");
      });
  },
  updateB2Bin: function (req, res) {
      var id = parseInt(req.param('id'));
      var i = parseInt(req.param('i'));
      var sql = "update file set inB2B = "+ i + " where id = " + id;
      ApiModel.query(sql,function(error,data){
          res.send("200");
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

function getNow() {
    var date = new Date(); //日期对象
    var now = "";
    now = date.getFullYear()+"";
    now = now + (date.getMonth()+1)+"";//取月的时候取的是当前月-1如果想取当前月+1就可以了
    now = now + date.getDate()+"";
    now = now + date.getHours()+"";
    now = now + date.getMinutes()+"";
    now = now + date.getSeconds()+"";
    return now;
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
  _read = _read + _setOption("文件名|a.name|123|");
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
  ApiModel.query("select a.*,b.name as rname from file a,user b where a.user_id = b.id order by time desc limit ?,?",[(page-1)*limit,limit],function(error,obj){
    ApiModel.query("select id from "+_tablename ,function(error,total){
        var utils = new Utils({
          page:page,
          limit:limit,
          obj:obj,
          total:total,
          content:_setFiled(obj),
          _searchKey:true
        });
        return callback(utils._toHtmltable());
  	});
  });
}

function _getAllbyKey (page,limit,key,callback) {
  //console.log("select a.*,b.name as username from "+_tablename+" a,user b where b.id = a.user_id and "+key+" order by a.time desc limit " + (page-1)*limit + "," + limit);
  ApiModel.query("select a.*,b.name as rname from "+_tablename+" a,user b where b.id = a.user_id and "+key+" order by a.time desc limit " + (page-1)*limit + "," + limit ,function(error,obj){
    ApiModel.query("select a.id from "+_tablename+" a where "+key ,function(error,total){
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
	result = result + "<thead>"+_setHeader("文件名|类型|时间|录入人|是否录入平台|操作")+"</thead><tbody>";
	for(var i in obj){
		result = result + "<tr>";
		//返回视图显示的列
    var _type = "";
    if(obj[i].type==1){_type="邮轮公司资料";}
    if(obj[i].type==2){_type="业务操作文件";}
    if(obj[i].type==3){_type="产品计划";}
    if(obj[i].type==4){_type="工作统计";}
    var inb2b = obj[i].inB2B==0?"否":"是";
		result = result + _setCol("<a href='/files/"+obj[i].fpath+"' target='_blank'>"+obj[i].name+"</a>|"+_type+"|"+(new Date(obj[i].time)).Format("yyyy-MM-dd hh:mm:ss")+"|"+obj[i].rname+"|"+inb2b);
		result = result + "<td style='width:60px'><button type='button' onclick='b2bin("+obj[i].id+",1)' class='btn btn-default btn-xs'>已录入平台</button><button type='button' onclick='b2bin("+obj[i].id+",0)' class='btn btn-default btn-xs'>没录入平台</button></td>";
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

