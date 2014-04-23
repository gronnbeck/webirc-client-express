var Nano = require('nano')
, _ = require('underscore')
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
