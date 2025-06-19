import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MoveLeft, CreditCard } from "lucide-react";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { productsAPI } from "../../Config/api"; // Adjust the path as needed
// import { API_BASE_URL, apiCall, productsAPI } from "../../Config/api";

import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const fetchedProduct = await productsAPI.getById(id);
        
        setProduct(fetchedProduct);

        // Pre-select the first variant if available
        if (
          fetchedProduct.product_variants &&
          fetchedProduct.product_variants.length > 0
        ) {
          setSelectedVariantId(fetchedProduct.product_variants[0].id);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch product details. Product might not exist.");
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleVariantSelection = (variantId) => {
    setSelectedVariantId(variantId);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!selectedVariantId) {
      alert("Please select a size before adding to cart.");
      return;
    }

    const selectedVariant = product.product_variants.find(
      (variant) => variant.id === selectedVariantId
    );

    if (selectedVariant) {
      try {
        // API call to add item to cart
        // const cartData = {
        //   product_id: product.id,
        //   variant_id: selectedVariantId,
        //   quantity: 1,
        // };

        // await cartAPI.addItem(cartData);

        console.log(
          `Added ${product.name} (Size: ${selectedVariant.size}, Price: $${selectedVariant.price}) to cart!`
        );
        alert(
          `Added ${product.name} (${selectedVariant.size}) to cart! Price: KES ${selectedVariant.price}`
        );
      } catch (error) {
        console.error("Failed to add item to cart:", error);
        alert("Failed to add item to cart. Please try again.");
      }
    } else {
      alert("Selected variant not found. Please try again.");
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    if (!selectedVariantId) {
      alert("Please select a size before proceeding.");
      return;
    }

    const selectedVariant = product.product_variants.find(
      (variant) => variant.id === selectedVariantId
    );

    if (selectedVariant) {
      try {
        // Create immediate order
        // const orderData = {
        //   product_id: product.id,
        //   variant_id: selectedVariantId,
        //   quantity: 1,
        //   immediate_purchase: true,
        // };

        // const createdOrder = await ordersAPI.create(orderData);

        alert("Redirecting to payment...");
        // Navigate to payment/checkout page
        // navigate('/checkout', { state: { orderId: createdOrder.id } });

      } catch (error) {
        console.error("Failed to process order:", error);
        alert("Failed to process order. Please try again.");
      }
    } else {
      alert("Selected variant not found. Please try again.");
    }
  };

  if (loading)
    return <p className="product_detail-loading">Loading product details...</p>;
  if (error) return <p className="product_detail-error">{error}</p>;
  if (!product)
    return <p className="product_detail-no-data">Product not found.</p>;

  const currentSelectedVariant = product.product_variants.find(
    (variant) => variant.id === selectedVariantId
  );

  return (
    <section className="product_detail-section container section">
      <div className="product_detail-back-section">
        <button
          onClick={() => navigate(-1)}
          className="product_detail-back-button"
        >
          <MoveLeft /> Back to Products
        </button>
      </div>
      <div className="product_detail-content-wrapper">
        <div className="product_detail-image-container">
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="product_detail-main-image"
              loading="lazy"
            />
          )}
        </div>

        <div className="product_detail-info">
          <h1 className="product_detail-title">{product.name}</h1>
          <p className="product_detail-description">{product.description}</p>

          <div className="product_detail-attributes">
            <p className="product_detail-attribute">
              <strong>Brand:</strong> {product.brand}
            </p>
            <p className="product_detail-attribute">
              <strong>Category:</strong> {product.category}
            </p>
            <p className="product_detail-attribute">
              <strong>Sub-category:</strong> {product.subcategory}
            </p>
            <p className="product_detail-attribute">
              <strong>Country:</strong> {product.country}
            </p>
            <p className="product_detail-attribute">
              <strong>Alcohol Content:</strong> {product.abv}%
            </p>
          </div>

          {product.product_variants && product.product_variants.length > 0 && (
            <div className="product_detail-variant-selection">
              <p className="product_detail-label">Select Size:</p>
              <div className="product_detail-variant-buttons">
                {product.product_variants.map((variant) => (
                  <button
                    key={variant.id}
                    className={`product_detail-variant-button ${
                      selectedVariantId === variant.id ? "selected" : ""
                    } ${variant.stock === 0 ? "out-of-stock" : ""}`}
                    onClick={() => handleVariantSelection(variant.id)}
                    disabled={variant.stock === 0}
                  >
                    <span className="variant-size">{variant.size}</span>
                    {/* <span className="variant-price">
                      ${parseFloat(variant.price).toFixed(2)}
                    </span> */}
                    {variant.stock === 0 && (
                      <span className="variant-stock-status">Out of Stock</span>
                    )}
                  </button>
                ))}
              </div>

              {currentSelectedVariant && (
                <div className="product_detail-selected-info">
                  <p className="product_detail-price">
                    Selected: {currentSelectedVariant.size} - KES{" "}
                    {parseFloat(currentSelectedVariant.price).toFixed(2)}
                  </p>
                  <p className="product_detail-stock">
                    Stock: {currentSelectedVariant.stock} available
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="product_detail-order-btns">
            <button
              className="product_detail-add-to-cart-btn btn btn-primary"
              onClick={handleAddToCart}
              disabled={
                !currentSelectedVariant || currentSelectedVariant.stock === 0
              }
            >
              <HiOutlineShoppingCart size={18} />
              {currentSelectedVariant && currentSelectedVariant.stock === 0
                ? "Out of Stock"
                : "Add to Cart"}
            </button>
            <button
              className="product_detail-buy-now-btn btn btn-outline"
              onClick={handleBuyNow}
              disabled={
                !currentSelectedVariant || currentSelectedVariant.stock === 0
              }
            >
              <CreditCard size={18} />
              {currentSelectedVariant && currentSelectedVariant.stock === 0
                ? "Out of Stock"
                : "Buy now"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;