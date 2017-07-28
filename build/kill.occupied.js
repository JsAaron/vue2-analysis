const net = require('net')
const cp = require('child_process');
const utils = require('./utils')

module.exports = (port, callback) => {
  var server, killPort

  server = net.createServer().listen(port)
  server.on('listening', () => {
    server.close()
    utils.log(`The port ${port} is available.`, 'prompt')
    callback()
  })

  killPort = (pid) => {
    cp.exec('kill -9 ' + pid, (e, stdout, stderr) => {
      if (e) {
        utils.log(`Command kill -9 ${pid} fails`, 'error')
      } else {
        utils.log(`Command kill -9 ${pid} success`, 'prompt')
        callback()
      }
    })
  }

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      utils.log(`The port ${port} is occupied, please waiting.`, 'prompt')
      var command = 'lsof -i:' + port
      cp.exec(command, (e, stdout, stderr) => {　　
        if (e) {
          utils.log(`Command ${command} fails`, 'error')
        }　
        else {　　
          var pid = /node(\s*)(\d+)/ig.exec(stdout)[2]
          killPort(Number(pid))
        }
      })
    }
  })
}
