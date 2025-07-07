import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { CartProvider } from "./contexts/CartContext";
import Home from "./Pages/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import AuthPages from "./Pages/Auth/AuthPages";
import ProductList from "./Pages/ProductsList/ProductList";
import ProductDetails from "./Pages/ProductsList/ProductDetails";
import FAQsPage from "./Pages/FAQs/FAQSPage";
import Cart from './Pages/Cart/Cart';
// import Orders from './Pages/Orders';
// import Checkout from './Pages/Checkout';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/authentication" element={<AuthPages />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/faqs" element={<FAQsPage />} />
          <Route path="/cart" element={<Cart />} />
          {/* <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} /> */}
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
