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
  };
  newData["student"] = {
    "favorites": [],
  }
  newData["instructor"] = {
    "courses": []
  }
  const sentData = await postRequest(newData);
  return sentData;
}
// Add a new video to the instructor's videos, using their id
export function addUserVideo(userData, videoData, courseDetails) {
  console.log("this runs");
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
  data.instructor.courses.push(newCourse);
  putRequest(data.id, data);
}