import {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';

import './css/ReplayList.css';
import starF from '../img/starFull.png';
import starN from '../img/starNaN.png';
import arrow from '../img/arrow.png';

const ReplayList = (props) => {
  const [replayList, setReplayList] = useState(null);
  const [tagState, setTagState] = useState(null);
  const [tagText, setTagText] = useState(null);
  const url = props.url;
  const urlMain = props.urlMain;
  const user = props.user;
  const subject = props.subject;
  const history = useHistory();

  useEffect(async ()=>{
    await getReplayList();
  }, [])

  const getReplayList = async () => {
    await axios.post(url.getReplayList)
    .then(req => {
      req.data.result != null && req.data.result.length > 0 && req.data.result.sort((a, b) => {
        if(a.favorite > b.favorite){
          return -1;
        }
        if(a.favorite < b.favorite){
          return 1;
        }
        return 0;
      });
      setReplayList(req.data.result);
    });
  }
  return (
    <div className="ReplayList_Main">
    <div className="ReplayList_Top">
      <div className="ReplayList_Top_Content ReplayList_Title"> 영상 제목 </div>
      <div className="ReplayList_Top_Content ReplayList_Date"> 등록 일시 </div>
      <div className="ReplayList_Top_Content ReplayList_Btn ">
      </div>
    </div>
    {replayList != null && replayList.length > 0 && replayList.map((value, index)=>{
      console.log(value);

      const fileName_List = value.fileName.split("__");
      const fileName = fileName_List.length == 4 ? `${fileName_List[1]}_${fileName_List[3]}` : value.fileName;

      const dateList = value.uploadDate.split("-");
      const year = dateList[0];
      const month = dateList[1];
      const day = dateList[2].split("T")[0];
      const times = dateList[2].split("T")[1].split(".")[0].split(":");
      const time = times[0];
      const minute = times[1];
      const date = year + "년 " + month + "월 " + day + "일 " + time + "시 " + minute + "분";

      const favorite_Set = async () => {
        const url = `${urlMain}api/main/favorite/${value.id}/${value.favorite}`;
        await axios.post(url)
        .then(req => {
          getReplayList();
        });
      }

      const onClickTagChange = async () => {
        console.log(tagState);
        console.log(value.id);
        if(tagState === value.id){
          const url = `${urlMain}api/main/subtitle/${value.id}`;
          const data = {
            subName : tagText
          }
          await axios.post(url, {data})
          .then(req => {
            if(req.data.result){
              setTagState(null);
              getReplayList();
            }
          });
        }else{
          setTagText(value.subName);
          setTagState(value.id);
        }
      }
      const onChangeTag = (e) => {
        setTagText(e.target.value);
      }
      const onKeyTag = (e) => {
        console.log("??")
        if(e.key === "Enter"){
          onClickTagChange();
        }
      }

      const onClick_ReplayLook = () =>{
        history.push(`/replay/${value.videoId}/${value.fileName}`);
      }
      if(value.fileName !== ""){
      return (
        <div className="ReplayList_List shadow-xl" key={index}>
          <div className="ReplayList_List_Content ReplayList_Title">
            <div className="ReplayList_Title_Big"> {fileName} </div>
            <div className="ReplayList_Title_Small">
              {tagState !== null ? value.id === tagState &&
                <>
                <img src={arrow} />
                <input type="text" defaultValue={tagText} onChange={onChangeTag} onKeyPress={onKeyTag}/>
                </>
                :
                <span> {value.subName != null ? value.subName : "저장된 소제목이 없습니다."} </span>
              }
            </div>
          </div>
          <div className="ReplayList_List_Content ReplayList_Date"> {date}  </div>
          <div className="ReplayList_List_Content ReplayList_Btn">
            <div className="ReplayList_Btn_Top">
              <img src={ value.favorite == 0  ? starN : starF} className="Replay_List_Content_favorite" onClick={favorite_Set}/>
            </div>
            <div className="ReplayList_Btn_Bottom">
              <button onClick={onClick_ReplayLook}> 영상보기 </button>
              <button onClick={onClickTagChange}> {tagState !== null && value.id === tagState ? <> 등록 </> : <> 소제목변경 </>} </button>
              {user.userType === "professor" &&
                <>
                <button> 삭제 </button>
                </>
              }
            </div>
          </div>
        </div>
      )}
    })}
    </div>
  )
}


export default ReplayList;
