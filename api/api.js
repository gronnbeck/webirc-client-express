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
        userById: config.base + '/user/:id'
      }
      app.get(routes.userById, function(req, res) {
        var id = req.params.id
        , encoded = base64.encode(id)
        db.get(encoded, function(err, body) {
          if (!err) {
            res.json(body)
          }
          else if (err.message === 'missing') {
            res.json(500, { error: 'Could not find id ' + id })
          }
          else {
            res.json(500, { error: 'Unknown error occured' })
          }
        })
      })
    }
  }
}
