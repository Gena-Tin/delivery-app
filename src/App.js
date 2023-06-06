import React from "react";
import { Routes, Route } from "react-router-dom";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import NotFoundRedirect from "./components/NotFoundRedirect";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ShopPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/order-history" element={<OrderHistoryPage />} />
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
};

export default App;
