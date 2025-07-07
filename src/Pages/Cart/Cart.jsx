// Cart.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { HiOutlineTrash } from "react-icons/hi";
import "./Cart.css";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
    itemCount,
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (itemCount === 0) {
    return (
      // Add 'empty-cart-page' class to the main container when empty
      <div className="cart-container section empty-cart-page">
        {" "}
        {/* This class is critical */}
        <div className="empty-cart">
          <div className="empty-cart-container">
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <NavLink to="/products" className="continue-shopping-btn">
              Continue Shopping
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container section">
      <div className="cart-contents container">
        <h1>
          Your Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
        </h1>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="cart-item"
              >
                <div className="item-image">
                  <img
                    src={item.image}
                    alt={item.productName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/path-to-placeholder-image.jpg";
                    }}
                  />
                </div>

                <div className="item-details">
                  <h3>{item.productName}</h3>
                  <p>Size: {item.size}</p>
                  <p className="item-price">
                    KES {item.price.toLocaleString()}
                  </p>

                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variantId,
                          item.quantity - 1
                        )
                      }
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variantId,
                          item.quantity + 1
                        )
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  <p>KES {(item.price * item.quantity).toLocaleString()}</p>
                  <button
                    onClick={() =>
                      removeFromCart(item.productId, item.variantId)
                    }
                    className="remove-btn"
                    aria-label="Remove item"
                  >
                    <HiOutlineTrash />
                  </button>
                </div>
              </div>
            ))}

            <button onClick={clearCart} className="clear-cart-btn">
              Clear Cart
            </button>
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>
                Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
              <span>KES {cartTotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>Free</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>KES {cartTotal.toLocaleString()}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="checkout-btn "
              disabled={itemCount === 0}
            >
              Proceed to Checkout
            </button>

            <NavLink to="/products" className="continue-shopping-link">
              Continue Shopping
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
