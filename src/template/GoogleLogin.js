import {useHistory} from 'react-router-dom';
import GLogin from 'react-google-login';
import axios from 'axios';



const GoogleLogin = (props) => {
  const clientId = "202435377897-l1g7h6nh84hrhusn8itglsj0486psno1.apps.googleusercontent.com";
  const urlMain = props.url;
  const setUser = props.setUser;
  const history = useHistory();

  const url = {
    login : `${urlMain}api/index/login`
  }

  const login = async (request) => {
    const objData = request.profileObj;
    const data = {
      mail : objData.email
    }
    await axios.post(url.login, {data})
    .then(req => {
      if(req.data.result){
        setUser(req.data.result[0]);
      }else{
        history.push(`/addUser/${objData.email}/${objData.familyName}${objData.givenName}`);
      }
    }).catch(err => console.error(err));
  }

  return (
    <>
    <GLogin
      clientId = {clientId}
      buttonText = "Login"
      render = {renderProps =>
        (
          <div role="button" className="GoogleLogin_Btn"
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            style={style.button}
            >
          Login
          </div>
        )}
      onSuccess ={login}
      onFailure = {login}
    />
    </>
  )
}

const style = {
  button : {
    width : "200px",
    height: "60px",
    lineHeight:"60px",
    borderRadius : "40px",
    textAlign : "center",
    backgroundColor : "rgba(255, 100, 0, 0.8)",
  }
}

export default GoogleLogin;
