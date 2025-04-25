import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedListings from "../components/FeaturedListings";
import LifestyleChoices from "../components/LifestyleChoices";
import MagazineCollection from "../components/MagazineCollection";
import Footer from "../components/Footer";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    // You can add additional search submission logic here if needed
  };

  return (
    <div>
      <Navbar />
      <Hero 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />
      <FeaturedListings searchQuery={searchQuery} />
      <LifestyleChoices />
      <MagazineCollection />
      <Footer />
    </div>
  );
};

export default Home;