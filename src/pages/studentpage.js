import React from "react";
import { TopNav, Dropdown } from "../components/Reusable";
import {getRequest} from "../services/JsonService";
import {Category, Footer} from "../components/Reusable";
import DefaultImage from "../assets/images/default_image.png"
import StarRatings from "react-star-ratings";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart} from '@fortawesome/free-solid-svg-icons';
import {faHeart as farHeart} from "@fortawesome/free-regular-svg-icons"
import {ReactComponent as PlayIcon} from "../assets/icons/play-icon.svg";
import { withRouter } from "react-router-dom";

class StudentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      userName: "",
      myFavorites: [],
      isFavorite: false,
      showDropdown: false,
      searchInput: "",
      suggestionCourses: [],
      rating: 0,
      url: "",
      nowPlaying: null,
      searchResult: false,
    }
  }

  componentDidMount() {
    const resetState = this.resetState;
    function getUserData() {
      let storageResponse = localStorage.getItem("userData");
      let userData = JSON.parse(storageResponse);
      let favCourses = localStorage.getItem("myFavs");
      // Function to get this user's list of favorite subjects
      if(favCourses) {
        console.log(favCourses);
        let myFavs = JSON.parse(favCourses);
        resetState({myFavorites: myFavs});
      } else {
        localStorage.setItem("myFavs", JSON.stringify([]));
        console.log("this runs: set favs in storage");
      }
      if (userData) resetState({userData: userData, userName: userData.details.name})
    }
    getUserData();
    getRequest("abcdef00011111ghij")
    .then((list) => {
      let user = list[0];
      let suggestionCourses = user.suggestion_courses;
      this.setState({suggestionCourses: suggestionCourses});
      console.log(suggestionCourses);
      console.log(this.state.suggestionCourses);
    })
    .catch((_) => alert("Could not load properly. Please check your connection and refresh the page"));
  }

  componentWillUnmount() {
    localStorage.setItem("myFavorites", this.state.myFavorites);
    console.log("this runs: component will unmount");
  }

  changeProfile = () => {
    const resetProfile = this.props.resetProfile;
    resetProfile({isStudent: false})
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

  handleFavorites = (isFavorite, myFavorites, nowPlaying) => {
    console.log("this runs: favorites handle");
    console.log(`${isFavorite} ${myFavorites.length} ${nowPlaying.toString()}`);
    const resetState = this.resetState;
    let myFavs = myFavorites;
    function setFavorite() {
      console.log("this runs too: set favorites");
      let prevLength = myFavorites.length;
      let newLength = 0;
      myFavs.forEach((favCourse, index) => {
        console.log("this runs too: for each");
        if(favCourse.id === nowPlaying.id) {
          prevLength = myFavs.length;
          console.log(prevLength);
          console.log(myFavs);
          myFavs.splice(index, 1);
          console.log(myFavs);
          console.log(newLength);
          resetState({isFavorite: !isFavorite, myFavorites: myFavs});
          return;
        } else newLength += 1;
      });
      if(prevLength === newLength) {
        console.log(myFavs.length);
        myFavs.push(nowPlaying);
        resetState({isFavorite: !isFavorite, myFavorites: myFavs});
        console.log(`${myFavs.length} ${prevLength} `);
      }
    }
    
    setFavorite();
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
          if(queryList.length < 1) {
            alert("Unfortunately, your search yielded no results :( this runss ");
            return;
          };
          console.log(queryList);
        }
      });
      if(queryList.length > 0) {
        resetState({
          suggestionCourses: queryList, searchResult: true,
          searchInput: ""
        });
      } else {
        resetState({
          searchInput: ""
        });
      }
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

  resetState = (newState) => this.setState(newState);

  navContainer = () => {
    // Get the most updated list of favorites for the student
    const fetchFavorites = () => {
      let storageResponse = localStorage.getItem("userData");
      let userData = JSON.parse(storageResponse);
      let favorites = userData.student.favorites;
      console.log(favorites);
      this.setState((prevState) => ({
        myCourses: favorites,
        showDropdown: !prevState.showDropdown,
      }));
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
          <div><button className="nav-btn3" onClick={this.changeProfile} >Teach a course</button></div>
          <div><button className="nav-btn2" onClick={fetchFavorites} >My Favorites</button></div>
          <div><button className="nav-btn1" onClick={this.handleLogout} >Log Out</button></div>
        </div>
      </div>
    );
  }

  deleteFavorite = (index) => {
    let favorites = this.state.myFavorites;
    let nowPlaying = this.state.nowPlaying;
    if(nowPlaying && (nowPlaying.id === favorites[index].id)) {
      this.setState({isFavorite: false});
    }
    favorites.splice(index, 1);
    console.log(favorites);
    console.log(this.state.favorites);
    this.setState({myFavorites: favorites})
    console.log(this.state.myFavorites);
  }

  changeRating = (newRating) => this.setState({rating: newRating});

  render() {
    const {userName, myFavorites, isFavorite, rating, showDropdown, url, suggestionCourses, nowPlaying, searchResult} = this.state;

    return(
      <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <TopNav navContainer={this.navContainer}/>
        {
          showDropdown && <Dropdown 
            title={"My Favorite Courses"}
            listData={myFavorites}
            closeDropdown={this.resetState}
            closable={this.deleteFavorite}
          />
        }
        <div className="student-page">
        <div className="player-container">
          <video 
            src={url} style={{width: "640px"}}
            preload="true" loop controls autoPlay 
          />
          {
            !(nowPlaying) ? null :
            <div>
              <div style={{display: "flex", flexDirection: "column", padding: "0px 20% 10px 0px"}}>
                <span style={{fontWeight: "500", padding: "5px 0px"}}>{nowPlaying.course_name}</span>
                <span>{nowPlaying.course_description}</span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between", marginTop: "10px"}}>
                <div style={{display: "flex", flexDirection: "column"}}>
                  <span>{nowPlaying.user_name}</span>
                  <StarRatings 
                    rating={rating}
                    starRatedColor="blue"
                    changeRating={this.changeRating}
                    numberOfStars={5}
                    name='rating'
                    starSpacing="3px"
                    starDimension="30px"
                  />
                </div>
                <div style={{paddingTop: "3px"}}>
                  <FontAwesomeIcon 
                    icon={isFavorite ? faHeart : farHeart} style={{color: "red", cursor: "pointer"}} size="2x"
                    onClick={() => this.handleFavorites(isFavorite, myFavorites, nowPlaying)}
                  />
                </div>
              </div>
            </div>
          }
        </div>
        <div className="page-body">
          <div>
            <h2 style={{borderBottom: "1px solid grey"}}>{`Welcome, ${userName}`}</h2>
          </div>
          { searchResult ? 
            <div style={{borderBottom: "1px solid grey"}}>
              <h4>Here are your seearch results</h4>
            </div> : 
            <div style={{borderBottom: "1px solid grey", display: "flex", flexDirection: "column"}}>
              <h4>What to learn next?</h4>
              <span>We have suggested top learning videos from all over the world, for you.</span>
            </div>
          }
          <SuggestionsContainer
            courseList={suggestionCourses}
            resetState={this.resetState}
            favList={myFavorites}
          />
        </div>
        <Category />
        <Footer />
        </div>
      </div>
    );
  }
}

