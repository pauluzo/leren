import React from "react";
import { GoogleLogin, } from 'react-google-login';
import {withRouter} from "react-router-dom";
import {CloseButton} from "../components/Reusable";

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
      <div className='float-right'>
        <div><button className="nav-btn3" onClick={() => onClick("signup", true)} >Become an Instructor</button></div>
        <div><button className="nav-btn2" onClick={() => onClick("login", false)} >Log In</button></div>
        <div><button className="nav-btn1" onClick={() => onClick("signup", false)} >Sign Up</button></div>
      </div>
    );
  }

  resetState = newState => this.setState(newState);

  render() {
    const {isLoggedin, buttonType, isInstructor} = this.state;
    const history = this.props.history;

    return(
      <div className="homepage">
        {isLoggedin && <BackDrop isInstructor={isInstructor} buttonType={buttonType} history={history} resetState={this.resetState}/>}
        <TopNav
          navContainer={() => this.navContainer(this.isLoggedin, this.resetState)}
        />
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
              <button 
                onClick={() => {
                  this.resetState({isLoggedin: true, buttonType: "signup", isInstructor: false});
                }}
              >
                Sign Up
              </button>
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
              <button
                onClick={() => {
                  this.resetState({isLoggedin: true, buttonType: "signup", isInstructor: true});
                }}
              >
                Register
              </button>
            </div>
            <img alt="img2" src={HomeImage2} />
          </div>
        </div>
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
        alert("Username and Password must not be empty");
        return;
      } else if(password.length < 8) {
        alert("Password must contain a minimum of 8 characters");
        return;
      } else if(password !== re_password) {
        alert("The initial password and re-entered password do not match! Check your values and try again");
        return;
      }
      userData.username = username;
      userData.password = password;
      console.log(`${userData.username} ${userData.password}`);

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
      console.log(userData);
      function getUserData () {
        createUser(userData, isInstructor)
        .then((data) => {
          console.log(data);
          localStorage.setItem("userData", JSON.stringify(data));
          if(history) history.push("/profile", `${profile}`);
        })
        .catch((error) => {
          console.log(error);
          alert("This user already exist.");
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
                onFailure={(response) => alert(`Google sign up failed! ${response.error}`)}
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
      }
    }

    // Function to handle the login process
    handleLogin = async () => {
      const {password, email} = this.state;

      if(password === "" || email === "") {
        alert("Error! Your input fields are not properly filled ");
        return;
      }
      const response = await getRequest(email);
      console.log(response);
      if(response) {
        console.log("this runs");
        
        if(response.length < 1) {
          alert("The credentials you entered are incorrect! Please check.");
          return;
        }
        response.forEach((user) => {
          if(user.details.email === email && user.details.password === password) {
            console.log("this runs");
            localStorage.setItem("userData", JSON.stringify(user));
            if(user.isInstructor === true) {
              console.log("instructor");
              history.push("/profile", "instructor");
            } else if(user.isStudent === true) {
              console.log("student");
              history.push("/profile", "student");
            }
            return;
          } else alert("The credentials you entered are incorrect! Please check.");
        });
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
      const {email, password} = this.state;
      return (
        <form className="form-body">
          <div>
            <label>Enter your email</label>
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
              onClick={this.handleLogin}
              type="button" value="Log In"
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
          <h4>Enter your details in the form below</h4>
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