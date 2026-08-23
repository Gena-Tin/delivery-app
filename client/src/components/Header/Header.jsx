import css from "./Header.module.css";
import { NavLink } from "react-router-dom";

export const Header = () => {
  return (
    <header>
      <nav className={css.navLink}>
        <NavLink to="/">Shop</NavLink>
        <NavLink to="/cart">Shopping Cart</NavLink>
        <NavLink to="/order-history">History</NavLink>
        <NavLink to="/admin">Admin Page</NavLink>
      </nav>
    </header>
  );
};
