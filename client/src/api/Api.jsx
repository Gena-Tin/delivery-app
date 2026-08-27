import axios from "axios";

// const BASE_URL = process.env.REACT_APP_MOCKAPI_KEY;
const BASE_URL = process.env.REACT_APP_EXPRESS_API_KEY;

const api = axios.create({
  baseURL: BASE_URL,
});

export const loginAdmin = async (username, password) => {
  try {
    const response = await api.post("/login", { username, password });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error(
      error.response?.data?.error || "Invalid username or password",
    );
  }
};

export const fetchGoods = async () => {
  try {
    const response = await api.get("/goods");
    return response.data;
  } catch (error) {
    console.error("Error fetching goods:", error);
    return [];
  }
};

export const fetchShops = async () => {
  try {
    const response = await api.get("/shops");
    return response.data;
  } catch (error) {
    console.error("Error fetching shops:", error);
    return [];
  }
};

export const postToOrderHistory = async (order) => {
  try {
    const response = await api.post("/orders", order);
    return response.data;
  } catch (error) {
    console.log("Error placing order:", error);
    return null;
  }
};

export const fetchOrderHistory = async () => {
  try {
    const response = await api.get("/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching order history:", error);
    return [];
  }
};
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await api.patch(
      `/orders/${orderId}/status`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error updating status:", error);
    return null;
  }
};

// export const updateOrderStatus = async (orderId, newStatus) => {
//   try {
//     const response = await api.patch(`/orders/${orderId}/status`, {
//       status: newStatus,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error updating status:", error);
//     return null;
//   }
// };
