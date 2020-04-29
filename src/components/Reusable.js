import React from "react";
import Logo from "../assets/images/logo.png";

//React allows to import svg as a component.
import {ReactComponent as BusinessIcon} from "../assets/icons/business-icon.svg";
import {ReactComponent as ComputerIcon} from "../assets/icons/comp-icon.svg";
import {ReactComponent as DataIcon} from "../assets/icons/data-icon.svg";
import {ReactComponent as DesignIcon} from "../assets/icons/design-icon.svg";
import {ReactComponent as EngrIcon} from "../assets/icons/engr-icon.svg";
import {ReactComponent as LangIcon} from "../assets/icons/lang-icon.svg";
import {ReactComponent as LogoIcon} from "../assets/icons/logo-icon.svg";

import Gmail from "../assets/images/gmail_logo.png";
import Github from "../assets/images/github_logo.png";
import Twitter from "../assets/images/twitter_logo.png";
import LinkedIn from "../assets/images/linkedin_logo.png";

// Reusable Top Navigtion component 
function TopNav (props) {
  return(
    <div className="topnav">
      <img src={Logo} alt="Logo" style={{height: "2em", width: "4.5em"}}/>
      <div className="float-right">
        <div><button className="instructor-button" >Become an Instructor</button></div>
        <div><button className="login-button">Log In</button></div>
        <div><button className="signup-button">Sign Up</button></div>
      </div>
    </div>
  );
}

function Category() {
  var popularCategories = [
    {icon: ComputerIcon, title: "Computer Science"},
    {icon: LangIcon, title: "Languages"},
    {icon: DesignIcon, title: "Design"},
    {icon: DataIcon, title: "Data Science"},
    {icon: EngrIcon, title: "Engineering"},
    {icon: BusinessIcon, title: "Business & Management"},
  ]
  const Cards = popularCategories.map((category) => {
    return SubjectCard(category);
  });
  return(
    <div className="category-container">
      <span>Popular Categories</span>
      <div className="card-container">
        {Cards}
      </div>
      <span>And lots more...</span>
    </div>
  );
}

function SubjectCard (props) {
  let Icon = props.icon
  return (
    <div className="subject-card" >
      <Icon style={{width: "2.5em", height: "2.5em"}} />
      <span>{props.title}</span>
    </div>
  );
}

const Footer = () => {
  return(
    <div className='footer_outer_container'>
      <div className="logo-icon">
        <LogoIcon style={{height: "100px", width: "200px"}}/>
      </div>
      <div className='footer_inner_container'>
        <a target='_blank' rel='noopener noreferrer' href='https://www.github.com/pauluzo'><img src={Github} alt='github'></img></a>
        <a target='_blank' rel='noopener noreferrer' href='https://twitter.com/papizone'><img src={Twitter} alt='twitter'></img></a>
        <a target='_blank' rel='noopener noreferrer' href='https://www.linkedin.com/in/paul-okafor-b51ab01a2/'><img src={LinkedIn} alt='linkedIn'></img></a>
        <a target='_blank' rel='noopener noreferrer' href='mailto:okaforpaul26@gmail.com'><img src={Gmail} alt='gmail'></img></a>
        <div className="copyright">
          <span>Copyright 2020 Leren Inc. All rights reserved</span>
        </div>
      </div>
    </div>
  );
}

export {TopNav, Category, Footer};