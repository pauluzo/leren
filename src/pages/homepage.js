import React from "react";
import "../Apps.css";
import { GoogleLogin } from 'react-google-login';
import {withRouter} from "react-router-dom";
import {CloseButton} from "../components/Reusable";
import {Container, Nav, Row, Col, Image} from "react-bootstrap";
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

import {TopNav, Category, Footer} from "../components/Reusable";
import {createUser} from "../components/logic";
import HomeImage1 from "../assets/images/home-img1.png"
import HomeImage2 from "../assets/images/home-img2.png"
import { getRequest } from "../services/JsonService";

// Home page which is to be displayed once the application is started
class HomePage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isLoggedin: false,
      buttonType: "login",
      isInstructor: false,
    }
  }

  navContainer = (loginStatus, resetState) => {
    function onClick(buttonType, isInstructor) {
      let status = loginStatus;
      resetState({isLoggedin: (!status), buttonType: buttonType, isInstructor: isInstructor});
    }
    
    return (
      <Nav className='ml-auto'>
        <Nav.Link onClick={() => onClick("signup", true)} >Become an Instructor</Nav.Link>
        <Nav.Link onClick={() => onClick("login", false)} >Log In</Nav.Link>
        <Nav.Link onClick={() => onClick("signup", false)} >Sign Up</Nav.Link>
      </Nav>
    );
  }

  resetState = newState => this.setState(newState);

  render() {
    const {isLoggedin, buttonType, isInstructor} = this.state;
    const history = this.props.history;

    return(
      <div className="homepage">
        <ToastsContainer position={ToastsContainerPosition.TOP_LEFT} store={ToastsStore}/>
        {isLoggedin && <BackDrop isInstructor={isInstructor} buttonType={buttonType} history={history} resetState={this.resetState}/>}
        <TopNav
          navContainer={() => this.navContainer(this.isLoggedin, this.resetState)}
        />
        <div className="header">
          <div className="header-details">
            <h1>Accelerate your career!</h1>
            <h4>
              Gain access to online courses, instructors, certificates and degrees from world-class tutors and organisations.
            </h4>
            <button className="col-btn" 
              style={{fontSize: "1.2em", backgroundColor: "rgb(90, 38, 211)"}}
              onClick={() => {
                this.resetState({isLoggedin: true, buttonType: "signup", isInstructor: false});
              }}
            >
              Get Started
            </button>
          </div>
        </div>
        <Container fluid style={{marginBottom: "10px"}}>
          <Row className="row" >
            <Col className="column" xs={12} sm={12} lg={6}>
              <div>
                <Image src={HomeImage1} fluid />
              </div>
              <div className="btn-container">
                <span>Become a Student</span>
                <button className="col-btn" 
                  onClick={() => {
                    this.resetState({isLoggedin: true, buttonType: "signup", isInstructor: false});
                  }}
                >
                  Sign Up
                </button>
              </div>
            </Col>
            <Col className="home-text-col" xs={12} sm={12} lg={6} >
              Becoming a student gives you access to millions of videos from instructors
              all over the world, interactive sessions with instructors and fellow 
              students. Build your expertise, and become an instructor as well.
            </Col>
          </Row>
        </Container>
        <Container fluid style={{marginBottom: "10px"}}>
          <Row className="row">
            <Col className="home-text-col" xs={12} sm={12} lg={6}>
              Being an instructor entails access to videos uploaded by other instructors,
              thereby giving you the option to learn, while teaching others. Get amazing opportunities for
              growth and experience.
            </Col>
            <Col className="column" xs={12} sm={12} lg={6}>
              <div className="btn-container">
                <span>Become an instructor</span>
                <button className="col-btn"
                  onClick={() => {
                    this.resetState({isLoggedin: true, buttonType: "signup", isInstructor: true});
                  }}
                >
                  Register
                </button>
              </div>
              <div>
                <Image src={HomeImage2} fluid />
              </div>
            </Col>
          </Row>
        </Container>
        <Category/>
        <Footer/>
      </div>
    );
  }
}

