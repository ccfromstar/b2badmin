/**
 * Created by teng on 19.11.2014.
 */
var maxItems = 10;

module.exports = {
  //layout: 'home_layout',
  show: function (req, res) {
    return res.view('cdemo');
  },
  getAll: function (req, res) {
    _getAll((req.param('page') ? req.param('page') : 1), function (data) {
      // check whether this was a socket request
      // with req.isSocket, and if so access the connecting
      // socket with req.socket
      // client call url '/userlist/getAll'
      if (req.isSocket) {
        sails.log('res json');
        res.json(data);
      } else {
        sails.log('send data');
        res.send(data);
      }
    });
  }
}

function _getAll (pageNum, callback) {

  User.query('select * from user',function(error,users){
      console.log(users);
      sails.log("123");
      return callback(users);
  });
  /*
  User.count(function( err, userTotal ) {
    Company.find({sort: 'id DESC'}).paginate({page: pageNum, limit: maxItems}).exec(function (err, companies) {
      var companyIds = [];
      for (var i in companies) {
        console.log('Found company: ' + companies[i].name);
        companyIds.push(companies[i].id);
      }

      User.find({where: {company_id: companyIds}, sort: 'company_id DESC'}).exec(function (err, users) {

        var data = [];
        for (var i in companies) {
          var companyUsers = [];
          while (users.length) {
            if (users[0].company_id == companies[i].id) {
              companyUsers.push(users.shift());
            } else {
              break;
            }
          }
          data.push({ company: companies[i], users: companyUsers});
        }
        return callback({userTotal: userTotal, list:data});
      });
    });
  });
  */
}
