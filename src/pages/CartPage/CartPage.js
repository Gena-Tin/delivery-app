import React, { useState, useEffect, useCallback } from "react";
import { postToOrderHistory } from "../../api/Api";
import css from "./CartPage.module.css";
// import cartImage from "./images/cartImg.png";
import CartItem from "../../components/CartItem/CartItem";
import { nanoid } from "nanoid";

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
      <h1 className={css.title}>Shopping Cart</h1>
      {cartItems.length > 0 ? (
        <div>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              handleQuantityChange={handleQuantityChange}
              handleRemoveItem={handleRemoveItem}
            />
          ))}
          <div className={css.orderDataSection}>
            <p className={css.totalPrice}>Total Price: ${totalPrice}</p>
            <label>
              Address:*
              <input
                type="text"
                placeholder=" Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
            <label>
              Email:*
              <input
                type="email"
                placeholder=" mail@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Phone:*
              <input
                type="tel"
                placeholder=" (123)123-12-13"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <label>
              Name:*
              <input
                type="text"
                placeholder=" John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <button
              className={css.submitBtn}
              onClick={handleSubmit}
              disabled={!address || !email || !phone || !name}
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <p className={css.noItemsText}>Youre cart is empty</p>
      )}
    </div>
  );
};

export default CartPage;
