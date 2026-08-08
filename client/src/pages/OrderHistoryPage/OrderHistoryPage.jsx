import css from "./OrderHistoryPage.module.css";
import { useState, useEffect } from "react";
import { fetchOrderHistory } from "../../api/Api";
import { OrderCard } from "../../components/OrderCard/OrderCard";

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fetchOrderHistory().then((data) => {
      if (Array.isArray(data)) {
        setOrders(data);
      }
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchCriteria.trim().toLowerCase();

    if (!query) {
      setFilteredOrders([]);
      return;
    }

    const filtered = orders.filter((order) => {
      const orderData = order.order_data || order;
      const customer = orderData.customer || order.customer || {};

      const email = (customer.email || order.email || "").toLowerCase();
      const phone = (customer.phone || order.phone || "")
        .toString()
        .toLowerCase();
      const orderCode = (order.order_code || order.orderCode || order.id || "")
        .toString()
        .toLowerCase();

      return email === query || phone === query || orderCode === query;
    });

    setFilteredOrders(filtered);
  };

  return (
    <div>
      <h1 className={css.title}>Orders History</h1>
      <div className={css.searchSection}>
        <form onSubmit={handleSearch}>
          <label>
            Find your Orders
            <input
              type="text"
              placeholder="Email, Phone or Order Code"
              value={searchCriteria}
              onChange={(e) => setSearchCriteria(e.target.value)}
            />
          </label>
          <button type="submit" className={css.serchBtn}>
            Search
          </button>
        </form>
      </div>
      <div className={css.ordersSection}>
        {filteredOrders.length > 0 ? (
          <ul>
            {filteredOrders.map((order) => (
              <OrderCard key={order.order_code || order.id} order={order} />
            ))}
          </ul>
        ) : (
          <p className={css.noItemsText}>
            {searchCriteria
              ? "No orders found"
              : "Enter your Order Code, Email or Phone to find your order"}
          </p>
        )}
      </div>
    </div>
  );
};
