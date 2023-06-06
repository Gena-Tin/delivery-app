import axios from "axios";

const BASE_URL = "https://647ed711c246f166da8f7790.mockapi.io";

const api = axios.create({
  baseURL: BASE_URL,
});

export const fetchGoods = async () => {
  try {
    const response = await api.get("/goods");
    return response.data;
  } catch (error) {
    console.error("Error fetching goods:", error);
    return [];
  }
};

export const fetchOrderHistory = async () => {
  try {
    const response = await api.get("/ordersHistory");
    return response.data;
  } catch (error) {
    console.error("Error fetching order history:", error);
    return [];
  }
};

export const fetchOrderById = async (email, phone, orderId) => {
  try {
    const response = await api.get("/ordersHistory", {
      params: {
        email,
        phone,
        id: orderId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return [];
  }
};
