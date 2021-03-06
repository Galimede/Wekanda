import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Home from './components/Home';
import Profile from './components/Profile';
import Play from './components/Play';
import FilterQuizz from './components/FilterQuizz'
import Signin from './components/Signin';
import Signup from './components/Signup';
import SearchQuizz from './components/SearchQuizz';
import CreateQuizz from "./components/CreateQuizz";

function App() {
  return (

    <Router>

        <Header/>

        <div id={"main-container"}>
              <Switch>
                <Route exact={true} path='/' component={Home}/>
                <Route exact={true} path='/home' component={Home}/>


                
                {/* <Route exact={true} path='/quizz/:id_quizz/edit' component={EditQuizz}/> */}
                <Route exact={true} path='/addQuizz' component={CreateQuizz}/>
                <Route exact={true} path='/edit/:id_quizz/' component={CreateQuizz}/>
                <Route exact={true} path='/quizz/:id_quizz/play' component={Play}/>
                
                <Route exact={true} path='/profile' component={Profile}/>
                <Route exact={true} path='/signin' component={Signin}/>
                <Route exact={true} path='/signup' component={Signup}/>


                <Route exact={true} path='/quizzes/:tag' component={FilterQuizz}/>
                <Route exact={true} path='/quizzes/search/:search' component={SearchQuizz}/>


                <Redirect from='*' to='/' />
              </Switch>
        </div>
    </Router>
    
  );
}

export default App;
