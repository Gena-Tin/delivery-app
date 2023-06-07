import { nanoid } from "nanoid";
import React, { useState, useEffect, useCallback } from "react";
import { postToOrderHistory } from "../api/Api";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    if (storedCartItems) {
      setCartItems(storedCartItems);
    }
  }, []);

  const calculateTotalPrice = useCallback(() => {
    const totalPrice = cartItems.reduce(
      (total, item) => total + item.cost * item.quantity,
      0
    );
    setTotalPrice(totalPrice);
  }, [cartItems]);

  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice]);

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    calculateTotalPrice();
  };

  const handleQuantityChange = (id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
    calculateTotalPrice();
  };

  const handleSubmit = async () => {
    const order = {
      name,
      phone,
      email,
      address,
      totalPrice,
      orderCode: nanoid(4),
      goods: cartItems,
    };

    const success = await postToOrderHistory(order);

    if (success) {
      alert(`Order placed successfully! Your order code: ${order.orderCode}`);
      setCartItems([]);
      setAddress("");
      setEmail("");
      setPhone("");
      setName("");
      localStorage.setItem("cartItems", JSON.stringify([]));
    } else {
      alert("Error placing order. Please try again.");
    }
  };

  return (
    <div>
      <h1>Cart Page</h1>
      {cartItems.length > 0 ? (
        <div>
          {cartItems.map((item) => (
            <div key={item.id}>
              <img src={item.image} alt={item.goods} />
              <p>{item.goods}</p>
              <p>{item.cost}</p>
              <input
                type="number"
                value={item.quantity}
                min="1"
                onChange={(e) =>
                  handleQuantityChange(item.id, parseInt(e.target.value))
                }
              />
              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </div>
          ))}
          <p>Total Price: {totalPrice}</p>
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={!address || !email || !phone || !name}
          >
            Submit
          </button>
        </div>
      ) : (
        <p>No items in cart</p>
      )}
    </div>
  );
};

export default CartPage;
