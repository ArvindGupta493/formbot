const URL = 'http://localhost:4000/api';

// backend services userRegister
export const userRegister = async (data) => {
    return await fetch(`${URL}/user/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}

// backend services userlogin
export const userLogin = async (data) => {
    return await fetch(`${URL}/user/login`,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
};

// create folder service
// export const createFolder = async (data) => {
//     return await fetch(`${URL}/folders/create-folder`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + localStorage.getItem('token')
//         },
//         body: JSON.stringify(data)
//     })
// };

// get folders
export const getFolder = async () => {
    const response = await fetch(`${URL}/api/folders/folders/:id`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  };