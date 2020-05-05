import React from "react";
import { TopNav, Dropdown } from "../components/Reusable";
import {putRequest, getRequest} from "../services/JsonService";
import {Category, Footer} from "../components/Reusable";
import VideoPlayer from "react-video-markers";
import DefaultImage from "../assets/images/default_image.png"
import StarRatings from "react-star-ratings";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

export default class StudentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myFavorites: [],
      showDropdown: false,
      searchInput: "",
      url: "https://res.cloudinary.com/paulo/video/upload/v1588361385/tbcbctfhryhtclvq2czp.mp4",
      isPlaying: false,
      volume: 0.9,
      suggestionCourses: [],
      rating: 0,
    }
  }

  componentDidMount() {
    getRequest("abcdef00011111ghij")
    .then((list) => {
      let user = list[0];
      let suggestionCourses = user.suggestion_courses;
      this.setState({suggestionCourses: suggestionCourses});
      console.log(suggestionCourses);
      console.log(this.state.suggestionCourses);
    })
    .catch((_) => alert("Could not load properly. Please check your connection n refresh"));
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
    if(history) history.goBack();
  } 

  handleSubmit = (e) => {
    e.preventDefault();
    const input = this.state.searchInput
    const resetState = this.resetState;

    function sortCourses(users) {
      console.log(users);
      let queryList = [];

      users.forEach((user) => {
        if(user.id === "abcdef00011111ghij") return;
        let name = user.details.name;
        let courses = user.instructor.courses;
        //get courses based on the user
        if(name.includes(input) || user.details.username.includes(input)) {
          user.instructor.courses.forEach((course) => queryList.push(course));
          console.log(queryList);
        } else {
          courses.forEach((course) => {
            if(course.course_name.includes(input) || course.category.includes(input) || course.course_description.includes(input)) {
              queryList.push(course);
            }
          });
          /*
              Assumption here, that if the query is not found in any of the above 
              parameters, then it was picked in email or other unrelated detail, like url
          */
          if(queryList.length < 1) alert("Unfortunately, your search yielded no results :( ");
          console.log(queryList);
        }
      });
      resetState({suggestionCourses: queryList});
    }

    // Function to ensure that an updated version of the userData is passed
    async function getQueryResponse() {
      const queryData = await getRequest(input);
      if(queryData.length < 1) {
        alert("Unfortunately, your search yielded no results :( ");
        return;
      }
      sortCourses(queryData);
    }

    if(this.state.searchInput === "") {
      alert("Your search field is empty!");
      return;
    }
    getQueryResponse();
    
  }

  handlePlay = () => {
    if(this.state.url === "") {
      alert("You have not selected any video yet");
      return;
    }
    this.setState({isPlaying: true});
  }
  
  handlePause = () => {
    this.setState({isPlaying: false});
  }
  
  handleVolume = value => {
    if(value > 1) value = 1;
    this.setState({volume: value});
  }

  resetState = (newState) => this.setState(newState);

  navContainer = () => {
    // Get the most updated list of courses for the instructor
    const fetchFavorites = () => {
      let storageResponse = localStorage.getItem("userData");
      let userData = JSON.parse(storageResponse);
      let favorites = userData.student.favorites;
      console.log(favorites);
      this.setState({
        myCourses: favorites,
        showDropdown: true,
      });
    }

    return (
      <div className="nav-container">
        <div className="float-left">
          <form onSubmit={this.handleSubmit}>
            <input 
              type="text" placeholder="Search for a topic or instructor" 
              onChange={this.handleInput} value={this.state.searchInput} 
              name="searchInput" className="search-input"
            />
            <input
              type="submit" value="Search" className="search-button"
            />
          </form>
        </div>
        <div className='float-right'>
          <div><button className="nav-btn3" onClick={() => {}} >Teach a course</button></div>
          <div><button className="nav-btn2" onClick={() => fetchFavorites()} >My Favorites</button></div>
          <div><button className="nav-btn1" onClick={() => this.handleLogout} >Log Out</button></div>
        </div>
      </div>
    );
  }

  resetState = (newState) => this.setState(newState);

  deleteFavorite = (index) => {
    let favorites = this.state.myFavorites;
    favorites.splice(index, 1);
    console.log(favorites);
    console.log(this.state.favorites);
    this.setState({myFavorites: favorites})
    console.log(this.state.myFavorites);
    let storageResponse = localStorage.getItem("myFavorites");
    let userData = JSON.parse(storageResponse);
    userData.student.favorites = favorites;
    putRequest(userData.id, userData)
    .then((resp) => {
      localStorage.setItem("myFavorites", JSON.stringify(resp.data));
      alert("Update has been saved successfully!");
    })
  }

  render() {
    const {myFavorites, rating, showDropdown, isPlaying, volume, url, suggestionCourses} = this.state;

    return(
      <div>
        <TopNav navContainer={this.navContainer}/>
        {
          showDropdown && <Dropdown 
            title={"My Course List"}
            listData={myFavorites}
            closeDropdown={this.resetState}
            closable={this.deleteCourse}
          />
        }
        <div className="player-container">
          <VideoPlayer
            url={url}
            isPlaying={isPlaying}
            volume={volume}
            onPlay={this.handlePlay}
            onPause={this.handlePause}
            onVolume={this.handleVolume}
          />
        </div>
        <SuggestionsContainer
         courseList={suggestionCourses}
         resetState={this.resetState}
         rating={rating}
        />
        <Category />
        <Footer />
      </div>
    );
  }
}

const SuggestionsContainer = (props) => {

  class CardContainer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        rating: 0,
      }
    }

    changeRating = (newRating) => {
      console.log("this runs");
      this.setState({rating: newRating})
    }

    render() {
      const {index, course} = this.props
      return(
        <div className="moviecard-container">
        <div className="course-image">
          <img alt="cover poster" src={DefaultImage} />
        </div>
        <div className="card-body">
          <div className="user-image">
            <img src={course.user_image} alt="Instructor-img"/>
          </div>
          <div className="course-details">
            <div className="course-title">
              {course.course_name}
            </div>
            <div className="course-rating">
              <p style={{margin: "0.5em 0px"}}>{course.user_name}</p>
              <StarRatings 
                rating={this.state.rating}
                starRatedColor="yellow"
                changeRating={this.changeRating}
                numberOfStars={5}
                name='rating'
                starSpacing="3px"
                starDimension="30px"
              />
            </div>
          </div>
          <div className="favorite-container">
            <FontAwesomeIcon icon={faHeart} style={{color: "red"}} size="2x" />
          </div>
        </div>
      </div>
      );
    }
  }
  let courses = !(props.courseList && props.courseList.length > 0) ? null : 
  props.courseList.map((course, index) => {
    return(
      <CardContainer key={index} course={course} index={index} />
    );
  });

  return (
    <div className="suggestion-container">
      {courses}
    </div>
  );
}