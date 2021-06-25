import {useState, useEffect, useRef} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';


import JanusScreen from '../janus/ScrennJ';
import {Note} from '../template/index';


let markList = [];

const View_underbar = (props) => {
  const handsUpBtn = props.handsUpBtn || null;
  const marker = () => {

  }
  const handsUp = () => {

  }
  return (
    <div className="StdClass_UnderBar_Body">
      <div className="StdClass_UnderBar_Button">
        <button ref={handsUpBtn} className="StdClass_Btn_HandsUp" id="StdClass_Btn_Handsup" onClick={handsUp}> HandsUp </button>
        <button className="StdClass_Btn_Marker" onClick={marker}> Marker </button>
      </div>
    </div>
  )
}

const Test = (props) => {
  // const [socket, setSocket]     = useState(null);
  const [markData, setMarkData] = useState(null)
  const [room, setRooms]        = useState({ screenRoom : '', videoRoom : ''});
  const [videoId, setVideoId]   = useState(null);
  useEffect(()=>{
    console.log(room);
  }, [room])
  const videoScreen = useRef();
  const camScreen   = useRef();
  const handsUpBtn  = useRef();
  console.log(props);
  const classId   = 1;
  const className = props.subject ? props.subject.name :  'no name';
  const userId    = props.user ? props.user.id : '2';
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
    // janus room number get
    await axios.get(url.getRoom)
    .then(req => {
      console.log(req.data.classRanNum);
      const roomObj = JSON.parse(req.data.classRanNum);
      setRooms({
        screenRoom : roomObj.screenRoom,
        videoRoom  : roomObj.videoRoom
      });
    }).catch(err => console.error(err));

    // getVideoId
    await axios.post(url.getVideoId)
    .then(req => {
      setVideoId(req.data.videoId);
    }).catch(err => console.error(err));

    // set Socket
    // const soc = io.connect(url.socket.connect);
    // const data = {
    //   roomId : classId,
    //   type : "student",
    //   id : userId
    // }
    // soc.emit('joinRoom', data);
    // setSocket(soc);
  }, []);

  // useEffect(()=>{
    // if(socket != null && videoId != null){
    //   socket.on(url.socket.markerRes, (msg) => {
    //     if(msg.stdId === userId){
    //       setMarkData(msg.time);
    //     }
    //   });
    //
    //   socket.on(url.socket.handsup, (msg) => {
    //     if(userId == msg.stdId || msg.stdId === "all"){
    //       handsUpBtn.disabled = msg.bool;
    //     }
    //   });
    //
    //   socket.on(url.socket.end, async (msg) => {
    //     await sendMarker();
    //     await sendNote();
    //     history.push('/');
    //   });
    // }
  // }, [socket, videoId]);

  useEffect(()=>{
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

  const hansUp = () => {

  }
  const marker = () => {

  }
  console.log(room);
  return (
    <div className="font-sans bg-white flex flex-col min-h-screen w-full">
      <div>
        <div className="bg-gray-200 md:overflow-hidden">
          <div className="px-4 pt-10">
            <div className="relative w-full md:max-w-2xl md:mx-auto text-center">
              <h1 className="font-bold text-gray-700 text-xl sm:text-2xl md:text-5xl leading-tight mb-3"> className </h1>
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
              <div className="StdClass_Video_Frame">
              {room.screenRoom !== '' &&
              <>
                <JanusScreen state='join' videoTag={videoScreen} room={room.screenRoom}/>
                </>
              }
              </div>
            </div>
            <div className="StdClass_Content_Right Std_Con_Right bg-blue-500">
              <div className="StdClass_Content_Right_Top">
                {room.videoRoom !== '' &&
                  <>
                  <JanusScreen state='join' videoTag={camScreen} room={room.videoRoom}/>
                  </>
                }
              </div>
              <div className="StdClass_Content_Right_Bottom">
                <Note url={urlMain} user={props.user} videoId={videoId} style={{margin : "0 auto", width:"90%"}}/>
              </div>
              <div className="StdClass_Bottom">
                <View_underbar />
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
  )
}


export default Test;
