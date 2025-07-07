import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import AuthPages from "./Pages/Auth/AuthPages";
import ProductList from "./Pages/ProductsList/ProductList";
import ProductDetails from "./Pages/ProductsList/ProductDetails";
import FAQsPage from "./Pages/FAQs/FAQSPage";
// import Cart from './Pages/Cart';
// import Orders from './Pages/Orders';
// import Checkout from './Pages/Checkout';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/authentication" element={<AuthPages />}></Route>
          <Route path="/products" element={<ProductList />}></Route>
          <Route path="/products/:id" element={<ProductDetails />}></Route>
          <Route path="/faqs" element={<FAQsPage />}></Route>
          {/* <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
