var express = require('express')
, app = express()
, GetOpt = require('node-getopt')
, getopt = new GetOpt([
  ['p', 'port=']
]).bindHelp()
, opt = getopt.parse(process.argv.slice(2))
, port = opt.options.port || 3000

app.use(express.static(__dirname + '/public'))

console.log('Starting webserver at port ' + port)
app.listen(port)
