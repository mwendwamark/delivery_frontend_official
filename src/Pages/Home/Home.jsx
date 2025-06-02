import React from "react";
import Hero from "./HomeHero/Hero";
import About from "./HomeAbout/About";
import Products from "./Products/Products";
import Testimonials from "./Testimonials/Testimonials";

const Home = () => {
  return (
    <div className="home-page section">
      <Hero />
      <About />
      <Products/>
      <Testimonials/>
    </div>
  );
};

export default Home;
