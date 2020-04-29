import React, {useState} from 'react';
import{beginUpload} from "../services/CloudinaryService";
import {TopNav} from "../components/Reusable";
import {ReactComponent as CourseIcon1} from "../assets/icons/course1-icon.svg";
import {ReactComponent as CourseIcon2} from "../assets/icons/course2-icon.svg";

function InstructorPage() {
  const [courseName, setName] = useState("");
  const [courseDescription, setDescription] = useState("");
  const [category, setCategory] = useState("");

  return(
    <div>
      <TopNav/>
      <div className="instructor-body">
        <div className="course-container">
          <div className="course-intro">
            <h3>Upload your course</h3>
            <h5>Fill in the necessary details below</h5>
          </div>
          <div className="course-form">
            <form className="form-body">
              <div>
                <label>Course Name</label>
                <input className="input-style"
                  type="text" value={courseName} onChange={setName}
                  placeholder="e.g. Basic Introduction to React"
                />
              </div>
              <div>
                <label>Course Description</label>
                <textarea className="input-style"
                  value={courseDescription} onChange={setDescription}
                  placeholder="e.g. A comprehensive Introduction to 
                    understanding the basics of react"
                />
              </div>
              <div>
                <label>Category</label>
                <input className="input-style"
                  type="text" value={category} onChange={setCategory}
                  placeholder="e.g. React, JavaScript"
                />
              </div>
              <div>
                <label>Upload video file</label>
                <input className="upload-button"
                  onClick={(e) => {
                    e.preventDefault();
                    beginUpload("video");
                  }}
                  type="button"
                  value="Upload Video"
                />
              </div>
            </form>
          </div>
        </div>
        <div className="resources-container">
          <h4>Getting started with creating courses? These materials would be helpful</h4>
          <div className="material-container">
            <div className="material-message">
              <h4>Create an engaging course</h4>
              <p>
                Irrespective of teaching experience, you can make an engaging
                course. Check the link below, it's a great place to start.
              </p>
              <span><a style={{textDecoration: "none"}} href="https://www.github.com/pauluzo">Read more</a></span>
            </div>
            <div className="material-icon">
              <CourseIcon1 style={{width: "10em", height: "10em"}} />
            </div>
          </div>
          <div className="material-container">
            <div className="material-icon">
              <CourseIcon2 style={{width: "9em", height: "9em"}} />
            </div>
            <div className="material-message">
              <h4>Get started with videos</h4>
              <p>
                Quality video lectures can set your course apart and are
                more appealing to students. Looking to get started? Check the link below.
              </p>
              <span><a style={{textDecoration: "none"}} href="https://www.github.com/pauluzo">Read more</a></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorPage;