import React from "react";
import { TopNav, Dropdown } from "../components/Reusable";
import {getRequest} from "../services/JsonService";
import {Category, Footer} from "../components/Reusable";
import StarRatings from "react-star-ratings";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart} from '@fortawesome/free-solid-svg-icons';
import {faHeart as farHeart} from "@fortawesome/free-regular-svg-icons"
import {ReactComponent as PlayIcon} from "../assets/icons/play-icon.svg";
import { withRouter } from "react-router-dom";
import { Nav, Container } from 'react-bootstrap';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

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
      let myFavs = favCourses ? JSON.parse(favCourses) : null;
      // Function to get this user's list of favorite subjects
      if(myFavs) {
        console.log(myFavs);
        resetState({myFavorites: myFavs});
      } else {
        localStorage.setItem("myFavs", JSON.stringify([]));
      }
      if (userData) resetState({userData: userData, userName: userData.details.name})
    }
    getUserData();
    getRequest("abcdef00011111ghij")
    .then((list) => {
      console.log(list);
      let user = list[0];
      let suggestionCourses = user.suggestion_courses;
      this.setState({suggestionCourses: suggestionCourses});
    })
    .catch((error) => ToastsStore.error(`Could not load properly. Please check your connection and refresh the page ${error}`));
  }

  componentWillUnmount() {
    localStorage.setItem("myFavs", JSON.stringify(this.state.myFavorites));
    console.log("this runs: component will unmount");
  }

  changeProfile = () => {
    const resetProfile = this.props.resetProfile;
    resetProfile({isStudent: false})
  }

  handleLogout = () => {
    const history = this.props.history;
    if(history) history.goBack();
  } 

  handleFavorites = (isFavorite, myFavorites, nowPlaying) => {
    const resetState = this.resetState;
    let myFavs = myFavorites;

    function setFavorite() {
      let prevLength = myFavorites.length;
      let newLength = 0;
      myFavs.forEach((favCourse, index) => {
        if(favCourse.id === nowPlaying.id) {
          prevLength = myFavs.length;
          myFavs.splice(index, 1);
          resetState({isFavorite: !isFavorite, myFavorites: myFavs});
          return;
        } else newLength += 1;
      });
      if(prevLength === newLength) {
        myFavs.push(nowPlaying);
        resetState({isFavorite: !isFavorite, myFavorites: myFavs});
      }
    }
    
    setFavorite();
  }

  handleSubmit = (searchInput) => {
    const input = searchInput.toLowerCase();
    const resetState = this.resetState;

    function sortCourses(users) {
      let queryList = [];

      users.forEach((user) => {
        if(user.id === "abcdef00011111ghij") return;
        let name = user.details.name.toLowerCase();
        let username = user.details.username.toLowerCase();
        let courses = user.instructor.courses;
        //get courses based on the user
        if(name.includes(input) || username.includes(input)) {
          courses.forEach((course) => queryList.push(course));
        } else {
          courses.forEach((course) => {
            if(course.course_name.toLowerCase().includes(input) || course.category.toLowerCase().includes(input) || course.course_description.includes(input)) {
              queryList.push(course);
            }
          });
          /*
              Assumption here, that if the query is not found in any of the above 
              parameters, then it was picked in email or other unrelated detail, like url
          */
          if(queryList.length < 1) {
            ToastsStore.error("Unfortunately, your search yielded no results :(");
            return;
          };
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
      if (queryData.error) {
        ToastsStore.error(`An error occured: ${queryData.error}`);
        return;
      }
       else if(queryData.length < 1) {
        ToastsStore.error("Unfortunately, your search yielded no results :( ");
        return;
      }
      sortCourses(queryData);
    }

    if(searchInput === "") {
      ToastsStore.error("Your search field is empty!");
      return;
    }
    getQueryResponse();
    
  }

  resetState = (newState) => this.setState(newState);

  navContainer = () => {
    // Get the most updated list of favorites for the student
    const fetchFavorites = () => {
      let favorites = this.state.myFavorites;
      if(favorites && favorites.length > 0) {
        this.setState((prevState) => ({
          showDropdown: !prevState.showDropdown,
        }));
      } else ToastsStore.info("You have not added any favorite course(s)")
    }

    return (
        <Nav className='ml-auto'>
          <Nav.Link onClick={this.changeProfile} >Teach a course</Nav.Link>
          <Nav.Link onClick={fetchFavorites} >My Favorites</Nav.Link>
          <Nav.Link onClick={this.handleLogout} >Log Out</Nav.Link>
        </Nav>
    );
  }

  deleteFavorite = (index) => {
    let favorites = this.state.myFavorites;
    let nowPlaying = this.state.nowPlaying;
    if(nowPlaying && (nowPlaying.id === favorites[index].id)) {
      this.setState({isFavorite: false});
    }
    favorites.splice(index, 1);
    this.setState({myFavorites: favorites})
  }

  changeRating = (newRating) => this.setState({rating: newRating});

  render() {
    const {userName, myFavorites, isFavorite, rating, showDropdown, url, suggestionCourses, nowPlaying, searchResult} = this.state;

    return(
      <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <ToastsContainer position={ToastsContainerPosition.TOP_LEFT} store={ToastsStore}/>
        <TopNav 
          navContainer={this.navContainer}
          handleSubmit={this.handleSubmit}
          resetState={this.resetState}
        />
        {
          showDropdown && <Dropdown 
            title={"My Favorite Courses"}
            listData={myFavorites}
            closeDropdown={this.resetState}
            closable={this.deleteFavorite}
          />
        }
        <div className="student-page">
        <Container fluid="sm" className="player-container">
          <video style={{width: "100%", height: "auto"}}
            src={url}
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
                <div style={{paddingTop: "3px", display: "flex",
                  alignItems: "flex-end"}}
                >
                  <FontAwesomeIcon 
                    icon={isFavorite ? faHeart : farHeart} style={{color: "red", cursor: "pointer"}} size="2x"
                    onClick={() => this.handleFavorites(isFavorite, myFavorites, nowPlaying)}
                  />
                </div>
              </div>
            </div>
          }
        </Container>
        <div className="page-body">
          <div>
            <h2 style={{borderBottom: "1px solid grey"}}>{`Welcome, ${userName}`}</h2>
          </div>
          { searchResult ? 
            <div style={{borderBottom: "1px solid grey"}}>
              <h4>Here are your search results</h4>
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
      suggestedCourses.splice(index, 1);
      resetState({
        nowPlaying: course,
        url: course.link,
        suggestedCourses: suggestedCourses,
        isFavorite: this.state.isFavorite,
        rating: 0,
      });
    }

    changeRating = (_) => ToastsStore.error("You have to watch a video to set a rating or add to favorites");

    render() {
      const {course} = this.props;
      return(
        <div className="moviecard-container">
        <div className="course-image" onClick={this.handleClick}>
          <img style={{opacity: "0.8"}} alt="cover poster" src={course.cover_image} />
          <PlayIcon style={{position: "absolute"}} />
        </div>
        <div className="card-body">
          <div className="user-image">
            <img src={course.user_image} alt="img"/>
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