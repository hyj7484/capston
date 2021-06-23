import {useState, useEffect} from 'react';
import axios from 'axios';

import "./css/ChangeUser.css";

const ChangeUser = (props) => {
  const [user, setUser] = props.userState;
  const subject = props.subject;
  const setClickState = props.setClickState;
  const url = props.url;

  const [data, setData] = useState({
    userName  : '',
    userType  : '',
    userMail  : '',
    userNum   : '',
    userPhone : ''
  });
  useEffect(()=>{
    setData(user)
  }, [])

  const changeType = (e) => {
    setData({
      ...data,
      userType : e.target.value
    });
  }
  const changeName = (e) => {
    setData({
      ...data,
      userName : e.target.value
    });
  }
  const changeNum = (e) => {
    setData({
      ...data,
      userNum : e.target.value
    });
  }
  const changePhone= (e) => {
    setData({
      ...data,
      userPhone : e.target.value
    });
  }

  const onClick_ChangeInfo = async () => {
    const myData = {
      data :{
        name : data.userName,
        mail : data.userMail,
        phone : data.userPhone,
      }
    }
    await axios.post(url.updateUser, myData)
    .then(req => {
      if(req.data.result){
        setUser(data);
        goBack();
      }
    })
  }

  const goBack = () => {
    if(subject === null){
      setClickState(null);
    }else{
      if(user.userType === "professor"){
        setClickState("학생리스트");
      }else{
        setClickState("자료실");
      }
    }

  }

  return (
    <div className="ChangeUser_Main">
      <div className="ChangeUser_Top"> <h1> 정보수정 </h1> </div>
      <div className="ChangeUser_Content">
        <div className="ChangeUser_Content_Info"> 이름 </div>
        <div className="ChangeUser_Content_Input"> <input type="text" onChange={changeName} defaultValue={data.userName}/> </div> <br/>
        <div className="ChangeUser_Content_Info"> 메일 </div>
        <div className="ChangeUser_Content_Input"> <input type="text" defaultValue={data.userMail}/> </div> <br/>
        <div className="ChangeUser_Content_Info"> 전화번호 </div>
        <div className="ChangeUser_Content_Input"> <input type="text" onChange={changePhone} defaultValue={data.userPhone}/> </div> <br/>
        <div className="ChangeUser_Content_Btn">
          <button onClick={onClick_ChangeInfo} className="ChangeUser_updateBtn"> 등록 </button>
          <button onClick={goBack} className="bg-red-400" > 취소 </button>
        </div>
      </div>
    </div>
  )
}

export default ChangeUser;
