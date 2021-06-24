import React, {useState, useEffect} from "react";
import {useHistory} from 'react-router-dom';

import {
  JanusStart,
  setUserState,
  getRoom,
  getRecorder,
  setFileName,
  preSharingScreen,
  setVideo_Url,
} from "../janus/screensharing";
import {
  JanusStart_Video,
  setUserState_Video,
  getRoom_Video,
  getRecorder_Video,
  setFileName_Video,
  preSharingScreen_Video,
  setVideoId_Video
} from "../janus/video";

import io from 'socket.io-client';
import axios from 'axios';
import "./css/TeacherClass.css";
import Logo from "../img/logo.png";

export default function TeacherClass(props){
  const [socket, setSocket] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [classPlaying, setClassPlaying] = useState(true);
  console.log(props.subject);
  const className = props.subject.className;
  const classId   = props.subject.id;
  const userId    = props.user.id;
  const fileName  = "";

  const history   = useHistory();

  const urlMain   = props.url;
  const playTime  = new Date().toLocaleTimeString();

  const getTime = () => {
    const video_screen = document.getElementById('screenvideo');
    return video_screen.currentTime;
  }
  const url = {
    insertRoom : `${urlMain}api/main/updateroom/${classId}`,
    insertVideo : `${urlMain}api/main/insertVideo/${classId}`,
    socket : {
      connect : 'https://sinzuku.n-e.kr',
      markerReq : 'markerReq',
      markerRes : 'markerRes',
      end : 'endRoom',
    }
  }

  useEffect(async ()=>{
    await axios.post(url.insertVideo, {userId : userId})
    .then(req => {
      console.log(req);
      setVideo_Url(`${urlMain}api/file/uploadvideo/${req.data.videoId}/${classId}`);
      setVideoId_Video(req.data.videoId);
    })

    const soc = io.connect(url.socket.connect);
    const data = {
      roomId : classId,
      type : "teacher",
      id : userId
    }
    console.log(data);
    soc.emit('joinRoom', data);
    soc.on('joinRoom', msg => {
      console.log(msg);
    });
    setSocket(soc);


    setUserState('create');
    setUserState_Video('create');
    // screen data is null
    if(getRoom() == null){
      JanusStart();
    }
    // Video data is null
    if(getRoom_Video() == null){
      JanusStart_Video();
    }

    const playInterval = setInterval(() => {
      if(getRoom() != null && getRoom_Video() != null){
        setRoomData({
          screenRoomId : getRoom(),
          videoRoomId  : getRoom_Video()
        });
        const roomObj = {
          screenRoom : getRoom(),
          videoRoom : getRoom_Video(),
        }
        const data = {
          roomNum : JSON.stringify(roomObj),
        }
        axios.post(url.insertRoom, {data})
        .then((msg) => {

        }).catch((err) => {alert(err);});
        clearInterval(playInterval);
      }
    }, 500);
  }, [])

  useEffect(()=>{
    console.log(socket)
    if(socket != null){
      console.log("socket Set");
      socket.on(url.socket.markerReq, (msg) => {
        const data = {
          roomId : classId,
          stdId : msg.stdId,
          time : getTime()
        }
        socket.emit(url.socket.markerRes, data);
      });
      socket.on(url.socket.markerRes, msg => {
        console.log(msg);
      });
      socket.on(url.socket.end, async (msg) => {
        if(classPlaying){
          console.log(msg);
          const newDate = new Date();
          const year = newDate.getYear() + 1900;
          const month = newDate.getMonth() > 9 ? newDate.getMonth() + 1 : "0" + (newDate.getMonth() + 1);
          const day = newDate.getDate() > 9 ? newDate.getDate() + 1 : "0" + ( newDate.getDate() + 1 );
          const nowDate =`${year} ${month} ${day}_${playTime}`;
          const fileName = `${classId}_${nowDate}_${className}`;
          setFileName(fileName);
          setFileName_Video(`${fileName}_Video`);
          getRecorder().stop();
          getRecorder_Video().stop();
          setClassPlaying(false);
          history.push('/');
          window.location.reload();
        }
      });
    }
  }, [socket]);



  const outClass = () => {
    if(classPlaying){
      const newDate = new Date();
      const year = newDate.getYear() + 1900;
      const month = newDate.getMonth() > 9 ? newDate.getMonth() + 1 : "0" + (newDate.getMonth() + 1);
      const day = newDate.getDate() > 9 ? newDate.getDate() + 1 : "0" + ( newDate.getDate() + 1 );
      const nowDate =`${year} ${month} ${day}__${playTime}`;
      const fileName = `${classId}__${nowDate}__${className}`;
      setFileName(fileName);
      setFileName_Video(`${fileName}_Video`);
      getRecorder().stop();
      getRecorder_Video().stop();
      setClassPlaying(false);
      history.push('/');
      // window.location.reload();
    }
  }
  const playSystem = () => {
    window.open('sinzuku://');
  }

  return (
    <div className="TeacherClass_Main_Frame">
      <div className="TeacherClass_Top">
        {/*<div className="TeacherClass_Top_Logo">
          <img src={Logo}/>
        </div>*/}
      </div>
    <div className="TeacherClass_Content">
      <div className="TeacherClass_Content_info">
        <table style={{width:"70%", margin : "0 auto"}}>
          <thead>
            <tr>
              <td colSpan="2"> 수업 중 입니다 ... </td>
            </tr>
          </thead>
          <tbody>
          <tr>
            <td style={{textAlign:"right", width:"250px"}}> 수업 명 : </td>
            <td style={{textAlign:"left", paddingLeft:"20px" }}> {className} </td>
          </tr>
          <tr>
            <td style={{textAlign:"right", width:"250px"}}> 수업 번호 : </td>
            <td style={{textAlign:"left", paddingLeft:"20px" }}> {classId} </td>
          </tr>
          <tr>
            <td style={{textAlign:"right", width:"250px"}}> 수업 시작 시간 : </td>
            <td style={{textAlign:"left", paddingLeft:"20px" }}> {playTime} </td>
          </tr>
          </tbody>
        </table>
      </div>
       <br/>
      <div>
        <button className="TeacherClass_EndBtn" onClick={outClass}> 수업종료 </button>
        <button className="TeacherClass_System_Start" onClick={playSystem}> 프로그램실행 </button>
      </div>
    </div>

    {
      /*
        Video Line => Display none
      */
    }
      <div className="TeacherClass_SharingVideo" style={{display:"none"}}>
        <div className="TeacherClass_Video" id="video_view"> </div>
        <div className="TeacherClass_Video" id="video_view_Cam"> </div>
      </div>
    </div>
  )
}
