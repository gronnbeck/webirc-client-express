var nano = require('nano')('http://localhost:5984')
, dbName = 'users'

nano.db.destroy(dbName, function() {

  nano.db.create(dbName, function() {

    var db = nano.use(dbName);

    console.log('Done')

  })
  
})
