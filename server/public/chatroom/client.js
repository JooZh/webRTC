const $username = document.querySelector('#username')
const $inputRoom = document.querySelector('#room')
const $btnConnect = document.querySelector('#connect')
const $outputArea = document.querySelector('#output')
const $inputArea = document.querySelector('#input')
const $btnSend = document.querySelector('#send')

let socket;
let room;

$btnConnect.onclick =()=>{
    socket = io.connect();
    // 接收消息
    socket.on('joined', (room,id)=>{
        console.log(room,id)
        $btnConnect.disabled = 'disabled'
        $inputArea.disabled = false
        $btnSend.disabled = false
    })
    socket.on('leave', (room,id)=>{
        $btnConnect.disabled = false
        $inputArea.disabled = true
        $btnSend.disabled = true
    })
    socket.on('message', (room,data)=>{
        console.log(room,data)
        let p = document.createElement('p')
        p.textContent = data
        $outputArea.appendChild(p)
    })
    room = $inputRoom.value
    socket.emit('join',room)
}


$btnSend.onclick = ()=>{
    let data = $username.value +':'+ $inputArea.value;
    socket.emit('message',room, data)
    $inputArea.value = ''
}