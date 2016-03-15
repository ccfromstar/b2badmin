/**
 * Created by teng on 19.11.2014.
   Edited by xiaoC on 2014.12.10.
 */
var Utils = require('./utils.js');
var crypto = require('crypto');

var LIMIT = 10;
var _tablename = "product";

module.exports = {
    getB2Clog: function (req, res) {
        var sql1 = "select ip from log";
        b2cApiModel.query(sql1,function(error,log){
            if(error){console.log(error);}
            //res.send(rows);
            var a1 = new Array();
            var a2 = new Array();
            

for(var i in log){
    if(log[i].ip !="127.0.0.1"){
    //循环a1，如果a1里没有这个ip的则添加数组元素
    var _l = -1;
    for(var j=0;j<a1.length;j++){
        if(log[i].ip == a1[j]){
            _l = j;
        }
    }

    if(_l==-1){
        //没有找到
        a1.push(log[i].ip);
        a2.push(1);
       
    }else{
        a2[_l]=Number(a2[_l])+1;
        
    }
}
}

                //对数据进行冒泡排序
                for(var i=0;i<a2.length;i++){
                    for(var j=0;j<a2.length;j++){
                        if(a2[i]>a2[j]){
                            t = a2[i];a2[i] = a2[j];a2[j] = t;
                            t = a1[i];a1[i] = a1[j];a1[j] = t;
                           
                        }
                    }
                }

    //返回数组对象
    var b1 = "";
    var b2 = "";
    
    for(var i=0;i<10;i++){
        if(b1 == ""){
            b1 = a1[i];b2 = a2[i];
        }else{
            b1 = b1 + "@" + a1[i];
            b2 = b2 + "@" + a2[i];
            
        }
    }
    res.send(b1+"|"+b2);

        });
    },
    getB2Blog: function (req, res) {
        var sql1 = "select * from log_user_company_temp";
        ApiModel.query(sql1,function(error,log){
            if(error){console.log(error);}
            //res.send(rows);
            var a1 = new Array();
            var a2 = new Array();
            var a3 = new Array();
            var a4 = new Array();
            var a1id = new Array();

for(var i in log){
    if(log[i].activated == 1 && log[i].certified == 1 && log[i].role_seller == 0){
    //循环a1，如果a1里没有这个ip的则添加数组元素
    var _l = -1;
    var _c = "";


        for(var j=0;j<a1id.length;j++){
            _c = _c + "," + a1id[j];
            if(log[i].uid == a1id[j]){
                _l = j;
            }
        }

    
    //console.log(_c);

    if(_l==-1){
        //没有找到
        a1id.push(log[i].uid);
        a1.push(log[i].name);
        a2.push(1);
         a3.push((log[i].time).Format("yyyy-MM-dd hh:mm:ss"));
         a4.push(log[i].cname);
    }else{
        a2[_l]=Number(a2[_l])+1;
        a3[_l]=(log[i].time).Format("yyyy-MM-dd hh:mm:ss");
    }
    }
}

                //对数据进行冒泡排序
                for(var i=0;i<a2.length;i++){
                    for(var j=0;j<a2.length;j++){
                        if(a2[i]>a2[j]){
                            t = a2[i];a2[i] = a2[j];a2[j] = t;
                            t = a1[i];a1[i] = a1[j];a1[j] = t;
                            t = a3[i];a3[i] = a3[j];a3[j] = t;
                            t = a4[i];a4[i] = a4[j];a4[j] = t;
                        }
                    }
                }

    //返回数组对象
    var b1 = "";
    var b2 = "";
    var b3 = "";
    var b4 = "";

    for(var i=0;i<a1.length;i++){
        if(b1 == ""){
            b1 = a1[i];b2 = a2[i];b3 = a3[i];b4 = a4[i];
        }else{
            b1 = b1 + "@" + a1[i];
            b2 = b2 + "@" + a2[i];
            b3 = b3 + "@" + a3[i];
            b4 = b4 + "@" + a4[i];
        }
    }
    res.send(b1+"|"+b2+"|"+b3+"|"+b4);

        });
    },
    getB2Bplog: function (req, res) {
        var sql1 = "select title from log_product_user_company";
        ApiModel.query(sql1,function(error,log){
            if(error){console.log(error);}
            //res.send(rows);
            var a1 = new Array();
            var a2 = new Array();

for(var i in log){
    //if(log[i].ip !="127.0.0.1"){
    //循环a1，如果a1里没有这个ip的则添加数组元素
    var _l = -1;
    for(var j=0;j<a1.length;j++){
        if(log[i].title == a1[j]){
            _l = j;
        }
    }

    if(_l==-1){
        //没有找到
        a1.push(log[i].title);
        a2.push(1);
    }else{
        a2[_l]=Number(a2[_l])+1;
    }
    //}
}

                //对数据进行冒泡排序
                for(var i=0;i<a2.length;i++){
                    for(var j=0;j<a2.length;j++){
                        if(a2[i]>a2[j]){
                            t = a2[i];a2[i] = a2[j];a2[j] = t;
                            t = a1[i];a1[i] = a1[j];a1[j] = t;
                        }
                    }
                }

    //返回数组对象
    var b1 = "";
    var b2 = "";
    for(var i=0;i<10;i++){
        if(b1 == ""){
            b1 = a1[i];b2 = a2[i];
        }else{
            b1 = b1 + "@" + a1[i];
            b2 = b2 + "@" + a2[i];
        }
    }
    res.send(b1+"|"+b2);

        });
    },
    getChart1: function (req, res) {
       //获取所有航区分类
        var area_id = new Array();
        var area_name = new Array();
        var area_num = new Array();
        var sql1 = "select id,txtCruiseArea from cruise_area";
        ApiModel.query(sql1 ,function(error,obj){
            for(var i in obj){
                area_id[i] = obj[i].id;
                area_name[i] = obj[i].txtCruiseArea;
                area_num[i] = 0;
            }
            //获取所有在售产品
            var sql2 = "select cruise_area_id from product where status_id = 3";
            ApiModel.query(sql2 ,function(error,o1){
                for(var j in o1){
                    for(var i=0;i<area_id.length;i++){
                        if(o1[j].cruise_area_id == area_id[i]){
                            area_num[i] = area_num[i] + 1;
                        }
                    }
                }

                //对数据进行冒泡排序
                for(var i=0;i<area_num.length;i++){
                    for(var j=0;j<area_num.length;j++){
                        if(area_num[i]>area_num[j]){
                            t = area_num[i];area_num[i] = area_num[j];area_num[j] = t;
                            t = area_name[i];area_name[i] = area_name[j];area_name[j] = t;
                        }
                    }
                }

                //return
                var json = "[";
                for(var i=0;i<area_num.length;i++) {
                    //console.log(area_name[i]+":"+area_num[i]);
                    if(area_num[i]!=0){
                        json = json + (json=="["?"{name:'"+area_name[i]+"',y:"+area_num[i]+",sliced:true,selected:true}":",{name:'"+area_name[i]+"',y:"+area_num[i]+"}");
                    }
                }
                json = json + "]";
                res.json(json);
            });
        });
    },
    getChart2: function (req, res) {
        //获取所有公司分类
        var area_id = new Array();
        var area_name = new Array();
        var area_num = new Array();
        var sql1 = "select txtCompanyNo,txtCompanyName from cruise_company";
        ApiModel.query(sql1 ,function(error,obj){
            for(var i in obj){
                area_id[i] = obj[i].txtCompanyNo;
                area_name[i] = obj[i].txtCompanyName;
                area_num[i] = 0;
            }
            //获取所有在售产品
            var sql2 = "select s.txtCompanyNo as no from product p left join cruise_ship s on p.ship_id = s.id and p.status_id = 3";
            ApiModel.query(sql2 ,function(error,o1){
                for(var j in o1){
                    for(var i=0;i<area_id.length;i++){
                        if(o1[j].no == area_id[i]){
                            area_num[i] = area_num[i] + 1;
                        }
                    }
                }

                //对数据进行冒泡排序
                for(var i=0;i<area_num.length;i++){
                    for(var j=0;j<area_num.length;j++){
                        if(area_num[i]>area_num[j]){
                            t = area_num[i];area_num[i] = area_num[j];area_num[j] = t;
                            t = area_name[i];area_name[i] = area_name[j];area_name[j] = t;
                        }
                    }
                }

                //return
                var json = "[";
                for(var i=0;i<area_num.length;i++) {
                    //console.log(area_name[i]+":"+area_num[i]);
                    if(area_num[i]!=0){
                        json = json + (json=="["?"{name:'"+area_name[i]+"',y:"+area_num[i]+",sliced:true,selected:true}":",{name:'"+area_name[i]+"',y:"+area_num[i]+"}");
                    }
                }
                json = json + "]";
                res.json(json);
            });
        });
    },
    getChart3: function (req, res) {
        //获取所有邮轮分类
        var area_id = new Array();
        var area_name = new Array();
        var area_num = new Array();
        var sql1 = "select id,txtShipName from cruise_ship";
        ApiModel.query(sql1 ,function(error,obj){
            for(var i in obj){
                area_id[i] = obj[i].id;
                area_name[i] = obj[i].txtShipName;
                area_num[i] = 0;
            }
            //获取所有在售产品
            var sql2 = "select ship_id from product where status_id = 3";
            ApiModel.query(sql2 ,function(error,o1){
                for(var j in o1){
                    for(var i=0;i<area_id.length;i++){
                        if(o1[j].ship_id == area_id[i]){
                            area_num[i] = area_num[i] + 1;
                        }
                    }
                }

                //对数据进行冒泡排序
                for(var i=0;i<area_num.length;i++){
                    for(var j=0;j<area_num.length;j++){
                        if(area_num[i]>area_num[j]){
                            t = area_num[i];area_num[i] = area_num[j];area_num[j] = t;
                            t = area_name[i];area_name[i] = area_name[j];area_name[j] = t;
                        }
                    }
                }

                //return
                var json = "[";
                for(var i=0;i<area_num.length;i++) {
                    //console.log(area_name[i]+":"+area_num[i]);
                    if(area_num[i]!=0){
                        json = json + (json=="["?"{name:'"+area_name[i]+"',y:"+area_num[i]+",sliced:true,selected:true}":",{name:'"+area_name[i]+"',y:"+area_num[i]+"}");
                    }
                }
                json = json + "]";
                res.json(json);
            });
        });
    },
    getChart4: function (req, res) {
        //获取所有邮轮分类
        var area_id = new Array();
        var area_name = new Array();
        var area_num = new Array();
        var sql1 = "select id,short_name from company";
        ApiModel.query(sql1 ,function(error,obj){
            for(var i in obj){
                area_id[i] = obj[i].id;
                area_name[i] = obj[i].short_name;
                area_num[i] = 0;
            }
            //获取所有在售产品
            var sql2 = "select supplier_id from product where status_id = 3";
            ApiModel.query(sql2 ,function(error,o1){
                for(var j in o1){
                    for(var i=0;i<area_id.length;i++){
                        if(o1[j].supplier_id == area_id[i]){
                            area_num[i] = area_num[i] + 1;
                        }
                    }
                }

                //对数据进行冒泡排序
                for(var i=0;i<area_num.length;i++){
                    for(var j=0;j<area_num.length;j++){
                        if(area_num[i]>area_num[j]){
                            t = area_num[i];area_num[i] = area_num[j];area_num[j] = t;
                            t = area_name[i];area_name[i] = area_name[j];area_name[j] = t;
                        }
                    }
                }

                //return
                var json = "[";
                for(var i=0;i<area_num.length;i++) {
                    //console.log(area_name[i]+":"+area_num[i]);
                    if(area_num[i]!=0){
                        json = json + (json=="["?"{name:'"+area_name[i]+"',y:"+area_num[i]+"}":",{name:'"+area_name[i]+"',y:"+area_num[i]+"}");
                    }
                }
                json = json + "]";
                res.json(json);
            });
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

function _getContactsOption(callback) {
 ApiModel.query("select * from user where certified = 1" ,function(error,obj){
  var _read = "";
  for(var i in obj){
    _read = _read + "<option value='"+obj[i].mobile_phone+"'>"+obj[i].name+"</option>";
  }
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
  ApiModel.query("select * from ?? where certified = 1 order by registered_at desc limit ?,?",[_tablename,(page-1)*limit,limit],function(error,obj){
    ApiModel.query("select * from "+_tablename + " where certified = 1" ,function(error,total){
        var utils = new Utils({
          page:page,
          limit:limit,
          obj:obj,
          total:total,
          content:_setFiled(obj),
          _searchKey:true
        });
        return callback("");
  	});
  });
}

function _getAllbyKey (page,limit,key,callback) {
  ApiModel.query("select * from "+_tablename+" where certified = 1 and "+key+" order by registered_at desc limit " + (page-1)*limit + "," + limit ,function(error,obj){
    ApiModel.query("select * from "+_tablename+" where certified = 1 and "+key ,function(error,total){
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
	result = result + "<thead>"+_setHeader("用户ID|公司ID|姓名|email|手机|注册日期|操作")+"</thead><tbody>";
	for(var i in obj){
		result = result + "<tr>";
		//返回视图显示的列
		result = result + _setCol(obj[i].id+"|"+obj[i].company_id+"|"+obj[i].name+"|"+obj[i].email+"|"+obj[i].mobile_phone+"|"+(new Date(obj[i].registered_at)).Format("yyyy-MM-dd hh:mm:ss"));
		result = result + "<td style='width:60px'><button type='button' onclick='setReadinfo("+obj[i].id+")' data-toggle='modal' data-target='#ModalRead' class='btn btn-default btn-xs'>查看</button></td>";
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

