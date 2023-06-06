import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchGoods } from "../api/Api";
import { nanoid } from "nanoid";

const ShopPage = () => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchGoods().then((data) => {
      setShops(getUniqueShops(data));
      setProducts(data);
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
    const itemIndex = cartItems.findIndex((item) => item.id === product.id);
    if (itemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems.splice(itemIndex, 1);
      setCartItems(updatedCartItems);
    } else {
      setCartItems((prevItems) => [...prevItems, product]);
    }
  };

  const isProductAddedToCart = (product) => {
    return cartItems.some((item) => item.id === product.id);
  };

  const isShopActive = (shop) => {
    return cartItems.length === 0 || selectedShop === shop;
  };

  return (
    <div>
      <h1>Shop Page</h1>

      <div>
        {shops.map((shop) => (
          <button
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
            <h2>{selectedShop}</h2>
            <Link to="/cart">Go to Cart</Link>

            {products
              .filter((item) => item.shop === selectedShop)
              .map((item) => (
                <div key={nanoid()}>
                  <img src={item.image} alt={item.goods} />
                  <p>{item.goods}</p>
                  <p>{item.cost}</p>
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!isShopActive(selectedShop)}
                  >
                    {isProductAddedToCart(item) ? "Added" : "Add to Cart"}
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
