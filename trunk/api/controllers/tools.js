var fs = require('fs');

exports.copy = function (src, dst) {
    fs.exists(src, function (exists) {
    	exists ? (fs.writeFileSync(dst, fs.readFileSync(src))) : (console.log(src));
    });
}