import { Routes, Route } from "react-router-dom";
import { ShopPage } from "./pages/ShopPage/ShopPage";
import { CartPage } from "./pages/CartPage/CartPage";
import { OrderHistoryPage } from "./pages/OrderHistoryPage/OrderHistoryPage";
import { AdminPage } from "./pages/AdminPage/AdminPage";
import { NotFoundRedirect } from "./components/NotFoundRedirect";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";

export const App = () => {
  return (
    <div className="container">
      <Header />
      <Routes>
        <Route path="/" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
      <Footer />
    </div>
  );
};
