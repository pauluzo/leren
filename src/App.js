import React from 'react';
import {CloudinaryContext} from "cloudinary-react";
import {Route, Switch} from 'react-router-dom';
import './App.css';
import HomePage from './pages/homepage';
import ProfilePage from "./pages/profile";

function App() {
  return (
    <CloudinaryContext cloudName="paulo">
      <div className="App">
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path="/profile" component={ProfilePage} />
        </Switch>
      </div>
    </CloudinaryContext>
  );
}

export default App;