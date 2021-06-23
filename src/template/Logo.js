import LogoImg from '../img/logo.png';
import {useHistory} from 'react-router-dom';

const Logo = (props) => {
  const width = props.width || null;
  const height = props.height || null;
  const history = useHistory();

  const click = () => {
    history.push('/');
  }

  return (
    <>
      <img className="cursor-pointer" src={LogoImg} width={width} height={height} onClick={click}/>
    </>
  )
}

export default Logo;
