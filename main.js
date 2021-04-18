import io from 'socket.io/client-dist/socket.io.min.js'

let acc = {}
let socket

async function requestOrientationPermission() {
    if(typeof DeviceOrientationEvent.requestPermission == 'function') {
        const state = await DeviceOrientationEvent.requestPermission()
        if(state != 'granted') {
            document.querySelector('.dialog').innerHTML = 'granting permissions is required if you want to parttake in this experience'
            return
        }
    }

    window.addEventListener('deviceorientation', (e) => {
        document.querySelector('.x span').textContent = e.beta
        document.querySelector('.y span').textContent = e.gamma
        document.querySelector('.z span').textContent = e.alpha

        acc.x = e.beta
        acc.y = e.gamma
        acc.z = e.alpha

        socket.emit('REQ_UPDATE_INPUTS', acc)
    })
}

window.addEventListener('load', () => {
    socket = io('https://ssi.imanidap.nl:8001')
    socket.on('connect', () => {
        console.log('Connected to websocket server')
    })

    document.addEventListener('click', (e) => {
        const target = e.target
        if(target.nodeName == 'BUTTON') {
            requestOrientationPermission()
        }
    })
})