import {useState, useEffect, useRef} from 'react';

import Janus from './janus';

const state = {
  server : 'https://sinzuku.o-r.kr/janus',
  janus: null,
}
const getServer = () => {
  return state.server;
}
const setJanus = (argJanus) => {
  state.janus = argJanus;
}
const getJanus = () => {
  return state.janus;
}

const Screen = (props) => {
  const [fileName, setFileName] = useState(null);
  const canvas = useRef(null);

  const state     = props.state; // 'create' or 'join'
  const video     = props.video || ''; // "screen"  or ""
  const videoTag  = props.videoTag;
  // 학생만 입력받음
  const room      = props.room || null; // 학생만 props로 room값을 받음
  // 선생만 입력받음
  const playTime  = props.playTime || null;
  const classId   = props.classId || null;
  const className = props.className || null;
  const setRoom   = props.setRoom || null;

  useEffect(async ()=>{
    if(playTime !== null && classId !== null && className !== null){
      const newDate = new Date();
      const year = newDate.getYear() + 1900;
      const month = newDate.getMonth() > 9 ? newDate.getMonth() + 1 : "0" + (newDate.getMonth() + 1);
      const day = newDate.getDate() > 9 ? newDate.getDate() + 1 : "0" + ( newDate.getDate() + 1 );
      const nowDate =`${year} ${month} ${day}_${playTime}`;
      const fileName = `${classId}_${nowDate}_${className}`;
      setFileName(fileName);
    }

    Janus.init({
      debug : "all",
      callback : () => {
        const obj = {
          state : state,
          video : video,
          videoTag : videoTag,
          room : room,
          setRoom : setRoom,
          canvas : canvas,
        }
        setJanus(createJanus(obj));
      }
    });

  }, [])

  return (
    <div className="screenSharing">
      <canvas ref={canvas}/>
      <video ref={videoTag} width="100%" height="100%" />
    </div>
  )
}

const createJanus = (props) => {
  const state = props.state;
  const video = props.video;
  const videoTag = props.videoTag.current;
  const setRoom  = props.setRoom;
  const canvas   = props.canvas.current;
  const room = props.room || null;

  const role = state === 'create' ? 'publisher' : 'listener';
  let plugin = null;

  const janus = new Janus({
    server : getServer(),
    success : () => {
      janus.attach({
        plugin : 'janus.plugin.videoroom',
        opaqueId : randomString(12),
        success : (argPlugin) => {
          plugin = argPlugin;
          const obj = {
            plugin : plugin,
            setRoom : setRoom,
            videoTag : videoTag,
            room : room,
          }
          if(state === 'join'){
            joinVideo(obj);
          }else if(state === 'create'){
            shareVideo(obj);
          }
        },
        error : (err) => {
          console.error(`Error attaching plugin : ${err}`);
        },
        onmessage : (msg, jsep) => {
          const event = msg['videoroom'];
          if(event) {
            if(event === "joined"){
              if(role === 'publisher'){
                plugin.createOffer({
                  media : {
                    video : video,
                    audioSend : true,
                    videoRecv : false,
                  },
                  success : (jsep) => {
                    const publish = {
                      request : 'configure',
                      audio : true,
                      video : true,
                    }
                    plugin.send({
                      message : publish,
                      jsep : jsep,
                    });
                  },
                  error : (err) =>  {
                    console.error(`WebRTC error : ${err.message}`);
                  }
                });
              }else {
                if(msg['publishers']){
                  const list = msg['publishers'];
                  for(let f in list){
                    const id = list[f]['id'];
                    const display = list[f]['display'];
                    const obj = {
                      room : room,
                      videoTag : videoTag,
                      setRoom : setRoom,
                    }
                    newRemoteFeed(id, display, obj);
                  }
                }
              }
            }else if ( event === 'event'){
              if(role === 'listener' && msg['publishers']){
                const list = msg['publishers'];
                for(let f in list){
                  const id = list[f]['id'];
                  const display = list[f]['display'];
                  const obj = {
                    room : room,
                    videoTag : videoTag,
                    setRoom : setRoom,
                  }
                  newRemoteFeed(id, display, obj)
                }
              }else if(msg['error']){
                console.error(`error : ${msg['error']}`);
              }
            }
          }
          if(jsep){
            plugin.handleRemoteJsep({
              jsep : jsep,
            });
          }
        },
        onlocalstream : (stream) => {
          Janus.attachMediaStream(videoTag, stream);
          videoTag.play();
          videoTag.currentTime = 0;

          console.log(stream);
          console.log(canvas);
          canvas.captureStream(25);
          let recordedChunks = [];
          const option = {mimeType : 'video/webm; codecs=vp8, opus'}
          let mediaRecorder = new MediaRecorder(stream, option);

          const handleDataAvailable = (event) => {
            console.log("!!");
            if (event.data.size > 0) {
              recordedChunks.push(event.data);
              console.log(recordedChunks);
              download();
            } else {
              // ...
            }
          }

          mediaRecorder.ondataavailable = handleDataAvailable;
          console.log(mediaRecorder.isTypeSupported);
          mediaRecorder.start();
          console.log(mediaRecorder);
          console.log(mediaRecorder.duration);

          function download() {
            var blob = new Blob(recordedChunks, {
              type: "video/webm"
            });
            console.log(blob);
            var url = URL.createObjectURL(blob);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = "test.webm";
            a.click();
            window.URL.revokeObjectURL(url);
          }

          // demo: to download after 9sec
          setTimeout(event => {
            console.log("stopping");
            mediaRecorder.stop();
          }, 9000);

        }
      });
    },
    error : (err) => {
      console.error(`error : ${err}`)
    },
    destroyed : () => {
      window.location.reload();
    }
  });
  return janus;
}

