const net = require('net')
const cp = require('child_process');

module.exports = (port, callback) => {
    var server, killPort

    server = net.createServer().listen(port)
    server.on('listening', () => {
        server.close()
        console.log('The port【' + port + '】 is available.')
        callback()
    })

    killPort = (pid) => {
        cp.exec('kill -9 ' + pid, (e, stdout, stderr) => {
            if (e) {
                console.log('Command kill -9 ' + pid + ' fails')
            } else {
                console.log('Command kill -9 ' + pid + ' success')
                callback()
            }
        })
    }

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log('The port【' + port + '】 is occupied, please waiting.')
            var command = 'lsof -i:' + port
            cp.exec(command, (e, stdout, stderr) => {　　
                if (e) {
                    console.log('Command ' + command + 'fails')
                }　
                else {　　
                    var pid = /node(\s*)(\d+)/ig.exec(stdout)[2]
                    killPort(Number(pid))
                }
            })
        }
    })
}
