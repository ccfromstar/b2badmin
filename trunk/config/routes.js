/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'index'
  },

  '/cmbpay': {
    view: 'cmbpay'
  },

  '/mybcontacts': {
    view: 'mybcontacts'
  },

  '/myscontacts': {
    view: 'myscontacts'
  },

  '/sysupdate': {
    view: 'sysupdate'
  },

  '/userlevel': {
    view: 'userlevel'
  },

  '/buycontacts' : {
    view: 'buycontacts'
  },

  '/sellcontacts' : {
    view: 'sellcontacts'
  },

  '/visits': {
    view: 'visits'
  },

  '/pic1': {
    view: 'pic1'
  },

  '/pic2': {
    view: 'pic2'
  },

  '/pic3': {
    view: 'pic3'
  },

  '/pic4': {
    view: 'pic4'
  },

  '/pic5': {
    view: 'pic5'
  },

  '/pic6': {
    view: 'pic6'
  },

  '/pic7': {
    view: 'pic7'
  },

  '/pic8': {
    view: 'pic8'
  },

  '/pic9': {
    view: 'pic9'
  },

  '/pic10': {
    view: 'pic10'
  },

  '/pic11': {
    view: 'pic11'
  },

  '/pic12': {
    view: 'pic12'
  },

  '/myExcelB': {
    view: 'myExcelB'
  },

  '/myExcelA': {
    view: 'myExcelA'
  },

  '/allExcelB': {
    view: 'allExcelB'
  },

  '/allExcelA': {
    view: 'allExcelA'
  },

  '/b2cuserlog': {
    view: 'b2cuserlog'
  },

  '/cabin': {
    view: 'cabin'
  },

  '/myCustomer': {
    view: 'myCustomer'
  },

  '/allCustomer': {
    view: 'allCustomer'
  },

  '/mysms': {
    view: 'mysms'
  },

  '/mysmsrecord': {
    view: 'mysmsrecord'
  },
    
  '/allsmsrecord': {
    view: 'allsmsrecord'
  },

  '/allCustomer': {
    view: 'allCustomer'
  },

  '/bookingbuy': {
    view: 'bookingbuy'
  },

  '/b2cuserlog': {
    view: 'b2cuserlog'
  },

  '/bookingsell': {
    view: 'bookingsell'
  },

  '/myCustomer': {
    view: 'myCustomer'
  },

  '/ship': {
    view: 'ship'
  },

  '/line': {
    view: 'line'
  },

  '/area': {
    view: 'area'
  },

  '/userlist' : {
    view: 'userlist'
  },

  '/file' : {
    view: 'file'
  },

  '/nopassuser' : {
    view: 'nopassuser'
  },

  '/passeduser' : {
    view: 'passeduser'
  },

  '/passeduserson' : {
    view: 'passeduserson'
  },

  '/user' : {
    view: 'user'
  },

  '/company' : {
    view: 'company'
  },

  '/blank' : {
    view: 'blank'
  },

  '/sms' : {
    view: 'sms'
  },

  '/allPassenger' : {
    view: 'allPassenger'
  },

  '/myPassenger' : {
    view: 'myPassenger'
  },

  '/logDbChange' : {
    view: 'logDbChange'
  },

  '/registerApprove' : {
    view: 'registerApprove'
  },

  '/registerApprove' : {
    view: 'registerApprove'
  },

  '/contacts' : {
    view: 'contacts'
  },

  '/pstatus1' : {
    view: 'pstatus1'
  },

  '/pstatus2' : {
    view: 'pstatus2'
  },

  '/pstatus3' : {
    view: 'pstatus3'
  },

  '/pstatus4' : {
    view: 'pstatus4'
  },

  '/pstatus5' : {
    view: 'pstatus5'
  },

  '/pstatus6' : {
    view: 'pstatus6'
  },

  '/pstatus7' : {
    view: 'pstatus7'
  },

  '/pstatus8' : {
    view: 'pstatus8'
  },

  '/userlog' : {
    view: 'userlog'
  },

  '/productchart' : {
    view: 'productchart'
  },

  '/updatelog' : {
    view: 'updatelog'
  },

  '/productlog' : {
    view: 'productlog'
  },

  '/newfile' : {
    view: 'newfile'
  },

  '/linelist' : {
    view: 'linelist'
  }

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
