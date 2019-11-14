"use strict";


module.exports = {
    // Web Controllers
    WebAdvertCtrl: require('./WebAdvert'),
    WebUserCtrl: require('./WebUser'),
    // API Controllers
    ItemCtrl: require('./apiv1/Item'),
    AuthCtrl: require('./apiv1/Auth'),
    UserCtrl: require('./apiv1/User'),
}