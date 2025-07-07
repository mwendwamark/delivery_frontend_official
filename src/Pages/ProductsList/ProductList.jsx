// import { useState, useEffect, useCallback, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { Helmet } from "react-helmet"; // <-- Import Helmet
// import {
//   Search,
//   Filter,
//   Grid,
//   List,
//   ChevronDown,
//   X,
//   Star,
//   ShoppingCart,
//   Eye,
//   Heart,
//   Flag,
//   Wine,
// } from "lucide-react";
// import "./ProductList.css";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filters, setFilters] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("name_asc");
//   const [showFilters, setShowFilters] = useState(false);
//   const [viewMode, setViewMode] = useState("grid");
//   const navigate = useNavigate();
//   const [selectedFilters, setSelectedFilters] = useState({
//     category: "",
//     subcategory: "",
//     brand: "",
//     country: "",
//     min_price: "",
//     max_price: "",
//     available_only: false,
//   });

//   // Debounced search function - moved outside of useCallback to prevent recreation
//   const debounce = useMemo(() => {
//     return (func, wait) => {
//       let timeout;
//       return function executedFunction(...args) {
//         const later = () => {
//           clearTimeout(timeout);
//           func(...args);
//         };
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//       };
//     };
//   }, []);

//   const fetchProducts = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();

//       if (searchTerm) params.append("search", searchTerm);
//       if (selectedFilters.category)
//         params.append("category", selectedFilters.category);
//       if (selectedFilters.subcategory)
//         params.append("subcategory", selectedFilters.subcategory);
//       if (selectedFilters.brand) params.append("brand", selectedFilters.brand);
//       if (selectedFilters.country)
//         params.append("country", selectedFilters.country);
//       if (selectedFilters.min_price)
//         params.append("min_price", selectedFilters.min_price);
//       if (selectedFilters.max_price)
//         params.append("max_price", selectedFilters.max_price);
//       if (selectedFilters.available_only)
//         params.append("available_only", "true");
//       if (sortBy) params.append("sort_by", sortBy);

//       // IMPORTANT: Use an absolute URL for your API call if not already
//       // This is less about SEO and more about robust fetch calls in production
//       const response = await fetch(`http://localhost:3000/products?${params}`);
//       const data = await response.json();

//       setProducts(data.products || []);
//       setFilters(data.filters || {});
//     } catch (err) {
//       setError("Failed to fetch products");
//     } finally {
//       setLoading(false);
//     }
//   }, [searchTerm, selectedFilters, sortBy]);

//   // Create debounced version of fetchProducts - this should be stable
//   const debouncedFetchProducts = useMemo(
//     () => debounce(fetchProducts, 2000),
//     [debounce, fetchProducts]
//   );

//   // Use useEffect to handle the debounced search
//   useEffect(() => {
//     debouncedFetchProducts();
//   }, [searchTerm, selectedFilters, sortBy]); // Remove debouncedFetchProducts from dependencies

//   const handleFilterChange = (filterType, value) => {
//     setSelectedFilters((prev) => ({
//       ...prev,
//       [filterType]: value,
//     }));
//   };

//   const clearFilters = () => {
//     setSelectedFilters({
//       category: "",
//       subcategory: "",
//       brand: "",
//       country: "",
//       min_price: "",
//       max_price: "",
//       available_only: false,
//     });
//     setSearchTerm("");
//   };

//   const handleProductClick = (productId) => {
//     // Navigate to product detail page
//     navigate(`/products/${productId}`);
//   };

//   const formatPrice = (priceInfo) => {
//     if (!priceInfo.has_variants) {
//       return <span className="price-unavailable">Out of Stock</span>;
//     }

//     if (priceInfo.min_price === priceInfo.max_price) {
//       return <span className="price-single">KES {priceInfo.min_price}</span>;
//     }

//     return (
//       <span className="price-range">
//         KES {priceInfo.min_price} - KES {priceInfo.max_price}
//       </span>
//     );
//   };

//   const getActiveFiltersCount = () => {
//     return (
//       Object.values(selectedFilters).filter(
//         (value) => value !== "" && value !== false
//       ).length + (searchTerm ? 1 : 0)
//     );
//   };

