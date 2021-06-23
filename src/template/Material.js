import {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';

import './css/Material.css';

const FileUpload = (props) => {
  const file = props.file;

  return (
    <div className="Material_Add_fileName" key={props.index}>
      <span> {file.name} </span>
    </div>
  )
  // <label for="input-file">업로드</label>
  // <input type="file" id="input-file" className="upload-hidden" onChange={change}/>
}

const AddMaterial = (props) => {
  const setAddMaterialState = props.setAddMaterialState;
  const [fileList, setFileList] = useState([]);
  const url = props.url;
  const getMaterialData = props.getMaterialData;

  const change = (e) => {
    setFileList([
      ...fileList,
      e.target.files[0]
    ]);
  }

  const saveFile = async () => {
    let bool = true;
    for(let i = 0; i < fileList.length; i++){
      if(bool){
        const fileName = new FormData();
        fileName.append("file", fileList[i]);
        await axios.post(url.addMaterial, fileName)
        .then(req => {
        }).catch(err => {
          console.error(err);
          bool = false;
        });
      }else{
        break;
      }
    }
    getMaterialData();
    setAddMaterialState(false);
  }

  const exit = () => {
    setAddMaterialState(false);
  }
  return (
    <div className="Material_Add_BackGround">
      <div className="Material_Add_Main">
      <div className="Material_Add_Top">
        <h1> 자료등록 </h1>
        <label className="Material_Add_Label" htmlFor="Material_input_file"> 업로드 </label>
        <input type="file" id="Material_input_file" className="Material_input_file" onChange={change}/>
      </div>
      <div className="Material_Add_Content">
        {fileList.map((value, index) => {
          return (
            <FileUpload file={value} key={index}/>
          )
        })}
      </div>
      <div className="Material_Add_Btn">
      <button onClick={saveFile}> 저장하기 </button>
      <button onClick={exit}> 닫기 </button>
      </div>
      </div>
    </div>
  )
}

const Material = (props) => {
  const [material, setMaterial] = useState(null);
  const [addMaterialState, setAddMaterialState] = useState(false);

  const subject = props.subject;
  const user = props.user;
  const url = props.url;
  const urlMain = props.urlMain

  const history = useHistory();

  useEffect(async ()=>{
    await getMaterialData();
  }, []);

  const getMaterialData = async () => {
    await axios.post(url.getMaterialData)
    .then(req =>{
      console.log(req);
      setMaterial(req.data.result)
    })
  }
  const addMaterial = () => {
    setAddMaterialState(true);
  }

  return (
    <div className="Material_Main">
      {addMaterialState &&
          <AddMaterial setAddMaterialState={setAddMaterialState} url={url} getMaterialData={getMaterialData}/>
      }
      <div className="Material_Top">
        <div className="Material_Top_Content Material_Title"> 파일 제목 </div>
        <div className="Material_Top_Content Material_Date"> 등록 일시 </div>
        <div className="Material_Btn_Top ">
          {user.userType === "professor" &&
            <button onClick={addMaterial}> 자료등록 </button>
          }
        </div>
      </div>
      <div className="Material_Content">
        {material !== null && material.map((value, index) => {
          const dateList = value.uploadDate.split("-");
          const year = dateList[0];
          const month = dateList[1];
          const day = dateList[2].split("T")[0];
          const times = dateList[2].split("T")[1].split(".")[0].split(":");
          const time = times[0];
          const minute = times[1];
          const date = year + "년 " + month + "월 " + day + "일 " + time + "시 " + minute + "분";

          const deleteMaterial = () => {

          }

          const downLoadMaterial = () => {
            const url = `${urlMain}api/file/download/${value.fileName}`;
            axios.get(url, {
              responseType : 'blob',
              header : {
                'Content-Disposition' : 'attachment; filename='+value.fileName,
                'Content-Type' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet charset=UTF-8',
              }
            })
            .then(req => {
              const url = window.URL.createObjectURL(new Blob([req.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', value.fileName);
              document.body.appendChild(link);
              link.click();
            })
          }
          return (
            <div key={index} className="mt-2 flex px-4 py-4 bg-white dark:bg-gray-600 shadow-xl rounded-lg">
              <div className="Material_Content Material_Title"> {value.fileName} </div>
              <div className="Material_Content Material_Date"> {date} </div>
              <div className="Material_Content Material_Btn">
              {user.userType === "professor" &&
                <button onClick={deleteMaterial}> 삭제 </button>
              }
                <button onClick={downLoadMaterial}> 다운로드 </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

}

export default Material;
