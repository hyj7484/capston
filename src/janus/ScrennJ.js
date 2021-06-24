import {useState, useEffect, useRef} from 'react';

import Janus from './janus';

const Screen = (props) => {
  const state = props.state; // 'create' or 'join'
  const video = props.video; // "screen"  or ""
  const videoTag = useRef();
  useEffect(async ()=>{
    await Janus.init({
      debug : "all",
      callback : () => {
        createJanus();
      }
    });
    const obj = {
      state : state,
      video : video,
      videoTag : videoTag
    }
    setJanus(await JanusStart(obj));
  }, [])

  return (
    <div>
      <video ref={video}/>
    </div>
  )
}


const state = {
  server : 'https://sinzuku.o-r.kr/janus',
  janus: null,
  plugin : null,
  role : null,
  source : null,
}

const getServer = () => {
  return state.server;
}

const setJanus = (argJanus) => {
  state.janus = argJanus;
}
const setPlugin = (argPlugin) => {
  state.plugin = argPlugin;
}

const setSource = (argSource) => {
  state.source = argSource;
}
const getSource = () => {
  return state.source;
}

const createJanus = (props) => {
  const state = props.state;
  const video = props.video;
  const role = state === 'create' ? 'publisher' : 'listener';
  let plugin = null;

  const janus = new Janus({
    server : getServer(),
    success : () => {
      janus.attach({
        plugin : 'janus.plugin.videoroom',
        opaqueId : randomString(12),
        success : (argPlugin) => {
          let plugin = argPlugin;
          const ojb = {
            plugin : plugin
          }
          if(state === 'join'){
            shareCapture(obj);
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
              if(role() === 'publisher'){
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
                    newRemoteFeed(id, display);
                  }
                }
              }
            }else if ( event === 'event'){
              if(role === 'listener' && msg['publishers']){
                const list = msg['publishers'];
                for(let f in list){
                  const id = list[f]['id'];
                  const display = list[f]['display'];
                  newRemoteFeed(id, display)
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
  pluginb.send({
    message : reg
  });
}
const shareVideo = (props) => {
  const plugin = props.plugin;

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
const newRemoteFeed = (id, display) => {
  setSource(id);
  state.janus.attach({
    
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
