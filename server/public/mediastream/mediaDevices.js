class WebRTC {
    constructor(config){
        
    }
    init(){

    }

}



module.exports = {
    mediaConfig:{
        deviceId: '',             // 输入设备切换
        // groupId:'' ,                    // 同一个物理设备
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
    },
    startGetUserMedia: (config) => {
        return new Promise((resolve,reject)=>{
            const values = {}

            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
                mediaConfig.deviceId = videoSource.value ? videoSource.value : undefined

                navigator.mediaDevices.getUserMedia(config.mediaConfig).then((stream)=>{
                    values.stream = stream;
                    values.deviceInfo = navigator.mediaDevices.enumerateDevices();
                    values.tracks

                    $videoPlayer.srcObject = stream

                    const videoTrack = stream.getVideoTracks()[0]
                    const videoConstraints = videoTrack.getSettings()
                    $constraints.textContent = JSON.stringify(videoConstraints,null,2)
                    // $audioPlayer.srcObject = stream

                    resolve(values)

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
                console.log('getUserMedia is not supported!')
            }
        })
    }
}