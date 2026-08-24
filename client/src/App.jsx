import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ShopPage } from "./pages/ShopPage/ShopPage";
import { CartPage } from "./pages/CartPage/CartPage";
import { OrderHistoryPage } from "./pages/OrderHistoryPage/OrderHistoryPage";
import { AdminPage } from "./pages/AdminPage/AdminPage";
import { NotFoundRedirect } from "./components/NotFoundRedirect";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage/LoginPage";

export const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken"));

  const handleLogin = async (username, password) => {
    // тут бедет реальный запрос к бекенду
    if (username === "admin" && password === "admin123") {
      const mockToken = "fake-jwt-token";
      localStorage.setItem("adminToken", mockToken);
      setToken(mockToken);
    } else {
      throw new Error("Invalid username or password");
    }
  };

  return (
    <div className="container">
      <Header />
      <Routes>
        <Route path="/" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
        {/* <Route path="/admin" element={<AdminPage />} /> */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute isAuth={Boolean(token)}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
      <Footer />
    </div>
  );
};
