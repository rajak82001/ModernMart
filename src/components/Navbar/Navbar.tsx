import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const cartCount = 0;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          ModernMart
        </Link>

        <button
          type="button"
          className={styles.cartButton}
          aria-label={`Open cart with ${cartCount} items`}
        >
          <FiShoppingCart size={24} aria-hidden="true" />

          {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
