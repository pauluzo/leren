import { postRequest, putRequest, getRequest } from "../services/JsonService";

// This is where most of the app logic will be executed
export async function createUser (userData, isInstructor) {
  let newData = {};

  if(isInstructor) {
    newData["isInstructor"] = "true"
    newData["isStudent"] = "false"
  } else {
    newData["isInstructor"] = "false"
    newData["isStudent"] = "true"
  }
  newData["id"] = userData.googleCred.googleId;
  newData["details"] = {
    "name": userData.googleCred.name,
    "password": userData.password,
    "email": userData.googleCred.email,
    "username": userData.username,
    "image": userData.googleCred.imageUrl,
  };
  newData["student"] = {
    "favorites": [],
  }
  newData["instructor"] = {
    "courses": []
  }
  console.log(newData);
  const sentData = await postRequest(newData);
  return sentData;
}
// Add a new video to the instructor's videos, using their id
export function addUserVideo(userData, videoData, courseDetails) {
  async function addToSuggestion(course) {
    getRequest("abcdef00011111ghij")
    .then((list) => {
      console.log("this runs");
      let courses = [];
      let suggestionObject = list[0];
      console.log(suggestionObject);
      courses = suggestionObject.suggestion_courses;
      courses.push(course);
      console.log(courses)
      suggestionObject.suggestion_courses = courses;
      putRequest(suggestionObject.id, suggestionObject)
      .then((resp) => console.log(resp))
      .catch((error) => console.log(`This returns an error: ${error}`));
    })
    .catch((error) => console.log(`this doesnt return suggestion object ${error}`));
  }

  let newCourse = {};
  let data = userData;
  newCourse["course_name"] = courseDetails.name;
  newCourse["course_description"] = courseDetails.description;
  newCourse["category"] = courseDetails.category;
  newCourse["link"] = videoData.url;
  newCourse["thumbnail"] = videoData.thumbnail_url;
  newCourse["rating"] = 0;
  newCourse["favorites"] = 0;
  newCourse["id"] = videoData.signature;
  newCourse["user_image"] = data.details.image;
  newCourse["user_name"] = data.details.name;
  data.instructor.courses.push(newCourse);
  putRequest(data.id, data)
  .then((response) => {
    console.log(response);
    localStorage.setItem("userData", JSON.stringify(response));
  })
  .catch((error) => console.log(error));
  addToSuggestion(newCourse);
}