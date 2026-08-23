import css from "./AdminPage.module.css";
import { useState, useEffect, useMemo } from "react";
import {
  fetchOrderHistory,
  fetchShops,
  updateOrderStatus,
} from "../../api/Api";
import { OrderCard } from "../../components/OrderCard/OrderCard";

export const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedShop, setSelectedShop] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [ordersData, shopsData] = await Promise.all([
        fetchOrderHistory(),
        fetchShops ? fetchShops() : Promise.resolve([]),
      ]);

      if (Array.isArray(ordersData)) {
        setOrders(ordersData);
      }
      if (Array.isArray(shopsData)) {
        setShops(shopsData);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  // Смена статуса заказа
  const handleStatusChange = async (orderId, newStatus) => {
    const res = await updateOrderStatus(orderId, newStatus);
    if (res) {
      // Обновляем локальный стейт, чтобы UI перерисовался мгновенно
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
    } else {
      alert("Failed to update status");
    }
  };

  // Клиентская фильтрация с помощью useMemo
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Фильтр по статусу
      const statusMatches =
        selectedStatus === "all" || order.status === selectedStatus;

      // 2. Фильтр по магазину
      const orderData = order.order_data || order;
      const goods = Array.isArray(orderData.goods)
        ? orderData.goods
        : Array.isArray(order.goods)
          ? order.goods
          : [];

      const shopMatches =
        selectedShop === "all" ||
        goods.some(
          (item) =>
            (item.shop_name || item.shopName || "").toLowerCase() ===
            selectedShop.toLowerCase(),
        );

      return statusMatches && shopMatches;
    });
  }, [orders, selectedStatus, selectedShop]);

  return (
    <div className={css.container}>
      <h1 className={css.title}>Admin Dashboard — Orders Management</h1>

      {/* Панель фильтров */}
      <div className={css.filterSection}>
        <div className={css.filterGroup}>
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">pending</option>
            <option value="in_progress">in_progress</option>
            <option value="delivered">delivered</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>

        <div className={css.filterGroup}>
          <label htmlFor="shop-filter">Filter by Shop:</label>
          <select
            id="shop-filter"
            value={selectedShop}
            onChange={(e) => setSelectedShop(e.target.value)}
          >
            <option value="all">All Shops</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.name}>
                {shop.name}
              </option>
            ))}
          </select>
        </div>

        <div className={css.counter}>
          Total found: <strong>{filteredOrders.length}</strong>
        </div>
      </div>

      {/* Список заказов */}
      <div className={css.ordersSection}>
        {loading ? (
          <p>Loading orders...</p>
        ) : filteredOrders.length > 0 ? (
          <ul className={css.ordersList}>
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id || order.order_code}
                order={order}
                onStatusChange={handleStatusChange}
              />
            ))}
          </ul>
        ) : (
          <p className={css.noOrders}>No orders match the selected filters.</p>
        )}
      </div>
    </div>
  );
};
