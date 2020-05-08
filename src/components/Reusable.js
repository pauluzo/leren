import React, { useEffect } from "react";
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
  const NavContainer = props.navContainer;
  return(
    <div className="topnav">
      <img src={Logo} alt="Logo" style={{height: "2em", width: "4.5em", marginRight: "20px"}}/>
      <NavContainer/>
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
  const Cards = popularCategories.map((category, index) => {
    return SubjectCard(category, index);
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

function SubjectCard (props, index) {
  let Icon = props.icon
  return (
    <div className="subject-card"  key={index}>
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

const Dropdown = (props) => {
  useEffect(() => {
    console.log("this runs onLoad");
  })

  const ListTiles = (props) => {
    const getTiles = () => props.listData.map((courseData, index) => {
      return ListTile(courseData, index, props.closable);
    });

    let tiles = getTiles();
    return tiles;
  }

  console.log(props);
  return(
    <div className="dropdown-container">
      <div className="title">
        <p>{props.title}</p>
        <CloseButton onClick={() => props.closeDropdown({showDropdown: false})}/>
      </div>
      <div className="list-container">
        {props.listData.length > 1 ? <ListTiles listData={props.listData} closable={props.closable} /> : alert("You have not selected any favorite movie(s) yet.")}
      </div>
    </div>
  );
}

const ListTile = (data, index, deleteFunction) => {
  const style = {
    backgroundColor: "white",
    color: "red",
  }

  return (
    <div key={index} className="tile-container">
      <div className="serial-number">
        {index + 1}
      </div>
      <div className="list-body">
        <div className="list-title">
          {data.course_name.length > 30 ? (data.course_name.slice(0, 30) + "...") : data.course_name}
        </div>
        <div className="list-description">
          {data.course_description.length > 50 ? (data.course_description.slice(0, 50) + "...") : data.course_description}
        </div>
      </div>
      <div className="list-rating">
        <div>Rating</div>
        {(data.rating === 0) ? "N/A" : data.rating}
      </div>
      {deleteFunction && <div className="btn-container"> <CloseButton style={style} onClick={() => deleteFunction(index)} index={index} /> </div>}
    </div>
  );
}

const CloseButton = (props) => {
  let style = props.style ? props.style : {};
  return <button style={style} className="close-btn" onClick={() => props.onClick(props.index)} >X</button>;
}

export {TopNav, Category, Footer, Dropdown, CloseButton};