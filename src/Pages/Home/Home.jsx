import Hero from "./HomeHero/Hero";
import About from "./HomeAbout/About";
import Products from "./Products/Products";
import Testimonials from "./Testimonials/Testimonials";

const Home = () => {
  // --- SEO Metadata Variables ---
  const siteName = "Liquor Chapchap";
  const homepageTitle = `${siteName} | Fast Alcohol & Drinks Delivery in Nairobi, Kenya`;
  const homepageDescription =
    "Get fast and reliable alcohol delivery in Nairobi, Kenya. Order wines, beers, spirits, and convenience items online. Your favorite drinks and essentials delivered to your doorstep across Nairobi and surrounding areas.";
  const canonicalUrl = "https://liquorchapchap.vercel.app/";
  const ogImageUrl =
    "https://i.im.ge/2025/06/24/JSTdGm.upscalemedia-transformed.png";
  const keywords =
    "alcohol delivery Nairobi, liquor delivery Nairobi, wine delivery Nairobi, beer delivery Nairobi, spirits delivery Nairobi, online liquor store Nairobi, buy alcohol online Kenya, drinks delivery Nairobi, alcohol home delivery, convenience items Nairobi, everyday essentials delivery, party supplies Nairobi";

  return (
    <>
      <title>{homepageTitle}</title>
      <meta name="description" content={homepageDescription} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={homepageTitle} />
      <meta property="og:description" content={homepageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content="website" />
      {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={homepageTitle} />
      <meta name="twitter:description" content={homepageDescription} />
      {ogImageUrl && <meta name="twitter:image" content={ogImageUrl} />}
      {/* It should be in your public/index.html or handled by an SSR framework
      otherwise keep in public/index.html */}
      <div className="home-page section">
        <Hero />
        <About />
        <Products />
        <Testimonials />
      </div>
    </>
  );
};

export default Home;