//   // --- SEO Metadata Variables ---
//   // These are set for the default, unfiltered view.
//   // You can dynamically adjust the title/description slightly based on active CATEGORY filter
//   // but avoid making it too specific for every combination of filters.
//   const siteName = "Liquor Chapchap";
//   const baseUrl = "https://liquorchapchap.vercel.app"; // Your deployed site base URL
//   const productListPagePath = "/products"; // Or whatever your route is for this page

//   // Dynamic Title based on category
//   const getPageTitle = () => {
//     let title = `${siteName} | Online Alcohol & Drinks Store in Nairobi`;
//     if (selectedFilters.category) {
//       title = `${selectedFilters.category} | ${siteName} - Delivery in Nairobi`;
//     }
//     return title;
//   };

//   // Dynamic Description based on category
//   const getPageDescription = () => {
//     let description = "Explore our wide selection of wines, beers, spirits, and other drinks available for fast delivery across Nairobi, Kenya. Find your favorite brands and new discoveries at Liquor Chapchap.";
//     if (selectedFilters.category) {
//       description = `Shop the best ${selectedFilters.category} at ${siteName}. We offer fast delivery of premium ${selectedFilters.category} across Nairobi, Kenya.`;
//     }
//     return description;
//   };

//   const currentCanonicalUrl = `${baseUrl}${productListPagePath}`; // Canonical should always point to the base URL of the listing page

//   // Consider an Open Graph image relevant to products or the store
//   const ogImageUrl = "https://i.im.ge/2025/06/24/JSTdGm.upscalemedia-transformed.png"; // Replace with an actual attractive image URL for social sharing
// ; // Create this image!

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner"></div>
//         <p>Loading products...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error-container">
//         <p className="error-message">{error}</p>
//         <button onClick={fetchProducts} className="retry-btn">
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="product-listing section">
//       {/* React Helmet for SEO */}
//       <Helmet>
//         <title>{getPageTitle()}</title>
//         <meta name="description" content={getPageDescription()} />
//         <link rel="canonical" href={currentCanonicalUrl} />

//         {/* Keywords (general for products page) */}
//         <meta name="keywords" content="alcohol, drinks, wine, beer, spirits, delivery, Nairobi, Kenya, online store, buy alcohol, liquor shop" />

//         {/* Open Graph Tags */}
//         <meta property="og:title" content={getPageTitle()} />
//         <meta property="og:description" content={getPageDescription()} />
//         <meta property="og:url" content={currentCanonicalUrl} />
//         <meta property="og:site_name" content={siteName} />
//         <meta property="og:type" content="product.group" /> {/* Use 'product.group' for listing pages */}
//         {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}

//         {/* Twitter Card Tags */}
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content={getPageTitle()} />
//         <meta name="twitter:description" content={getPageDescription()} />
//         {ogImageUrl && <meta name="twitter:image" content={ogImageUrl} />}

//         {/* Language declaration */}
//         <html lang="en" />
//       </Helmet>

//       {/* Header Section */}
//       <div className="listing-header section">
//         <div className="header-content">
//           <h1 className="page-title">
//             {selectedFilters.category
//               ? `${selectedFilters.category} Collection`
//               : "Our Drinks Collection"}
//           </h1>
//           <p className="page-subtitle">
//             Discover premium {selectedFilters.category || "alcoholic drinks"} from around the world, delivered fast in Nairobi.
//           </p>
//         </div>
//       </div>

//       {/* Search and Filter Bar */}
//       <div className="search-filter-bar">
//         <div className="search-container">
//           <div className="search-input-wrapper">
//             <Search className="search-icon" size={20} />
//             <input
//               type="text"
//               placeholder="Search wines, brands, or regions..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="search-input"
//             />
//             {searchTerm && (
//               <button
//                 onClick={() => setSearchTerm("")}
//                 className="clear-search-btn"
//               >
//                 <X size={18} />
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="filter-controls">
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
//           >
//             <Filter size={18} />
//             Filters
//             {getActiveFiltersCount() > 0 && (
//               <span className="filter-count">{getActiveFiltersCount()}</span>
//             )}
//             <ChevronDown
//               className={`chevron ${showFilters ? "rotated" : ""}`}
//               size={16}
//             />
//           </button>

