import {useState} from 'react';
import axios from 'axios';
import './css/AddSubject.css';

const ChangeSubject = (props) => {
  const [text, setText] = useState(null);

  const setClickState = props.setClickState;
  const setSubjectList = props.setSubjectList;
  const [subject, setSubject] = props.subjectState;
  const url = props.url;


  const changeText = (e) => {
    setText(e.target.value);
  }
  const urls = {
    // add : `${urlMain}api/main/updateclassname/${subject.id}`,
  }
  const keyEnter = (e) => {
    if(e.key === "Enter"){
      click();
    }
  }

  const click = async () => {
    const data = {
      newClassName : text
    }
    await axios.post(url.updateSubjectName, {data})
    .then(req => {
      axios.post(url.getSubject)
      .then(req => {
        setSubject({
          ...subject,
          className : text
        })
        setSubjectList(req.data.result);
        setClickState(null);
      })
    });
  }
  return (
    <div className="AddSubject_Main">
      <h1> 과목 이름 수정 </h1>
      <input type="text" className="mt-10" defaultValue={text} onChange={changeText} onKeyPress={keyEnter}/>
      <br />
      <button onClick={click} className="bg-green-500 text-white font-bold py-2 px-4 rounded mt-10"> 수정하기 </button>

    </div>
  )
}

export default ChangeSubject;
