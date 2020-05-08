const axios = require("axios");
var url = "https://personal-json-server.herokuapp.com/users";
var testUrl = "http://localhost:3002/users";

export async function getRequest(searchQuery) {
  let myUrl = url;
  if (searchQuery && searchQuery !== '') {
    myUrl = `${myUrl}?q=${searchQuery}`;
  }

  const userResponse = await axios.get(myUrl);
  const response = userResponse.data;
  console.log(response);
  return response; 
}

export async function postRequest(newData) {
  const userResponse = await axios.post(`${url}`, newData);
  const response = userResponse.data;
  return response;
}

export async function putRequest(id, newData) {
  const userResponse = await axios.put(`${url}/${id}/`, newData);
  const response = userResponse.data;
  console.log(response);
  return response;
}

export const deleteRequest = () => {
  axios.delete(`${url}/5/`, )
  .then(resp => {
    console.log(resp.data);
  }).catch(error => {
    console.log(error);
  })
}
