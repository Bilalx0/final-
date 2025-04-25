import React from "react";
import MansionCard from "./Card";

const PenthouseList = ({ penthouses }) => {
  return (
    <div className="flex flex-wrap gap-6 justify-center w-full">
      {penthouses.length > 0 ? (
        penthouses.map((penthouse) => (
          <MansionCard key={penthouse.reference} mansion={penthouse} />
        ))
      ) : (
        <p className="text-gray-600 text-center w-full text-lg py-8">
          No penthouses found matching your criteria. Try adjusting your search or filters.
        </p>
      )}
    </div>
  );
};

export default PenthouseList;