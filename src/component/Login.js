import Logo from '../img/logo.png';
import './css/Login.css';

import {GoogleLogin} from '../template/index';

const Login = (props) => {

  return(
    <div className="min-w-screen min-h-screen bg-blue-100 flex items-center p-5 lg:p-20 overflow-hidden relative">
    <div className="flex-1 min-h-full min-w-full rounded-3xl bg-white shadow-xl p-10 lg:p-20 text-gray-800 relative md:flex items-center text-center md:text-left">
      <div className="Login_Conent_Left w-full md:w-1/2">
        <div className="Login_Content_Left_Logo mb-10 lg:mb-20">
          <img src={Logo} width="200px" height="100px" alt="Logo"/>
        </div>
        <div className="Login_Content_Left_Btn mb-10 md:mb-20 text-gray-600 font-light">
          <GoogleLogin url={props.url} setUser={props.setUser}/>
        </div>

      </div>
      <div className="w-full md:w-1/2 text-center">
        <h1 className="font-black uppercase text-3xl lg:text-5xl text-indigo-700 mb-10"> </h1>
        <p>비대면 수업 서포팅 플렛폼 입니다.</p>
        <p>로그인을 해주세요.</p>
      </div>
    </div>
    <div className="w-64 md:w-96 h-96 md:h-full bg-blue-200 bg-opacity-30 absolute -top-64 md:-top-96 right-20 md:right-32 rounded-full pointer-events-none -rotate-45 transform"></div>
    <div className="w-96 h-full bg-indigo-200 bg-opacity-20 absolute -bottom-96 right-64 rounded-full pointer-events-none -rotate-45 transform"></div>
  </div>
  )
}


export default Login;
