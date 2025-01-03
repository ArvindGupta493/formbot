// import axios from "axios";

// const API_URL = "http://localhost:5000"; // Update to your backend URL

// // Login API
// // export const loginUser = async (credentials) => {
// //   const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
// //   return response;
// // };

// // // Register API
// // export const registerUser = async (data) => {
// //   const response = await axios.post(`${API_URL}/api/auth/register`, data);
// //   return response;
// // };

// export const getFolder = async () => {
//   const response = await fetch(`${API_URL}/api/folders/folders/:id`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });
//   return response;
// };
