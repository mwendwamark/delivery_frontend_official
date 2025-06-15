import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import AuthPages from "./Pages/Auth/AuthPages";
import ProductList from "./Pages/ProductsList/ProductList";
import ProductDetails from "./Pages/ProductsList/ProductDetails";

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
