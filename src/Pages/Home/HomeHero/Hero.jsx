import React from "react";
import "./Hero.css";
import { NavLink } from "react-router-dom";
import img1 from "../../../assets/Images/HomeImages/HeroImage.jpg";
import { HiOutlineArrowLongRight, HiOutlineSparkles } from "react-icons/hi2";
import { FaWineBottle, FaWineGlassAlt, FaShippingFast } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="home-hero">
      <div className="hero-overlay"></div>
      <div className="home-hero-content container">
        <div className="home-left_section">
          <span className="hero-subtitle">
            <HiOutlineSparkles className="sparkle-icon" />
            PREMIUM LIQUOR DELIVERY
          </span>
          <h1>
            Quality Liquor, <br />
            Delivered to Your Door
          </h1>
          <p className="hero-description">
            Experience the finest selection of premium wines, rare spirits, and
            craft beers curated for connoisseurs. Fast, discreet delivery to
            your doorstep.
          </p>
          <div className="hero-cta">
            <NavLink to="#products" className="btn btn-home_hero">
              Our Collection <HiOutlineArrowLongRight className="btn-icon" />
            </NavLink>
            <NavLink to="#contact" className="btn btn-outline-white">
              Contact Us
            </NavLink>
          </div>
          <div className="hero-features">
            <div className="feature">
              <FaWineBottle className="feature-icon" />
              <span>Premium Selection</span>
            </div>
            <div className="feature">
              <FaShippingFast className="feature-icon" />
              <span>Fast Delivery</span>
            </div>
            <div className="feature">
              <FaWineGlassAlt className="feature-icon" />
              <span>Expertly Curated</span>
            </div>
          </div>
        </div>

        <div className="home-right_section">
          <div className="home-hero-image_container">
            <div className="image-overlay"></div>
            <img
              src={img1}
              alt="Premium spirits collection"
              className="hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