//           <div className="view-controls">
//             <button
//               onClick={() => setViewMode("grid")}
//               className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
//             >
//               <Grid size={18} />
//             </button>
//             <button
//               onClick={() => setViewMode("list")}
//               className={`view-btn ${viewMode === "list" ? "active" : ""}`}
//             >
//               <List size={18} />
//             </button>
//           </div>

//           <div className="sort-container">
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="sort-select"
//             >
//               <option value="name_asc">Name A-Z</option>
//               <option value="name_desc">Name Z-A</option>
//               <option value="price_asc">Price Low to High</option>
//               <option value="price_desc">Price High to Low</option>
//               <option value="newest">Newest First</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Filter Panel */}
//       {showFilters && (
//         <div className="filter-panel">
//           <div className="filter-grid">
//             <div className="filter-group">
//               <label>Category</label>
//               <select
//                 value={selectedFilters.category}
//                 onChange={(e) => handleFilterChange("category", e.target.value)}
//               >
//                 <option value="">All Categories</option>
//                 {filters.categories?.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="filter-group">
//               <label>Brand</label>
//               <select
//                 value={selectedFilters.brand}
//                 onChange={(e) => handleFilterChange("brand", e.target.value)}
//               >
//                 <option value="">All Brands</option>
//                 {filters.brands?.map((brand) => (
//                   <option key={brand} value={brand}>
//                     {brand}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="filter-group">
//               <label>Country</label>
//               <select
//                 value={selectedFilters.country}
//                 onChange={(e) => handleFilterChange("country", e.target.value)}
//               >
//                 <option value="">All Countries</option>
//                 {filters.countries?.map((country) => (
//                   <option key={country} value={country}>
//                     {country}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="filter-group price-filter">
//               <label>Price Range</label>
//               <div className="price-inputs">
//                 <input
//                   type="number"
//                   placeholder="Min"
//                   value={selectedFilters.min_price}
//                   onChange={(e) =>
//                     handleFilterChange("min_price", e.target.value)
//                   }
//                 />
//                 <span>-</span>
//                 <input
//                   type="number"
//                   placeholder="Max"
//                   value={selectedFilters.max_price}
//                   onChange={(e) =>
//                     handleFilterChange("max_price", e.target.value)
//                   }
//                 />
//               </div>
//             </div>

//             <div className="filter-group">
//               <label className="checkbox-label">
//                 <input
//                   type="checkbox"
//                   checked={selectedFilters.available_only}
//                   onChange={(e) =>
//                     handleFilterChange("available_only", e.target.checked)
//                   }
//                 />
//                 Available Only
//               </label>
//             </div>
//           </div>

//           <div className="filter-actions">
//             <button onClick={clearFilters} className="clear-filters-btn">
//               Clear All Filters
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Results Summary */}
//       <div className="results-summary">
//         <p>{products.length} products found</p>
//         {getActiveFiltersCount() > 0 && (
//           <div className="active-filters">
//             {searchTerm && (
//               <span className="filter-tag">
//                 Search: "{searchTerm}"
//                 <button onClick={() => setSearchTerm("")}>×</button>
//               </span>
//             )}
//             {Object.entries(selectedFilters).map(([key, value]) => {
//               if (value && value !== false) {
//                 return (
//                   <span key={key} className="filter-tag">
//                     {key.replace("_", " ")}: {value.toString()}
//                     <button
//                       onClick={() =>
//                         handleFilterChange(
//                           key,
//                           key === "available_only" ? false : ""
//                         )
//                       }
//                     >
//                       ×
//                     </button>
//                   </span>
//                 );
//               }
//               return null;
//             })}
//           </div>
//         )}
//       </div>

