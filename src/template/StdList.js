import {useState, useEffect} from 'react';
import axios from 'axios';

import './css/StdList.css';

const StdList = (props) => {
  const user = props.user;
  const subject = props.subject;
  const url = props.url;
  const urlMain = props.urlMain
  const [stdList, setStdList] = useState(null);

  useEffect( ()=>{
    getStdList()
  }, [])

  const getStdList = async () => {
    await axios.post(url.getStudent)
    .then(req => {
      req.data.result !== null && req.data.result.length > 0 && req.data.result.sort((a, b) => {
        if(a.includeClass > b.includeClass){
          return -1;
        }
        if(a.includeClass < b.includeClass){
          return 1;
        }
        return 0;
      });
      setStdList(req.data.result);
    });
  }

  return (
    <>
    <div className="StdList_UserList_Top mt-2 px-4 justify-between bg-white  shadow-xl rounded-lg cursor-pointer">
      <div className="StdList_UserList_Name"> 이름 </div>
      <div className="StdList_UserList_Num"> 학번 </div>
      <div className="StdList_UserList_Phone"> 전화번호 </div>
      <div className="StdList_UserList_Mail"> 이메일 </div>
      <div className="StdList_UserList_Btn">  </div>
    </div>
      {
        stdList !== null && stdList.length > 0 && stdList.map((value, index) => {

          const deleteStudent = async () => {
            const url = `${urlMain}api/delete/student/${value.id}/${subject.id}`;
            await axios.post(url)
            .then(req => {
              if(req.data.result){
                getStdList();
              }
            })
          }


          const accept = (e) => {
            const url = `${urlMain}api/main/accept/${value.id}/${subject.id}/${e.target.value}`;
            axios.post(url)
            .then(req => {
              getStdList();
            })
          }

          return (
            <div key={index} className="StdList_UserList_Content bg-white mt-2 justify-between shadow-xl rounded-lg">
              <div className="StdList_UserList StdList_UserList_Name">
                {value.userName}
              </div>
              <div className="StdList_UserList StdList_UserList_Num">
                {value.userNum}
              </div>
              <div className="StdList_UserList StdList_UserList_Phone">
                {value.userPhone}
              </div>
              <div className="StdList_UserList StdList_UserList_Mail">
                {value.userMail}
              </div>
              <div className="StdList_UserList StdList_UserList_Btn">
              {value.includeClass === 0 ?
                <>
                  <button className="StdList_UserList_accept" onClick={accept} value="1"> 수락하기 </button>
                  <button className="bg-red-400" onClick={accept}  value="0"> 반대하기 </button>
                </>
                :
                <>
                  <button className="bg-red-400" onClick={deleteStudent}> 학생 삭제 </button>
                </>
              }
              </div>
            </div>
          )
        })
      }
    </>
  )
}


export default StdList;
