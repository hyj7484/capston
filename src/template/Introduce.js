import teacherInfo from '../img/teacherInfo.png';
import studentInfo from '../img/studentInfo.png';

const Introduce = (props) => {
  const user = props.user;

  return(
    <div style={{margin : "100px auto", width:"80%"}}>
    {
      user.userType === "professor" ?
        <img src={teacherInfo} width="100%"/>
        :
        <img src={studentInfo} width="100%"/>
    }
    </div>
  )
}


export default Introduce;
