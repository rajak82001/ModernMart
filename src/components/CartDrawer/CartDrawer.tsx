import { FiX, FiTrash2 } from "react-icons/fi";
import { useCart } from "../../hooks/useCart";
import styles from "./CartDrawer.module.scss";
import { useEffect, useMemo } from "react";

const CartDrawer = () => {
  const { state, dispatch } = useCart();

  const subtotal = useMemo(
    () => state.items.reduce((total, item) => total + item.price * item.quantity, 0),
    [state.items],
  );

  useEffect(() => {
    if (!state.isCartOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        dispatch({ type: "TOGGLE_CART" });
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch, state.isCartOpen]);

  return (
    <>
      {state.isCartOpen && (
        <div className={styles.overlay} onClick={() => dispatch({ type: "TOGGLE_CART" })} role="presentation" />
      )}

      <div id="cart-drawer" className={`${styles.drawer} ${state.isCartOpen ? styles.open : ""}`} role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title">
        <div className={styles.header}>
          <h2 id="cart-drawer-title">Shopping Cart</h2>

          <button type="button" onClick={() => dispatch({ type: "TOGGLE_CART" })} aria-label="Close cart">
            <FiX size={24} />
          </button>
        </div>

        <div className={styles.items}>
          {state.items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            state.items.map((item) => (
              <article key={`${item.id}-${item.selectedColor ?? "default"}-${item.selectedSize ?? "default"}`} className={styles.item}>
                <img src={item.image} alt={item.title} className={styles.image} loading="lazy" decoding="async" />

                <div className={styles.info}>
                  <p className={styles.itemTitle}>{item.title}</p>
                  {item.selectedColor && item.selectedSize && (
                    <p className={styles.variant}>
                      {item.selectedColor} / {item.selectedSize}
                    </p>
                  )}

                  <p>${item.price.toFixed(2)}</p>

                  <div className={styles.quantity}>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_QUANTITY",
                          payload: {
                            productId: item.id,
                            quantity: item.quantity - 1,
                            selectedColor: item.selectedColor,
                            selectedSize: item.selectedSize,
                          },
                        })
                      }
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity for ${item.title}`}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_QUANTITY",
                          payload: {
                            productId: item.id,
                            quantity: item.quantity + 1,
                            selectedColor: item.selectedColor,
                            selectedSize: item.selectedSize,
                          },
                        })
                      }
                      aria-label={`Increase quantity for ${item.title}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.remove}
                  onClick={() =>
                    dispatch({
                      type: "REMOVE_FROM_CART",
                      payload: {
                        productId: item.id,
                        selectedColor: item.selectedColor,
                        selectedSize: item.selectedSize,
                      },
                    })
                  }
                  aria-label={`Remove ${item.title} from cart`}
                >
                  <FiTrash2 />
                </button>
              </article>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <h3>Total: ${subtotal.toFixed(2)}</h3>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
