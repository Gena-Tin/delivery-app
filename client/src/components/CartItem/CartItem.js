import React from "react";
import { nanoid } from "nanoid";
import css from "./CartItem.module.css";

const CartItem = ({ item, handleQuantityChange, handleRemoveItem }) => {
  const totalPrice = item.cost * item.quantity;
  return (
    <div className={css.card} key={nanoid()}>
      <div className={css.imgWrapper}>
        <img className={css.image} src={item.image} alt={item.goods} />
      </div>
      <div>
        <p className={css.productName}>{item.goods}</p>
        <p className={css.cost}>Cost: ${item.cost}</p>
        <p className={css.quantity}>Quantity:</p>
        <input
          className={css.quantityInput}
          type="number"
          value={item.quantity}
          min="1"
          onChange={(e) =>
            handleQuantityChange(item.id, parseInt(e.target.value))
          }
        />
        <p className={css.price}>Price: ${totalPrice}</p>
        <button
          className={css.removeBtn}
          onClick={() => handleRemoveItem(item.id)}
        >
          Remove from Cart
        </button>
      </div>
    </div>
  );
};

export default CartItem;
