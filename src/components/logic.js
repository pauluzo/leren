import { postRequest, putRequest } from "../services/JsonService";

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
    "image": userData.googleCred.imageUrl
  };
  newData["student"] = {
    "favorites": [],
  }
  newData["instructor"] = {
    "courses": []
  }
  const sentData = await postRequest(newData);
  if(!sentData.error) return sentData
  else {
    return {error: sentData.error};
  }
}
// Add a new video to the instructor's videos, using their id
export function addUserVideo(userData, videoData, courseDetails) {
  let newCourse = {};
  let data = userData;
  newCourse["course_name"] = courseDetails.name;
  newCourse["course_description"] = courseDetails.description;
  newCourse["category"] = courseDetails.category;
  newCourse["link"] = videoData.url;
  newCourse["cover_image"] = courseDetails.coverImage;
  newCourse["rating"] = 0;
  newCourse["favorites"] = 0;
  newCourse["id"] = videoData.signature;
  newCourse["user_image"] = data.details.image;
  newCourse["user_name"] = data.details.name;
  data.courses.push(newCourse);
  putRequest(data._id, data)
  .then((response) => {
    localStorage.setItem("userData", JSON.stringify(response));
  })
  .catch((error) => console.log(error));
}