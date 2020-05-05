import React from 'react';
import {CloudinaryContext} from "cloudinary-react";
import {Route, Switch} from 'react-router-dom';
import './App.css';
import HomePage from './pages/homepage';
import InstructorPage from './pages/instructpage';
import StudentPage from "./pages/studentpage";

function App() {

  return (
    <CloudinaryContext cloudName="paulo">
      <div className="App">
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path="/profile" component={InstructorPage} />
          <Route path="/student" component={StudentPage} />
        </Switch>
      </div>
    </CloudinaryContext>
  );
}

export default App;