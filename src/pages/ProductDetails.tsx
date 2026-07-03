import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { productVariants } from "../data/productVariants";
import styles from "./ProductDetail.module.scss";
import type { Product, ColorVariant, SizeOption } from "../types/product";
import { useCart } from "../hooks/useCart";

const ProductDetails = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { state, dispatch } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const variantData = useMemo(() => (product ? productVariants[product.id] : null), [product]);

  const getPreferredSize = (color: ColorVariant, requestedSize: string | null): SizeOption => {
    const matchingSize = color.sizes.find((size) => size.value === requestedSize);

    if (matchingSize && matchingSize.status !== "sold-out") {
      return matchingSize;
    }

    const availableSize = color.sizes.find((size) => size.status === "available");
    return availableSize ?? color.sizes[0];
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async (): Promise<void> => {
      if (!id) {
        if (isMounted) {
          setError("Product not found");
          setIsLoading(false);
        }
        return;
      }

      try {
        const data = await getProductById(id);

        if (!isMounted) {
          return;
        }

        setProduct(data);
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError instanceof Error ? fetchError.message : "Something went wrong");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const currentVariantData = productVariants[product.id];

    if (!currentVariantData) {
      setSelectedColor(null);
      setSelectedSize(null);
      setSelectedImage(product.image);
      return;
    }

    const colorFromUrl = searchParams.get("color");
    const sizeFromUrl = searchParams.get("size");
    const initialColor =
      currentVariantData.colors.find((color) => color.name === colorFromUrl) ||
      currentVariantData.colors[0];

    const initialSize = getPreferredSize(initialColor, sizeFromUrl);
    const initialImage = initialColor.images[0] ?? product.image;

    setSelectedColor((previousColor) => (previousColor?.name === initialColor.name ? previousColor : initialColor));
    setSelectedSize((previousSize) => (previousSize?.value === initialSize.value ? previousSize : initialSize));
    setSelectedImage((previousImage) => (previousImage === initialImage ? previousImage : initialImage));
    setQuantity(1);
  }, [product, searchParams]);

  useEffect(() => {
    if (!selectedColor || !selectedSize) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    const shouldUpdate = params.get("color") !== selectedColor.name || params.get("size") !== selectedSize.value;

    if (shouldUpdate) {
      params.set("color", selectedColor.name);
      params.set("size", selectedSize.value);
      setSearchParams(params, { replace: true });
    }
  }, [selectedColor, selectedSize, searchParams, setSearchParams]);

  useEffect(() => {
    if (!selectedSize) {
      return;
    }

    setQuantity((currentQuantity) => Math.min(currentQuantity, selectedSize.stock));
  }, [selectedSize]);

  const handleColorChange = (color: ColorVariant): void => {
    const currentImage = selectedImage;
    const nextImage = color.images.find((image) => image === currentImage) ?? color.images[0] ?? product?.image ?? "";
    const nextSize = getPreferredSize(color, null);

    setSelectedColor(color);
    setSelectedImage(nextImage);
    setSelectedSize(nextSize);
    setQuantity(1);
  };

  const handleSizeChange = (size: SizeOption): void => {
    if (size.status === "sold-out") {
      return;
    }

    setSelectedSize(size);
  };

  const handleQuantityChange = (direction: "increment" | "decrement"): void => {
    if (!selectedSize) {
      return;
    }

    setQuantity((currentQuantity) => {
      if (direction === "decrement") {
        return Math.max(1, currentQuantity - 1);
      }

      return Math.min(selectedSize.stock, currentQuantity + 1);
    });
  };

  const handleAddToCart = (): void => {
    if (!product || !selectedColor || !selectedSize || selectedSize.status === "sold-out") {
      return;
    }

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product,
        selectedColor: selectedColor.name,
        selectedSize: selectedSize.value,
        quantity,
      },
    });

    if (!state.isCartOpen) {
      dispatch({ type: "TOGGLE_CART" });
    }
  };

  if (isLoading) {
    return <h2>Loading product...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!product) {
    return <h2>Product not found.</h2>;
  }

  const isAddToCartDisabled = !selectedSize || selectedSize.status === "sold-out";

  return (
    <main className={styles.container}>
      <section className={styles.imageSection}>
        <img src={selectedImage || product.image} alt={product.title} className={styles.image} loading="eager" />

        <div className={styles.thumbnails}>
          {selectedColor?.images.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={selectedImage === image ? styles.activeThumbnail : ""}
              aria-label={`Show ${product.title} view`}
            >
              <img src={image} alt={`${product.title} view`} loading="lazy" decoding="async" />
            </button>
          ))}
        </div>

        <div>
          <h3>Color</h3>

          <div className={styles.colors}>
            {variantData?.colors.map((color) => {
              const isSelected = selectedColor?.name === color.name;

              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => handleColorChange(color)}
                  aria-label={`Select ${color.name} color`}
                  aria-pressed={isSelected}
                  className={isSelected ? styles.activeSwatch : ""}
                  style={{
                    backgroundColor: color.hexCode,
                  }}
                />
              );
            })}
          </div>
        </div>

        <div>
          <h3>Size</h3>

          <div className={styles.sizes}>
            {selectedColor?.sizes.map((size) => {
              const isSelected = selectedSize?.value === size.value;
              const isSoldOut = size.status === "sold-out";
              const isLowStock = size.status === "low-stock";

              return (
                <button
                  key={size.value}
                  type="button"
                  disabled={isSoldOut}
                  onClick={() => handleSizeChange(size)}
                  aria-pressed={isSelected}
                  className={`${isSelected ? styles.activeSize : ""} ${isSoldOut ? styles.soldOutSize : ""} ${isLowStock ? styles.lowStockSize : ""}`}
                >
                  <span>{size.value}</span>
                  {isLowStock && <span className={styles.statusLabel}>Low Stock</span>}
                  {isSoldOut && <span className={styles.statusLabel}>Sold Out</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.quantity}>
          <button type="button" onClick={() => handleQuantityChange("decrement")} aria-label="Decrease quantity" disabled={quantity <= 1}>
            -
          </button>

          <span>{quantity}</span>

          <button type="button" onClick={() => handleQuantityChange("increment")} aria-label="Increase quantity" disabled={Boolean(selectedSize && quantity >= selectedSize.stock)}>
            +
          </button>
        </div>

        <button type="button" className={styles.addToCart} disabled={isAddToCartDisabled} onClick={handleAddToCart}>
          {isAddToCartDisabled ? "Sold Out" : "Add To Cart"}
        </button>
      </section>

      <section className={styles.content}>
        <p className={styles.category}>{product.category}</p>

        <h1>{product.title}</h1>

        <p className={styles.description}>{product.description}</p>

        <p className={styles.brand}>Brand: {variantData?.brand}</p>

        <div className={styles.priceWrapper}>
          {variantData?.originalPrice ? (
            <>
              <span className={styles.salePrice}>${product.price.toFixed(2)}</span>
              <span className={styles.originalPrice}>${variantData.originalPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className={styles.price}>${product.price.toFixed(2)}</span>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProductDetails;
