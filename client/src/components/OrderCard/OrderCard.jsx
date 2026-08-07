import css from "./OrderCard.module.css";

export const OrderCard = ({ order }) => {
  // Достаем вложенный объект order_data (если его нет — берем сам order)
  const orderData = order.order_data || order;
  const customer = orderData.customer || order.customer || {};
  const goodsList = Array.isArray(orderData.goods)
    ? orderData.goods
    : Array.isArray(order.goods)
      ? order.goods
      : [];

  const orderCode = order.order_code || order.orderCode || order.id;
  const totalPrice = Number(
    orderData.totalPrice || order.totalPrice || 0,
  ).toFixed(2);

  // Форматируем дату в читаемый вид
  const formattedDate = order.created_at
    ? new Date(order.created_at).toLocaleString()
    : "";

  return (
    <li className={css.orderCard}>
      <div className={css.orderHeader}>
        <p>
          <strong>Order Code:</strong> {orderCode}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        {formattedDate && (
          <p>
            <strong>Date:</strong> {formattedDate}
          </p>
        )}
      </div>

      <div className={css.customerDetails}>
        <p>
          <strong>Name:</strong> {customer.name || order.name}
        </p>
        <p>
          <strong>Email:</strong> {customer.email || order.email}
        </p>
        <p>
          <strong>Phone:</strong> {customer.phone || order.phone}
        </p>
        <p>
          <strong>Address:</strong> {customer.address || order.address}
        </p>
        <p className={css.totalPrice}>
          <strong>Total Price:</strong> ${totalPrice}
        </p>
      </div>

      {goodsList.length > 0 && (
        <ul className={css.goodsList}>
          {goodsList.map((item, index) => {
            const itemName = item.title || item.goods || item.name;
            const itemCost = Number(item.cost || item.price || 0).toFixed(2);
            const itemQty = item.quantity || 1;

            return (
              <li key={item.id || index} className={css.item}>
                <div className={css.goodsCard}>
                  {item.image && (
                    <div className={css.imgWrapper}>
                      <img src={item.image} alt={itemName} />
                    </div>
                  )}
                  <div className={css.goodsDescription}>
                    <p className={css.goodsTitle}>{itemName}</p>
                    <p>Cost: ${itemCost}</p>
                    <p>Quantity: {itemQty}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};
