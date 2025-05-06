import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import newImage from "../assests/Modern Minimalist Interior.jpeg";
import img1 from "../assests/Serenity Waters Luxury Villa 1.png";
import image from "../assests/Elegant Living Room with Designer Furniture and Artistic Sculptures.jpeg";
import Footer from "../components/Footer";
import logo from "../assests/TMM-LANDING PAGE 1.svg";
import { Menu, X } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // Impor
import AboutPageListing from "./AboutPageListing.jsx";
import { Link } from "react-router-dom";

const Register = () => {
  const listings1 = [
    {
      id: 1,
      price: "13 AED",
      location: "Villa in Marbella, Andalusia, Spain",
      imageUrl: img1, // Replace with actual image URL
      bedrooms: 5,
      bathrooms: 4,
      size: "6,500", // sqft
      name: "Sienna Views",
    },
    {
      id: 2,
      price: "13 AED",
      location: "Villa in Marbella, Andalusia, Spain",
      imageUrl: img1,
      bedrooms: 6,
      bathrooms: 5,
      size: "7,200",
      name: "Sienna Views",
    },
    {
      id: 3,
      price: "13 AED",
      location: "Villa in Marbella, Andalusia, Spain",
      imageUrl: img1,
      bedrooms: 4,
      bathrooms: 3,
      size: "5,800",
      name: "Sienna Views",
    },
    {
      id: 4,
      price: "13 AED",
      location: "Villa in Marbella, Andalusia, Spain",
      imageUrl: img1,
      bedrooms: 7,
      bathrooms: 6,
      size: "8,000",
      name: "mansion",
    },
  ];
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };
  return (
    <>
      {/* Title and Search Bar */}
      <div className="flex flex-col items-center px-4 md:px-10 lg:px-20 py-12 space-y-8">
        {/* Title and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6 relative">
          {/* Logo */}
          <img src={logo} className="w-[250px] md:w-[400px]" alt="logo" />

          <div className="flex gap-2 w-full md:w-auto items-center">
            {/* Search Bar */}
            <div className="flex items-center w-full md:w-[300px] border border-[#000000] overflow-hidden shadow-sm">
              <input
                type="text"
                placeholder="Country, Area, District..."
                className="w-full px-4 py-2 text-[#000000] text-sm bg-[#f5f5f5] focus:outline-none"
              />
            </div>

            {/* Search Button */}
            <button className="bg-[#00603A] px-4 py-[10px] flex items-center justify-center border border-[#00603A] text-white hover:text-[#00603A] hover:bg-transparent transition">
              <FaSearch className="font-thin hover:text-[#00603A]" />
            </button>

            {/* Menu Icon (Visible on all screen sizes) */}
            <button className="p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <X className="w-6 h-6 text-[#000000]" />
              ) : (
                <Menu className="w-6 h-6 text-[#000000]" />
              )}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="mt-2  ">
            <div className="bg-white shadow-md p-4 z-50 absolute w-full right-0 px-12  md:px-20">
              {[
                { name: "Home", href: "/" },
                { name: "Mansions", href: "/mansions" },
                { name: "Penthouses", href: "/penthouses" },
                { name: "Developments", href: "/newdevelopment" },
                // { name: "Development", href: "/listingpage" },
                { name: "Magazine", href: "/magazine" },
                { name: "Luxe Collectibles", href: "/listedcollectibles" },
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
      </div>

      <div className="relative w-full h-screen">
        <img
          src={newImage}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <h1 className="text-white text-3xl md:text-5xl w-full max-w-[900px] leading-[1 !leading-[1] text-center font-playfair px-4">
            Connect with the best luxury real estate marketplace worldwide.
          </h1>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16 bg-gray-50">
        <div className="max-w-2xl text-center space-y-8 font-inter">
          <p className="text-lg  text-center font-inter pb-8 leading-[2] ">
            Become a part of an elite marketplace for ultra-luxurious mansions
            and penthouses. Our exclusive platform draws ultra-high-net-worth
            buyers who seek unparalleled quality and distinction in their homes.
          </p>
          <p className="text-lg  text-center font-inter pb-8 leading-[2]">
            With a commitment to excellence, we carefully curate listings,
            focusing on exceptional properties located in the city’s most
            prestigious areas.
          </p>
          <p className="text-lg  text-center font-inter pb-8 leading-[2]">
            Who can join our distinguished marketplace? Individual agents,
            agencies, holiday home operators, property developers, and property
            owners.
          </p>
        </div>

        <div className="mt-8">
          <button className="font-inter px-6 py-3 w-full md:w-[500px]  font-inter px-20 py-3 text-black  border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300   transition duration-300">
            Register Now
          </button>
        </div>
      </div>

      {/* <div className="px-4 md:px-8 lg:px-20 py-12 border-t border-b border-[#00603A]">
       
        <h2 className="text-2xl md:text-3xl text-center  text-[#00603A] font-playfair mt-2 mb-6">
          Newly Listed Penthouses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
          {listings1.map((listing) => (
            <div key={listing.id} className="overflow-hidden">
          
              <img
                src={listing.imageUrl}
                alt={listing.location}
                className="w-full h-96 object-cover"
              />

          
              <div className="py-4">
                <p className="text-black font-inter font-bold text-lg">
                  {listing.price}
                </p>
            
                <p className="font-inter text-gray-700 text-sm mt-2 mb-2">
                  {listing.bedrooms} Beds | {listing.bathrooms} Baths |{" "}
                  {listing.size} sqft
                </p>
                <p className="font-inter text-gray-500 text-sm mb-2 mt-2">
                  {listing.name}
                </p>
                <p className="font-inter text-gray-700 text-sm mt-2">
                  {listing.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mt-8 space-y-6 gap-4 md:space-y-0">
          <p className="text-gray-600 text-center md:text-left max-w-2xl font-inter">
            Discover the exquisite mansions and penthouses that are currently in
            the spotlight and newly available. This curated collection showcases
            the most sought-after properties on the market right now.
          </p>
          <button className="px-20 py-3 mr-0 ffont-inter px-20 py-3 text-black  border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300">
            Discover all
          </button>
        </div>
      </div> */}
      <AboutPageListing searchQuery={searchQuery} />

      <div className="flex flex-col md:flex-row items-center px-4 md:px-8   gap-8 py-12 space-y-8 md:space-y-0 mt-20 mb-24 ">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={image}
            alt="Mansion Market Magazine"
            className="w-full md:w-[70%] lg:w-[80%] h-auto  "
          />
        </div>

        {/* Text Section */}
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl md:text-3xl w-full md:w-[500px] font-playfair text-[#00603A] mb-12">
            The mansion market Magazine
          </h2>
          <p className="text-gray-600 mb-6 font-inter mb-12">
            Expert articles, market insights, and lifestyle features that
            showcase the latest in luxury properties and valuable assets. Check
            out our journal for exclusive updates, tips, and intriguing stories
            that celebrate the world of high-end real estate in Dubai and
            beyond.
          </p>
          <Link to="/magazine">
            <button className="px-8 py-3 w-full mt-6 md:w-[300px] font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300">
              Explore magazine
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Register;
