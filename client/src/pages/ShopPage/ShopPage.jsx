import css from "./ShopPage.module.css";
import { useState, useEffect } from "react";
import { fetchGoods } from "../../api/Api";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import { Loader } from "../../components/Loader/Loader";
import { Link } from "react-router-dom";
import shoppingCart from "./images/shoppingCart.png";

export const ShopPage = () => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  useEffect(() => {
    fetchGoods().then((data) => {
      if (Array.isArray(data)) {
        setShops(getUniqueShops(data));
        setProducts(data);
      }
      setIsLoading(false);
    });
  }, []);

  // Синхронизация с localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const getUniqueShops = (data) => {
    const shops = data.map((item) => item.shop_name);
    return Array.from(new Set(shops.filter(Boolean)));
  };

  const handleShopSelect = (shop) => {
    setSelectedShop(shop);
  };

  // Добавление товара с инициализацией или увеличением quantity
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id,
      );

      if (existingItemIndex !== -1) {
        // Если товар уже в корзине — увеличиваем quantity
        return prevItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item,
        );
      }

      // Если товара нет — добавляем его с quantity: 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (product) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== product.id),
    );
  };

  const isProductAddedToCart = (product) => {
    return cartItems.some((item) => item.id === product.id);
  };

  const isShopActive = (shop) => {
    return cartItems.length === 0 || selectedShop === shop;
  };

  // Подсчитываем общее количество штук товаров для счетчика на иконке корзины
  const totalCartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  return (
    <>
      <h1 className={css.title}>Shops</h1>
      <div className={css.shopPageSecton}>
        <Link to="/cart">
          <p className={css.goodsQuantity}>{totalCartCount}</p>
          <img
            className={css.shoppingCartImg}
            src={shoppingCart}
            alt="shopping cart"
          />
        </Link>

        {isLoading && <Loader />}

        <div className={css.shopButtonsWrapper}>
          {shops.map((shop) => (
            <button
              className={css.button}
              key={shop}
              onClick={() => handleShopSelect(shop)}
              disabled={!isShopActive(shop)}
            >
              {shop}
            </button>
          ))}
        </div>

        <div>
          {selectedShop && (
            <div>
              <h2 className={css.shopName}>{selectedShop}</h2>
              <div className={css.cardWrapper}>
                {products
                  .filter((item) => item.shop_name === selectedShop)
                  .map((item) => (
                    <ProductCard
                      key={item.id}
                      product={item}
                      addToCart={handleAddToCart}
                      removeFromCart={handleRemoveFromCart}
                      isProductAdded={isProductAddedToCart(item)}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// import css from "./ShopPage.module.css";
// import { useState, useEffect } from "react";
// import { fetchGoods } from "../../api/Api";
// import { nanoid } from "nanoid";
// import { ProductCard } from "../../components/ProductCard/ProductCard";
// import { Loader } from "../../components/Loader/Loader";
// import { Link } from "react-router-dom";
// import shoppingCart from "./images/shoppingCart.png";

// export const ShopPage = () => {
//   const [shops, setShops] = useState([]);
//   const [selectedShop, setSelectedShop] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [cartItems, setCartItems] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchGoods().then((data) => {
//       setShops(getUniqueShops(data));
//       setProducts(data);
//       setIsLoading(false);
//     });
//   }, []);

//   useEffect(() => {
//     const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
//     if (storedCartItems) {
//       setCartItems(storedCartItems);
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("cartItems", JSON.stringify(cartItems));
//   }, [cartItems]);

//   const getUniqueShops = (data) => {
//     // const shops = data.map((item) => item.shop);
//     const shops = data.map((item) => item.shop_name);

//     return Array.from(new Set(shops));
//   };

//   const handleShopSelect = (shop) => {
//     setSelectedShop(shop);
//   };

//   const handleAddToCart = (product) => {
//     setCartItems((prevItems) => [...prevItems, product]);
//   };

//   const handleRemoveFromCart = (product) => {
//     const updatedCartItems = cartItems.filter((item) => item.id !== product.id);
//     setCartItems(updatedCartItems);
//   };

//   const isProductAddedToCart = (product) => {
//     return cartItems.some((item) => item.id === product.id);
//   };

//   const isShopActive = (shop) => {
//     return cartItems.length === 0 || selectedShop === shop;
//   };

//   return (
//     <>
//       <h1 className={css.title}>Shops</h1>
//       <div className={css.shopPageSecton}>
//         <Link to="/cart">
//           <p className={css.goodsQuantity}>{cartItems.length}</p>
//           <img
//             className={css.shoppingCartImg}
//             src={shoppingCart}
//             alt="shopping cart"
//           />
//         </Link>
//         {isLoading && <Loader />}
//         <div className={css.shopButtonsWrapper}>
//           {shops.map((shop) => (
//             <button
//               className={css.button}
//               key={nanoid()}
//               onClick={() => handleShopSelect(shop)}
//               disabled={!isShopActive(shop)}
//             >
//               {shop}
//             </button>
//           ))}
//         </div>
//         <div>
//           {selectedShop && (
//             <div>
//               <h2 className={css.shopName}>{selectedShop}</h2>
//               <div className={css.cardWrapper}>
//                 {products
//                   .filter((item) => item.shop_name === selectedShop)
//                   .map((item) => (
//                     <ProductCard
//                       key={item.id}
//                       product={item}
//                       addToCart={handleAddToCart}
//                       removeFromCart={handleRemoveFromCart}
//                       isProductAdded={isProductAddedToCart(item)}
//                     />
//                   ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };
