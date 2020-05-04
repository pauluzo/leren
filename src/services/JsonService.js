const axios = require("axios");
var urll = "https://personal-json-server.herokuapp.com/users";
var url = "http://localhost:3001/users";

export async function getRequest (searchQuery) {
  let myUrl = url;
  if (searchQuery && searchQuery !== '') {
    myUrl = `${myUrl}?q=${searchQuery}`;
  }

  const userResponse = await axios.get(myUrl);
  const response = userResponse.data;
  return response; 
}

export async function postRequest (newData) {
  const userResponse = await axios.post(`${url}`, newData);
  const response = userResponse.data;
  return response;
}

export const putRequest = (id, newData) => {
  axios.put(`${url}/${id}/`, newData)
  .then(resp => {
    console.log(resp.data);
    localStorage.setItem("userData", JSON.stringify(resp.data));
    alert("Update has been saved successfully!");
  }).catch(error => {
    console.log(error);
  })
}

export const deleteRequest = () => {
  axios.delete(`${url}/5/`, )
  .then(resp => {
    console.log(resp.data);
  }).catch(error => {
    console.log(error);
  })
}
