import {useState, useEffect} from 'react';
import {useRouteMatch, useHistory} from 'react-router-dom';
import axios from 'axios';
import './css/AddUser.css';
import Logo from '../img/logo.png';

const AddUser = (props) => {

  const setUser = props.setUser;
  const [data, setData] = useState({
    userName  : '',
    userType  : '',
    userMail  : '',
    userNum   : '',
    userPhone : ''
  });
  const urlMain = props.url;
  const history = useHistory();

  const routeMatch = useRouteMatch("/addUser/:mail/:name").params;
  const mail = routeMatch.mail;
  const name = routeMatch.name;
  const url = {
      addInfo : `${urlMain}api/index/addinfo`,
      login : `${urlMain}api/index/login`,
  }

  useEffect(()=>{
    setData({
      userName  : name,
      userType  : '',
      userMail  : mail,
      userNum   : '',
      userPhone : ''
    });
  }, []);

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
  const addUser = async () => {
    if(data.userType.replace(/ /g, "") === "" || data.userName.replace(/ /g, "") === "" || data.userNum.replace(/ /g, "") === "" || data.userPhone.replace(/ /g, "") === ""){
      alert("모든 칸을 입력해 주세요.");
    }else{
      await axios.post(url.addInfo, {data})
     .then(req => {
       if(req.data.result){
         login();
         history.push('/');
       }
     });
    }
  }

  const login = async () => {
    const option = {
      data : {
        mail : data.userMail
      }
    }
    await axios.post(url.login, option)
    .then(req => {
      if(req.data.result){
        setUser(req.data.result[0]);
      }else{
        history.push(`/addUser/${data.userMail}/${data.userName}`);
      }
    }).catch(err => console.error(err));
  }

  const cancel = () => {
    history.push('/');
  }

  return (
    <div className="min-w-screen min-h-screen bg-blue-100 flex items-center p-5 lg:p-20 overflow-hidden relative">
    <div className="AddUser_Main">
      <div className="AddUser_Top">
        <img src={Logo} alt="Logo"/>
      </div>
      <div className="AddUser_Content">
        <h1> 유저 등록 </h1>

        <div className="AddUser_Content_Info"> 담당 </div>
        <div className="AddUser_Content_Input"> <input type="radio" name="typechk" value="professor" onChange={changeType}/> 교수님 <input type="radio" name="typechk" value="student" onChange={changeType}/> 학생 </div> <br/>
        <div className="AddUser_Content_Info"> 이름 </div>
        <div className="AddUser_Content_Input"> <input type="text" onChange={changeName} defaultValue={data.userName}/> </div> <br/>
        <div className="AddUser_Content_Info"> 학번 </div>
        <div className="AddUser_Content_Input"> <input type="number" onChange={changeNum} defaultValue={data.userNum}/> </div> <br/>
        <div className="AddUser_Content_Info"> 메일 </div>
        <div className="AddUser_Content_Input"> <input type="text" defaultValue={data.userMail}/> </div> <br/>
        <div className="AddUser_Content_Info"> 전화번호 </div>
        <div className="AddUser_Content_Input"> <input type="text" onChange={changePhone} defaultValue={data.userPhone}/> </div> <br/>
        <div className="AddUser_Content_Btn">
          <button onClick={addUser}> 등록 </button>
          <button onClick={cancel}> 취소 </button>
        </div>
      </div>
    </div>
    <div className="w-64 md:w-96 h-96 md:h-full bg-blue-200 bg-opacity-30 absolute -top-64 md:-top-96 right-20 md:right-32 rounded-full pointer-events-none -rotate-45 transform"></div>
    <div className="w-96 h-full bg-indigo-200 bg-opacity-20 absolute -bottom-96 right-64 rounded-full pointer-events-none -rotate-45 transform"></div>
  </div>
  )
}

export default AddUser;
