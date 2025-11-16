import CONFIG from "../config";

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  GET_ALL_STORIES: `${CONFIG.BASE_URL}/stories`,
  ADD_NEW_STORY: `${CONFIG.BASE_URL}/stories`,
};

async function registerUser({ name, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const responseJson = await response.json();

  if (responseJson.error) {
    throw new Error(responseJson.message);
  }

  return responseJson;
}

async function loginUser({ email, password }) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ email, password }),
  });

  const responseJson = await response.json();

  if (responseJson.error) {
    throw new Error(responseJson.message);
  }

  return responseJson.loginResult;
}

async function getAllStories() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Anda harus login terlebih dahulu.");
  }

  const response = await fetch(ENDPOINTS.GET_ALL_STORIES, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();

  if (responseJson.error) {
    throw new Error(responseJson.message);
  }

  return responseJson.listStory;
}

async function addNewStory({ description, photo, lat, lon }) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Anda harus login terlebih dahulu.");
  }
  const formData = new FormData();
  formData.append("description", description);
  formData.append("photo", photo);

  if (lat) formData.append("lat", lat);
  if (lon) formData.append("lon", lon);

  const response = await fetch(ENDPOINTS.ADD_NEW_STORY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const responseJson = await response.json();

  if (responseJson.error) {
    throw new Error(responseJson.message);
  }

  return responseJson;
}

async function subscribePushNotification(subscription) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Anda harus login terlebih dahulu.");
  }

  const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(subscription),
  });

  const responseJson = await response.json();
  if (responseJson.error) {
    throw new Error(responseJson.message);
  }
  return responseJson;
}

async function unsubscribePushNotification(endpoint) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Anda harus login terlebih dahulu.");
  }

  const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ endpoint }),
  });

  const responseJson = await response.json();
  if (responseJson.error) {
    throw new Error(responseJson.message);
  }
  return responseJson;
}

async function getStoryDetail(id) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Anda harus login terlebih dahulu.");
  }

  const response = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const responseJson = await response.json();
  if (responseJson.error) {
    throw new Error(responseJson.message);
  }
  return responseJson.story;
}

export {
  registerUser,
  loginUser,
  getAllStories,
  addNewStory,
  subscribePushNotification,
  unsubscribePushNotification,
  getStoryDetail,
};
