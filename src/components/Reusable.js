import React from "react";
import Logo from "../assets/images/logo.png";
import {Navbar, Container, Row, Col, Image, } from "react-bootstrap";

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
class TopNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      width: 0,
      height: 0,
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  navContainer = this.props.navContainer;
  resetState = this.props.resetState;
  handleSubmit = this.props.handleSubmit;
  submit = (e) => {
    e.preventDefault();
    this.handleSubmit(this.state.input);
    this.setState({input: ""});
  }

  searchContainer = () => {
    return (
      <div className="mr-auto">
        <form onSubmit={this.submit}>
          <input 
            type="text" placeholder="Search for a topic or instructor" 
            onChange={this.handleInput} value={this.state.input} 
            name="input" className="search-input"
          />
          <input
            type="submit" value="Search" className="search-button"
          />
        </form>
      </div>
    )
  }

  handleInput = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name] : value
    })
    this.resetState({searchInput: this.state.input});
  }

  render() {
    const SearchContainer = this.searchContainer;
    const NavContainer = this.props.navContainer;
    return(
      <Navbar fixed="top" collapseOnSelect expand="lg" variant="dark" style={{backgroundColor: "rgb(61, 15, 134)"}}>
        { !(this.handleSubmit && this.state.width < 560) && 
          <Navbar.Brand href="#home">
            <img src={Logo} alt="Logo" />
          </Navbar.Brand>
        }
        {this.handleSubmit && <SearchContainer/>}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <NavContainer/>
        </Navbar.Collapse>
      </Navbar>
    );
  }
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
      <Icon style={{width: "3.5rem", height: "3.5rem"}} />
      <span>{props.title}</span>
    </div>
  );
}

const Footer = () => {
  return(
    <Container fluid>
      <Row>
        <Col xs="12" sm="4">
          <LogoIcon style={{height: "100px", width: "200px"}}/>
        </Col>
        <Col className="icon-column" xs="12" sm="8">
          <a target='_blank' rel='noopener noreferrer' href='https://www.github.com/pauluzo'><Image className="footer-icon" src={Github} alt='github' fluid /></a>
          <a target='_blank' rel='noopener noreferrer' href='https://twitter.com/papizone'><Image className="footer-icon" src={Twitter} alt='twitter' fluid /></a>
          <a target='_blank' rel='noopener noreferrer' href='https://www.linkedin.com/in/paul-okafor-b51ab01a2/'><Image className="footer-icon" src={LinkedIn} alt='linkedIn' /></a>
          <a target='_blank' rel='noopener noreferrer' href='mailto:okaforpaul26@gmail.com'><Image className="footer-icon" src={Gmail} alt='gmail' fluid /></a>
        </Col>
      </Row>
      <Row>
        <Col className="footer-copyright">
          <span>Copyright 2020 Leren Inc. All rights reserved</span>
        </Col>
      </Row>
    </Container>
  );
}

const Dropdown = (props) => {
  const ListTiles = (props) => {
    const getTiles = () => props.listData.map((courseData, index) => {
      return ListTile(courseData, index, props.closable);
    });

    let tiles = getTiles();
    return tiles;
  }

  return(
    <div className="dropdown-container">
      <div className="title">
        <p>{props.title}</p>
        <CloseButton onClick={() => props.closeDropdown({showDropdown: false})}/>
      </div>
      <div className="list-container">
        <ListTiles listData={props.listData} closable={props.closable} />
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