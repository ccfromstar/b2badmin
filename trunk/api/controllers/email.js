var nodemailer = require('nodemailer');
var nodeUtil = require('util');
var footer = "<br/><br/><br/><hr/><b>荟邮轮——荟萃天下邮轮专业邮轮分销平台及运营服务商！</b><br/>荟邮轮：www.huiyoulun.com<br/>Tel:400-998-6121 (9:00-18:00)<br/>注：此邮件为系统邮件，请勿直接回复。<br/>";

function _sendMail(sender, subject, mailContent, mailOptions, callback) {
    var smtpTransport = nodemailer.createTransport("SMTP", {
        host: "smtp.exmail.qq.com", // 主机
        secureConnection: false, // 使用 SSL
        port: 25, // SMTP 端口
        auth: {
            user: "", // 账号
            pass: "" // 密码
        }
    });

    // 发送邮件
    smtpTransport.sendMail(mailOptions, function (err, response) {
        if (err) {
            nodeUtil.error(err);
            if( callback ){
                return callback(new Error(err));
            }
            return false;
        }
        nodeUtil.log("Message sent: " + response.message);
        smtpTransport.close();
        if( callback ){
            return callback(response.message);
        }
    });
}

function _sendSingleMail(sender, recipient, subject, mailContent, callback) {
   
// 设置邮件内容
    var mailOptions = {
        from: sender, // 发件地址
        to: recipient, // 收件列表
        subject: subject, // 标题
        html: mailContent
    }
    _sendMail(sender, subject, mailContent, mailOptions, callback);
}
function _sendMultipleMails(sender, recipientList, subject, mailContent, callback) {
    var bccList;
    for( var i in recipientList ){
        if ( !bccList ) {
            bccList = recipientList[i];
        } else {
            bccList += ', '+recipientList[i];
        }
    }

    
    
    // 设置邮件内容
    var mailOptions = {
        from: sender, // 发件地址
        bcc: recipientList, // 收件列表
        subject: subject, // 标题
        html: mailContent
    }
    _sendMail(sender, subject, mailContent, mailOptions, callback);
}

exports.sendMail = function (sender, recipient, subject, mailContent, callback) {
	_sendSingleMail(sender, recipient, subject, mailContent, callback);
}

exports.sendMultipleMails = function (sender, recipientList, subject, mailContent, callback) {
    _sendMultipleMails(sender, recipient, subject, mailContent, callback);
}

exports.sendSystemMail = function (recipient, subject, mailContent, callback) {
    _sendSingleMail("荟邮轮 <service@huiyoulun.com>", recipient, subject, mailContent + footer, callback);
}

exports.sendSystemMailMultiple = function (recipientList, subject, mailContent, callback) {
    _sendMultipleMails("荟邮轮 <service@huiyoulun.com>", recipientList, subject, mailContent + footer, callback);
}
