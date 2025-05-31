import React from "react";
import "./About.css";
import { GiGlassCelebration } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import SearchIcon from "../../../assets/SVG/Search.svg";
import CartIcon from "../../../assets/SVG/Cart.svg";
import DeliverIcon from "../../../assets/SVG/Deliver.svg";
import CheersIcon from "../../../assets/SVG/Cheers.svg"

const About = () => {
  return (
    <>
      <section className="home-about section-spacing container">
        <div className="home-about_title">
          <span className="subtitle">
            <GiGlassCelebration className="subtitle-icon"/>
            ABOUT US
          </span>
          <h2 className="text-thick">Who we are?</h2>
        </div>

        <div className="home-about_description">
          <p>
            At Liquor Chap Chap, we're passionate about bringing your favorite beverages right to your doorstep. 
            Whether you're hosting a party, celebrating a special occasion, or simply stocking up, 
            our seamless delivery service ensures you get what you need, when you need it.
          </p>
          <div className="home-about_learn-more">
            <NavLink to="/faqs" className="btn btn-ghost btn-outline">
              {" "}
              Learn more
            </NavLink>
          </div>
        </div>

        <div className="home-about_summary">
          <div className="home-about_summary-card">
            <div className="summary-card_top">
              <div className="summary-card_title">
                <span>Step 1</span>
                <h3>Search</h3>
              </div>
              <img src={SearchIcon} alt="Search" className="summary-card-icon" />
            </div>
            <div className="summary-card_bottom">
              <p>Discover our curated collection of premium beverages, from fine wines to craft beers</p>
            </div>
          </div>

          <div className="home-about_summary-card">
            <div className="summary-card_top">
              <div className="summary-card_title">
                <span>Step 2</span>
                <h3>Add to Cart</h3>
              </div>
              <img src={CartIcon} alt="Cart" className="summary-card-icon" />
            </div>
            <div className="summary-card_bottom">
              <p>Easily add your favorite drinks to your cart with just a few clicks</p>
            </div>
          </div>

          <div className="home-about_summary-card">
            <div className="summary-card_top">
              <div className="summary-card_title">
                <span>Step 3</span>
                <h3>Fast Delivery</h3>
              </div>
              <img src={DeliverIcon} alt="Delivery" className="summary-card-icon" />
            </div>
            <div className="summary-card_bottom">
              <p>Get your order delivered quickly to your doorstep</p>
            </div>
          </div>
          <div className="home-about_summary-card">
            <div className="summary-card_top">
              <div className="summary-card_title">
                <span>Step 4</span>
                <h3>Enjoy your Drink</h3>
              </div>
              <img src={CheersIcon} alt="Delivery" className="summary-card-icon" />
            </div>
            <div className="summary-card_bottom">
              <p>Get your order delivered quickly to your doorstep</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
