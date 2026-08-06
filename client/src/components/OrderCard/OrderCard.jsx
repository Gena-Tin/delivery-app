import css from "./OrderCard.module.css";

export const OrderCard = ({ order }) => {
  return (
    <li key={order.id} className={css.orderCard}>
      <p>Name: {order.name}</p>
      <p>Order Code: {order.id}</p>
      <p>Email: {order.email}</p>
      <p>Phone: {order.phone}</p>
      <p>Address: {order.address}</p>
      <p>Total Price: ${order.totalPrice}</p>
      <ul>
        {order.goods.map((item) => (
          <li key={item.id} className={css.item}>
            <div className={css.goodsCard}>
              <div className={css.imgWrapper}>
                <img src={item.image} alt={item.goods} />
              </div>
              <div className={css.goodsDescription}>
                <p>{item.goods}</p>
                <p>Cost: ${item.cost}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </li>
  );
};
