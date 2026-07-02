import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import type { Product } from "../types/product";
import styles from "./Home.module.scss";
import ProductCard from "../components/ProductCard/ProductCard";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async (): Promise<void> => {
      try {
        const data = await getProducts();

        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error ? error.message : "Something went wrong",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <h2>Loading products...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!products.length) {
    return <h2>No products found.</h2>;
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Products</h1>

      <section className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </section>
    </main>
  );
};

export default Home;
