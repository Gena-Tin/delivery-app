import css from "./CartPage.module.css";
import { useState, useEffect } from "react";
import { postToOrderHistory } from "../../api/Api";
import { CartItem } from "../../components/CartItem/CartItem";
import { MapPicker } from "../../components/MapPicker/MapPicker";

export const CartPage = () => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  // стейты для карты
  const [showMap, setShowMap] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  const [addressError, setAddressError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const totalPrice = cartItems
    .reduce((total, item) => {
      const price = Number(item.cost) || 0;
      const qty = item.quantity || 1;
      return total + price * qty;
    }, 0)
    .toFixed(2);

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, newQuantity) => {
    const validQuantity =
      isNaN(newQuantity) || newQuantity < 1 ? 1 : newQuantity;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: validQuantity } : item,
      ),
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  const validateAddress = (value) =>
    value.trim().length > 0 && value.trim().length <= 1000; // увеличен лимит под полный адрес Nominatim

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value.trim().length > 0 && emailRegex.test(value.trim());
  };

  const validatePhone = (value) => {
    const phoneRegex = /^\d{10}$/;
    return value.trim().length > 0 && phoneRegex.test(value.trim());
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    setAddressError(!validateAddress(value));
  };

  // Коллбэк выборки из компонента карты
  const handleLocationSelect = (addressText, coordinates) => {
    setAddress(addressText);
    setAddressError(false);
    setDeliveryLocation({
      type: "Point",
      coordinates: coordinates, // [lng, lat]
    });
  };

  const handleSubmit = async () => {
    const order = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      totalPrice: Number(totalPrice),
      goods: cartItems,
      delivery_location: deliveryLocation, // передаем точные координаты
    };

    const response = await postToOrderHistory(order);

    if (response) {
      const orderCode = response.order.order_code;
      alert(`Order placed successfully! Your order code: ${orderCode}`);

      handleClearCart();
      setAddress("");
      setEmail("");
      setPhone("");
      setName("");
      setDeliveryLocation(null);
      setShowMap(false);
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
          <div className={css.orderDataSection}>
            <p className={css.totalPrice}>Total Price: ${totalPrice}</p>

            <div className={css.addressWrapper}>
              <label>
                Address:*
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={handleAddressChange}
                  className={addressError ? css.invalidInput : ""}
                />
              </label>
              <button
                type="button"
                className={css.mapToggleBtn}
                onClick={() => setShowMap((prev) => !prev)}
              >
                🗺️ {showMap ? "Hide Map" : "Select on Map"}
              </button>
            </div>

            {addressError && (
              <p className={css.errorMsg}>Please enter a valid address.</p>
            )}

            {/* Раскрывающийся блок с картой */}
            {showMap && <MapPicker onLocationSelect={handleLocationSelect} />}

            <label>
              Email:*
              <input
                type="email"
                placeholder="mail@mail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(!validateEmail(e.target.value));
                }}
                className={emailError ? css.invalidInput : ""}
              />
            </label>
            {emailError && (
              <p className={css.errorMsg}>
                Please enter a valid email address.
              </p>
            )}

            <label>
              Phone:*
              <input
                type="tel"
                placeholder="0991231213"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneError(!validatePhone(e.target.value));
                }}
                className={phoneError ? css.invalidInput : ""}
              />
            </label>
            {phoneError && (
              <p className={css.errorMsg}>
                Please enter a valid phone number (10 digits).
              </p>
            )}

            <label>
              Name:*
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <button
              className={css.submitBtn}
              onClick={handleSubmit}
              disabled={
                !address ||
                !email ||
                !phone ||
                !name ||
                addressError ||
                emailError ||
                phoneError
              }
            >
              Submit
            </button>
          </div>
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

// import css from "./CartPage.module.css";
// import { useState, useEffect } from "react";
// import { postToOrderHistory } from "../../api/Api";
// import { CartItem } from "../../components/CartItem/CartItem";

// export const CartPage = () => {
//   const [cartItems, setCartItems] = useState(() => {
//     const storedCartItems = localStorage.getItem("cartItems");
//     return storedCartItems ? JSON.parse(storedCartItems) : [];
//   });

//   const [address, setAddress] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [name, setName] = useState("");
//   const [addressError, setAddressError] = useState(false);
//   const [emailError, setEmailError] = useState(false);
//   const [phoneError, setPhoneError] = useState(false);

//   // Сохраняем актуальную корзину в localStorage при любом изменении cartItems
//   useEffect(() => {
//     localStorage.setItem("cartItems", JSON.stringify(cartItems));
//   }, [cartItems]);

