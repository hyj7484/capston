import React, {useState, useEffect} from 'react';
import {useHistory, BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  Login, Home, AddUser,
  AddQuestion, Test, Replay,
  TeacherClass, StdClass
} from './component/index';

import './App.css';

function App() {
  const [user, setUser]       = useState(null);
  const [subject, setSubject] = useState(null);
  const [video, setVideo]     = useState(null);
  const history = useHistory();
  const urlMain = "https://sinzuku.n-e.kr/";
  const socketUrl = "https://sinzuku.n-e.kr";

  useEffect(()=>{
    if ( localStorage.getItem('user') != null){
      setUser(JSON.parse(localStorage.getItem('user')))
    }
  }, []);

  useEffect(()=>{
    console.log(subject);
  }, [subject])

  useEffect(()=>{
    if (user != null) {
      localStorage.setItem('user', JSON.stringify(user))
    }
  }, [user]);

  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact>
          {
            user != null ?
            <Home userState={[user, setUser]} subjectState={[subject, setSubject]} videoState={[video, setVideo]} url={urlMain}/>
            :
            <Login setUser={setUser} url={urlMain} />
          }
          </Route>
          <Route path="/test" exact>
            <Test user={user} subject={subject} url={urlMain} socketUrl={socketUrl}/>
          </Route>
          {user === null &&
            <Route path='/addUser/:mail/:name' exact>
              <AddUser setUser={setUser} url={urlMain}/>
            </Route>
          }
          { user != null ?
            <>
            <Route path='/addQuestion/:id' exact>
              <AddQuestion user={[user, setUser]} subject={subject} url={urlMain}/>
            </Route>
            { video !== null &&
              <Route path='/replay' exact>
                <Replay urlMain={urlMain} user={user} subject={subject} video={video}/>
              </Route>

            }
            <Route path='/play' exact>
            {
              user.userType === "professor" ?
              <TeacherClass user={user} subject={subject} url={urlMain} socketUrl={socketUrl}/>
              :
              <StdClass user={user} subject={subject} url={urlMain} socketUrl={socketUrl}/>
            }
            </Route>
          </>
          :
          <>
            {()  => {history.push('/')}}
          </>
          }
        </Switch>
      </Router>
    </>
  );
}

export default App;