const SuggestionsContainer = (props) => {

  class CardContainer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isFavorite: props.isFavorite
      }
    }

    handleClick = () => {
      const {courseList, index, resetState, course} = this.props;
      let suggestedCourses = courseList;
      console.log(suggestedCourses);
      console.log(index);
      suggestedCourses.splice(index, 1);
      console.log(suggestedCourses);
      resetState({
        nowPlaying: course,
        url: course.link,
        suggestedCourses: suggestedCourses,
        isFavorite: this.state.isFavorite,
        rating: 0,
      });
      console.log(suggestedCourses)
    }

    changeRating = (_) => alert("You have to watch a video to set a rating or add to favorites");

    render() {
      const {course} = this.props;
      return(
        <div className="moviecard-container">
        <div className="course-image" onClick={this.handleClick}>
          <img alt="cover poster" src={DefaultImage} />
          <PlayIcon style={{position: "absolute"}} />
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
            <FontAwesomeIcon icon={this.state.isFavorite ? faHeart : farHeart} 
              style={{color: "red"}} 
              size="2x" onClick={() => this.changeRating}
            />
          </div>
        </div>
      </div>
      );
    }
  }

  let courses = !(props.courseList && props.courseList.length > 0) ? null : 
  props.courseList.map((course, index) => {
    let favList = props.favList;
    let isFavorite = false;
    if(favList) {
      favList.forEach((favCourse) => {
        if(favCourse.id === course.id) {
          isFavorite = true;
          return;
        }
      })
    }

    return(
      <CardContainer 
        key={index} course={course} 
        index={index} favList={props.favList}
        resetState={props.resetState} courseList={props.courseList}
        isFavorite={isFavorite}
      />
    );
  });
  


  return (
    <div className="suggestion-container">
      {courses}
    </div>
  );
}

export default withRouter(StudentPage);