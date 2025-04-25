import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import logo from "../assests/TMM-LANDING PAGE 1.svg";
import Footer from "../components/Footer";
import { Menu, X } from "lucide-react";
import PenthouseList from "../components/PenthouseList";
import { useMansions } from "../context/MansionContext";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // Impor

const Penthouses = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null); // Track which dropdown is open
  const [filters, setFilters] = useState({
    bedrooms: "",
    minPrice: "",
    maxPrice: "",
    minSize: "",
    maxSize: "",
    sortBy: "newest",
  });
  const { mansions } = useMansions();

  // Refs for each dropdown to handle click-outside
  const sizeRef = useRef(null);
  const bedroomsRef = useRef(null);
  const priceRef = useRef(null);
  const moreRef = useRef(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sizeRef.current &&
        !sizeRef.current.contains(event.target) &&
        bedroomsRef.current &&
        !bedroomsRef.current.contains(event.target) &&
        priceRef.current &&
        !priceRef.current.contains(event.target) &&
        moreRef.current &&
        !moreRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Split search query into individual terms
  const searchTerms = searchQuery
    .toLowerCase()
    .split(" ")
    .filter((term) => term);

  // Filter penthouses based on search query and filters
  const filteredPenthouses = mansions.filter((mansion) => {
    if (mansion.propertytype !== "Penthouse") return false;

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

    if (filters.bedrooms && mansion.bedrooms < parseInt(filters.bedrooms)) {
      return false;
    }

    if (filters.minPrice && mansion.price < parseInt(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && mansion.price > parseInt(filters.maxPrice)) {
      return false;
    }

    if (filters.minSize && mansion.size < parseInt(filters.minSize)) {
      return false;
    }
    if (filters.maxSize && mansion.size > parseInt(filters.maxSize)) {
      return false;
    }

    return true;
  });

  // Sort the filtered penthouses
  const sortedPenthouses = [...filteredPenthouses].sort((a, b) => {
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
        return a.reference < b.reference ? 1 : -1;
    }
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      bedrooms: "",
      minPrice: "",
      maxPrice: "",
      minSize: "",
      maxSize: "",
      sortBy: "newest",
    });
    setActiveDropdown(null);
  };

  // Toggle dropdown
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <>
      <div className="flex flex-col items-center px-4 md:px-10 lg:px-20 py-12 space-y-10">
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 relative">
          <img src={logo} className="w-[250px] md:w-[400px]" alt="logo" />
          <div className="flex gap-4 w-full md:w-auto items-center">
            <div className="flex items-center w-full md:w-[300px] border border-[#000000] overflow-hidden shadow-sm">
              <input
                type="text"
                placeholder="Country, Area, District..."
                className="w-full px-4 py-2 text-[#000000] text-sm bg-[#f5f5f5] focus:outline-none"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <button className="bg-[#00603A] px-4 py-[10px] flex items-center justify-center border border-[#00603A] text-white hover:text-[#00603A] hover:bg-transparent transition">
              <FaSearch className="font-thin hover:text-[#00603A]" />
            </button>
            <button className="p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <X className="w-6 h-6 text-[#000000]" />
              ) : (
                <Menu className="w-6 h-6 text-[#000000]" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Popup */}
        {menuOpen && (
          <div className="mt-2  ">
            <div className="bg-white shadow-md  p-4  z-50 absolute w-full  right-0  px-20">
              {[
                { name: "Home", href: "/" },
                { name: "Mansions", href: "/mansions" },
                { name: "Development", href: "/newdevelopment" },
                // { name: "New Developments", href: "/listingpage" },
                { name: "Magazine", href: "/magazine" },
                // { name: "Luxe Collectibles", href: "/listingpage" },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block font-inter py-2 text-gray-800 hover:text-[#00603A]  text-lg"
                >
                  {link.name}
                </a>
              ))}

              <p
                className="flex justify-start border-t border-[#000000]  space-x-0 mt-3 pt-4 "
                style={{ textTransform: "capitalize" }}
              >
                FOLLOW THE MANSION MARKET
              </p>
              <div className="flex justify-start  mt-4 py-4 space-x-6 mb-2 ">
                <a
                  href="#"
                  className="text-[#00603A] hover:text-gray-400 text-2xl"
                  aria-label="Facebook"
                >
                  <FaFacebook />
                </a>
                <a
                  href="#"
                  className="hover:text-gray-400 text-[#00603A] text-2xl"
                  aria-label="Twitter X"
                >
                  <FaXTwitter />
                </a>
                <a
                  href="#"
                  className="hover:text-gray-400 text-[#00603A] text-2xl"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  className="hover:text-gray-400 text-[#00603A] text-2xl"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="#"
                  className="hover:text-gray-400 text-2xl text-[#00603A]"
                  aria-label="YouTube"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-xl md:text-3xl pt-12 font-playfair text-[#00603A] text-center">
          Explore luxurious penthouses for sale globally
        </h2>
        <p className="text-sm font-inter md:text-lg text-gray-600 text-center max-w-3xl leading-relaxed">
          Discover a curated selection of exceptional penthouses from around the
          globe at The Mansion Market. Each listing is handpicked to meet your
          ultra-luxury requirements, offering unparalleled elegance, opulence,
          and breathtaking views.
        </p>
        {/* Filters Section */}
        <div className="flex flex-wrap pt-6 gap-4 items-center w-full justify-between">
          <div className="flex gap-4">
            {/* Size Dropdown */}
            <div className="relative" ref={sizeRef}>
              <button
                onClick={() => toggleDropdown("size")}
                className="px-4 py-2 border border-[#00603A] text-[#00603A] bg-white hover:bg-[#00603A] hover:text-white transition text-sm font-medium"
              >
                Size
              </button>
              {activeDropdown === "size" && (
                <div className="absolute z-10 mt-2 w-64 bg-white border border-[#00603A]shadow-lg p-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-600">
                      Size Range (sq.ft)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="minSize"
                        placeholder="Min"
                        value={filters.minSize}
                        onChange={handleFilterChange}
                        className="border border-gray-300 px-3 py-1 w-1/2 focus:outline-none focus:ring-1 focus:ring-[#00603A]"
                      />
                      <input
                        type="number"
                        name="maxSize"
                        placeholder="Max"
                        value={filters.maxSize}
                        onChange={handleFilterChange}
                        className="border border-gray-300 px-3 py-1 w-1/2 focus:outline-none focus:ring-1 focus:ring-[#00603A]"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={resetFilters}
                        className="px-3 py-1 border border-gray-300 text-gray-600 hover:bg-gray-100 rounded text-sm"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setActiveDropdown(null)}
                        className="px-3 py-1 bg-[#00603A] text-white hover:bg-[#004e30] rounded text-sm"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bedrooms Dropdown */}
            <div className="relative" ref={bedroomsRef}>
              <button
                onClick={() => toggleDropdown("bedrooms")}
                className="px-4 py-2 border border-[#00603A] text-[#00603A] bg-white hover:bg-[#00603A] hover:text-white transition text-sm font-medium"
              >
                Bedrooms
              </button>
              {activeDropdown === "bedrooms" && (
                <div className="absolute z-10 mt-2 w-48 bg-white border border-[#00603A]shadow-lg p-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-600">
                      Bedrooms
                    </label>
                    <select
                      name="bedrooms"
                      value={filters.bedrooms}
                      onChange={handleFilterChange}
                      className="border border-gray-300 px-3 py-1 focus:outline-none focus:ring-1 focus:ring-[#00603A]"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                      <option value="6">6+</option>
                    </select>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={resetFilters}
                        className="px-3 py-1 border border-gray-300 text-gray-600 hover:bg-gray-100  text-sm"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setActiveDropdown(null)}
                        className="px-3 py-1 bg-[#00603A] text-white hover:bg-[#004e30] text-sm"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Price Dropdown */}
            <div className="relative" ref={priceRef}>
              <button
                onClick={() => toggleDropdown("price")}
                className="px-4 py-2 border border-[#00603A] text-[#00603A] bg-white hover:bg-[#00603A] hover:text-white transition text-sm font-medium"
              >
                Price
              </button>
              {activeDropdown === "price" && (
                <div className="absolute z-10 mt-2 w-64 bg-white border border-[#00603A] shadow-lg p-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-600">
                      Price Range (USD)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="minPrice"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        className="border border-gray-300 px-3 py-1 w-1/2 focus:outline-none focus:ring-1 focus:ring-[#00603A]"
                      />
                      <input
                        type="number"
                        name="maxPrice"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        className="border border-gray-300 px-3 py-1 w-1/2 focus:outline-none focus:ring-1 focus:ring-[#00603A]"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={resetFilters}
                        className="px-3 py-1 border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setActiveDropdown(null)}
                        className="px-3 py-1 bg-[#00603A] text-white hover:bg-[#004e30] text-sm"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* More Dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => toggleDropdown("more")}
                className="px-4 py-2 border border-[#00603A] text-[#00603A] bg-white hover:bg-[#00603A] hover:text-white transition text-sm font-medium"
              >
                More
              </button>
              {activeDropdown === "more" && (
                <div className="absolute z-10 mt-2 w-48 bg-white border border-[#00603A] rounded-md shadow-lg p-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-600">
                      Additional Filters
                    </label>
                    <p className="text-gray-600 text-sm">
                      More filters coming soon...
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={resetFilters}
                        className="px-3 py-1 border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setActiveDropdown(null)}
                        className="px-3 py-1 bg-[#00603A] text-white hover:bg-[#004e30] text-sm"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sort Dropdown */}
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-[#00603A] text-[#00603A] bg-white text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#00603A] appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUgNmw1IDUgNS01IDIgMS03IDctNy03IDItMXoiIGZpbGw9IiMwMDYwM0EiLz48L3N2Zz4=')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:12px]"
          >
            <option value="newest">Sort by Featured</option>
            <option value="price_low">Price (Low to High)</option>
            <option value="price_high">Price (High to Low)</option>
            <option value="size_low">Size (Small to Large)</option>
            <option value="size_high">Size (Large to Small)</option>
          </select>
        </div>
        <p className="text-gray-600">
          {sortedPenthouses.length} properties found
        </p>
        <PenthouseList penthouses={sortedPenthouses} />
      </div>
      <Footer />
    </>
  );
};

export default Penthouses;
