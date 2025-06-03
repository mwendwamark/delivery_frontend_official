import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import AuthPages from "./Pages/Auth/AuthPages";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/authentication" element={<AuthPages />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
