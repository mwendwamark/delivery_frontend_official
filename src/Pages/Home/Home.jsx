import React from "react";
import Hero from "./HomeHero/Hero";
import About from "./HomeAbout/About";

const Home = () => {
  return (
    <div className="home-page section">
      <Hero />
      <About />
    </div>
  );
};

export default Home;
