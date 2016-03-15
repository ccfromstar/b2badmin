/**
 * Created by teng on 19.11.2014.
   Edited by xiaoC on 2014.12.10.
 */

module.exports = {
  //if this controller name is not the same, use property tableName
  //tableName: 'user',
  attributes: {
    id : {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true
    },
    company_id : {
      type: 'integer',
      required: true
    },
    name : {
      type: 'string',
      size: 50,
      required: true
    }, /*姓名*/
    sex : {
      type: 'string',
      enum: ['男', '女']
    },
    departmentName : {
      type: 'string',
      size: 100
    }, /*部门名称*/
    position : {
      type: 'string',
      size: 50
    }, /*职务*/
    email : {
      type: 'string',
      size: 50,
      required: true
    },
    picture : {
      type: 'string',
      size: 100
    },/*头像图片路径*/
    mobile_phone : {
      type: 'string',
      size: 50,
      required: true
    },/*手机号*/
    telephone : {
      type: 'string',
      size: 50
    },
    fax : {
      type: 'string',
      size: 50
    }, /*传真*/
    qq : {
      type: 'string',
      size: 20
    }, /*qq号*/
    weixin : {
      type: 'string',
      size: 20
    }, /*微信号*/
    password : {
      type: 'string',
      size: 50
    },
    role_sys_admin : {
      type: 'integer',
      defaultsTo : 0
    },		/* =1->后台系统管理员*/
    role_sys_user : {
      type: 'integer',
      defaultsTo : 0
    },		/* =1->后台用户*/
    role_company_admin : {
      type: 'integer',
      defaultsTo : 0
    },	/* =1->公司帐户管理员权限*/
    role_buyer : {
      type: 'integer',
      defaultsTo : 0
    },		/* =1->采购权限*/
    role_seller : {
      type: 'integer',
      defaultsTo : 0
    },			/* =1->销售权限*/
    role_accountant : {
      type: 'integer',
      defaultsTo : 0
    },		/* =1->财务权限*/
    activated : {
      type: 'integer',
      defaultsTo : 0
    },/*未激活=0, 已激活=1, 未激活用户不能登录*/
    certified : {
      type: 'integer',
      defaultsTo : 0
    },/*未验证=0, 已验证=1*/
    registered_at : {
      type: 'datetime'
    },/*注册时间，插入新的用户时使用 now()*/
    last_updated_at : {
      type: 'datetime'
    }
  }
}
