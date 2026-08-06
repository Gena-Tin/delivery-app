import css from "./CartItem.module.css";

export const CartItem = ({ item, handleQuantityChange, handleRemoveItem }) => {
  const cost = Number(item.cost) || 0;
  const quantity = item.quantity || 1;
  const itemTotalPrice = (cost * quantity).toFixed(2);

  return (
    <div className={css.card}>
      <div className={css.imgWrapper}>
        <img className={css.image} src={item.image} alt={item.title} />
      </div>
      <div>
        <p className={css.productName}>{item.title}</p>
        <p className={css.cost}>Cost: ${cost.toFixed(2)}</p>
        <label className={css.quantityLabel}>
          <span className={css.quantity}>Quantity:</span>
          <input
            className={css.quantityInput}
            type="number"
            value={quantity}
            min="1"
            onChange={(e) =>
              handleQuantityChange(item.id, parseInt(e.target.value, 10))
            }
          />
        </label>
        <p className={css.price}>Price: ${itemTotalPrice}</p>
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
