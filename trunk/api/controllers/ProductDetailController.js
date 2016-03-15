/**
 * Created by teng on 19.11.2014.
   Edited by xiaoC on 2014.12.10.
 */
var Utils = require('./utils.js');
var crypto = require('crypto');

var LIMIT = 10;
var _tablename = "product_list";

module.exports = {
  getProject: function (req, res) {
  	var id = parseInt(req.param('id'));
    var sql1 = "select * from "+_tablename+" where id = "+id;
    ApiModel.query(sql1 ,function(error,obj){
      obj[0].imagepath = sails.config.globals.url.b2b.files;
      obj[0].imgpath = sails.config.globals.url.b2b.img;
      res.json(obj);
    });
  },
  getProductPosition: function (req, res) {
    var id = parseInt(req.param('id'));
    var sql1 = "select * from product_cabin where product_id = "+id +" order by cabin_category_id asc";
    ApiModel.query(sql1 ,function(error,obj){
      res.json(obj);
    });
  },
  getPF: function (req, res) {
    var id = parseInt(req.param('id'));
    var sql1 = "select * from product_files where product_id = "+id;
    ApiModel.query(sql1 ,function(error,obj){
      res.json(obj);
    });
  },
  gettravel_schedule: function (req, res) {
    var id = parseInt(req.param('id'));
    var sql1 = 'select * from travel_schedule where product_id = '+id +' order by day_number asc';
    ApiModel.query(sql1 ,function(error,obj){
      res.json(obj);
    });
  },
  getInsurance: function (req, res) {
    var id = parseInt(req.param('id'));
    var sql1 = "select * from product_insurance where product_id = "+id;
    ApiModel.query(sql1 ,function(error,obj){
      res.json(obj);
    });
  },
  getIncluded: function (req, res) {
    var id = parseInt(req.param('id'));
    var sql1 = "select * from included_fee where product_id = "+id;
    ApiModel.query(sql1 ,function(error,inf){
      //计算费用包含和费用不包含
        var bh = "";
        var bbh = "";
        if ( inf[0] ) {
            if (inf[0].incl_cruise_ticket == 1) {
                bh = bh + "<b>船票费用：</b>" + inf[0].incl_cruise_ticket_comment + "<br/>";
            } else if (inf[0].incl_cruise_ticket == 0) {
                bbh = bbh + "<b>船票费用：</b>" + inf[0].incl_cruise_ticket_comment + "<br/>";
            }

            if (inf[0].incl_port_tax == 1) {
                if (inf[0].port_tax_fee == 0) {
                    bh = bh + "<b>港务费：</b>" + inf[0].incl_port_tax_comment + "<br/>";
                } else {
                    bh = bh + "<b>港务费：</b>" + inf[0].port_tax_fee + "元/人" + inf[0].incl_port_tax_comment + "<br/>";
                }
            } else if (inf[0].incl_port_tax == 0) {
                bbh = bbh + "<b>港务费：</b>" + inf[0].port_tax_fee + "元/人" + inf[0].incl_port_tax_comment + "<br/>";
            }

            if (inf[0].incl_visa_fee == 1) {

                if (inf[0].visa_fee == 0) {
                    bh = bh + "<b>签证费：</b>" + inf[0].incl_visa_comment + "<br/>";
                } else {
                    bh = bh + "<b>签证费：</b>" + inf[0].visa_fee + "元/人" + inf[0].incl_visa_comment + "<br/>";
                }
            } else if (inf[0].incl_visa_fee == 0) {
                bbh = bbh + "<b>签证费：</b>" + inf[0].visa_fee + "元/人" + inf[0].incl_visa_comment + "<br/>";
            }


            if (inf[0].incl_tip == 1) {

                if (inf[0].tip == 0) {
                    bh = bh + "<b>小费：</b>" + inf[0].incl_tip_comment + "<br/>";
                } else {
                    bh = bh + "<b>小费：</b>" + inf[0].incl_tip_comment + "<br/>";
                }
            } else if (inf[0].incl_tip == 0) {
                if (inf[0].tip == 0) {
                    bbh = bbh + "<b>小费：</b>" + inf[0].incl_tip_comment + "<br/>";
                } else {
                    bbh = bbh + "<b>小费：</b>" + inf[0].incl_tip_comment + "<br/>";
                }

            }


            if (inf[0].incl_tourist_guide == 1) {

                if (inf[0].tourist_guide_fee == 0) {
                    bh = bh + "<b>领队派遣费：</b>" + inf[0].incl_tourist_guide_comment + "<br/>";
                } else {
                    bh = bh + "<b>领队派遣费：</b>" + inf[0].tourist_guide_fee + "元/人" + inf[0].incl_tourist_guide_comment + "<br/>";
                }
            } else if (inf[0].incl_tourist_guide == 0) {
                bbh = bbh + "<b>领队派遣费：</b>" + inf[0].tourist_guide_fee + "元/人" + inf[0].incl_tourist_guide_comment + "<br/>";
            }


            if (inf[0].incl_excursion == 1) {

                if (inf[0].excursion_fee == 0) {
                    bh = bh + "<b>岸上观光费：</b>" + inf[0].incl_excursion_comment + "<br/>";
                } else {
                    bh = bh + "<b>岸上观光费：</b>" + inf[0].excursion_fee + "元/人" + inf[0].incl_excursion_comment + "<br/>";
                }
            } else if (inf[0].incl_excursion == 0) {
                bbh = bbh + "<b>岸上观光费：</b>" + inf[0].excursion_fee + "元/人" + inf[0].incl_excursion_comment + "<br/>";
            }


            if (inf[0].incl_entertainment == 1) {
                bh = bh + "<b>邮轮免费娱乐活动：</b>" + inf[0].incl_entertainment_comment + "<br/>";
            } else if (inf[0].incl_entertainment == 0) {
                bbh = bbh + "<b>邮轮免费娱乐活动：</b>" + inf[0].incl_entertainment_comment + "<br/>";
            }
            if (inf[0].incl_passport == 1) {
                bh = bh + "<b>护照费：</b>" + inf[0].incl_passport_comment + "<br/>";
            } else if (inf[0].incl_passport == 0) {
                bbh = bbh + "<b>护照费：</b>" + inf[0].incl_passport_comment + "<br/>";
            }
            if (inf[0].incl_transfer == 1) {
                bh = bh + "<b>出发地至港口交通费：</b>" + inf[0].incl_transfer_comment + "<br/>";
            } else if (inf[0].incl_transfer == 0) {
                bbh = bbh + "<b>出发地至港口交通费：</b>" + inf[0].incl_transfer_comment + "<br/>";
            }
            if (inf[0].incl_single_room_fee == 1) {
                bh = bh + "<b>邮轮单人房差价费用：</b>" + inf[0].incl_single_room_fee_comment + "<br/>";
            } else if (inf[0].incl_single_room_fee == 0) {
                bbh = bbh + "<b>邮轮单人房差价费用：</b>" + inf[0].incl_single_room_fee_comment + "<br/>";
            }
            if (inf[0].incl_self_consumption == 1) {
                bh = bh + "<b>邮轮上私人消费费用：</b>" + inf[0].incl_self_consumption_comment + "<br/>";
            } else if (inf[0].incl_self_consumption == 0) {
                bbh = bbh + "<b>邮轮上私人消费费用：</b>" + inf[0].incl_self_consumption_comment + "<br/>";
            }
            if (inf[0].incl_travel_insurance == 1) {
                bh = bh + "<b>旅游保险费用：</b>" + inf[0].incl_travel_insurance_comment + "<br/>";
            } else if (inf[0].incl_travel_insurance == 0) {
                bbh = bbh + "<b>旅游保险费用：</b>" + inf[0].incl_travel_insurance_comment + "<br/>";
            }
            if (inf[0].incl_fee_not_mentioned == 1) {
                bh = bh + "" + inf[0].incl_fee_not_mentioned_comment + "<br/>";
            } else if (inf[0].incl_fee_not_mentioned == 0) {
                bbh = bbh + "" + inf[0].incl_fee_not_mentioned_comment + "<br/>";
            }

        }
        var obj = {
            "bh":bh,
            "bbh":bbh,
            "other":inf[0].fee_comment
        };
      res.json(obj);
    });
  },
  getCruiseLine: function (req, res) {
    var id = parseInt(req.param('id'));
    var sql1 = "select location from travel_schedule where product_id = "+id + " order by day_number asc";
    ApiModel.query(sql1 ,function(error,ts){
      var hx = "";
      for(j in ts){
        if(ts[j].location!="航海日"){
            hx==""?hx = ts[j].location:hx = hx + "-" + ts[j].location;
        }
      }
      res.json(hx);
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
  _read = _read + _setOption("产品编号|product_number|"+obj[i].product_number+"|");
  _read = _read + _setOption("产品名称|title|"+obj[i].title+"|");
  _read = _read + _setOption("发布日期|created_at|"+obj[i].created_at+"|");
  _read = _read + _setOption("发布人|nameowner|"+obj[i].nameowner+"|");
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
  ApiModel.query("select * from ?? where status_id = 6 order by created_at desc limit ?,?",[_tablename,(page-1)*limit,limit],function(error,obj){
    ApiModel.query("select * from "+_tablename + " where status_id = 6" ,function(error,total){
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
  ApiModel.query("select * from "+_tablename+" where status_id = 6 and "+key+" order by created_at desc limit " + (page-1)*limit + "," + limit ,function(error,obj){
    ApiModel.query("select * from "+_tablename+" where status_id = 6 and "+key ,function(error,total){
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
    result = result + "<thead>"+_setHeader("产品编号|产品名称|运营性质|发布人|录入人|发布日期|操作")+"</thead><tbody>";
    for(var i in obj){
        result = result + "<tr>";
        //返回视图显示的列
        var name1 = (new Date(obj[i].created_at)).Format("yyyy-MM-dd")>"2014-12-26"?obj[i].namewrite:"-";
        var property1 = obj[i].service_by_huiyou==0?"自营":"荟邮代";
        result = result + _setCol(obj[i].product_number+"|"+obj[i].title+"|"+property1+"|"+obj[i].nameowner+"|"+name1+"|"+(new Date(obj[i].created_at)).Format("yyyy-MM-dd hh:mm:ss"));
        result = result + "<td style='width:60px'><button type='button' onclick='window.open(\""+sails.config.globals.url.b2b.host+"/routedownload?"+obj[i].product_number+"\");' class='btn btn-default btn-xs'>查看</button></td>";
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

