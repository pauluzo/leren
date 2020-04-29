import React from 'react';
import {CloudinaryContext} from "cloudinary-react";
import './App.css';
import InstructorPage from './pages/instructpage';

function App() {

  return (
    <CloudinaryContext cloudName="paulo">
      <div className="App">
        <InstructorPage />
      </div>
    </CloudinaryContext>
  );
}

export default App;