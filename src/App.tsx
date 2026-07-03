import Navbar from "./components/Navbar/Navbar";
import AppRouter from "./router/AppRouter";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Navbar />
      <AppRouter />
    </CartProvider>
  );
}

export default App;
