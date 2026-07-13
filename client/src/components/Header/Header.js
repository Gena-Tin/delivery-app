import React from "react";
import css from "./Header.module.css";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <nav className={css.navLink}>
        <NavLink to="/">Shop</NavLink>
        <NavLink to="/cart">Shopping Cart</NavLink>
        <NavLink to="/order-history">History</NavLink>
      </nav>
    </header>
  );
};

export default Header;
