// Use the base URL from env or localhost
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Get token from localStorage
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Create Task
export const createTask = async ({ title, description, dueDate, status }) => {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ title, description, dueDate, status }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create task");
  }

  return res.json();
};

// Get all tasks for current user
export const getTasks = async () => {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch tasks");
  }

  return res.json();
};



// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/tasks";

// // Get token from localStorage
// const getAuthHeader = () => ({
//   Authorization: `Bearer ${localStorage.getItem("token")}`,
// });

// // Create Task
// export const createTask = async ({ title, description, dueDate, status }) => {
//   const res = await fetch(API_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       ...getAuthHeader(),
//     },
//     body: JSON.stringify({ title, description, dueDate, status }),
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.message || "Failed to create task");
//   }

//   return res.json();
// };

// // Get all tasks for current user
// export const getTasks = async () => {
//   const res = await fetch(API_URL, {
//     headers: getAuthHeader(),
//   });

//   if (!res.ok) {
//     const err = await res.json();
//     throw new Error(err.message || "Failed to fetch tasks");
//   }

//   return res.json();
// };