//       {/* Product Grid */}
//       <div className={`product-grid ${viewMode}`}>
//         {products.map((product) => (
//           <div
//             key={product.id}
//             className="product-card"
//             onClick={() => handleProductClick(product.id)}
//           >
//             <div className="product-image-container">
//               {product.image_url ? (
//                 <img
//                   src={product.image_url}
//                   alt={product.name}
//                   className="product-image"
//                   loading="lazy"
//                 />
//               ) : (
//                 <div className="product-image-placeholder">
//                   <span>No Image</span>
//                 </div>
//               )}

//               <div className="product-overlay">
//                 <button className="action-btn wishlist-btn">
//                   <Heart size={18} />
//                 </button>
//                 <button className="action-btn quick-view-btn">
//                   <Eye size={18} />
//                 </button>
//               </div>

//               {!product.availability_info.is_available && (
//                 <div className="out-of-stock-badge">Out of Stock</div>
//               )}
//             </div>

//             <div className="product-info">
//               <div className="product-meta">
//                 <span className="product-category">{product.category}</span>
//                 {product.brand && (
//                   <span className="product-brand">{product.brand}</span>
//                 )}
//               </div>

//               <h3 className="product-title">{product.name}</h3>

//               {/* <p className="product-description">
//                 {product.description?.substring(0, 100)}...
//               </p> */}

//               <div className="product-details">
//                 {product.country && (
//                   <span className="detail-item">
//                     {" "}
//                     <Flag size={20} />
//                     {product.country}
//                   </span>
//                 )}
//                 {product.abv && (
//                   <span className="detail-item">
//                     {" "}
//                     <Wine size={20}/>
//                     {product.abv}% ABV
//                   </span>
//                 )}
//               </div>

//               {/* <div className="product-footer"> */}
//                 <div className="price-section">
//                   {formatPrice(product.price_info)}
//                   {product.availability_info.total_stock > 0 && (
//                     <span className="stock-info">
//                       {product.availability_info.total_stock} in stock
//                     </span>
//                   )}
//                 {/* </div> */}

//                 <button
//                   className="add-to-cart-btn"
//                   disabled={!product.availability_info.is_available}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleProductClick(product.id);
//                   }}
//                 >
//                   <ShoppingCart size={16} />
//                   {product.availability_info.is_available
//                     ? "Select Options"
//                     : "Out of Stock"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {products.length === 0 && !loading && (
//         <div className="no-results">
//           <h3>No products found</h3>
//           <p>Try adjusting your search terms or filters</p>
//           <button onClick={clearFilters} className="btn btn-primary">
//             Clear All Filters
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductList;

