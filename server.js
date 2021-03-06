import * as net from 'net'
import * as fs from 'fs'
import * as https from 'https'
import * as osc from 'osc'
import { Server } from 'socket.io'

const TCP_PORT = process.env.TCP_PORT || 8000
const WS_PORT = process.env.WS_PORT || 8001

const wsServerConfig = {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
    pingTimeout: 2000,
    pingInterval: 2500,
}

let httpsServer
let wsServer

const certPath = '/etc/letsencrypt/live/ssi.imanidap.nl/fullchain.pem'
const keyPath = '/etc/letsencrypt/live/ssi.imanidap.nl/privkey.pem'

const isCertPresent = fs.existsSync(certPath)
const isKeyPresent = fs.existsSync(keyPath)

if(isCertPresent && isKeyPresent) {
    wsServerConfig.cert = fs.readFileSync(certPath)
    wsServerConfig.key = fs.readFileSync(keyPath)
    httpsServer = https.createServer(wsServerConfig)
    wsServer = new Server(httpsServer, wsServerConfig)
    console.log("SSL detected")
} else {
    wsServer = new Server(WS_PORT, wsServerConfig)
    console.log(`WebSocket server listening on port ${WS_PORT}`)
}

const server = net.createServer()

let TCPConnections = []
let UIInputs = {}
let averageX, averageY, averageZ = 0

server.on('connection', (socket) => {
    console.log('new tcp client connected')
    const fd = socket._parent ? socket._parent._handle.fd : socket._handle.fd

    const OSCManager = new osc.default.TCPSocketPort({
        socket: socket
    })

    TCPConnections.push({
        fd: fd,
        OSCManager: OSCManager,
        socket: socket,
    })

    OSCManager.on('error', (err) => {
        console.error(err)
    })

    OSCManager.on('message', (msg) => {
        console.log(msg)
    })

    socket.on('end', () => {
        console.log(`TCP client ${fd} disconnected`)
        TCPConnections = TCPConnections.filter((connection) => {
            return connection.fd != fd
        })
    })
})

server.listen(TCP_PORT, () => {
    console.log(`TCP server listening on port ${TCP_PORT}`)
})

wsServer.on('connection', (socket) => {
    console.log('new websocket client connected')

    socket.on('REQ_UPDATE_INPUTS', (data) => {
        UIInputs[data.id] = data

        averageX = 0
	averageY = 0 
	averageZ = 0

        for(let id in UIInputs) {
            const player = UIInputs[id]
           
	    averageX += player.x
            averageY += player.y
            averageZ += player.z
        }

        averageX /= Object.keys(UIInputs).length
        averageY /= Object.keys(UIInputs).length
        averageZ /= Object.keys(UIInputs).length

        for(let connection of TCPConnections) {
            connection.OSCManager.send({
                address: '/average/x',
                args: [averageX]
            })
            connection.OSCManager.send({
                address: '/average/y',
                args: [averageY]
            })
            connection.OSCManager.send({
                address: '/average/z',
                args: [averageZ]
            })
        }
    })

    socket.on('disconnect', () => {
	console.log('ws client disconnected')
	delete UIInputs[socket.id]
    })
})

if(httpsServer) {
    httpsServer.listen(WS_PORT, () => {
        console.log(`WS server listening on port ${WS_PORT}`)
    })
}
