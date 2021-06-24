import {useState} from 'react';

import Janus from './janus';

const state = {
  server : 'https://sinzuku.o-r.kr/janus',
  janus: null,
  plugin : null,
  role : null,
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


const getRole = () => {
  return state.role;
}
const setRole = (argRole) => {
  state.role = argRole;
}

const Screen = () => {

}

const JanusStart = () => {
  Janus.init({
    debug : "all",
    callback : () => {
      createJanus();
    }
  })
  setJanus(createJanus());
}

const createJanus = () => {
  const janus = new Janus({
    server : getServer(),
    success : () => {
      janus.attach({
        plugin : 'janus.plugin.videoroom',
        opaqueId : randomString(12),
        success : (plugin) => {
          setPlugin(plugin);
        },
        error : (err) => {
          console.error(`Error attaching plugin : ${err}`);
        },
        onmessage : (msg, jsep) => {
          const event = msg['videoroom'];
          if(event) {
            if(event === "joined"){
              
            }
          }
        }

      });
    },
    error : () => {

    },
    destroyed : () => {

    }
  })


  return janus;
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
