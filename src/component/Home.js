import {useState, useEffect} from 'react';
import axios from 'axios';

import {
  AddSubject, Question, Logo, Logout,
  Material, ChangeSubject, DeleteSubject,
  StdList, ChangeUser, ReplayList
} from '../template/index';

import './css/Home.css';

const ClickView = (props) => {
  const subject = props.subject;
  const btnList = props.btnList;
  const user = props.user;
  const [clickState, setClickState] = props.clickState;

  return (
    <>
      {
        btnList.map((value, index) => {
        const click = async (e) => {
          await setClickState(null);
          setClickState(e);
        }
        if(user.userType !== "professor" && (value === "학생리스트" || value === "과목이름수정" || value === "과목삭제")){
          return;
        }
        if(value === "수업시작"){
          if(user.userType === "student" && subject.classOnline === 0){
            return;
          }else if(user.userType ==="professor" && subject.classOnline === 1){
            return;
          }
        }
        return (
          <div key={index} className="Home_ClickView">
          {clickState == value ?
            <a className="py-2 cursor-pointer block text-green-500 border-green-500 dark:text-green-200 dark:border-green-200 focus:outline-none border-b-2 font-medium capitalize transition duration-500 ease-in-out"
            onClick={()=>{click(value)}}>
                {value}
            </a>
          :
            <a className="py-2 cursor-pointer block focus:outline-none border-b-2 font-medium capitalize transition duration-500 ease-in-out"
            onClick={()=>{click(value)}}>
                {value}
            </a>
          }
        </div>
        )
      })
    }
    </>
  )
}

const Subject = (props) => {
  const  user = props.user;
  const [subject, setSubejct] = props.subjectState;
  const [subjectList, setSubjectList] = props.subjectListState;
  const setClickState = props.setClickState;
  const url = props.url;

  useEffect(async ()=>{
    await axios.post(url.getSubject)
    .then(req => {
      req.data.result.length > 0 && req.data.result.sort((a, b) => {
        if(a.classOnline > b.classOnline){
          return -1;
        }
        if(a.classOnline < b.classOnline){
          return 1;
        }
        return 0;
      });
      if(req.data.result.length > 0){
        setSubjectList(req.data.result);
      }
    });
  }, []);

  return (
    <>
    {subjectList != null &&
    subjectList.map((value, index) => {
        const clickSubject = async () => {
          await setClickState(null);
          if(user.userType === "professor"){
            setClickState("학생리스트");
          }else{
            setClickState("자료실");
          }
          setSubejct(value);
        }
      return (
        <li className="mt-4"  key={index}>
          <a className="flex" onClick={clickSubject}>
            <span className="ml-2 capitalize font-medium text-black dark:text-gray-300 cursor-pointer">
              {value.className}
            </span>
          </a>
        </li>
      )
    })
    }
    </>
  )
}

