/**
 * Created by teng on 19.11.2014.
 */

module.exports = {
  //tableName: 'company',
  attributes: {
    id : {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true
    },
    name : {/*公司名*/
      type: 'string',
      size: 100,
      required: true
    },
    short_name : {/*公司简称*/
      type: 'string',
      size: 15
    },
    province : {
      type: 'string',
      size: 20
    },/*省*/
    city : {
      type: 'string',
      size: 20
    },/*市*/
    address : {
      type: 'string',
      size:200
    },/*详细地址*/
    telephone_area_code : {
      type: 'string',
      size: 10
    }, /*电话区号*/
    telephone : {
      type: 'string',
      size: 50
    },/*公司电话*/
    fax : {
      type: 'string',
      size: 50
    }, /*传真*/
    homepage : {
      type: 'string',
      size: 200
    },
    logo : {
      type: 'string',
      size: 100
    },/*公司LOGO的路径*/
    bank : {
      type: 'string',
      size: 100
    }, 			/*银行名称*/
    account_number : {
      type: 'string',
      size: 100
    },	/*帐号*/
    account_name : {
      type: 'string',
      size: 50
    }, /*银行帐户名*/
    payment_transfer : {
      type: 'integer'
    }, 		/*1->支付方式:转账, 0->不提供该方式*/
    payment_online_banking : {
      type: 'integer'
    },/*1->支付方式:网银, 0->不提供该方式*/
    payment_alipay : {
      type: 'integer'
    },		/*1->支付方式:支付宝, 0->不提供该方式*/
    payment_cheque : {
      type: 'integer'
    },		/*1->支付方式:支票, 0->不提供该方式*/
    payment_cash : {
      type: 'integer'
    },			/*1->支付方式:现金, 0->不提供该方式*/
    isSupplier : {
      type: 'integer',
      defaultsTo : 0
    }, 	/*1->是供应商, 0->是分销商, 这个由后台管理员验证确定*/
    activated : {
      type: 'integer',
      defaultsTo : 0
    },/*未激活=0, 已激活=1, 未激活公司的用户不能登录*/
    certified : {
      type: 'integer',
      defaultsTo : 0
    },/*未验证=0, 已验证=1, 已验证的公司的用户自动标记为已验证？*/
    role_seller : {
      type: 'integer',
      defaultsTo : 0
    },/*有供应商资质=1*/
    registered_at : {
      type: 'datetime'
    },
    last_updated_at : {
      type: 'datetime'
    }
  }
};
