import React, { useState, useEffect } from "react";
import { fetchOrderHistory } from "../../api/Api";
import { nanoid } from "nanoid";
import css from "./OrderHistoryPage.module.css";
import OrderCard from "../../components/OrderCard/OrderCard";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fetchOrderHistory().then((data) => setOrders(data));
  }, []);

  const handleSearch = () => {
    if (searchCriteria) {
      const filtered = orders.filter(
        (order) =>
          order.email === searchCriteria.trim() ||
          order.phone === searchCriteria.trim() ||
          order.orderCode === searchCriteria.trim()
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders([]);
    }
  };

  return (
    <div>
      <h1 className={css.title}>Orders History</h1>
      <div className={css.searchSection}>
        <div>
          <label>
            Find your Orders
            <input
              type="text"
              placeholder="Email or Phone or OrderID"
              value={searchCriteria}
              onChange={(e) => setSearchCriteria(e.target.value)}
            />
          </label>
          <button className={css.serchBtn} onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
      <div className={css.ordersSection}>
        {filteredOrders.length > 0 ? (
          <ul>
            {filteredOrders.map((order) => (
              <OrderCard key={nanoid()} order={order} />
            ))}
          </ul>
        ) : (
          <p className={css.noItemsText}>No orders found</p>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
