import {useState, useEffect, useRef} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';
import axios from 'axios';

import {Note, Video} from '../template/index';

import './css/Replay.css'

const videoNameSet = (fileNameList) => {
  let name = "";
  for(let i = 0; i < fileNameList.length -1 ; i++){
    name += `${fileNameList[i]}`
    if(i != fileNameList.length - 2){
      name += ".";
    }
  }
  return name + "_Video.mp4";
}


const Replay = (props) => {
  const user    = props.user;
  const subject = props.subject;
  const urlMain = props.urlMain;

  const [marker, setMarker]       = useState(null);
  const [videoPlay, setVideoPlay] = useState(true);
  const camVideo = useRef(null);
  const video = props.video;

  const fileNameList  = video.fileName.split('.');
  const screenName    = video.fileName;
  const videoName     = videoNameSet(fileNameList);

  const history = useHistory();

  const url = {
    getVideo : `${urlMain}api/mark/get/${video.videoId}/${user.id}`,
    screenUrl : `${urlMain}api/file/getvideo/${screenName}`,
    videoUrl : `${urlMain}api/file/getvideo/${videoName}`,
    getMarker : `${urlMain}api/mark/get/${video.videoId}/${user.id}`,
  }

  useEffect(async ()=>{
    await getMarker();
  }, [])

  useEffect(() => {
    if(!videoPlay){
      history.push('/');
      window.onload.reload();
    }
  }, [videoPlay])

  const getMarker = async () => {
    await axios.post(url.getMarker)
    .then(req => {
      const data = req.data.result[0];
      if(data != null){
        const list = JSON.parse(data.tag).map((value, index) => {
          return {id : index, time : value, color : '#ffc837', title : `marker${index}`};
        });
        setMarker(list);
      }else{
        setMarker([]);
      }
    });
  }

  const exit = async () => {
    await setVideoPlay(false);
  }

  return(
    <div className="font-sans bg-white flex flex-col min-h-screen w-full">
      <div>
        <div className="bg-gray-200 md:overflow-hidden">
          <div className="px-4 pt-10">
            <div className="relative w-full md:max-w-2xl md:mx-auto text-center">
              <h1 className="font-bold text-gray-700 text-xl sm:text-2xl md:text-5xl leading-tight mb-3"> {subject.className} </h1>
              <div className="hidden md:block h-40 w-40 rounded-full bg-blue-600 absolute right-0 bottom-0 -mb-1 -mr-48"></div>
              <div className="hidden md:block h-5 w-5 rounded-full bg-yellow-500 absolute top-0 right-0 -mr-64 mt-20"></div>
            </div>
          </div>
          <svg className="fill-current bg-gray-200 text-white hidden md:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fillOpacity="1" d="M0,64L120,85.3C240,107,480,149,720,149.3C960,149,1200,107,1320,85.3L1440,64L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
          </svg>
        </div>
        <div className="mx-auto shadow-lg relative z-20" style={{marginTop:"-370px", borderRadius:"20px"}}>
          <div className="h-20 w-20 rounded-full bg-yellow-500 absolute top-0 left-0 ml-64 -mt-32" style={{zIndex : "-1"}}></div>
          <div className="h-5 w-5 rounded-full bg-blue-500 absolute top-0 left-0 ml-32 -mt-32" style={{zIndex: "-1"}}></div>
          <div className="Replay_Content">
            <div className="Replay_Content_Left bg-yellow-500">
              {camVideo != null && videoPlay &&
                <Video marker={marker} url={url.screenUrl} camVideo={camVideo}/>
              }
            </div>
            <div className="Replay_Content_Right bg-blue-500">
              <div className="Replay_Content_Right_Top">
                <video src={url.videoUrl} width="100%" ref={camVideo} controls/>
              </div>
              <div className="Replay_Content_Right_Bottom">
                <Note url={urlMain} user={user} videoId={video.videoId} style={{margin : "0 auto", width:"90%"}}/>
              </div>
            </div>
          </div>
          <div className="Reaplay_Bottom">
            <button className="bg-green-500" onClick={exit}> 나가기 </button>
          </div>
    </div>
  </div>
</div>
  )
}

export default Replay;
