import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./ProductList.css"; // Your custom styles

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // We no longer need selectedVariants in the list view, as selection happens on detail page
  // const [selectedVariants, setSelectedVariants] = useState({});

  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      const fetchedProducts = response.data;
      setProducts(fetchedProducts);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch products");
      setLoading(false);
    }
  };

  // Function to handle card click (navigation to detail page)
  const handleCardClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  // The variant selection and add to cart logic are now moved to ProductDetail
  // const handleVariantChange = (productId, variantId) => { ... };
  // const handleAddToCart = (product) => { ... };


  if (loading)
    return <p className="product_list-loading">Loading products...</p>;
  if (error) return <p className="product_list-error">{error}</p>;

  return (
    <section className="product_list-product-section container section">
      <div className="product_list-contents">
        <div className="product_list-product-grid">
          {products.map((product) => (
            <div
              className="product_list-product-card"
              key={product.id}
              onClick={() => handleCardClick(product.id)} // Make the whole card clickable
              style={{ cursor: 'pointer' }} // Indicate clickability
            >
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="product_list-product-media"
                />
              )}
              <div className="product_list-product-content">
                <h2 className="product_list-product-title">{product.name}</h2>
                {/* Keep a brief description or motto here if desired, or remove completely */}
                <p className="product_list-product-description_short">
                    {product.description.substring(0, 100)}... {/* Truncate for list view */}
                </p>
                {/* ⭐ REMOVED detailed product info from list view */}
                {/* Brand, Category, Sub-category, Country, ABV are now only on detail page */}

                {/* ⭐ REMOVED variant selection and add-to-cart button from list view */}
                {/* These are now on the ProductDetail page */}

                <button
                  className="product_list-view-details-btn" // New button class
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click from firing again
                    handleCardClick(product.id);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;