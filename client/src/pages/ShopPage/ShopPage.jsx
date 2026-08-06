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

  // Определяем, из какого магазина товары в корзине (если они там есть)
  const activeCartShop = cartItems.length > 0 ? cartItems[0].shop_name : null;

  useEffect(() => {
    fetchGoods().then((data) => {
      if (Array.isArray(data)) {
        const uniqueShops = getUniqueShops(data);
        setShops(uniqueShops);
        setProducts(data);

        // Если в корзине уже есть товары, сразу выбираем их магазин по умолчанию.
        // Если корзина пуста — выбираем первый магазин из списка.
        if (activeCartShop) {
          setSelectedShop(activeCartShop);
        } else if (uniqueShops.length > 0) {
          setSelectedShop(uniqueShops[0]);
        }
      }
      setIsLoading(false);
    });
  }, [activeCartShop]);

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

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id,
      );

      if (existingItemIndex !== -1) {
        return prevItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item,
        );
      }

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

  // Проверка активности кнопки магазина:
  // Если корзина пуста — активны ВСЕ магазины.
  // Если в корзине есть товары — активен ТОЛЬКО магазин этих товаров.
  const isShopActive = (shop) => {
    return !activeCartShop || activeCartShop === shop;
  };

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
