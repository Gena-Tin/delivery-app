import React from "react";
import { nanoid } from "nanoid";
import css from "./OrderCard.module.css";

const OrderCard = ({ order }) => {
  return (
    <li key={nanoid()} className={css.orderCard}>
      <p>Name: {order.name}</p>
      <p>Order Code: {order.orderCode}</p>
      <p>Email: {order.email}</p>
      <p>Phone: {order.phone}</p>
      <p>Address: {order.address}</p>
      <p>Total Price: ${order.totalPrice}</p>
      <ul>
        {order.goods.map((item) => (
          <li key={nanoid()} className={css.item}>
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

export default OrderCard;
