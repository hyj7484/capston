import {useState} from 'react';
import axios from 'axios';

import './css/DeleteSubject.css';

const DeleteSubject = (props) => {

  const setClickState = props.setClickState;
  const setSubjectList = props.setSubjectList;
  const [subject, setSubject] = props.subjectState;
  const url = props.url;

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
  return (
    <div className="DeleteSubject_Main">
      <h1> 삭제하시겠습니까? </h1>
      <br />
      <button onClick={onClickDelete} className="bg-red-500 text-white font-bold py-2 px-4 rounded mt-10"> 삭제하기 </button>
    </div>
  )
}

export default DeleteSubject;
