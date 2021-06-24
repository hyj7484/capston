import {useState} from 'react';
import axios from 'axios';
import './css/AddSubject.css';

const AddSubject = (props) => {
  const [text, setText] = useState(null);
  const urlMain = props.urlMain;
  const user = props.user;
  const setContentView = props.setContentView;
  const setSubjectList = props.setSubjectList;
  console.log(user);

  const changeText = (e) => {
    setText(e.target.value);
  }
  const url = {
    addSubject : `${urlMain}api/main/${user.userType === "professor" ? `createsub/${user.id}` : `request/${user.id}/${text}`}`,
    getSubject : props.url.getSubject
  }
  const click = async () => {
    console.log(url.addSubject);
    if(text != null){
      const data = {
        subName : text
      }
      await axios.post(url.addSubject, {data})
      .then(req => {
        if(req.data){
          console.log(props.url);
          axios.post(url.getSubject)
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
              setContentView(null);
            }
          });
        }
      })
    }
  }

  const onKeyEnter = (e) => {
    if(e.key === "Enter"){
      click();
    }
  }
  return (
    <div className="AddSubject_Main">
      <h1> 과목 추가 </h1>
      <input type="text" className="mt-10" defaultValue={text} onChange={changeText} onKeyPress={onKeyEnter}/>
      <br />
      <button onClick={click} className="bg-green-500 text-white font-bold py-2 px-4 rounded mt-10"> 추가하기 </button>

    </div>
  )
}

export default AddSubject;
