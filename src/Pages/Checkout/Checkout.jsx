import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import PaystackPop from "@paystack/inline-js";

import { useCart } from "../../contexts/CartContext";

import { ordersAPI, paystackAPI } from "../../Config/api";

import "./Checkout.css";

// Get logged in user data

const getLoggedInUser = () => {
  const userDataString = sessionStorage.getItem("user");

  if (userDataString) {
    try {
      return JSON.parse(userDataString);
    } catch (e) {
      console.error("Error parsing user_data from sessionStorage:", e);

      return null;
    }
  }

  return null;
};

const getLoggedInUserEmail = () => {
  const user = getLoggedInUser();

  return user?.email || "guest@example.com";
};

// Address form component

const AddressForm = ({
  address,

  onChange,

  isManual,

  onToggleManual,

  savedAddresses = [],

  onSelectAddress,
}) => {
  return (
    <div className="address-form">
      <div className="address-radio-group">
        <label>
          <input
            type="radio"
            checked={!isManual}
            onChange={() => onToggleManual(false)}
          />

          <span>Use saved address</span>
        </label>

        <label>
          <input
            type="radio"
            checked={isManual}
            onChange={() => onToggleManual(true)}
          />

          <span>Enter address manually</span>
        </label>
      </div>

      {!isManual ? (
        <div className="form-group">
          <label htmlFor="saved-address">Select Address</label>

          <select
            id="saved-address"
            value={address?.id || ""}
            onChange={(e) => onSelectAddress(e.target.value)}
            className="form-control"
            required
          >
            <option value="">Select a saved address</option>

            {savedAddresses.length > 0 ? (
              savedAddresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.street_address}, {addr.location} - {addr.recipient_name}
                </option>
              ))
            ) : (
              <option disabled>No saved addresses found</option>
            )}
          </select>

          {savedAddresses.length === 0 && (
            <p className="no-addresses-message">
              No saved addresses found. Please enter your address manually.
            </p>
          )}
        </div>
      ) : (
        <div className="manual-address-form">
          <div className="form-group">
            <label htmlFor="recipient-name">Recipient Name</label>

            <input
              id="recipient-name"
              type="text"
              name="recipient_name"
              value={address.recipient_name || ""}
              onChange={onChange}
              placeholder="Full name of the recipient"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="recipient-phone">Recipient Phone</label>

            <input
              id="recipient-phone"
              type="tel"
              name="recipient_phone"
              value={address.recipient_phone || ""}
              onChange={onChange}
              placeholder="e.g., 254700000000"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="street-address">Street Address</label>

            <input
              id="street-address"
              type="text"
              name="street_address"
              value={address.street_address || ""}
              onChange={onChange}
              placeholder="House number, building, street name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location/Area</label>

            <input
              id="location"
              type="text"
              name="location"
              value={address.location || ""}
              onChange={onChange}
              placeholder="Area, city, or town"
              required
            />
          </div>

          <div className="location-coordinates">
            <div className="form-group">
              <label htmlFor="latitude">Latitude (optional)</label>

              <input
                id="latitude"
                type="number"
                step="any"
                name="latitude"
                value={address.latitude || ""}
                onChange={onChange}
                placeholder="e.g., -1.2921"
              />
            </div>

            <div className="form-group">
              <label htmlFor="longitude">Longitude (optional)</label>

              <input
                id="longitude"
                type="number"
                step="any"
                name="longitude"
                value={address.longitude || ""}
                onChange={onChange}
                placeholder="e.g., 36.8219"
              />
            </div>
          </div>

          <div className="form-note">
            <p>
              Note: Providing accurate location coordinates helps our delivery
              team find you more easily.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckoutPage = () => {
  const { cartItems, cartTotal, itemCount, clearCart } = useCart();

  const navigate = useNavigate();

  // We'll get the user once and store it in state to prevent re-rendering issues

  const [user, setUser] = useState(null);

  // Payment state

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("payOnDelivery");

  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState("");

  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  const [paymentMessage, setPaymentMessage] = useState("");

  const [currentOrderId, setCurrentOrderId] = useState(null);

  const [orderStatus, setOrderStatus] = useState(null);

  // Address state

  const [savedAddresses, setSavedAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState({
    id: null,

    recipient_name: "",

    recipient_phone: "",

    street_address: "",

    location: "",

    latitude: "",

    longitude: "",
  });

  const [isManualAddress, setIsManualAddress] = useState(false);

  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  // Effect to load user data on initial mount

  useEffect(() => {
    setUser(getLoggedInUser());
  }, []); // Empty dependency array ensures this runs only once

  // Fetch saved addresses on component mount

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        // For now, we'll use mock data

        setSavedAddresses([
          {
            id: 1,

            street_address: "123 Main St",

            location: "Nairobi",

            recipient_name: user?.full_name || "John Doe",

            recipient_phone: user?.phone || "+254700000000",

            latitude: -1.2921,

            longitude: 36.8219,

            full_address: "123 Main St, Nairobi",
          },
        ]);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    if (user) {
      fetchAddresses();
    } else {
      // If user is not logged in, default to manual address entry

      setIsManualAddress(true);

      setIsLoadingAddresses(false);
    }
  }, [user]); // Now the dependency array correctly uses the stable user state

  // Handle address input changes

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setSelectedAddress((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  // Toggle between manual and saved addresses

  const handleToggleManualAddress = (isManual) => {
    setIsManualAddress(isManual);

    // Reset selected address when toggling

    if (isManual) {
      setSelectedAddress({
        id: null,

        recipient_name: user?.full_name || "",

        recipient_phone: user?.phone || "",

        street_address: "",

        location: "",

        latitude: "",

        longitude: "",
      });
    } else {
      // Clear the manual address fields

      setSelectedAddress({
        id: null,

        recipient_name: "",

        recipient_phone: "",

        street_address: "",

        location: "",

        latitude: "",

        longitude: "",
      });

      // Automatically select the first saved address if available

      if (savedAddresses.length > 0) {
        handleSelectAddress(savedAddresses[0].id);
      }
    }
  };

  // Handle address selection from dropdown

  const handleSelectAddress = (addressId) => {
    if (!addressId) {
      setSelectedAddress({
        id: null,

        recipient_name: "",

        recipient_phone: "",

        street_address: "",

        location: "",

        latitude: "",

        longitude: "",
      });

      return;
    }

    const address = savedAddresses.find(
      (addr) => addr.id === parseInt(addressId)
    );

    if (address) {
      setSelectedAddress({
        id: address.id,

        recipient_name: address.recipient_name,

        recipient_phone: address.recipient_phone,

        street_address: address.street_address,

        location: address.location,

        latitude: address.latitude,

        longitude: address.longitude,
      });
    }
  };

  // Paystack Public Key from environment variables

  const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  // Effect for polling order status from your Rails backend

  useEffect(() => {
    let pollInterval;

    if (isLoadingPayment && currentOrderId) {
      pollInterval = setInterval(async () => {
        try {
          const data = await ordersAPI.getStatus(currentOrderId); // Using new API method

          setOrderStatus(data);

          if (
            data.payment_status === "Paystack Paid" ||
            data.payment_status === "Mpesa Paid" ||
            data.payment_status === "Cash on Delivery"
          ) {
            setPaymentMessage(
              "Payment successful! Redirecting to confirmation..."
            );

            setIsLoadingPayment(false);

            clearInterval(pollInterval);

            clearCart();

            // navigate(`/order-confirmation/${currentOrderId}`);
          } else if (
            data.payment_status === "Paystack Failed" ||
            data.payment_status === "payment_failed"
          ) {
            setPaymentMessage("Payment failed. Please try again.");

            setIsLoadingPayment(false);

            clearInterval(pollInterval);
          }
        } catch (error) {
          console.error("Network error polling order status:", error);

          setPaymentMessage(
            "Error checking payment status. Please check your order history."
          );

          setIsLoadingPayment(false);

          clearInterval(pollInterval);
        }
      }, 5000);

      return () => clearInterval(pollInterval);
    }
  }, [isLoadingPayment, currentOrderId, clearCart, navigate]);

  // Handle change in payment method selection

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);

    setMpesaPhoneNumber("");

    setPaymentMessage("");

    setIsLoadingPayment(false);

    setOrderStatus(null);

    setCurrentOrderId(null);
  };

  // Main function to handle "Place Order" button click

  const handlePlaceOrder = async () => {
    setPaymentMessage("");

    // Validate cart

    if (itemCount === 0) {
      setPaymentMessage(
        "Your cart is empty. Please add items before checking out."
      );

      return;
    }

    // Validate address based on the current mode

    if (isManualAddress) {
      if (
        !selectedAddress.recipient_name ||
        !selectedAddress.recipient_phone ||
        !selectedAddress.street_address ||
        !selectedAddress.location
      ) {
        setPaymentMessage("Please fill in all required address fields.");

        return;
      }
    } else {
      if (!selectedAddress.id) {
        setPaymentMessage("Please select a delivery address.");

        return;
      }
    }

    setIsLoadingPayment(true);

    setPaymentMessage("Processing order...");

    // Prepare the cart items payload

    const cartItemsPayload = cartItems.map((item) => ({
      product_id: item.productId,

      quantity: item.quantity,

      size: item.size,

      price_per_unit: item.price,
    }));

    let apiPayload;

    // Dynamically create the payload to avoid sending a null delivery_address_id

    if (isManualAddress) {
      apiPayload = {
        amount: cartTotal,

        cart_items: cartItemsPayload,

        manual_address: {
          location: selectedAddress.location,

          street_address: selectedAddress.street_address,

          latitude: selectedAddress.latitude || null,

          longitude: selectedAddress.longitude || null,

          recipient_name: selectedAddress.recipient_name,

          recipient_phone: selectedAddress.recipient_phone,
        },
      };
    } else {
      apiPayload = {
        amount: cartTotal,

        cart_items: cartItemsPayload,

        delivery_address_id: selectedAddress.id,
      };
    }

    if (selectedPaymentMethod === "payOnDelivery") {
      try {
        apiPayload.payment_method = "cash_on_delivery";

        // Create the order

        const response = await ordersAPI.createCashOnDelivery(apiPayload);

        if (response) {
          setPaymentMessage("Order placed successfully for Cash on Delivery!");

          setCurrentOrderId(response.order_id);

          setOrderStatus({
            payment_status: "Cash on Delivery",

            status: "confirmed",

            receipt_url: response.receipt_url,
          });

          clearCart();

          // navigate(`/order-confirmation/${response.order_id}`);
        }
      } catch (error) {
        console.error("Error placing COD order:", error);

        setPaymentMessage(`Failed to place order: ${error.message}`);
      } finally {
        setIsLoadingPayment(false);
      }
    } else if (
      selectedPaymentMethod === "mpesa" ||
      selectedPaymentMethod === "card"
    ) {
      // Logic for Paystack payments (M-Pesa or Card)

      const customerEmail = user?.email || "guest@example.com";

      if (!customerEmail || customerEmail === "guest@example.com") {
        setPaymentMessage(
          "Please log in or provide a valid email for payment."
        );

        setIsLoadingPayment(false);

        return;
      }

      if (selectedPaymentMethod === "mpesa" && !mpesaPhoneNumber) {
        setPaymentMessage("Please enter your M-Pesa phone number.");

        setIsLoadingPayment(false);

        return;
      }

      try {
        // Add email and phone to the payload

        apiPayload.email = customerEmail;

        apiPayload.phone_number = mpesaPhoneNumber;

        const initiateResponse = await paystackAPI.initiatePayment(apiPayload);

        setCurrentOrderId(initiateResponse.order_id);

        setPaymentMessage("Initiating Paystack payment...");

        // Step 2: Use PaystackPop to open payment modal

        const handler = PaystackPop.setup({
          key: PAYSTACK_PUBLIC_KEY,

          email: customerEmail,

          amount: (cartTotal * 100).toFixed(0), // Amount in kobo/cents

          reference: initiateResponse.reference,

          onClose: () => {
            setPaymentMessage(
              "Payment window closed. Please check your order history."
            );

            setIsLoadingPayment(false);
          },

          callback: (response) => {
            setPaymentMessage("Payment initiated. Waiting for confirmation...");

            setIsLoadingPayment(true);
          },
        });

        handler.openIframe();
      } catch (error) {
        console.error("Error during Paystack initiation:", error);

        setPaymentMessage(`Failed to initiate payment: ${error.message}`);

        setIsLoadingPayment(false);
      }
    }
  };

  // If cart is empty, redirect or show empty cart message

  if (itemCount === 0 && !currentOrderId) {
    return (
      <div className="checkout-container empty-cart-page">
        <div className="empty-cart-message">
          <h2>Your cart is empty!</h2>

          <p>Add some delicious drinks to proceed to checkout.</p>

          <button
            onClick={() => navigate("/products")}
            className="continue-shopping-btn"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-summary">
        <h3>Order Summary</h3>

        <h1 className="checkout-title">Secure Checkout</h1>

        {/* Order Summary Section */}

        <div className="order-summary">
          <h2 className="summary-title">Order Summary</h2>

          <div className="summary-item">
            <span className="summary-label">Subtotal ({itemCount} items)</span>

            <span className="summary-value">
              KES {cartTotal.toLocaleString()}
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-label">Delivery Fee</span>

            <span className="summary-value">KES 0.00</span>
          </div>

          <div className="summary-item summary-total">
            <span className="summary-label">Total</span>

            <span className="summary-total-value">
              KES {cartTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Delivery Address Section */}

        <div className="delivery-address-section">
          <h2 className="section-title">Delivery Address</h2>

          {isLoadingAddresses ? (
            <p>Loading addresses...</p>
          ) : (
            <AddressForm
              address={selectedAddress}
              onChange={handleAddressChange}
              isManual={isManualAddress}
              onToggleManual={handleToggleManualAddress}
              savedAddresses={savedAddresses}
              onSelectAddress={handleSelectAddress}
            />
          )}
        </div>

        {/* Payment Method Selection */}

        <div className="payment-method-section">
          <h2 className="payment-method-title">Select Payment Method</h2>

          <div className="payment-options">
            {/* Pay on Delivery */}

            <label
              htmlFor="payOnDelivery"
              className={`payment-option-label ${
                selectedPaymentMethod === "payOnDelivery" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                id="payOnDelivery"
                name="paymentMethod"
                value="payOnDelivery"
                checked={selectedPaymentMethod === "payOnDelivery"}
                onChange={handlePaymentMethodChange}
                className="form-radio"
              />

              <span className="payment-option-text">Pay on Delivery</span>
            </label>

            {/* M-Pesa (via Paystack) */}

            <label
              htmlFor="mpesa"
              className={`payment-option-label ${
                selectedPaymentMethod === "mpesa" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                id="mpesa"
                name="paymentMethod"
                value="mpesa"
                checked={selectedPaymentMethod === "mpesa"}
                onChange={handlePaymentMethodChange}
                className="form-radio"
              />

              <span className="payment-option-text">M-Pesa</span>
            </label>

            {/* Credit/Debit Card (via Paystack) */}

            <label
              htmlFor="card"
              className={`payment-option-label ${
                selectedPaymentMethod === "card" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                id="card"
                name="paymentMethod"
                value="card"
                checked={selectedPaymentMethod === "card"}
                onChange={handlePaymentMethodChange}
                className="form-radio"
              />

              <span className="payment-option-text">Credit/Debit Card</span>
            </label>
          </div>
        </div>

        {/* Conditional Field Reveal Area */}

        <div className="conditional-fields-area">
          {selectedPaymentMethod === "payOnDelivery" && (
            <div className="info-text">
              <p className="summary-title">You've selected Pay on Delivery.</p>

              <p>Please have the exact amount ready upon delivery.</p>
            </div>
          )}

          {selectedPaymentMethod === "mpesa" && (
            <div>
              <h3 className="summary-title">M-Pesa Details (via Paystack)</h3>

              <div className="field-group">
                <label htmlFor="mpesaPhone" className="field-label">
                  M-Pesa Phone Number
                </label>

                <input
                  type="tel"
                  id="mpesaPhone"
                  className="text-input"
                  placeholder="e.g., 0712345678"
                  value={mpesaPhoneNumber}
                  onChange={(e) => setMpesaPhoneNumber(e.target.value)}
                  required
                  disabled={isLoadingPayment}
                />
              </div>

              <p className="info-text">
                A prompt will be sent to this number to complete the payment.
              </p>
            </div>
          )}

          {selectedPaymentMethod === "card" && (
            <div>
              <h3 className="summary-title">
                Credit/Debit Card Details (via Paystack)
              </h3>

              <p className="info-text">
                You will be redirected to a secure Paystack page or a popup will
                appear to enter your card details.
              </p>
            </div>
          )}
        </div>

        {/* Place Order Button */}

        <button
          onClick={handlePlaceOrder}
          className="place-order-button"
          disabled={isLoadingPayment || itemCount === 0}
        >
          {isLoadingPayment ? "Processing Order..." : "Place Order"}
        </button>

        {paymentMessage && <p className="payment-message">{paymentMessage}</p>}

        {orderStatus &&
          (orderStatus.payment_status === "Paystack Paid" ||
            orderStatus.payment_status === "Mpesa Paid" ||
            orderStatus.payment_status === "Cash on Delivery") && (
            <div className="payment-message">
              <p>Your order is confirmed!</p>

              {orderStatus.receipt_url && (
                <a
                  href={orderStatus.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="receipt-link"
                >
                  Download Receipt
                </a>
              )}

              <p>
                Current Order Status: <b>{orderStatus.status}</b>
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default CheckoutPage;
