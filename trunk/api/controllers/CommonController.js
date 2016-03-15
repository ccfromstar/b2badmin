/**
 * Created by teng on 19.11.2014.
   Edited by xiaoC on 2014.12.10.
 */
var Utils = require('./utils.js');
var crypto = require('crypto');

module.exports = {
  getLog: function (req, res) {
  //获取更新日志
  	ApiModel.query("select * from log_update order by id desc ",function(error,data){
        for(var i in data){
            data[i].time = (new Date(data[i].time)).Format("yyyy-MM-dd");
        }
        res.send(data);
    }); 
  },
  createCMB: function (req, res) {
  var BillNo = req.param('BillNo');
  var Amount = req.param('Amount');
  var DatePay = req.param('DatePay');
  var remark = req.param('remark');
  var sql1 = "insert into CMB (BillNo,Amount,DatePay,remark) values('"+BillNo+"','"+Amount+"','"+DatePay+"','"+remark+"')";
  console.log(sql1);
    ApiModel.query(sql1,function(error,data){
        res.send("200");
    }); 
  }
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

