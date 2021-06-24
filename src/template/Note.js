import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import "./css/note.css";

const View_setFontSize = (props) => {
  const fontList = ["8", "10", "12", "14", "16", "18", "20", "22", "24", "26", "28", "30"];
  const [fontSize, setFontSize] = props.fontSizeState;
  // const textArea = useRef() ;

  const insertNote = props.insertNote;
  const setFont = (e) => {
    setFontSize(e.target.value)
  }


  return (
    <div className="Note_OptionLine">
    <select className="Note_setFont" value={fontSize} onChange={setFont}>
      {fontList.map((list, index)=>{
        return (
          <option key={index} value={list}> {list} </option>
        )
      })}
    </select>
    <button className="Note_save_Btn" onClick={insertNote}> SAVE </button>
    </div>
  )
}


export default function Note(props){
  const [note, setNote] = useState({
    content : ""
  });
  const urlMain = props.url;
  const user    = props.user;
  const videoId   = props.videoId || null;
  const [fontSize, setFontSize] = useState(8) ;
  const textArea = useRef(null) ;

  useEffect(() => {
    console.log(fontSize) ;
    textArea.current.style.fontSize = `${fontSize}px`;
  }, [ fontSize ]) ;

  const url ={
    getMemo : `${urlMain}api/memo/get/${videoId}/${user.id}`,
    setMemo : `${urlMain}api/memo/write/${videoId}/${user.id}`
  }

  useEffect(()=>{
    console.log("okok");
    if(videoId != null){
      console.log(url.getMemo);
      axios.post(url.getMemo)
      .then(req => {
        console.log(req.data)
        if(req.data.result[0]){
          setNote(req.data.result[0]);
        }
      });
    }
  }, []);
  useEffect(()=>{
    console.log(note);
  }, [note])

  const insertNote = () => {
    if(videoId != null){
      axios.post(url.setMemo, {data : {content : note.content}})
      .then(req => {
        console.log(req.data);
      });
    }
  }
  const changeNote = (e) => {
    setNote({...note, content : e.target.value});
  }
  return(
    <div style={props.style}>
      <View_setFontSize fontSizeState={[fontSize, setFontSize]} insertNote={insertNote}/>
      <textarea ref={textArea} className="Note_Text_Body" id="Note_Text" onChange={changeNote} value={note.content}/>
    </div>
  )
}
