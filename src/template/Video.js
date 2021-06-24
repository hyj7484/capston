import React, {useState, useEffect, useRef } from 'react';
import VideoPlayer from 'react-video-markers';
// npm install react-video-markers --save

const Video = (props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const marker  = props.marker;

  useEffect(async ()=>{
    await setVideo();
  }, []);

  const setVideo = () => {

  }
}

export default function Video1(props){
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume]       = useState(1);
  const marker    = props.marker;
  const url       = props.url;

  useEffect(()=>{
    setVideo();
  }, []);

  const setVideo = () => {
    const screenVideo = document.getElementsByClassName('react-video-player')[0] || null;
    const camVideo = props.camVideo.current;
    screenVideo !== null && screenVideo.addEventListener('loadedmetadata', () => {
      if(screenVideo.duration == "Infinity"){
        screenVideo.currentTime = 1e101;
        camVideo.currentTime = 1e101;
        screenVideo.ontimeupdate = () => {
          screenVideo.currentTime = 0;
          camVideo.currentTime = 0;
          screenVideo.ontimeupdate = () => {
            if(camVideo.currentTime - screenVideo.currentTime > 0.2 || camVideo.currentTime - screenVideo.currentTime < -0.2 ){
              camVideo.currentTime = screenVideo.currentTime;
              if(camVideo.paused){
                  camVideo.play();
              }
            }
            return;
          }
          return;
        }
      }
    });
  }

  const handlePlay = () => {
    setIsPlaying(true);
  }
  const handlePause = () => {
    setIsPlaying(false);
  }
  const handleVolume = (value) => {
    setVolume(value);
  }

  return (
    <>
    <VideoPlayer
      url={url}
      isPlaying={isPlaying}
      volume={volume}
      onPlay={handlePlay}
      onPause={handlePause}
      onVolume={handleVolume}
      markers={marker}
      width="100%"
      height="100%"
    />
    </>
  )
}
