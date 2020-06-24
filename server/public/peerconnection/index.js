const localvideo = document.querySelector('#localvideo')
const remotevideo = document.querySelector('#remotevideo')

const btnStart = document.querySelector('#start')
const btnCall = document.querySelector('#call')
const btnHangup = document.querySelector('#hangup')

const mediaConfig = {
    video:{
        width: 320,                 // 视频采集宽 可设置范围 {min:300,max:640}
        height: 240,                // 视频采集高 可设置范围
        frameRate: 30,              // 视频采集帧 可设置范围
        facingMode: 'user',         // 视频采集摄像头 user 前 enviroment 后 left 前左侧  right 前右侧
    },
    audio:false,
}


btnStart.onclick = function(){
    let localStream;
    let client1;
    let client2;

    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia(mediaConfig).then((stream)=>{
            localStream = stream;
            localvideo.srcObject = stream
        }).catch(e=>{
            console.log(e)
        })
    }

    btnCall.onclick = function(){
        client1 = new RTCPeerConnection();
        client2 = new RTCPeerConnection();
        client1.onicecandidate = (e)=>{
            client2.addIceCandidate(e.candidate)
        }
        client2.onicecandidate = (e)=>{
            client1.addIceCandidate(e.candidate)
        }
        client2.ontrack = (e)=>{
            remotevideo.srcObject = e.streams[0]
        }
        // 先传输数据在做媒体协商
        localStream.getTracks().forEach(track => {
            client1.addTrack(track,localStream)
        });
        
        client1.createOffer({
            offerToReceiveAudio:0,
            offerToReceiveVideo:1
        }).then(desc=>{
            client1.setLocalDescription(desc)
            client2.setRemoteDescription(desc)
            client2.createAnswer().then((desc2)=>{
                client2.setLocalDescription(desc2)
                client1.setRemoteDescription(desc2)
            })
        })
    }
    
    btnHangup.onclick = function(){
        client1.close()
        client2.close()
        client1 = null
        client2 = null
    }
}

