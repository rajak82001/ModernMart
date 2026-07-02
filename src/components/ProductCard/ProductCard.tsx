import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import styles from "./ProductCard.module.scss";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <article className={styles.card}>
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.title} className={styles.image} />
      </Link>

      <div className={styles.content}>
        <Link to={`/product/${product.id}`} className={styles.title}>
          {product.title}
        </Link>

        <p className={styles.price}>${product.price.toFixed(2)}</p>

        <button className={styles.button} type="button">
          Quick Add
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
