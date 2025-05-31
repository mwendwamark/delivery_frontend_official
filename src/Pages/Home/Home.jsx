import React from "react";
import Hero from "./HomeHero/Hero";
import About from "./HomeAbout/About";
import Products from "./Products/Products";

const Home = () => {
  return (
    <div className="home-page section">
      <Hero />
      <About />
      <Products/>
    </div>
  );
};

export default Home;
