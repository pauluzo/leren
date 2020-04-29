import React from "react";
import {TopNav, Category, Footer} from "../components/Reusable";
import HomeImage1 from "../assets/images/home-img1.png"
import HomeImage2 from "../assets/images/home-img2.png"

// Home page which is to be displayed once the application is started

function HomePage() {
  return(
    <div className="homepage">
      <TopNav/>
      <div className="header">
        <div className="header-details">
          <h1>Learn Anything</h1>
          <h4>
            Gain access to online courses, instructors, certificates and degrees from world-class tutors and organisations.
          </h4>
        </div>
      </div>
      <div className="home-intro">
        <div className="intro-left">
          <div>
            <span>Become a Student</span>
            <button>Sign Up</button>
          </div>
          <img alt="img1" src={HomeImage1} />
        </div>
        <div className="intro-right">
          Becoming a student gives you access to millions of videos from instructors
          all over the world, interactive sessions with instructors and fellow 
          students. Build your expertise, and become an instructor as well.
        </div>
      </div>
      <div className="home-intro">
        <div className="intro-right">
          Being an instructor entails access to videos uploaded by other instructors,
          thereby giving you the option to learn, while teaching others. Get amazing opportunities for
          growth and experience.
        </div>
        <div className="intro-left">
          <div>
            <span>Become an instructor</span>
            <button>Register</button>
          </div>
          <img alt="img2" src={HomeImage2} />
        </div>
      </div>
      <Category/>
      <Footer/>
    </div>
  );
}



export default HomePage;