const joinVideo = (props) => {
  const plugin = props.plugin;
  const room = props.room;
  if(isNaN(room)){
    return;
  }
  const userName = randomString(12);
  const reg = {
    request : 'join',
    room : room,
    ptype : 'publisher',
    display : userName,
  }
  plugin.send({
    message : reg
  });
}
const shareVideo = (props) => {
  const plugin = props.plugin;
  const setRoom = props.setRoom;

  const desc = randomString(12, '0123456789');
  const create = {
    request : 'create',
    description : desc,
    bitrate : 500000,
    publishers : 1
  }

  plugin.send({
    message : create,
    success : (res) => {
      const event = res['videoroom'];
      if(event) {
        setRoom(res['room']);
        const userName = randomString(12);
        const register = {
          request : 'join',
          room : res['room'],
          ptype : 'publisher',
          display : userName
        };
        plugin.send({
          message : register,
        });
      }
    },
  });
}


// Host는 호출 안함
const newRemoteFeed = (id, display, props) => {

  const room = props.room;
  const videoTag = props.videoTag;
  const setRoom = props.setRoom;
  let plugin = null;
  getJanus().attach({
    plugin : 'janus.plugin.videoroom',
    opaqueId : randomString(12),
    success : (argPlugin) => {
      plugin = argPlugin;
      const listen = {
        request : 'join',
        room : room,
        ptype : 'listener',
        feed : id,
      };

      plugin.send({
        message : listen
      });
    },
    error : (err) => {
      console.error(`Error attaching plugin ...  ${err}`);
    },
    onmessage : (msg, jsep) => {
      const event = msg['videoroom'];
      if(event){
        if(event === 'attached'){
          // setRoom(msg['room']);
        }
      }
      if(jsep){
        plugin.createAnswer({
          jsep : jsep,
          media : {
            audioSend : true,
            videoSend : true,
          },
          success : (jsep) => {
            const body = {
              request : 'start',
              room : room,
            }
            plugin.send({
              message : body,
              jsep : jsep,
            });
          },
          error : (err) => {
            console.error(`WebRTC error ...  ${err}`);
          },
        });
      }
    },
    onremotestream : (stream) => {
      Janus.attachMediaStream(videoTag, stream);
      videoTag.play();
      videoTag.volume = 1;
    },
  })
}



const randomString = (len, charSet) => {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

export default Screen;