//   // Вычисляем итоговую стоимость "на лету"
//   const totalPrice = cartItems
//     .reduce((total, item) => {
//       const price = Number(item.cost) || 0;
//       const qty = item.quantity || 1;
//       return total + price * qty;
//     }, 0)
//     .toFixed(2);

//   const handleRemoveItem = (id) => {
//     setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
//   };

//   const handleQuantityChange = (id, newQuantity) => {
//     // Не даем опустить количество ниже 1 (если пользователь очистил инпут или ввел 0/отрицательное число)
//     const validQuantity =
//       isNaN(newQuantity) || newQuantity < 1 ? 1 : newQuantity;

//     setCartItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === id ? { ...item, quantity: validQuantity } : item,
//       ),
//     );
//   };

//   const handleClearCart = () => {
//     setCartItems([]);
//     localStorage.removeItem("cartItems");
//   };

//   const validateAddress = (value) =>
//     value.trim().length > 0 && value.trim().length <= 100;

//   const validateEmail = (value) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return value.trim().length > 0 && emailRegex.test(value.trim());
//   };

//   const validatePhone = (value) => {
//     const phoneRegex = /^\d{10}$/;
//     return value.trim().length > 0 && phoneRegex.test(value.trim());
//   };

//   const handleAddressChange = (e) => {
//     const value = e.target.value;
//     setAddress(value);
//     setAddressError(!validateAddress(value));
//   };

//   const handleEmailChange = (e) => {
//     const value = e.target.value;
//     setEmail(value);
//     setEmailError(!validateEmail(value));
//   };

//   const handlePhoneChange = (e) => {
//     const value = e.target.value;
//     setPhone(value);
//     setPhoneError(!validatePhone(value));
//   };

//   const handleSubmit = async () => {
//     const order = {
//       name: name.trim(),
//       phone: phone.trim(),
//       email: email.trim(),
//       address: address.trim(),
//       totalPrice: Number(totalPrice),
//       goods: cartItems,
//     };

//     const response = await postToOrderHistory(order);

//     if (response) {
//       // Получаем order_code или id из ответа сервера
//       const orderCode = response.order.order_code;
//       alert(`Order placed successfully! Your order code: ${orderCode}`);

//       handleClearCart();
//       setAddress("");
//       setEmail("");
//       setPhone("");
//       setName("");
//     } else {
//       alert("Error placing order. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <h1 className={css.title}>Shopping Cart</h1>
//       {cartItems.length > 0 ? (
//         <div>
//           {cartItems.map((item) => (
//             <CartItem
//               key={item.id}
//               item={item}
//               handleQuantityChange={handleQuantityChange}
//               handleRemoveItem={handleRemoveItem}
//             />
//           ))}
//           <div className={css.orderDataSection}>
//             <p className={css.totalPrice}>Total Price: ${totalPrice}</p>
//             <label>
//               Address:*
//               <input
//                 type="text"
//                 placeholder="Address"
//                 value={address}
//                 onChange={handleAddressChange}
//                 className={addressError ? css.invalidInput : ""}
//               />
//               {addressError && (
//                 <p className={css.errorMsg}>
//                   Please enter a valid address (1-100 characters).
//                 </p>
//               )}
//             </label>
//             <label>
//               Email:*
//               <input
//                 type="email"
//                 placeholder="mail@mail.com"
//                 value={email}
//                 onChange={handleEmailChange}
//                 className={emailError ? css.invalidInput : ""}
//               />
//               {emailError && (
//                 <p className={css.errorMsg}>
//                   Please enter a valid email address.
//                 </p>
//               )}
//             </label>
//             <label>
//               Phone:*
//               <input
//                 type="tel"
//                 placeholder="0991231213"
//                 value={phone}
//                 onChange={handlePhoneChange}
//                 className={phoneError ? css.invalidInput : ""}
//               />
//               {phoneError && (
//                 <p className={css.errorMsg}>
//                   Please enter a valid phone number (10 digits).
//                 </p>
//               )}
//             </label>
//             <label>
//               Name:*
//               <input
//                 type="text"
//                 placeholder="John Doe"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </label>
//             <button
//               className={css.submitBtn}
//               onClick={handleSubmit}
//               disabled={
//                 !address ||
//                 !email ||
//                 !phone ||
//                 !name ||
//                 addressError ||
//                 emailError ||
//                 phoneError
//               }
//             >
//               Submit
//             </button>
//           </div>
//           <button className={css.clearCartBtn} onClick={handleClearCart}>
//             Clear Cart
//           </button>
//         </div>
//       ) : (
//         <p className={css.noItemsText}>Your cart is empty</p>
//       )}
//     </div>
//   );
// };
