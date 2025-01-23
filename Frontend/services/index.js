const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// Backend services: User Registration
export const userRegister = async (data) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response; // Let the caller handle the response status
  } catch (error) {
    console.error("Error during user registration fetch:", error);
    throw new Error("Failed to connect to the server.");
  }
};

// Backend services: User Login
export const userLogin = async (data) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response; // Let the caller handle the response status
  } catch (error) {
    console.error("Error during user login fetch:", error);
    throw new Error("Failed to connect to the server.");
  }
};

// Get folders service
export const getFolder = async (id) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/folders/folders/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response; // Let the caller handle the response status
  } catch (error) {
    console.error("Error fetching folder data:", error);
    throw new Error("Failed to fetch folder data.");
  }
};
