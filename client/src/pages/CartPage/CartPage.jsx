import css from "./CartPage.module.css";
import { postToOrderHistory } from "../../api/Api";
import { useCart } from "../../hooks/useCart";
import { CartItem } from "../../components/CartItem/CartItem";
import { OrderForm } from "../../components/OrderForm/OrderForm";

export const CartPage = () => {
  const {
    cartItems,
    totalPrice,
    handleRemoveItem,
    handleQuantityChange,
    handleClearCart,
  } = useCart();

  const handleOrderSubmit = async (formData) => {
    const order = { ...formData, goods: cartItems };
    const response = await postToOrderHistory(order);

    if (response) {
      alert(
        `Order placed successfully! Your order code: ${response.order.order_code}`,
      );
      handleClearCart();
    } else {
      alert("Error placing order. Please try again.");
    }
  };

  return (
    <div>
      <h1 className={css.title}>Shopping Cart</h1>
      {cartItems.length > 0 ? (
        <div>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              handleQuantityChange={handleQuantityChange}
              handleRemoveItem={handleRemoveItem}
            />
          ))}

          <OrderForm totalPrice={totalPrice} onSubmit={handleOrderSubmit} />

          <button className={css.clearCartBtn} onClick={handleClearCart}>
            Clear Cart
          </button>
        </div>
      ) : (
        <p className={css.noItemsText}>Your cart is empty</p>
      )}
    </div>
  );
};
