var	server = require('../server');


console.log("index.js");
//---------------------------USER---------------------------
exports.index = require('./user.js').index;
// exports.facebook = require('./user.js').facebook;


exports.eztv = require('./user.js').eztv;
exports.eztv_dl = require('./user.js').eztv_dl;
exports.eztv_search = require('./user.js').eztv_search;
exports.eztv_news = require('./user.js').eztv_news;


exports.tpb_search = require('./user.js').tpb_search;
exports.tpb_search_p = require('./user.js').tpb_search_p;
exports.tpb_dl = require('./user.js').tpb_dl;
