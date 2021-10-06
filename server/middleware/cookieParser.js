const models = require('../models');
const auth = require('./auth');

const parseCookies = (req, res, next) => {
  var cookiesObj = {};

  if (req.headers.cookie) {
    var array = req.headers.cookie.split('; ');
    // console.log(array);
    array.forEach((cookie) => {
      var parsedCookie = cookie.split('=');
      cookiesObj[parsedCookie[0]] = parsedCookie[1];
    });
  }

  req.cookies = cookiesObj;
  next();
};

module.exports = parseCookies;