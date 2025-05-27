import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { RiUserLine, RiCloseLine } from "react-icons/ri";
import { IoSearchOutline, IoMenu } from "react-icons/io5";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar_contents">
          {/* Desktop Navigation - Left Items */}
          <div className="desktop-nav nav-items_left">
            <NavLink to="/" className="nav-item_left" onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/products" className="nav-item_left" onClick={closeMenu}>
              Products
            </NavLink>
            <NavLink to="/faqs" className="nav-item_left" onClick={closeMenu}>
              FAQs
            </NavLink>
            <NavLink to="/about-us" className="nav-item_left" onClick={closeMenu}>
              About Us
            </NavLink> 
            <NavLink to="/contacts" className="nav-item_right" onClick={closeMenu}>
              Contacts
            </NavLink>
          </div>

          {/* Logo - Center */}
          <div className="nav-items_logo">
            <h1>
              <NavLink to="/" className="nav-item" onClick={closeMenu}>
                Liqour <br /> Chap Chap
              </NavLink>
            </h1>
          </div>

          {/* Desktop Navigation - Right Items */}
          <div className="desktop-nav nav-items_right">

            <div className="nav-item_right-icon">
              <IoSearchOutline className="nav-right_icon" />
            </div>
            <div className="nav-item_right-icon">
              <HiOutlineShoppingCart className="nav-right_icon" />
            </div>
            <div className="nav-item_right-icon">
              <RiUserLine className="nav-right_icon" />
            </div>
            <NavLink
              to="/make-order"
              className="nav-item_right-btn btn btn-primary"
              onClick={closeMenu}
            >
              Order Now
            </NavLink>
          </div>

          {/* Mobile Header Icons */}
          <div className="mobile-header-icons">
            <IoSearchOutline className="mobile-header-icon" />
            <HiOutlineShoppingCart className="mobile-header-icon" />
            <button className="hamburger-menu" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? (
                <RiCloseLine className="menu-icon" />
              ) : (
                <IoMenu className="menu-icon" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
      
      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-nav-items">
            <NavLink to="/" className="mobile-nav-item" onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/products" className="mobile-nav-item" onClick={closeMenu}>
              Products
            </NavLink>
            <NavLink to="/faqs" className="mobile-nav-item" onClick={closeMenu}>
              FAQs
            </NavLink>
            <NavLink to="/about-us" className="mobile-nav-item" onClick={closeMenu}>
              About Us
            </NavLink>
            <NavLink to="/contacts" className="mobile-nav-item" onClick={closeMenu}>
              Contacts
            </NavLink>
          </div>
          
          <div className="mobile-nav-footer">
            <div className="mobile-nav-icons">
              <div className="mobile-nav-icon">
                <IoSearchOutline className="nav-icon" />
              </div>
              <div className="mobile-nav-icon">
                <HiOutlineShoppingCart className="nav-icon" />
              </div>
              <div className="mobile-nav-icon">
                <RiUserLine className="nav-icon" />
              </div>
            </div>
            <NavLink
              to="/make-order"
              className="mobile-order-btn btn btn-primary"
              onClick={closeMenu}
            >
              Order Now
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;