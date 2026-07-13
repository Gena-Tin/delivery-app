import React from "react";
import { nanoid } from "nanoid";
import css from "./ProductCard.module.css";

const ProductCard = ({
  product,
  addToCart,
  removeFromCart,
  isProductAdded,
}) => {
  return (
    <div className={css.card} key={nanoid()}>
      <div className={css.imgWrapper}>
        <img className={css.image} src={product.image} alt={product.goods} />
      </div>
      <p className={css.productName}>{product.goods}</p>
      <p className={css.cost}>Cost: ${product.cost}</p>
      <button
        className={`${css.button} ${
          isProductAdded ? css.removeButton : css.addButton
        }`}
        onClick={() =>
          isProductAdded ? removeFromCart(product) : addToCart(product)
        }
      >
        {isProductAdded ? "Remove from Cart" : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductCard;
