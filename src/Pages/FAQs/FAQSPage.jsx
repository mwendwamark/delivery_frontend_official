import { useState, useEffect, useRef } from 'react';
import { faqCategories } from './FAQsData.js';
// Removed: import { Helmet } from "react-helmet"; // <-- REMOVED HELMET
import './FAQsPage.css';

// Import icons from lucide-react
import { Search, HelpCircle, ShoppingCart, Package, Shield, RefreshCw, Scale, Settings, Plus, ArrowRight, MoveRight } from 'lucide-react';

// Map category IDs to more appealing Lucide icons
const categoryIcons = {
  'ordering-delivery': ShoppingCart,
  'product-curation': Package,
  'account-security': Shield,
  'returns-refunds': RefreshCw,
  'legal-compliance': Scale,
  'technical-assistance': Settings,
  'default': HelpCircle
};

// Helper function for smooth scrolling
const scrollToRef = (ref) => {
  if (ref && ref.current) {
    window.scrollTo({
      top: ref.current.offsetTop - 100, // Adjust for header/fixed elements
      behavior: 'smooth'
    });
  }
};

const FAQsPage = () => {
  const [activeCategory, setActiveCategory] = useState(faqCategories[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [openQuestionId, setOpenQuestionId] = useState(null);

  // Refs for smooth scrolling to categories
  const categoryRefs = useRef({});

  useEffect(() => {
    // Scroll to the active category section on initial load or category change
    if (activeCategory && categoryRefs.current[activeCategory]) {
      scrollToRef(categoryRefs.current[activeCategory]);
    }
  }, [activeCategory]);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setSearchTerm(''); // Clear search when changing category
    setOpenQuestionId(null); // Close any open accordions
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setActiveCategory(''); // De-select category when searching
    setOpenQuestionId(null); // Close any open accordions
  };

  const toggleAccordion = (questionId) => {
    setOpenQuestionId(openQuestionId === questionId ? null : questionId);
  };

  const filteredFaqs = faqCategories
    .filter(category =>
      activeCategory ? category.id === activeCategory : true // Filter by active category or show all if no category is active
    )
    .flatMap(category =>
      category.faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  const displayedCategories = searchTerm
    ? faqCategories.filter(category =>
        category.faqs.some(faq =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [faqCategories.find(cat => cat.id === activeCategory) || faqCategories[0]];

  // --- SEO Metadata Variables ---
  const siteName = "Liquor Chapchap";
  const baseUrl = "https://liquorchapchap.vercel.app"; // Your deployed site base URL
  const faqsPagePath = "/faqs"; // Or whatever your route is for this page

  // Dynamic Title based on search or active category
  const getPageTitle = () => {
    let title = `${siteName} | Frequently Asked Questions`;
    if (searchTerm) {
      title = `Search Results for "${searchTerm}" | FAQs | ${siteName}`;
    } else if (activeCategory) {
      const activeCat = faqCategories.find(cat => cat.id === activeCategory);
      if (activeCat) {
        title = `${activeCat.name} FAQs | ${siteName}`;
      }
    }
    return title;
  };

  // Dynamic Description based on search or active category
  const getPageDescription = () => {
    let description = "Find answers to your common questions about ordering, delivery, products, and more at Liquor Chapchap. Get support for your online alcohol purchases.";
    if (searchTerm) {
      description = `Browse FAQs related to "${searchTerm}" on Liquor Chapchap. Fast answers to your queries.`;
    } else if (activeCategory) {
      const activeCat = faqCategories.find(cat => cat.id === activeCategory);
      if (activeCat && activeCat.description) {
        description = activeCat.description; // Use category's description if available
      }
    }
    return description;
  };

  const currentCanonicalUrl = `${baseUrl}${faqsPagePath}`; // Canonical for FAQ page
  const ogImageUrl = "https://i.im.ge/2025/06/24/JSTdGm.upscalemedia-transformed.png"; // General image for social sharing

  return (
    <> {/* Use a React Fragment to wrap the head elements and your page content */}
      {/* React 19 Native Document Metadata (assuming React 19 is used) */}
      <title>{getPageTitle()}</title>
      <meta name="description" content={getPageDescription()} />
      <link rel="canonical" href={currentCanonicalUrl} />

      {/* Keywords (general for FAQs page) */}
      <meta name="keywords" content="FAQ, frequently asked questions, help, support, customer service, alcohol delivery, liquor chapchap, online store, Nairobi, Kenya, ordering, delivery, returns, refunds, account, security" />

      {/* Open Graph Tags */}
      <meta property="og:title" content={getPageTitle()} />
      <meta property="og:description" content={getPageDescription()} />
      <meta property="og:url" content={currentCanonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content="website" /> {/* FAQs is a general website page */}
      {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={getPageTitle()} />
      <meta name="twitter:description" content={getPageDescription()} />
      {ogImageUrl && <meta name="twitter:image" content={ogImageUrl} />}

      {/* The <html> lang attribute should not be placed here.
          It belongs in your public/index.html file or handled by an SSR framework. */}

      <div className="faqs-page-container section">
        {/* Hero Section with improved background handling */}
        <section className="faqs-hero">
          <div className="faqs-hero-content container">
            <h1 className="faqs-title">Frequently Asked Questions</h1>
            <p className="faqs-subtitle">
              Need assistance? Our curated responses address your most common queries, ensuring a seamless experience with our distinguished spirits.
            </p>
            <div className="search-bar-wrapper">
              <input
                type="text"
                placeholder="Search for answers..."
                className="faqs-search-input"
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search frequently asked questions"
              />
              <span className="faqs-search-icon">
                <Search size={20} />
              </span>
            </div>
          </div>
        </section>

        <div className="faqs-content-wrapper container">
          {/* Left Navigation: FAQ Categories */}
          <nav className="faqs-navigation">
            <h3>FAQ Categories</h3>
            <ul>
              {faqCategories.map((category) => {
                const IconComponent = categoryIcons[category.id] || categoryIcons.default;
                return (
                  <li key={category.id}>
                    <button
                      className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
                      onClick={() => handleCategoryClick(category.id)}
                      aria-label={`View ${category.name} FAQs`}
                    >
                      <span className="category-button-icon">
                        <IconComponent size={20} />
                      </span>
                      <span>{category.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Main Content: FAQ Items */}
          <main className="faqs-list-section">
            {displayedCategories.length === 0 || filteredFaqs.length === 0 ? (
              <div className="no-results-message">
                <p>No FAQs found matching your search criteria. Please try different keywords or browse our categories.</p>
              </div>
            ) : (
              displayedCategories.map((category) => {
                const categoryFaqs = searchTerm
                  ? category.faqs.filter(faq =>
                      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                  : category.faqs;

                if (categoryFaqs.length === 0) return null;

                return (
                  <section
                    key={category.id}
                    className="faq-category-section"
                    ref={(el) => {
                      if (el) categoryRefs.current[category.id] = { current: el };
                    }}
                  >
                    <h2 className="category-title">{category.name}</h2>
                    <p className="category-description">{category.description}</p>

                    <div className="faq-items-list">
                      {categoryFaqs.map((faq) => {
                        const questionId = `${category.id}-${faq.id}`;
                        const isOpen = openQuestionId === questionId;

                        return (
                          <article
                            key={faq.id}
                            className={`faq-item ${isOpen ? 'open' : ''}`}
                          >
                            <button
                              className={`faq-question-button ${isOpen ? 'active' : ''}`}
                              onClick={() => toggleAccordion(questionId)}
                              aria-expanded={isOpen}
                              aria-controls={`answer-${questionId}`}
                            >
                              <span className="question-icon">
                                <HelpCircle size={16} />
                              </span>
                              <span className="question-text">{faq.question}</span>
                              <span className="accordion-icon">
                                <Plus size={16} />
                              </span>
                            </button>

                            <div
                              className="faq-answer"
                              id={`answer-${questionId}`}
                              style={{
                                maxHeight: isOpen ? '1000px' : '0',
                                opacity: isOpen ? '1' : '0',
                                visibility: isOpen ? 'visible' : 'hidden'
                              }}
                            >
                              <p>{faq.answer}</p>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                );
              })
            )}
          </main>
        </div>

        {/* Enhanced CTA Section */}
        <section className="faqs-cta-section container">
          <div className="faqs-cta-content">
            <h2 className="cta-title">Still Need Help?</h2>
            <p className="cta-subtitle">
              Can't find the answer you're looking for? Our dedicated support team is here to assist you with any questions or concerns.
            </p>
            <div className="faqs-cta-buttons">
              <a href="/learn-more" className="btn btn-outline-white btn-l btn-icon">
                Learn More
                <MoveRight size={18} style={{ marginLeft: '8px' }} />
              </a>
              <a href="/get-started" className="btn btn-primary btn-l btn-icon">
                Get Started
                <MoveRight size={18} style={{ marginLeft: '8px' }} />
              </a>
            </div>
            <p>
              Need immediate assistance?{' '}
              <a href="/contact" className="cta-link">
                Contact us here
              </a>
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default FAQsPage;