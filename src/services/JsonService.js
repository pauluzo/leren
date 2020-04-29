const axios = require("axios");
var url = "https://personal-json-server.herokuapp.com/users";

export const getRequest = (searchQuery) => {
  let myUrl = url;
  if (searchQuery && searchQuery !== '') {
    myUrl = `${myUrl}?q=${searchQuery}`;
  }
  axios.get(myUrl)
  .then(resp => {
    let data = resp.data;
    console.log(data);
  })
  .catch(error => {
    console.log(error);
  }); 
}

export const postRequest = () => {
  axios.post(`${url}`, {
    id: 5,
    first_name: "Okafor",
    last_name: "Paul",
    email: "okaforpaul26@gmail.com"
  }).then(resp => {
    console.log(resp.data);
  }).catch(error => {
    console.log(error);
  })
}

export const putRequest = () => {
  axios.put(`${url}/5/`, {
    id: 6,
    first_name: "Okafor",
    last_name: "Paulie",
    email: "okaforpaul2678@gmail.com"
  }).then(resp => {
    console.log(resp.data);
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
