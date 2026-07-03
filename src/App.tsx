import Navbar from "./components/Navbar/Navbar";
import AppRouter from "./router/AppRouter";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer/CartDrawer";

function App() {
  return (
    <CartProvider>
      <Navbar />
      <CartDrawer />
      <AppRouter />
    </CartProvider>
  );
}

export default App;
