import React from 'react';
import {beginUpload} from "../services/CloudinaryService";
import {putRequest, getRequest} from "../services/JsonService";
import {TopNav, Dropdown} from "../components/Reusable";
import {ReactComponent as CourseIcon1} from "../assets/icons/course1-icon.svg";
import {ReactComponent as CourseIcon2} from "../assets/icons/course2-icon.svg";
import { withRouter } from 'react-router-dom';
import { Nav, Container, Row, Col } from 'react-bootstrap';

class InstructorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseName: '',
      courseDescription: '',
      category: '',
      showDropdown: false,
      myCourses: [],
    }
  }

  changeProfile = () => {
    const resetProfile = this.props.resetProfile;
    resetProfile({isStudent: true})
  }

  handleInput = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    })
  }

  handleLogout = () => {
    const history = this.props.history;
    if(history) {
      history.goBack();
    };
  }

  navContainer = () => {
    // Get the most updated list of courses for the instructor
    const fetchCourses = () => {
      let storageResponse = localStorage.getItem("userData");
      let userData = JSON.parse(storageResponse);
      let courses = userData.instructor.courses;
      if(courses && courses.length > 0) {
        this.setState((prevState) => ({
          myCourses: courses,
          showDropdown: !prevState.showDropdown,
        }));
      } else alert("You don't seem to have any courses uploaded, yet.")
    }

    return (
      <Nav className="ml-auto">
        <Nav.Link onClick={this.changeProfile} >Learn a course</Nav.Link>
        <Nav.Link onClick={() => fetchCourses()} >My Courses</Nav.Link>
        <Nav.Link onClick={this.handleLogout} >Log Out</Nav.Link>
      </Nav>
    );
  }

  deleteCourse = (index) => {
    let courses = this.state.myCourses;
    let deletedCourse = courses.splice(index, 1);
    this.setState({myCourses: courses})
    let storageResponse = localStorage.getItem("userData");
    let userData = JSON.parse(storageResponse);
    userData.instructor.courses = courses;
    putRequest(userData.id, userData)
    .then((resp) => {
      localStorage.setItem("userData", JSON.stringify(resp));
      alert("Update has been saved successfully!");
    });
    getRequest("abcdef00011111ghij")
    .then((resp) => {
      let response = resp[0];
      let suggestCourses = response.suggestion_courses;
      suggestCourses.forEach((course, index) => {
        if(course.id === deletedCourse[0].id) {
          suggestCourses.splice(index, 1);
          response.suggestion_courses = suggestCourses;
          putRequest("abcdef00011111ghij", response)
          .then((_) => {return;})
          .catch("Could not update successfully. Check your network connection");
          return;
        }
      })
    })
  }

  handleSubmit = () => {
    const {courseName, courseDescription, category} = this.state;
    // Function to ensure that an updated version of the userData is passed
    function getUserData() {
      let storageResponse = localStorage.getItem("userData");
      let userData = JSON.parse(storageResponse);
      return userData;
    }

    if(courseName === "" || courseDescription === "") {
      alert("The course name and description must be filled correctly!");
      return;
    }
    let videoDetails = {};
    videoDetails["name"] = courseName;
    videoDetails["description"] = courseDescription;
    videoDetails["category"] = category;
    this.setState({
      courseName: "",
      courseDescription: "",
      category: "",
    })
    beginUpload("videos", getUserData(), videoDetails);
  }

  resetState = (newState) => this.setState(newState);

  render() {
    const {courseName, courseDescription, category, myCourses, showDropdown} = this.state;
    
    return(
      <div className="instructor-page">
        <TopNav navContainer={this.navContainer}/>
        {
          showDropdown && <Dropdown 
            title={"My Course List"}
            listData={myCourses}
            closeDropdown={this.resetState}
            closable={this.deleteCourse}
          />
        }
        <div className="instructor-body">
          <div className="course-container">
            <div className="course-intro">
              <h4>Upload your course</h4>
              <h6>Fill in the necessary details below</h6>
            </div>
            <div className="course-form">
              <form className="form-body">
                <div>
                  <label>Course Name*</label>
                  <input className="input-style"
                    type="text" value={courseName} onChange={this.handleInput}
                    placeholder="e.g. Basic Introduction to React"
                    name="courseName"
                  />
                </div>
                <div>
                  <label>Course Description*</label>
                  <textarea className="input-style"
                    value={courseDescription} onChange={this.handleInput}
                    placeholder="e.g. A comprehensive Introduction to 
                      understanding the basics of react"
                      name="courseDescription"
                  />
                </div>
                <div>
                  <label>Category</label>
                  <input className="input-style"
                    type="text" value={category} onChange={this.handleInput}
                    placeholder="e.g. React, JavaScript" name="category"
                  />
                </div>
                <div>
                  <label>Upload video file</label>
                  <input className="upload-button"
                    onClick={(e) => {
                      e.preventDefault();
                      this.handleSubmit();
                    }}
                    type="button"
                    value="Upload Video"
                  />
                </div>
              </form>
            </div>
          </div>
          <h6>Getting started with creating courses? These materials would be helpful</h6>
          <Container className="instructor-materials" fluid>
            <Row>
              <Col xs="12" sm="8" >
                <h4>Create an engaging course</h4>
                <p>
                  Irrespective of teaching experience, you can make an engaging
                  course. Check the link below, it's a great place to start.
                </p>
                <span><a style={{textDecoration: "none"}} href="https://www.github.com/pauluzo">Read more</a></span>
              </Col>
              <Col xs="12" sm="4">
                <CourseIcon1 style={{width: "10em", height: "10em"}} />
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="4">
                <CourseIcon2 style={{width: "9em", height: "9em"}} />
              </Col>
              <Col xs="12" sm="8">
                <h4>Get started with videos</h4>
                <p>
                  Quality video lectures can set your course apart and are
                  more appealing to students. Looking to get started? Check the link below.
                </p>
                <span><a style={{textDecoration: "none"}} href="https://www.github.com/pauluzo">Read more</a></span>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default withRouter(InstructorPage);