// Backdrop component that renders when sign-up/log-in button is clicked
const BackDrop = props => {
  // User data that is saved after successful sign-in
  var userData = {
    username: "",
    password: "",
    googleCred: {},
  };
  const {history, isInstructor} = props;

  class SignInForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        password: "",
        re_password: "",
        username: "",
        showGoogleBtn: false
      }
    }

    handleSignup = () => {
      const {username, password, re_password} = this.state;
      if(username === "" || password === "") {
        ToastsStore.error("Username and Password must not be empty");
        return;
      } else if(password.length < 8) {
        ToastsStore.error("Password must contain a minimum of 8 characters");
        return;
      } else if(password !== re_password) {
        ToastsStore.error("The initial password and re-entered password do not match! Check your values and try again");
        return;
      }
      userData.username = username;
      userData.password = password;

      this.setState({
        username: "",
        password: "",
        re_password: "",
        showGoogleBtn: true
      });
    }
  
    // Function to handle the form input change
    handleInput = (event) => {
      const target = event.target;
      const name = target.name;
      const value = target.value;
      this.setState({
        [name]: value
      });
    }

    responseGoogle = response => {
      const profile = isInstructor ? "instructor" : "student";
      userData.googleCred = response.profileObj;
      function getUserData () {
        createUser(userData, isInstructor)
        .then((data) => {
          if(data.error) {
            ToastsStore.error(data.error);
            return;
          }
          localStorage.setItem("userData", JSON.stringify(data));
          if(history) history.push("/profile", `${profile}`);
        })
        .catch((error) => {
          ToastsStore.error("An error occured! Try again, later");
        })
      }
      getUserData();
    }

    render() {
      const {username, password, re_password, showGoogleBtn} = this.state;
    
      const GoogleButton = () => {
        return (
          <div>
            <p style={{fontSize: "13px"}}>Saved! Click this button to complete sign-up</p>
            <div style={{width: "120px"}}>
              <GoogleLogin
                clientId="644395597963-2o1pb5pe1k1eo9nrhij9acpkrugf2b75.apps.googleusercontent.com"
                buttonText="Sign Up"
                onSuccess={this.responseGoogle}
                onFailure={(response) => ToastsStore.error(`Google sign up failed! ${response.error}`)}
                cookiePolicy={'single_host_origin'}
              />
            </div>
          </div>
        );
      }

      return (
        <form className="form-body">
          <div>
            <label>Username</label>
            <input className="input-style"
              type="text" placeholder="enter your username"
              value={username} name="username"
              onChange={this.handleInput}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              className="input-style" type="password" name="password"
              placeholder="enter your password" value={password}
              onChange={this.handleInput}
            />
            <p style={{fontSize: "12px", margin: "0px"}}>Password must contain at least 8 characters*</p>
          </div>
          <div>
            <label>Re-enter Password</label>
            <input 
              className="input-style" type="password" name="re_password"
              placeholder="re-enter your password" value={re_password}
              onChange={this.handleInput}
            />
            <p style={{fontSize: "12px", margin: "0px"}}>Re-entered password must match the first password*</p>
          </div>
          {
            showGoogleBtn === false ? 
            (
              <div>
                <input className="upload-button"
                  onClick={this.handleSignup}
                  type="button" value="Sign Up"
                />
              </div>
            ) :
            <GoogleButton/>
          }
        </form>
      );
    }
  };

  class LoginForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        password: "",
        email: "",
        loading: false
      }
    }

    // Function to handle the login process
    handleLogin = async () => {
      this.setState({loading: true});
      const {password, email} = this.state;

      if(password === "" || email === "") {
        ToastsStore.error("Error! Your input fields are not properly filled ");
        this.setState({loading: false});
        return;
      }
      const response = await getRequest(email);
      if(!response.error) {
        if(response.length < 1) {
          ToastsStore.error("The credentials you entered are incorrect! Please check.");
          this.setState({loading: false});
          return;
        }
        response.forEach((user) => {
          if(user.details.email === email && user.details.password === password) {
            localStorage.setItem("userData", JSON.stringify(user));
            if(user.isInstructor) {
              history.push("/profile", "instructor");
            } else if(user.isStudent) {
              history.push("/profile", "student");
            }
            return;
          } else {
            this.setState({loading: false});
            ToastsStore.error("The credentials you entered are incorrect! Please check.");
          }
        });
      } else {
        this.setState({loading: false});
        ToastsStore.error(`An error occured, ${response.error}`);
      }
    }

    // Function to handle the form input change
    handleInput = (event) => {
      const target = event.target;
      const name = target.name;
      const value = target.value;
      this.setState({
        [name]: value
      })
    }

    render() {
      const {email, password, loading} = this.state;
      return (
        <form className="form-body">
          <div>
            <label>Email</label>
            <input className="input-style"
              type="text" placeholder="enter your registered email."
              value={email} name="email" onChange={this.handleInput}
            />
          </div>
          <div>
            <label>Password</label>
            <input 
              className="input-style" type="password" name="password"
              placeholder="enter your password here" value={password}
              onChange={this.handleInput}
            />
            <p style={{fontSize: "12px", margin: "0px"}}></p>
          </div>
          <div>
            <input className="upload-button"
              onClick={loading ? null : this.handleLogin}
              type="button" value={loading ? "Loading..." : "Log In"} 
            />
          </div>
        </form>
      );
    }
  }

  return(
    <div className='backDrop'>
      <div className="form-container">
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%"}}>
          <h4>Enter your details below</h4>
          <CloseButton onClick={() => props.resetState({isLoggedin: false})}/>
        </div>
        {
          (props.buttonType === "login") ? 
          <LoginForm/> : <SignInForm googleButton={props.googleButton} isInstructor={isInstructor}/>
        }
      </div>
    </div>
  );
}

export default withRouter(HomePage);