import { useState, useEffect } from "react";

export const useCart = () => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const totalPrice = cartItems
    .reduce(
      (total, item) => total + (Number(item.cost) || 0) * (item.quantity || 1),
      0,
    )
    .toFixed(2);

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, newQuantity) => {
    const validQty = isNaN(newQuantity) || newQuantity < 1 ? 1 : newQuantity;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: validQty } : item,
      ),
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  return {
    cartItems,
    totalPrice,
    handleRemoveItem,
    handleQuantityChange,
    handleClearCart,
  };
};
