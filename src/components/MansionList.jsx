import React from "react";
import { useMansions } from "../context/MansionContext";
import MansionCard from "./Card";

const MansionList = ({ searchQuery = "", filters = {} }) => {
  const { mansions } = useMansions();

  // Split search query into individual terms
  const searchTerms = searchQuery
    .toLowerCase()
    .split(" ")
    .filter((term) => term);

  // Filter mansions based on search query and filters
  const filteredMansions = mansions.filter((mansion) => {
    // Only include Mansion property type
    if (mansion.propertytype !== "Mansion") return false;

    // Search query filtering (country, area, district, city, community, subcommunity)
    if (searchTerms.length > 0) {
      const matchesSearch = searchTerms.some((term) =>
        [
          mansion.country,
          mansion.area,
          mansion.district,
          mansion.city,
          mansion.community,
          mansion.subcommunity,
        ].some((field) => field && field.toLowerCase().includes(term))
      );

      if (!matchesSearch) return false;
    }

    // Bedrooms filter
    if (filters.bedrooms && mansion.bedrooms < parseInt(filters.bedrooms)) {
      return false;
    }

    // Price range filter
    if (filters.minPrice && mansion.price < parseInt(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && mansion.price > parseInt(filters.maxPrice)) {
      return false;
    }

    // Size range filter
    if (filters.minSize && mansion.size < parseInt(filters.minSize)) {
      return false;
    }
    if (filters.maxSize && mansion.size > parseInt(filters.maxSize)) {
      return false;
    }

    return true;
  });

  // Sort the filtered mansions
  const sortedMansions = [...filteredMansions].sort((a, b) => {
    switch (filters.sortBy) {
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      case "size_low":
        return a.size - b.size;
      case "size_high":
        return b.size - a.size;
      case "newest":
      default:
        // Assuming there's a date field, otherwise fall back to reference
        return a.reference < b.reference ? 1 : -1;
    }
  });

  return (
    <div className="w-full pt-4">
      {/* Results count */}
      <p className="text-gray-600 text-center mb-4">
        {sortedMansions.length} properties found
      </p>

      {/* Mansion cards grid */}
      <div className="flex flex-wrap gap-6 justify-center">
        {sortedMansions.length > 0 ? (
          sortedMansions.map((mansion) => (
            <MansionCard key={mansion.reference} mansion={mansion} />
          ))
        ) : (
          <p className="text-gray-600 text-center w-full text-lg py-8">
            No mansions found matching your criteria. Try adjusting your search
            or filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default MansionList;
