var express = require('express')
, GetOpt = require('node-getopt')
, app = express()
, API = require('./api/api')
, api = new API({
  base: '/api'
})

, getopt = new GetOpt([
  ['p', 'port=']
]).bindHelp()
, opt = getopt.parse(process.argv.slice(2))
, port = opt.options.port || 3000

app.use(express.json())

api.bind(app)

app.get('/app/config.js', function(req,res) {
  res.sendfile('config.js')
})

app.use(express.static(__dirname + '/public'))

console.log('Starting webserver at port ' + port)
app.listen(port)
