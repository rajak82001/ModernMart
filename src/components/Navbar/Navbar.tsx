import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../../hooks/useCart";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const { state, dispatch } = useCart();

  const itemCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleCartToggle = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          ModernMart
        </Link>

        <button
          type="button"
          className={styles.cartButton}
          aria-label="Open cart"
          aria-expanded={state.isCartOpen}
          aria-controls="cart-drawer"
          onClick={handleCartToggle}
        >
          <FiShoppingCart size={24} aria-hidden="true" />

          {itemCount > 0 && (
            <span className={styles.badge}>
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Navbar;