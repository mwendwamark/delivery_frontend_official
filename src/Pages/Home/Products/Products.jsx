import React, { useState } from "react";
import { GiGlassCelebration, GiWineBottle, GiCoffeeCup } from "react-icons/gi";
import {  FaShoppingCart, FaEye } from "react-icons/fa";
import { LiaGlassWhiskeySolid } from "react-icons/lia";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import "./Product.css";

const Products = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const featuredProducts = [
    {
      id: 1,
      name: "Tusker Lager",
      category: "Beer",
      price: 280,
      originalPrice: 320,
      image:
        "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400",
      description: "Kenya's pride - 100% African ingredients",
      badge: "Local Favorite",
      icon: <GiCoffeeCup />,
    },
    {
      id: 2,
      name: "Gilbey's London Dry Gin",
      category: "Gin",
      price: 1850,
      originalPrice: 2100,
      image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400",
      description: "Premium London Dry Gin with juniper berries",
      badge: "Trending",
      icon: <GiWineBottle />,
    },
    {
      id: 3,
      name: "Jack Daniel's No.7",
      category: "Whiskey",
      price: 3200,
      originalPrice: 3600,
      image:
        "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400",
      description: "America's top-selling Tennessee whiskey",
      badge: "Best Seller",
      icon: <LiaGlassWhiskeySolid />,
    },
    {
      id: 4,
      name: "Baileys Irish Cream",
      category: "Liqueur",
      price: 2400,
      originalPrice: 2800,
      image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
      description: "Smooth blend of Irish cream and whiskey",
      badge: "Premium",
      icon: <GiGlassCelebration />,
    },
    {
      id: 5,
      name: "Johnnie Walker Black",
      category: "Whiskey",
      price: 4500,
      originalPrice: 5200,
      image:
        "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400",
      description: "Benchmark for deluxe blended whisky",
      badge: "Luxury",
      icon: <LiaGlassWhiskeySolid />,
    },
    {
      id: 6,
      name: "4th Street Wine",
      category: "Wine",
      price: 850,
      originalPrice: 1000,
      image:
        "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400",
      description: "Sweet and fruity South African wine",
      badge: "Popular",
      icon: <GiWineBottle />,
    },
  ];

  return (
    <section className="home-products section-spacing">
      {/* Background decoration */}
      <div className="background-decoration"></div>

      <div className="home-products_contents container">
        {/* Section Header */}
        <div className="home-produts_title">
          <span className="subtitle">
            <GiGlassCelebration className="subtitle-icon" />
            PREMIUM SELECTION
          </span>
          <h2 className="section-title text-thick">People's Favourites</h2>
          <p className="section-description">
            Discover our curated collection of premium spirits, locally sourced
            beers, and international favorites
          </p>
        </div>

        {/* Featured Products Grid */}
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className={`product-card ${
                hoveredProduct === product.id ? "hovered" : ""
              }`}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Badge */}
              <div
                className={`product-badge ${product.badge
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {product.badge}
              </div>

              {/* Product Image */}
              <div
                className="product-image"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url(${product.image})`,
                }}
              >
                <div className="product-icon">{product.icon}</div>

                {/* Hover Actions */}
                <div className="product-actions">
                  <button className="action-btn view-btn">
                    <FaEye />
                  </button>
                  <button className="action-btn cart-btn">
                    <FaShoppingCart />
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="product-details">
                <div className="product-category">{product.category}</div>

                <h3 className="product-name">{product.name}</h3>

                <p className="product-description">{product.description}</p>

                <div className="product-pricing">
                  <div className="price-section">
                    <span className="current-price">
                      KES {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="original-price">
                        KES {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {product.originalPrice && (
                    <div className="discount-badge">
                      SAVE{" "}
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      %
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <div className="cta-background-decoration"></div>

          <div className="cta-content">
            <h3 className="cta-title">Explore Our Complete Collection</h3>
            <p className="cta-description">
              From premium whiskeys to local favorites, discover over 100+
              carefully selected spirits and wines
            </p>

            <button className="btn cta-button">
              View All Products
              <HiOutlineArrowLongRight className="btn-icon" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
