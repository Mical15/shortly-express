const models = require('../models');
const Promise = require('bluebird');
const cookies = require('./cookieParser');

module.exports.createSession = (req, res, next) => {
  // console.log(toString(req.cookies));
  if (req.cookies.shortlyid) {
    var hash = req.cookies.shortlyid;
    models.Sessions.get({ hash })
      .then((sessionData) => {
        if (sessionData) {
          req.session = sessionData;
          res.cookie = ('shortlyid', req.session.hash);
          var id = sessionData.userId;
          if (id) {
            id = req.session.userId;
            models.Users.get({ id })
              .then((userData) => {
                req.session.user = { username: userData.username };
                next();
              });
          } else {
            next();
          }
        } else {
          models.Sessions.create()
            .then((result) => {
              var id = result.insertId;
              return models.Sessions.get({ id });
            })
            .then((sessionData) => {
              req.session = sessionData;
              res.cookie('shortlyid', req.session.hash);
              next();
            });
        }
      });

  } else {
    models.Sessions.create()
      .then((result) => {
        var id = result.insertId;
        return models.Sessions.get({ id });
      })
      .then((sessionData) => {
        req.session = sessionData;
        res.cookie('shortlyid', req.session.hash);
      })
      .then(() => {
        var username = req.body.username;
        req.session.user = { username };
        return models.Users.get({ username });
      })
      .then((userData) => {
        if (userData && userData.id) {
          req.session.userId = userData.id;
        }
        next();
      });
  }
};

// module.exports = createSession;

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