const Home = (props) => {
  const [clickState, setClickState] = useState(null);
  const [contentView, setContentView] = useState(null);
  const [user, setUser] = props.userState;
  const [subject, setSubject] = props.subjectState;
  const [subjectList, setSubjectList] = useState(null);

  const btnList = ["학생리스트", "자료실", "질문", "다시보기", "과목이름수정", "과목삭제", "수업시작"];
  const urlMain = props.url;
  const url = {
    getSubject : `${urlMain}api/list/subject/${user.id || null}`,
    getQuestion :  `${urlMain}api/list/question/${subject != null && subject.id}`,
    addMaterial : `${urlMain}api/file/add/${user.id}/1/${subject != null && subject.id}`,
    getMaterialData : `${urlMain}api/list/teachingmeterial/${subject != null && subject.id}`,
    deleteSubject : `${urlMain}api/delete/class/${subject != null && subject.id}`,
    updateSubjectName : `${urlMain}api/main/updateclassname/${subject != null &&subject.id}`,
    getStudent : `${urlMain}api/list/student/${subject != null && subject.id}`,
    updateUser : `${urlMain}api/main/modifyuser/${user.id}`,
    getReplayList :  `${urlMain}api/list/video/${subject != null && subject.id}/${user.id}`,
  };

  useEffect(async()=>{
    await setContentView(null);
    if(clickState != null){
      if(clickState === "학생리스트"){
        setContentView(<StdList url={url} urlMain={urlMain} subject={subject} user={user}/>);
      }else if(clickState === "자료실"){
        setContentView(<Material urlMain={urlMain} url={url} user={user} subject={subject}/>);
      }else if(clickState === "질문"){
        setContentView(<Question user={user} url={url} subjectState={props.subjectState} urlMain={urlMain}/>);
      }else if(clickState === "과목이름수정"){
        setContentView(<ChangeSubject subjectState={[subject, setSubject]} url={url} setSubjectList={setSubjectList} setClickState={setClickState}/>);
      }else if(clickState === "과목삭제"){
        setContentView(<DeleteSubject url={url} setClickState={setClickState} setSubjectList={setSubjectList} subjectState={[subject, setSubject]} />);
      }else if(clickState === "수업시작"){

      }else if(clickState === "addSubject"){
        setContentView(<AddSubject url={url} urlMain={urlMain} user={user} setContentView={setContentView} setSubjectList={setSubjectList}/>);
      }else if(clickState === "정보수정"){
        setContentView(<ChangeUser url={url} userState={[user, setUser]} subject={subject} setContentView={setContentView} setClickState={setClickState}/>)
      }else if(clickState === "다시보기"){
        setContentView(<ReplayList url={url} urlMain={urlMain} subject={subject} user={user} />)
      }
    }
  }, [clickState, subject]);

  const onClickDelete = async () => {
    await axios.post(url.deleteSubject)
    .then(req => {
      axios.post(url.getSubject)
      .then(req => {
        setClickState(null);
        setSubject(null);
        setSubjectList(req.data.result);
      })
    })
  }

  const changeUserInfo = () =>{
    setClickState("정보수정");
  }

  const addSubject = () => {
    setClickState("addSubject");
  }

  return (
    <div className="h-screen w-full flex overflow-hidden">
      <nav className="flex flex-col bg-gray-200 dark:bg-gray-900 w-64 px-12 pt-4 pb-6">
          <div className="flex flex-row border-b items-center justify-between pb-2">
              <span className="text-lg font-semibold capitalize dark:text-gray-300"> <Logo width="100%" height="100%"/> </span>
          </div>
          <div className="mt-8">
              <h2 className="mt-4 text-xl dark:text-gray-300 font-extrabold capitalize">
                  {user.userName}
              </h2>
              <br/>
              <span> <a className="cursor-pointer" onClick={changeUserInfo}> 정보수정 </a> </span>
          </div>
          <button className="mt-8 flex items-center justify-between py-3 px-2 text-white dark:text-gray-200 bg-green-400 dark:bg-green-500 rounded-lg shadow"
          onClick={addSubject}
          >
            <span>과목 추가</span>
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
            </svg>
          </button>

          <ul className="Home_SubjectList_Main mt-2 text-gray-600">
            <Subject user={user} setClickState={setClickState} url={url} subjectState={props.subjectState} subjectListState={[subjectList, setSubjectList]}/>
          </ul>
          <Logout setUser={setUser}/>
      </nav>


      <main className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-700 transition duration-500 ease-in-out overflow-y-auto">
          <div className="mx-10 my-2">
          {subject !== null &&
            <>
              <div className="Home_Subject_Info">
                <div className="Home_Subject_Info_text">
                  <span> 현재 과목 : {subject.className} </span> <br/>
                  <span> 과목 번호 : {subject.id} </span> <br/>
                </div>
              </div>
            </>
          }
              <nav className="flex flex-row justify-between border-b dark:border-gray-600 dark:text-gray-400 transition duration-500 ease-in-out">
                  <div className="flex">
                    {subject !== null && <ClickView clickState={[clickState, setClickState]} btnList={btnList} user={user} subject={subject} /> }
                  </div>
              </nav>
              {/* <h2 className="my-4 text-4xl font-semibold dark:text-gray-400">User list</h2> */}
              {/* <div className="mt-2 flex px-4 py-4 justify-between bg-white dark:bg-gray-600 shadow-xl rounded-lg cursor-pointer">
              </div> */}
              {contentView}
          </div>
      </main>
  </div>

  )
}


export default Home;
