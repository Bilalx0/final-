import React from "react";
import MansionCard from "./Card";

const LuxuaryCollectibleList = ({ collectible }) => {
  return (
    <div className="flex flex-wrap gap-6 justify-center w-full">
      {collectible.length > 0 ? (
        collectible.map((collectible) => (
          <MansionCard key={collectible.reference} mansion={collectible} />
        ))
      ) : (
        <p className="text-gray-600 text-center w-full text-lg py-8">
          No luxury collectibles found matching your criteria. Try adjusting your search or filters.
        </p>
      )}
    </div>
  );
};

export default LuxuaryCollectibleList;