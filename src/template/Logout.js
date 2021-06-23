import {useHistory} from 'react-router-dom';

const Logout = (props) => {
  const setUser = props.setUser;
  const history = useHistory();
  const clickLogout = () => {
    setUser(null);
    localStorage.clear();
    history.push('/');
  }

  return (
    <div className="Home_Logout mt-4 flex items-center text-red-700 dark:text-red-400">
        <a className="flex items-center" onClick={clickLogout}>
            <svg className="fill-current h-5 w-5" viewBox="0 0 24 24">
                <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 012 2v2h-2V4H5v16h9v-2h2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h9z"></path>
            </svg>
            <span className="ml-2 capitalize font-medium">log out</span>
        </a>
    </div>
  )
}

export default Logout;
