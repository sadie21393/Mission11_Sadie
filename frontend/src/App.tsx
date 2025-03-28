import "./App.css";
import { CartProvider } from "./context/CartContext";
import BuyPage from "./pages/BuyPage";
import CartPage from "./pages/CartPage";
import ProjectPage from "./pages/ProjectPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ProjectPage />} />
            <Route path="/buy/:title/:bookId/:price" element={<BuyPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App;
