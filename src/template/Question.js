import {useState, useEffect} from 'react';
import {useHistory}  from 'react-router-dom';
import axios from 'axios';
import './css/Question.css';
import ReFresh from '../img/refresh.png';

const Question = (props) => {
  const user = props.user;
  const url = props.url;
  const urlMain = props.urlMain;
  const [subject, setSubejct] = props.subjectState;
  const [questionList, setQuestionList] = useState(null);
  const [nowQuestion, setNowQuestion]   = useState(null);

  const history = useHistory();

  useEffect(async ()=>{
    await getQuestionList();
  }, [])

  const getQuestionList = async () => {
    await axios.post(url.getQuestion)
    .then(req => {
      console.log(req.data.result)
      req.data.result != null && req.data.result.sort((a, b) => {
        if(a.Check > b.Check){
          return 1;
        }
        if(a.Check < b.Check){
          return -1;
        }
        return 0;
      });
      setQuestionList(req.data.result);
    });
  }

  const click = () => {
    console.log(subject);
  }
  const refresh = async () => {
    await getQuestionList();
  }

  const deleteAll = async () => {
    const url = `${urlMain}api/delete/allquestion/${subject.id}`;
    await axios.post(url)
    .then(req => {
      if(req.data.result){
        getQuestionList();
      }
    })
  }

  const addQuestion = async () => {
    history.push(`/addQuestion/${subject.id}`);
  }
  return (
    <div className="Question_Main">
    <div className="Question_Top">
      <div className="Question_Top_Content Question_Title"> 질문 제목 </div>
      <div className="Question_Top_Content Question_Date"> 질문 일시 </div>
      <div className="Question_Btn_Top ">
      {user.userType === "professor" ?
        <button onClick={deleteAll}> 전체삭제 </button>
        :
        <button onClick={addQuestion}> 질문등록 </button>
      }
      </div>
    </div>
    {questionList != null && questionList.length > 0 && questionList.map((value, index) => {
      if(user.userType === "student" && value.registPeople !== user.id){
        return;
      }
      const readQuestion = async () => {
        if(value.Check == 0 && user.userType === "professor"){
          const url = `${urlMain}api/main/readquestion/${value.id}`;
          await axios.post(url)
          .then(req => {
            value.Check = "1";
          })
        }
        setNowQuestion(index)
      }

      const deleteQuestion = async () => {
        const url = `${urlMain}api/delete/myquestion/${value.id}`;
        await axios.post(url)
        .then(req => {
          if(req.data.result){
            getQuestionList();
          }
        });
      }

      const dateList = value.uploadDate.split("-");
      const year = dateList[0];
      const month = dateList[1];
      const day = dateList[2].split("T")[0];
      const times = dateList[2].split("T")[1].split(".")[0].split(":");
      const time = times[0];
      const minute = times[1];
      const date = year + "년 " + month + "월 " + day + "일 " + time + "시 " + minute + "분";
      const color = value.Check == "1" ? "rgba(255, 200, 220, 0.7)" : null;
      const heightSize  = index === nowQuestion ? "500px" : "80px";
      return (
        <div key={index} style={{backgroundColor:color, height:heightSize}} className="Question_Content_Main mt-2 px-4 py-4 justify-between bg-white dark:bg-gray-600 shadow-xl rounded-lg">
        <div className="Question_Content_Top">
        <div className="Question_Content Question_Title"> {value.fileName} </div>
        <div className="Question_Content Question_Date"> {date} </div>

          <div className="Question_Content Question_Btn">
          {index !== nowQuestion &&
            <>
          <div className="Question_Content_Btn mx-3">
              <button onClick={readQuestion} className="bg-green-500 text-white font-bold rounded border-b-2 border-r-2 border-green-500 hover:border-green-600 hover:bg-white hover:text-black shadow-md py-2 px-4 inline-flex items-center">
                  <span className="mr-2" >확인하기</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path fill="currentcolor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                  </svg>
              </button>
          </div>
          {user.userType === "professor" &&
          <div onClick={deleteQuestion} className="Question_Content_Btn mx-3">
              <button className="bg-red-500 text-white font-bold rounded border-b-2 border-r-2 border-red-500 hover:border-red-600 hover:bg-white hover:text-black shadow-md py-2 px-4 inline-flex items-center">
                  <span className="mr-2">삭제하기</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path
                          fill="currentcolor"
                          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                      />
                  </svg>
              </button>
          </div>
          }
          </>
          }
          </div>

        </div>
        {index === nowQuestion &&
          <div className="Question_Content_View">
            {value.Content}
          </div>
        }
        </div>

      )
    })}
    </div>
  )
}

export default Question;
