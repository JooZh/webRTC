const $audioSource = document.querySelector('#audioSource')
const $audioOutput = document.querySelector('#audioOutput')
const $videoSource = document.querySelector('#videoSource')

const $filterSource = document.querySelector('#filter')
const $snapshot = document.querySelector('#snapshot')
const $picture = document.querySelector('#picture')
const $videoPlayer = document.querySelector('#videoPlayer')
const $audioPlayer = document.querySelector('#audioPlayer')

const $constraints = document.querySelector('#constraints')

$picture.width = 320
$picture.height = 240

const $recvideo = document.querySelector('#videoRecPlayer')
const $btnRecord = document.querySelector('button#record')
const $btnPlay = document.querySelector('button#recplay')
const $btnDownload = document.querySelector('button#download')

let globelStream = null;
let globleMediaRecorder = null;
let dataBuffer = [];

const mediaConfig = {
    deviceId: '',             // 输入设备切换
    // groupId:                     // 同一个物理设备
    video:{
        width: 320,                 // 视频采集宽 可设置范围 {min:300,max:640}
        height: 240,                // 视频采集高 可设置范围
        frameRate: 30,              // 视频采集帧 可设置范围
        facingMode: 'user',         // 视频采集摄像头 user 前 enviroment 后 left 前左侧  right 前右侧
        // resizeMode:              // 裁剪
        // aspectRatio: 0.2,        // 视频采集宽/高
    },
    audio:false,
    // audio:{
    //     volume: 0,                   // 音量采集  0-1
    //     sampleRate: 48000,           // 采样率
    //     sampleSize: 16,              // 采样大小
    //     echoCancellation: true,         // 回音消除
    //     autoGainControl: false,      // 音量增益
    //     noiseSuppression: true,         // 降噪
    //     latency: 200,                // 延迟 毫秒 500 以内最佳
    //     // channelCount:                // 单双通道
    // } 
}
const startGetUserMedia = () => {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
        mediaConfig.deviceId = videoSource.value ? videoSource.value : undefined
        navigator.mediaDevices.getUserMedia(mediaConfig).then((stream)=>{
            globelStream = stream
            $videoPlayer.srcObject = stream
            const videoTrack = stream.getVideoTracks()[0]
            const videoConstraints = videoTrack.getSettings()
            $constraints.textContent = JSON.stringify(videoConstraints,null,2)
            // $audioPlayer.srcObject = stream

            return navigator.mediaDevices.enumerateDevices()
        }).then((deviceInfos)=>{
            deviceInfos.forEach(deviceInfo => {
                const option = document.createElement('option')
                option.text = deviceInfo.label
                option.value = deviceInfo.deviceId
                switch(deviceInfo.kind){
                    case 'audioinput':
                        $audioSource.appendChild(option);
                        break;
                    case 'audiooutput':
                        $audioOutput.appendChild(option);
                        break;
                    case 'videoinput':
                        $videoSource.appendChild(option)
                        break;
                }
            });
        }).catch((error)=>{
            console.log(error)
        })
    } else {
        console.log('该浏览器不支持')
    }
}
startGetUserMedia()

$videoSource.onchange = startGetUserMedia()


$filterSource.onchange = function(){
    $videoPlayer.className = 'filter-' + $filterSource.value
}

// 拍照
$snapshot.onclick = function(){
    $picture.getContext('2d').drawImage(videoPlayer,0,0,$picture.width,$picture.height)
}

// 录制
function startRecord(){
    var options = {
        mimeType:'video/webm;codecs=vp8'
    }
    if(!MediaRecorder.isTypeSupported(options.mimeType)){
        console.error(`${options.mimeType} is not supported!`)
        return
    }
    try{
        globleMediaRecorder = new MediaRecorder(globelStream,options)
    } catch(error){
        console.error('Failed to create MediaRecorder:',e)
    }
    globleMediaRecorder.ondataavailable = function(e){
        if(e && e.data && e.data.size >0){
            dataBuffer.push(e.data)
        }
    }
    globleMediaRecorder.start(10)
}
function stopRecord(){
    globleMediaRecorder.stop()
}
$btnRecord.onclick = function(){
    if($btnRecord.textContent === 'start record'){
        startRecord();
        $btnRecord.textContent = 'stop record';
        $btnPlay.disabled = true;
        $btnDownload.disabled = true
    } else {
        stopRecord();
        $btnRecord.textContent = 'start record';
        $btnPlay.disabled = false;
        $btnDownload.disabled = false
    }
}

// 播放录制视频
$btnPlay.onclick = function(){
    const blob = new Blob(dataBuffer,{type:'video/webm'})
    $recvideo.src = window.URL.createObjectURL(blob)
    $recvideo.srcObject = null;
    $recvideo.play()
}

// 下载录制的视频

$btnDownload.onclick = function (){
    
    const blob = new Blob(dataBuffer,{type:'video/webm'})
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a');
    console.log(url)
    a.style.display = 'none'
    a.href = url
    a.download = 'aaa.webm'
    a.click()
}
