/**
 * Created by teng on 21.11.2014.
 */

var LIMIT = 10;

module.exports = {

    getList : function( req, res ) {
        var page = parseInt(req.param('page'));
        var limit = parseInt(req.param('max'));
        page = (page && page > 0) ? (page-1) : 0;
        limit = (limit && limit > 0) ? limit : LIMIT;
        var sql =
            "SELECT user.name as nameowner, pstatus.name as statusname,cruise_company.rtfCompanyLogo, " +
            " p.*, ship.id as cid, ship.txtShipName,cruise_company.txtCompanyNo,cruise_company.txtCompanyName, " +
            " company.bank,company.account_number,company.account_name,company.logo,company.short_name, area.txtCruiseArea,company.address,company.telephone,company.telephone_area_code,company.payment_transfer,company.payment_online_banking,company.payment_alipay,company.payment_cheque,company.payment_cash " +
            " from ((select * FROM product where start_date > CURDATE() limit " + page + ", " + limit + ") as p " +
            " LEFT JOIN cruise_ship as ship ON p.ship_id=ship.id " +
            " LEFT JOIN cruise_company ON ship.txtCompanyNo = cruise_company.txtCompanyNo " +
            " LEFT JOIN company ON p.supplier_id = company.id " +
            " LEFT JOIN cruise_area as area ON p.cruise_area_id = area.id " +
            " LEFT JOIN product_status pstatus ON p.status_id = pstatus.id " +
            " LEFT JOIN user ON p.owner_id = user.id)";
        ApiModel.query(sql, function (err, results) {
            res.json(results);
        });
    }
}