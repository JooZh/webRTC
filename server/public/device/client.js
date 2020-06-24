const audioSource = document.querySelector('#audioSource')
const audioOutput = document.querySelector('#audioOutput')
const videoSource = document.querySelector('#videoSource')

if(!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices){
    console.log('enumerateDevice is not supported!')
} else {
    navigator.mediaDevices.enumerateDevices()
    .then((deviceInfos)=>{
        deviceInfos.forEach(deviceInfo => {
            const option = document.createElement('option')
            option.text = deviceInfo.label
            option.value = deviceInfo.deviceId
            switch(deviceInfo.kind){
                case 'audioinput':
                    audioSource.appendChild(option);
                    break;
                case 'audiooutput':
                    audioOutput.appendChild(option);
                    break;
                case 'videoinput':
                    videoSource.appendChild(option)
                    break;
            }
        });
    })
    .catch((error)=>{
        console.log(error)
    })
}
