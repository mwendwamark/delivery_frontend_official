import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams and useNavigate
import "./ProductDetails.css"; // We'll create this CSS file next

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate(); // For programmatic navigation (e.g., back button)

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(''); // For selected variant on detail page

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/products/${id}`);
        const fetchedProduct = response.data;
        setProduct(fetchedProduct);

        // Pre-select the first variant if available
        if (fetchedProduct.product_variants && fetchedProduct.product_variants.length > 0) {
          setSelectedVariantId(fetchedProduct.product_variants[0].id);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch product details. Product might not exist.");
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]); // Re-fetch when ID changes

  const handleVariantChange = (e) => {
    setSelectedVariantId(parseInt(e.target.value));
  };

  const handleAddToCart = () => {
    if (!product) return; // Should not happen if data is loaded

    if (!selectedVariantId) {
      alert("Please select a size before adding to cart.");
      return;
    }

    const selectedVariant = product.product_variants.find(
      (variant) => variant.id === selectedVariantId
    );

    if (selectedVariant) {
      console.log(
        `Added ${product.name} (Size: ${selectedVariant.size}, Price: $${selectedVariant.price}) to cart!`
      );
      // Implement your actual add-to-cart logic here
      alert(`Added ${product.name} (${selectedVariant.size}) to cart! Price: $${selectedVariant.price}`);
    } else {
      alert("Selected variant not found. Please try again.");
    }
  };

  if (loading) return <p className="product_detail-loading">Loading product details...</p>;
  if (error) return <p className="product_detail-error">{error}</p>;
  if (!product) return <p className="product_detail-no-data">Product not found.</p>; // Fallback if product is null after loading

  // Get the current selected variant to display its price and stock
  const currentSelectedVariant = product.product_variants.find(
    (variant) => variant.id === selectedVariantId
  );

  return (
    <section className="product_detail-section container section">
      <button onClick={() => navigate(-1)} className="product_detail-back-button">
        &larr; Back to Products
      </button>

      <div className="product_detail-content-wrapper">
        <div className="product_detail-image-container">
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="product_detail-main-image"
            />
          )}
        </div>

        <div className="product_detail-info">
          <h1 className="product_detail-title">{product.name}</h1>
          <p className="product_detail-description">{product.description}</p>

          <div className="product_detail-attributes">
            <p className="product_detail-attribute"><strong>Brand:</strong> {product.brand}</p>
            <p className="product_detail-attribute"><strong>Category:</strong> {product.category}</p>
            <p className="product_detail-attribute"><strong>Sub-category:</strong> {product.subcategory}</p>
            <p className="product_detail-attribute"><strong>Country:</strong> {product.country}</p>
            <p className="product_detail-attribute"><strong>Alcohol Content:</strong> {product.abv}%</p>
          </div>

          {product.product_variants && product.product_variants.length > 0 && (
            <div className="product_detail-variant-selection">
              <label htmlFor="size-select" className="product_detail-label">Select Size:</label>
              <select
                id="size-select"
                className="product_detail-select"
                value={selectedVariantId}
                onChange={handleVariantChange}
              >
                {product.product_variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.size}
                  </option>
                ))}
              </select>

              {currentSelectedVariant && (
                <>
                  <p className="product_detail-price">
                    Price: ${parseFloat(currentSelectedVariant.price).toFixed(2)}
                  </p>
                  <p className="product_detail-stock">
                    Stock: {currentSelectedVariant.stock} in stock
                  </p>
                </>
              )}
            </div>
          )}

          <button
            className="product_detail-add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={!currentSelectedVariant || currentSelectedVariant.stock === 0}
          >
            {currentSelectedVariant && currentSelectedVariant.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;