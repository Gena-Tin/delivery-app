import axios from "axios";

const BASE_URL = process.env.REACT_APP_MOCKAPI_KEY;

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

export const postToOrderHistory = async (order) => {
  try {
    await api.post("/ordersHistory", order);
    return true;
  } catch (error) {
    console.log("Error placing order:", error);
    return false;
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
