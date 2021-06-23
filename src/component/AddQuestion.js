import {useState, useEffect} from 'react';
import {useRouteMatch, useHistory} from 'react-router-dom';
import axios from 'axios';

import './css/AddQuestion.css';
import {Logo, Logout} from '../template/index';

const AddQuestion = (props) => {
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [data, setData] = useState({
    fileName : "",
    questionTitle : "",
    questionContent : ""
  });

  const [user, setUser] = props.user;
  const subject = props.subject;
  const urlMain = props.url;
  const routeMatch = useRouteMatch("/addQuestion/:id").params;
  console.log(routeMatch.id);
  const url = {
    addQuestion : `${urlMain}api/file/add/${user.id}/2/${routeMatch.id}`,
  }
  const history = useHistory();

  useEffect(()=>{
    setData({
      fileName : "",
      questionTitle : title,
      questionContent : content
    });
  }, [title, content])
  useEffect(()=>{
    console.log(data);
  }, [data])

  const changeTitle = (e) => {
    setTitle(e.target.value);
  }
  const changeContent = (e) => {
    setContent(e.target.innerHTML);
  }

  const clickAddQuestion = async () => {
    await axios.post(url.addQuestion, {data})
    .then(req => {
      if(req.data.result){
        history.push('/');
      }
    })
  }

  const backHome = () => {
    history.push('/');
  }

  return (
    <>
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
          </div>
          <Logout setUser={setUser}/>
        </nav>
          <div className="AddQuestion">
            <div className="AddQuestion_Title">
              <input type="text" onChange={changeTitle} defaultValue={title} placeholder="제목을 입력해주세요."/>
              <span> 작성자 : {user.userName} </span>
            </div>
            <div className="AddQuestion_Content_Option">
            </div>
            <div className="AddQuestion_Content" contentEditable="true" onInput={changeContent}>
            </div>
            <div className="AddQuestion_Btn">
              <button onClick={clickAddQuestion}> 등록하기 </button>
              <button onClick={backHome}> 취소 </button>
            </div>
          </div>
      </div>
    </>
  )
}


export default AddQuestion;
