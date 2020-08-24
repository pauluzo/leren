import React from "react";
import { TopNav, Dropdown } from "../components/Reusable";
import {getRequest, putRequest} from "../services/JsonService";
import {Category, Footer} from "../components/Reusable";
import StarRatings from "react-star-ratings";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faSpinner} from '@fortawesome/free-solid-svg-icons';
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
      isLoading: true,
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
        resetState({myFavorites: myFavs});
      } else {
        localStorage.setItem("myFavs", JSON.stringify([]));
      }
      if (userData) resetState({userData: userData, userName: userData.details.name})
    }
    getUserData();
    getRequest(null, null, true)
    .then((list) => {
      if(list.error) {
        ToastsStore.error(`Could not load properly. Please check your connection and refresh the page ${list.error}`)
        this.setState({isLoading: false});
      } else {
        this.setState({suggestionCourses: list, isLoading: false})
      }
    })
    .catch((error) => {
      ToastsStore.error(`Could not load properly. Please check your connection and refresh the page ${error}`)
      this.setState({isLoading: false});
    });
  }

  componentWillUnmount() {
    localStorage.setItem("myFavs", JSON.stringify(this.state.myFavorites));
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
      for (let index = 0; index < myFavs.length; index++) {
        const favCourse = myFavs[index];
        if(favCourse._id === nowPlaying._id){
          prevLength = myFavs.length;
          myFavs.splice(index, 1);
          resetState({isFavorite: !isFavorite, myFavorites: myFavs});
          putRequest(nowPlaying._id, {user_name: nowPlaying.user_name}, 'remove')
          break;
        } else newLength += 1;
      }
      if(prevLength === newLength) {
        myFavs.push(nowPlaying);
        resetState({isFavorite: !isFavorite, myFavorites: myFavs});
        putRequest(nowPlaying._id, {user_name: nowPlaying.user_name}, 'add');
      }
    }
    
    setFavorite();
  }

  handleSubmit = (searchInput) => {
    const input = searchInput;
    const resetState = this.resetState;

    // Function to ensure that an updated version of the userData is passed
    async function getQueryResponse() {
      const queryData = await getRequest(null, input);
      if (queryData.error) {
        ToastsStore.error(`An error occured: ${queryData.error}`);
        return;
      }
       else if(queryData.length < 1) {
        ToastsStore.error("Unfortunately, your search yielded no results :( ");
        return;
      }
      resetState({
        suggestionCourses: queryData, searchResult: true,
        searchInput: ""
      });
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
      } else ToastsStore.error("You have not added any favorite course(s)")
    }

    return (
        <Nav className='ml-auto'>
          <Nav.Link onClick={this.changeProfile} >Teach a course</Nav.Link>
          <Nav.Link onClick={fetchFavorites} >My Favorites</Nav.Link>
          <Nav.Link onClick={this.handleLogout} >Log Out</Nav.Link>
        </Nav>
    );
  }

  deleteFavorite = (index, courseData) => {
    let favorites = this.state.myFavorites;
    let nowPlaying = this.state.nowPlaying;
    if(nowPlaying && (nowPlaying._id === favorites[index]._id)) {
      this.setState({isFavorite: false});
    }
    favorites.splice(index, 1);
    this.setState({myFavorites: favorites});
    if (courseData) putRequest(courseData._id, {user_name: courseData.user_name}, 'remove');
    else putRequest(nowPlaying._id, {user_name: nowPlaying.user_name}, 'remove');
  }

  changeRating = (newRating) => this.setState({rating: newRating});

  render() {
    const {userName, userData, myFavorites, isFavorite, rating, showDropdown, url, suggestionCourses, nowPlaying, searchResult, isLoading} = this.state;

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
        <PlayerContainer
          url={url}
          nowPlaying={nowPlaying}
          isFavorite={isFavorite}
          myFavorites={myFavorites}
          rating={rating}
          userData={userData}
          handleFavorites={this.handleFavorites}
          changeRating={this.changeRating}
        />
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
          {
            isLoading ? 
            <div style={{paddingTop: '5px', width: '100%', display: "flex", justifyContent: 'center', alignItems: 'center'}}>
              <FontAwesomeIcon 
                icon={faSpinner} spin
                size='5x'
              />
            </div> :
            <SuggestionsContainer
              courseList={suggestionCourses}
              resetState={this.resetState}
              favList={myFavorites}
            />
          }
        </div>
        <Category />
        <Footer />
        </div>
      </div>
    );
  }
}

class PlayerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidUpdate(prevProps) {
    if(prevProps && prevProps.url !== this.props.url && prevProps.rating > 0) {
      putRequest(prevProps.nowPlaying._id, {user_name: prevProps.nowPlaying.user_name}, prevProps.rating);
    }
  }

  componentWillUnmount() {
    let props = this.props;
    if(props && props.url && props.rating > 0) {
      putRequest(this.props.nowPlaying._id, {user_name: this.props.nowPlaying.user_name}, this.props.rating);
    }
  }

  render() {
    const {url, nowPlaying, userData, rating, isFavorite, myFavorites, handleFavorites, changeRating} = this.props;
    let userName = userData.details ? userData.details.name : '';
    let user_name = nowPlaying ? nowPlaying.user_name : '';
    return (
    <Container fluid="sm" className="player-container">
      <video style={{width: "100%", height: "auto"}}
        src={url}
        preload="true" loop controls
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
                changeRating={(rating) => {
                  if(userName === user_name) {
                    ToastsStore.error('You cannot set rating for your own course.');
                    return;
                  }
                  changeRating(rating);
                }}
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
                onClick={() => handleFavorites(isFavorite, myFavorites, nowPlaying)}
              />
            </div>
          </div>
        </div>
      }
    </Container>
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
                rating={course.rating}
                starRatedColor="blue"
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
        if(favCourse._id === course._id) {
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