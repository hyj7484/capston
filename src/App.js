import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {Login, Home, AddUser, AddQuestion, Test, Replay} from './component/index';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [subject, setSubject] = useState(null);

  const urlMain = "https://sinzuku.n-e.kr/";
  const socketUrl = "https://sinzuku.n-e.kr";

  useEffect(()=>{
    if ( localStorage.getItem('user') != null){
      setUser(JSON.parse(localStorage.getItem('user')))
    }
  }, []);

  useEffect(()=>{
    if (user != null) {
      localStorage.setItem('user', JSON.stringify(user))
    }
  }, [user]);

  return (
      <Router>
        <Switch>
          <Route path="/" exact>
          {
            user != null ?
            <Home userState={[user, setUser]} subjectState={[subject, setSubject]} url={urlMain}/>
            :
            <Login setUser={setUser} url={urlMain} />
          }
          </Route>
          <Route path='/addUser/:mail/:name' exact>
            <AddUser setUser={setUser} url={urlMain}/>
          </Route>
          <Route path='/addQuestion/:id' exact>
            <AddQuestion user={[user, setUser]} subject={subject} url={urlMain}/>
          </Route>
          <Route path='/replay/:id/:fileName' exact>
            <Replay urlMain={urlMain} user={user} subject={subject}/>
          </Route>

          <Route path="/test" exact>
            <Test />
          </Route>
        </Switch>
      </Router>
  );
}

export default App;
