import React from "react";
import MansionCard from "./Card"; // Use MansionCard instead of CollectibleCard

const LuxuryCollectibleList = ({ collectibles, searchQuery = "" }) => {
  return (
    <div className="flex flex-wrap gap-6 justify-center w-full">
      {collectibles?.length > 0 ? (
        collectibles
          .filter((collectible) => collectible && collectible.reference) // Filter out invalid entries
          .map((collectible) => (
            <MansionCard
              key={collectible.reference || collectible._id}
              mansion={collectible} // Pass as 'mansion' prop
              searchQuery={searchQuery}
            />
          ))
      ) : (
        <div className="w-full text-center py-12">
          <p className="text-gray-600 text-lg mb-4">
            No luxury collectibles found matching your criteria.
          </p>
          <p className="text-gray-500">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default LuxuryCollectibleList;