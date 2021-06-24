import React, {useState, useEffect} from "react";
import {useHistory} from 'react-router-dom';
import { JanusStart, setUserState, setRoom } from "../janus/screensharing";
import { JanusStart_Video, setUserState_Video, setRoom_Video } from "../janus/video";
import io from 'socket.io-client';
import axios from 'axios';
// npm i axios
// npm install socket.io-client


import {Note} from "../template/index";
import "./css/StdClass.css";
import ImgLogo from "../img/logo.png";
/*
    학생 페이지
    Data set :
    StdId : 학생 ID
    ClassId : 수업 ID
    Marker Data List : 마킹 Event 실행시 데이터 list 저장
    screen Room Id : 화면 공유 받을 screen Room Number
*/
/*
  남은 것
  노트, 마킹시간 DB 저장
  페이지 이동 시키는거
*/
let markList = [];

export default function StdClass(props){
  const [socket, setSocket]     = useState(null);
  const [markData, setMarkData] = useState(null)
  const [room, setRooms]        = useState({ screenRoom : "", videoRoom : ""});

  const [videoId, setVideoId]   = useState(null);

  const classId   = props.subject.id;
  const className = props.subject.name;
  const userId    = props.user.id;
  const urlMain   = props.url;
  const socketUrl = props.socketUrl;
  const history   = useHistory();


  const url       = {
    getRoom : `${urlMain}api/main/getroom/${classId}`,
    setMarker : `${urlMain}api/mark/insert/${videoId}/${userId}`,
    setNote : `${urlMain}api/memo/write/${videoId}/${userId}`,
    getVideoId : `${urlMain}api/main/lastvideoid/${classId}`,
    socket : {
      connect : `${socketUrl}`,
      markerReq : "markerReq",
      markerRes : "markerRes",
      handsup : "handsup",
      end : 'endRoom',
    }
  }

  useEffect(async ()=>{
    const soc = io.connect(url.socket.connect);
    await axios.get(url.getRoom)
    .then(req => {
      const roomObj = JSON.parse(req.data.classRanNum);
      setRooms({
        screenRoom : roomObj.screenRoom,
        videoRoom  : roomObj.videoRoom
      });
    }).catch(err => console.error(err));

    await axios.post(url.getVideoId)
    .then(req => {
      console.log(req.data);
      setVideoId(req.data.videoId);
    }).catch(err => console.error(err));


    const data = {
      roomId : classId,
      type : "student",
      id : userId
    }
    soc.emit('joinRoom', data);

    setSocket(soc);
  }, []);


  useEffect(()=>{
    if(socket != null && videoId != null){
      socket.on(url.socket.markerReq, (msg) => {
        console.log(msg);
      });

      socket.on(url.socket.markerRes, (msg) => {
        if(msg.stdId === userId){
          setMarkData(msg.time);
        }
      });

      socket.on(url.socket.handsup, (msg) => {
        console.log(userId === msg.stdId);
        const btn = document.getElementById("StdClass_Btn_Handsup");
        if(userId == msg.stdId || msg.stdId === "all"){
          btn.disabled = msg.bool;
        }
      });

      socket.on(url.socket.end, async (msg) => {
        /*
          Class End
          Marking Data Save to DB
          Page Move ? : Where ?
          if No Move : Exit Btn make ?
        */
        await sendMarker();
        await sendNote();
        history.push('/');
      });
    }
  }, [socket, videoId])


  useEffect(()=>{
    if(markData != null){
      markList = [
        ...markList,
        markData
      ]
    }
  }, [markData]);

  useEffect(()=>{
    console.log(videoId);
    if(videoId != null){
      url.setMarker = `${urlMain}api/mark/insert/${videoId}/${userId}`;
      url.setNote = `${urlMain}api/memo/write/${videoId}/${userId}`;
    }
  }, [videoId]);


  const sendMarker = async () => {
    const data = { tag : JSON.stringify(markList)};
    console.log(markList);
    console.log(data);
    await axios.post(url.setMarker, {data})
    .then(req => {
      console.log(req);
    });
  }

  const sendNote = async() => {
    const noteElement = document.getElementById('Note_Text');
    const data = { content : noteElement.innerHTML}
    await axios.post(url.setNote, {data}).then( req => {
      console.log(req);
    });
  }

  useEffect(()=>{
    if(room.screenRoom != "" && room.videoRoom != ""){
      /*
          Janus Screen Room Set Success
          Janus Video Room Set Success

          Janus Video, Screen Play from Teacher Video, Screen

          UserState join
      */
      console.log(room);
      setRoom(room.screenRoom);
      setRoom_Video(room.videoRoom);

      setUserState('join');
      setUserState_Video('join');

      JanusStart();
      JanusStart_Video();
    }
  }, [room])


  const handsUp = (e) => {
    const data = {
      roomId : classId,
      bool : true,
      stdId : userId,
    };
    socket.emit(url.socket.handsup, data);
  }

  const marker = () => {
    const data = {
      roomId : classId,
      stdId : userId,
    };
    socket.emit(url.socket.markerReq, data);
  }

  const view_video = () => {
    return (
      <div className="StdClass_Video_Body">
        <div className="StdClass_Video_Video" id="video_view"></div>
      </div>
    )
  }

  const test = () => {
    socket.emit(url.socket.end, {roomId : classId});
    console.log("end play");
  }

  const camVideo_View = () => {
    return (
      <div className="StdClass_Video_Cam_Body">
        <div className="StdClass_Video_Cam_Video" id="video_view_Cam"> video </div>
      </div>
    )
  }

  const view_underbar = () => {
    return (
      <div className="StdClass_UnderBar_Body">
        <div className="StdClass_UnderBar_Button">
          <button className="StdClass_Btn_HandsUp" id="StdClass_Btn_Handsup" onClick={handsUp}> HandsUp </button>
          <button className="StdClass_Btn_Marker" onClick={marker}> Marker </button>
        </div>
      </div>
    )
  }

  const view_Logo = () => {
    return (
      <div className="StdClass_Logo_Body">
        <div className="StdClass_Logo_Img">
          <img className="StdClass_Logo_Img_Get" src={ImgLogo} />
        </div>
        <div className="StdClass_Logo_ClassName">
        {className}
        </div>
      </div>
    )
  }

  return (
    <div className="font-sans bg-white flex flex-col min-h-screen w-full">
      <div>
        <div className="bg-gray-200 md:overflow-hidden">
          <div className="px-4 pt-10">
            <div className="relative w-full md:max-w-2xl md:mx-auto text-center">
              <h1 className="font-bold text-gray-700 text-xl sm:text-2xl md:text-5xl leading-tight mb-3"> {props.subject.className} </h1>
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
          <div className="StdClass_Content">
            <div className="StdClass_Content_Left bg-yellow-500">
              <div className="StdClass_Video_Frame"> {view_video()}  </div>
            </div>
            <div className="StdClass_Content_Right Std_Con_Right bg-blue-500">
              <div className="StdClass_Content_Right_Top">
                <div className="StdClass_Cam_Video" id="video_view_Cam"> </div>
              </div>
              <div className="StdClass_Content_Right_Bottom">
                <Note url={urlMain} user={props.user} videoId={videoId} style={{margin : "0 auto", width:"90%"}}/>
              </div>
              <div className="StdClass_Bottom">
                {view_underbar()}
              </div>
            </div>
          </div>
    </div>
  </div>
</div>
  )
}
