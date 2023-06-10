import React, { useState, useEffect } from "react";
import { fetchGoods } from "../../api/Api";
import { nanoid } from "nanoid";
import ProductCard from "../../components/ProductCard/ProductCard";
import css from "./ShopPage.module.css";
import Loader from "../../components/Loader/Loader";
import shoppingCart from "./images/shoppingCart.png";

const ShopPage = () => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGoods().then((data) => {
      setShops(getUniqueShops(data));
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    if (storedCartItems) {
      setCartItems(storedCartItems);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const getUniqueShops = (data) => {
    const shops = data.map((item) => item.shop);
    return Array.from(new Set(shops));
  };

  const handleShopSelect = (shop) => {
    setSelectedShop(shop);
  };

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  const handleRemoveFromCart = (product) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== product.id);
    setCartItems(updatedCartItems);
  };

  const isProductAddedToCart = (product) => {
    return cartItems.some((item) => item.id === product.id);
  };

  const isShopActive = (shop) => {
    return cartItems.length === 0 || selectedShop === shop;
  };

  return (
    <>
      <h1 className={css.title}>Shops</h1>
      <div className={css.shopPageSecton}>
        <p className={css.goodsQuantity}>{cartItems.length}</p>
        <img
          className={css.shoppingCartImg}
          src={shoppingCart}
          alt="shopping cart"
        />
        {isLoading && <Loader />}
        <div className={css.shopButtonsWrapper}>
          {shops.map((shop) => (
            <button
              className={css.button}
              key={nanoid()}
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
                  .filter((item) => item.shop === selectedShop)
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

export default ShopPage;
