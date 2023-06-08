import React, { useState, useEffect } from "react";
import { fetchOrderHistory } from "../api/Api";
import { nanoid } from "nanoid";

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
          order.email === searchCriteria ||
          order.phone === searchCriteria ||
          order.orderCode === searchCriteria
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders([]);
    }
  };

  return (
    <div>
      <h1>Order History Page</h1>
      <div>
        <input
          type="text"
          placeholder="You can Find youre Orders by Email, Phone, or OrderID"
          value={searchCriteria}
          onChange={(e) => setSearchCriteria(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        {filteredOrders.length > 0 ? (
          <ul>
            {filteredOrders.map((order) => (
              <li key={nanoid()}>
                <p>Order ID: {order.id}</p>
                <p>Email: {order.email}</p>
                <p>Phone: {order.phone}</p>
                <p>Address: {order.address}</p>
                <p>Name: {order.name}</p>
                <ul>
                  {order.goods.map((item) => (
                    <li key={nanoid()}>
                      <img src={item.image} alt={item.goods} />
                      <p>{item.goods}</p>
                      <p>{item.cost}</p>
                      <p>Quantity: {item.quantity}</p>
                    </li>
                  ))}
                </ul>
                <p>Total Price: {order.totalPrice}</p>
                <p>Order Code: {order.orderCode}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders found</p>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
