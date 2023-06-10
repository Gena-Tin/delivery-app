import React, { useState, useEffect, useCallback } from "react";
import { postToOrderHistory } from "../../api/Api";
import css from "./CartPage.module.css";
import CartItem from "../../components/CartItem/CartItem";
import { nanoid } from "nanoid";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

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

  const handleClearCart = () => {
    localStorage.setItem("cartItems", JSON.stringify([]));
    setCartItems([]);
  };

  const validateAddress = (value) => {
    return value.trim().length > 0 && value.trim().length <= 100;
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value.trim().length > 0 && emailRegex.test(value.trim());
  };

  const validatePhone = (value) => {
    const phoneRegex = /^\d{10}$/;
    return value.trim().length > 0 && phoneRegex.test(value.trim());
  };

  const handleAddressChange = (e) => {
    const value = e.target.value.trim();
    setAddress(value);
    setAddressError(!validateAddress(value));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value.trim();
    setEmail(value);
    setEmailError(!validateEmail(value));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.trim();
    setPhone(value);
    setPhoneError(!validatePhone(value));
  };

  const handleSubmit = async () => {
    const order = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
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
                placeholder="Address"
                value={address}
                onChange={handleAddressChange}
                className={addressError ? css.invalidInput : ""}
              />
              {addressError && (
                <p className={css.errorMsg}>
                  Please enter a valid address (1-100 characters).
                </p>
              )}
            </label>
            <label>
              Email:*
              <input
                type="email"
                placeholder="mail@mail.com"
                value={email}
                onChange={handleEmailChange}
                className={emailError ? css.invalidInput : ""}
              />
              {emailError && (
                <p className={css.errorMsg}>
                  Please enter a valid email address.
                </p>
              )}
            </label>
            <label>
              Phone:*
              <input
                type="tel"
                placeholder="(123)123-12-13"
                value={phone}
                onChange={handlePhoneChange}
                className={phoneError ? css.invalidInput : ""}
              />
              {phoneError && (
                <p className={css.errorMsg}>
                  Please enter a valid phone number (10 digits).
                </p>
              )}
            </label>
            <label>
              Name:*
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <button
              className={css.submitBtn}
              onClick={handleSubmit}
              disabled={
                !address ||
                !email ||
                !phone ||
                !name ||
                addressError ||
                emailError ||
                phoneError
              }
            >
              Submit
            </button>
          </div>
          <button className={css.clearCartBtn} onClick={handleClearCart}>
            Clear Cart
          </button>
        </div>
      ) : (
        <p className={css.noItemsText}>Your cart is empty</p>
      )}
    </div>
  );
};

export default CartPage;