import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// Removed: import { Helmet } from "react-helmet";
import {
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  X,
  Star,
  ShoppingCart,
  Eye,
  Heart,
  Flag,
  Wine,
} from "lucide-react";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    subcategory: "",
    brand: "",
    country: "",
    min_price: "",
    max_price: "",
    available_only: false,
  });

  // Debounced search function - moved outside of useCallback to prevent recreation
  const debounce = useMemo(() => {
    return (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (searchTerm) params.append("search", searchTerm);
      if (selectedFilters.category)
        params.append("category", selectedFilters.category);
      if (selectedFilters.subcategory)
        params.append("subcategory", selectedFilters.subcategory);
      if (selectedFilters.brand) params.append("brand", selectedFilters.brand);
      if (selectedFilters.country)
        params.append("country", selectedFilters.country);
      if (selectedFilters.min_price)
        params.append("min_price", selectedFilters.min_price);
      if (selectedFilters.max_price)
        params.append("max_price", selectedFilters.max_price);
      if (selectedFilters.available_only)
        params.append("available_only", "true");
      if (sortBy) params.append("sort_by", sortBy);

      // IMPORTANT: Use an absolute URL for your API call if not already
      // This is less about SEO and more about robust fetch calls in production
      const response = await fetch(`http://localhost:3000/products?${params}`);
      const data = await response.json();

      setProducts(data.products || []);
      setFilters(data.filters || {});
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedFilters, sortBy]);

  // Create debounced version of fetchProducts - this should be stable
  const debouncedFetchProducts = useMemo(
    () => debounce(fetchProducts, 2000),
    [debounce, fetchProducts]
  );

  // Use useEffect to handle the debounced search
  useEffect(() => {
    // Call the debounced function, which itself calls fetchProducts
    debouncedFetchProducts();
  }, [searchTerm, selectedFilters, sortBy, debouncedFetchProducts]); // Added debouncedFetchProducts to deps

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      category: "",
      subcategory: "",
      brand: "",
      country: "",
      min_price: "",
      max_price: "",
      available_only: false,
    });
    setSearchTerm("");
  };

  const handleProductClick = (productId) => {
    // Navigate to product detail page
    navigate(`/products/${productId}`);
  };

  const formatPrice = (priceInfo) => {
    if (!priceInfo.has_variants) {
      return <span className="price-unavailable">Out of Stock</span>;
    }

    if (priceInfo.min_price === priceInfo.max_price) {
      return <span className="price-single">KES {priceInfo.min_price}</span>;
    }

    return (
      <span className="price-range">
        KES {priceInfo.min_price} - KES {priceInfo.max_price}
      </span>
    );
  };

  const getActiveFiltersCount = () => {
    return (
      Object.values(selectedFilters).filter(
        (value) => value !== "" && value !== false
      ).length + (searchTerm ? 1 : 0)
    );
  };

  // --- SEO Metadata Variables ---
  const siteName = "Liquor Chapchap";
  const baseUrl = "https://liquorchapchap.vercel.app";
  const productListPagePath = "/products";

  // Dynamic Title based on category
  const getPageTitle = () => {
    let title = `${siteName} | Online Alcohol & Drinks Store in Nairobi`;
    if (selectedFilters.category) {
      title = `${selectedFilters.category} | ${siteName} - Delivery in Nairobi`;
    }
    return title;
  };

  // Dynamic Description based on category
  const getPageDescription = () => {
    let description = "Explore our wide selection of wines, beers, spirits, and other drinks available for fast delivery across Nairobi, Kenya. Find your favorite brands and new discoveries at Liquor Chapchap.";
    if (selectedFilters.category) {
      description = `Shop the best ${selectedFilters.category} at ${siteName}. We offer fast delivery of premium ${selectedFilters.category} across Nairobi, Kenya.`;
    }
    return description;
  };

  const currentCanonicalUrl = `${baseUrl}${productListPagePath}`;

  const ogImageUrl = "https://i.im.ge/2025/06/24/JSTdGm.upscalemedia-transformed.png";

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchProducts} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <> {/* Use a React Fragment to wrap the head elements and your page content */}
      {/* React 19 Native Document Metadata (assuming React 19 is used) */}
      <title>{getPageTitle()}</title>
      <meta name="description" content={getPageDescription()} />
      <link rel="canonical" href={currentCanonicalUrl} />

      {/* Keywords (general for products page) */}
      <meta name="keywords" content="alcohol, drinks, wine, beer, spirits, delivery, Nairobi, Kenya, online store, buy alcohol, liquor shop" />

      {/* Open Graph Tags */}
      <meta property="og:title" content={getPageTitle()} />
      <meta property="og:description" content={getPageDescription()} />
      <meta property="og:url" content={currentCanonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content="product.group" />
      {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={getPageTitle()} />
      <meta name="twitter:description" content={getPageDescription()} />
      {ogImageUrl && <meta name="twitter:image" content={ogImageUrl} />}

      {/* The <html> lang attribute should not be placed here.
          It belongs in your public/index.html file or handled by an SSR framework. */}

      <div className="product-listing section">
        {/* Header Section */}
        <div className="listing-header section">
          <div className="header-content">
            <h1 className="page-title">
              {selectedFilters.category
                ? `${selectedFilters.category} Collection`
                : "Our Drinks Collection"}
            </h1>
            <p className="page-subtitle">
              Discover premium {selectedFilters.category || "alcoholic drinks"} from around the world, delivered fast in Nairobi.
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="search-filter-bar">
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search wines, brands, or regions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="clear-search-btn"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="filter-controls">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
            >
              <Filter size={18} />
              Filters
              {getActiveFiltersCount() > 0 && (
                <span className="filter-count">{getActiveFiltersCount()}</span>
              )}
              <ChevronDown
                className={`chevron ${showFilters ? "rotated" : ""}`}
                size={16}
              />
            </button>

            <div className="view-controls">
              <button
                onClick={() => setViewMode("grid")}
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              >
                <List size={18} />
              </button>
            </div>

            <div className="sort-container">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="name_asc">Name A-Z</option>
                <option value="name_desc">Name Z-A</option>
                <option value="price_asc">Price Low to High</option>
                <option value="price_desc">Price High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-panel">
            <div className="filter-grid">
              <div className="filter-group">
                <label>Category</label>
                <select
                  value={selectedFilters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                >
                  <option value="">All Categories</option>
                  {filters.categories?.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Brand</label>
                <select
                  value={selectedFilters.brand}
                  onChange={(e) => handleFilterChange("brand", e.target.value)}
                >
                  <option value="">All Brands</option>
                  {filters.brands?.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Country</label>
                <select
                  value={selectedFilters.country}
                  onChange={(e) => handleFilterChange("country", e.target.value)}
                >
                  <option value="">All Countries</option>
                  {filters.countries?.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group price-filter">
                <label>Price Range</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={selectedFilters.min_price}
                    onChange={(e) =>
                      handleFilterChange("min_price", e.target.value)
                    }
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={selectedFilters.max_price}
                    onChange={(e) =>
                      handleFilterChange("max_price", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="filter-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedFilters.available_only}
                    onChange={(e) =>
                      handleFilterChange("available_only", e.target.checked)
                    }
                  />
                  Available Only
                </label>
              </div>
            </div>

            <div className="filter-actions">
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="results-summary">
          <p>{products.length} products found</p>
          {getActiveFiltersCount() > 0 && (
            <div className="active-filters">
              {searchTerm && (
                <span className="filter-tag">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")}>×</button>
                </span>
              )}
              {Object.entries(selectedFilters).map(([key, value]) => {
                if (value && value !== false) {
                  return (
                    <span key={key} className="filter-tag">
                      {key.replace("_", " ")}: {value.toString()}
                      <button
                        onClick={() =>
                          handleFilterChange(
                            key,
                            key === "available_only" ? false : ""
                          )
                        }
                      >
                        ×
                      </button>
                    </span>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className={`product-grid ${viewMode}`}>
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="product-image-container">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="product-image-placeholder">
                    <span>No Image</span>
                  </div>
                )}

                <div className="product-overlay">
                  <button className="action-btn wishlist-btn">
                    <Heart size={18} />
                  </button>
                  <button className="action-btn quick-view-btn">
                    <Eye size={18} />
                  </button>
                </div>

                {!product.availability_info.is_available && (
                  <div className="out-of-stock-badge">Out of Stock</div>
                )}
              </div>

              <div className="product-info">
                <div className="product-meta">
                  <span className="product-category">{product.category}</span>
                  {product.brand && (
                    <span className="product-brand">{product.brand}</span>
                  )}
                </div>

                <h3 className="product-title">{product.name}</h3>

                <div className="product-details">
                  {product.country && (
                    <span className="detail-item">
                      {" "}
                      <Flag size={20} />
                      {product.country}
                    </span>
                  )}
                  {product.abv && (
                    <span className="detail-item">
                      {" "}
                      <Wine size={20}/>
                      {product.abv}% ABV
                    </span>
                  )}
                </div>

                <div className="price-section">
                  {formatPrice(product.price_info)}
                  {product.availability_info.total_stock > 0 && (
                    <span className="stock-info">
                      {product.availability_info.total_stock} in stock
                    </span>
                  )}
                  <button
                    className="add-to-cart-btn"
                    disabled={!product.availability_info.is_available}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product.id);
                    }}
                  >
                    <ShoppingCart size={16} />
                    {product.availability_info.is_available
                      ? "Select Options"
                      : "Out of Stock"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="no-results">
            <h3>No products found</h3>
            <p>Try adjusting your search terms or filters</p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;