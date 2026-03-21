import React from "react";
import Banner from "./components/Banner";
import ShopByCategory from "./Homepage/ShopByCategory";
import SeoContent from "./components/SeoContent";
import NewBooks from "./Homepage/NewBooks";
import Link from "next/link";

const HomePage = () => {
  return (
    <main>
      {/* Banner Section */}
      <Banner />

      {/* Shop By Category Section */}
      <ShopByCategory />

      {/* Newly Added Product */}
      <NewBooks />

      <div className="flex items-center">
        <Link
          href="/products"
          className="inline-flex mt-10 mb-10 mx-auto items-center justify-center bg-primary hover:bg-primary_hover text-white px-8 py-4 rounded-xl text-sm transition"
        >
          Explore All Products
        </Link>
      </div>

      {/* SEO content */}
      <SeoContent />
    </main>
  );
};

export default HomePage;
