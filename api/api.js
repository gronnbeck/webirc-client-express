var Nano = require('nano')
, _ = require('underscore')
, log = console.log
, base64 = require('./base64')
, defaults = {
  base: '',
  db: {
    url: 'http://localhost:5984',
    name: 'users'
  }
}

module.exports = function API(config) {
  config = _.defaults(config || {}, defaults)

  var nano = Nano(config.db.url)
  , db = nano.db.use(config.db.name)
  return {
    bind: function(app) {

      var routes = {
        userById: config.base + '/user/:id',
        registerUser: config.base + '/register/:id'
      }
      , id = function(req) {
        var id = req.params.id
        , encoded = base64.encode(id)
        return encoded
      }

      app.get(routes.userById, function(req, res) {
        var encoded = id(req)

        db.get(encoded, function(err, body) {
          if (!err) {
            res.json(body)
          }
          else if (err.message === 'missing') {
            res.json(500, { error: 'Could not find id ' + req.params.id })
          }
          else {
            res.json(500, { error: 'Unknown error occured' })
          }
        })
      })

      app.post(routes.userById, function(req, res) {
        var enc = id(req)
        var user = req.body
        var valid = function(user) {
          var empty = _.isEmpty(user)
          return !empty
        }
        var insert = function(user) {
          db.insert(user, enc, function(err, body) {
            if (!err) {
              res.json({
                success: true,
                user: user
              })
            } else {
              var msg = 'An error occured on updating user ' + req.params.id
              log(msg)
              log(err)
              res.json(500, {
                success: false,
                error: msg
              })
            }

          })
        }
        if (!valid(user)) {
          res.json(500, {
            success: false,
            error: 'Invalid user object'
          })
        }
        else {
          db.get(enc, function(err, body) {
            if (!err) {
              insert(user)
            } else {
              res.json(500, {
                success: false,
                error: 'Could not find user with id ' + req.params.id
              })
            }
          })
        }
      })

      app.post(routes.registerUser, function(req, res) {
        var encoded = id(req)
        db.insert({}, encoded, function(err, body) {
          if (!err) {
            res.json({
              success: true,
              id: req.params.id
            })
          } else {
            res.json(500, {
              success: false
            })
          }
        })
      })
    }
  }
}
