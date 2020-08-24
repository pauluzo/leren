const axios = require("axios");
let url = "https://personal-json-server.herokuapp.com/users";

export async function getRequest(query, search, suggested) {
  let myUrl = url;
  if (query && query !== '') {
    myUrl = `${myUrl}?q=${query}`;
  } else if (search && search !== '') {
    myUrl = `${myUrl}?s=${search}`;
  } else if(suggested) {
    myUrl = `${myUrl}?t=true`
  }

  try {
    const userResponse = await axios.get(myUrl);
    const response = userResponse.data;
    return response; 
  } catch (error) {
    let err = {
      error: error,
    }
    return err;
  }
}

export async function postRequest(newData) {
  try {
    const userResponse = await axios.post(`${url}`, newData);
    const response = userResponse.data;
    return response;
  } catch(error) {
      let err = {
        error: error,
      }
      return err;
  }
}

export async function putRequest(id, newData, query) {
  let myUrl = `${url}/${id}`;
  let data = newData;
  if(id && query) {
    data = {reqData: query, userName: newData.user_name};
  }
  const userResponse = await axios.put(myUrl, data);
  const response = userResponse.data;
  return response;
}

export const deleteRequest = async (id, courseId) => {
  let myUrl = `${url}/${id}`;
  const userResponse = await axios.delete(myUrl, {
    data: {courseId: courseId},
    headers: {"Content-Type": "application/json"}
  });
  const response = userResponse.data;
  return response;
}
