import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import styles from "./ProductCard.module.scss";
import { useCart } from "../../hooks/useCart";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { state, dispatch } = useCart();

  const handleQuickAdd = (): void => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product,
      },
    });

    if (!state.isCartOpen) {
      dispatch({ type: "TOGGLE_CART" });
    }
  };

  return (
    <article className={styles.card}>
      <Link to={`/product/${product.id}`} aria-label={`View ${product.title}`}>
        <img src={product.image} alt={product.title} className={styles.image} loading="lazy" decoding="async" />
      </Link>

      <div className={styles.content}>
        <Link to={`/product/${product.id}`} className={styles.title}>
          {product.title}
        </Link>

        <p className={styles.price}>${product.price.toFixed(2)}</p>

        <button type="button" className={styles.button} onClick={handleQuickAdd}>
          Quick Add
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
