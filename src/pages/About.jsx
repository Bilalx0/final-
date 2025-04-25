import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import newImage from "../assests/Office Image - About us page_full_size.png"; // Use the uploaded image
import Footer from "../components/Footer";
import logo from "../assests/TMM-LANDING PAGE 1.svg";
import { Menu, X } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // Impor

const About = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="">
        {" "}
        {/* Full screen height */}
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
          {/* Navigation Popup (Works on all screen sizes) */}
          {menuOpen && (
            <div className="mt-2  ">
              <div className="bg-white shadow-md  p-4  z-50 absolute w-full  right-0  px-20">
                {[
                  { name: "Home", href: "/" },
                  { name: "Mansions", href: "/mansions" },
                  { name: "Penthouses", href: "/penthouses" },
                  { name: "New Developments", href: "/newdevelopment" },
                  // { name: "Development", href: "/listingpage" },
                  { name: "Magazine", href: "/magazine" },
                  // { name: "Luxe Collectibles", href: "/listedcollectibles" },
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
        <div className="relative w-full min-h-screen">
          <img
            src={newImage}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center mt-12">
        <div className="  text-gray-700 w-9/12 md:px-10 lg:px-20 py-12 space-y-8">
          <div className="space-y-6">
            <p className="text-lg  text-center font-inter pb-8 leading-[2]">
              <span className="text-2xl text-[#00603A] font-playfair ">
                The Mansion Market
              </span>
              , the premier marketplace for finest mansions and penthouses. We
              specialize in properties those with a built-up area of 6,000
              square feet or more. Our exclusive focus ensures that we cater to
              the upper echelons of the luxury real estate market.
            </p>

            <p className="text-lg  text-center font-inter pb-8 leading-[2]">
              We take immense pride in our rigorous vetting process for both
              properties and agents, guaranteeing that only the highest quality
              listings are presented to our discerning clients. As pioneers in
              Dubai’s luxury real estate sector, we are acutely aware of the
              increasing number of homes entering the market, and we remain
              steadfast in our commitment to excellence.
            </p>

            <p className="text-lg  text-center font-inter leading-[2]">
              We collaborate with the leading agencies in the industry, ensuring
              that we showcase only the most exquisite properties. At The
              Mansion Market, we fully understand the expectations of modern
              luxury home buyers and sellers. We are dedicated to not just
              meeting but exceeding those expectations. With us, you can trust
              that your journey through Dubai’s real estate market will be
              nothing short of exceptional and rewarding.
            </p>
          </div>
        </div>
        <h2 className="text-2xl md:text-4xl m-10  text-center text-[#00603A] font-playfair">
          List Your Property With Us?
        </h2>
        <div className="  text-gray-700 w-9/12 md:px-10 lg:px-20 py-2 space-y-2">
          <p className="text-lg  text-center font-inter pb-8 leading-[2]">
            Put your property in front of the right eyeballs and enhance its
            visibility tenfold. with us property will attract high-end buyers
            actively seeking luxury homes in the market.
          </p>
        </div>
        <button className="w-8/12 md:w-4/12  text-xl border border-[#00603A] font-inter p-0 md:p-2 m-16 flex items-center justify-center font-inter px-20 py-3 text-black  border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300">
          List your properties
        </button>
      </div>

      <Footer />
    </>
  );
};

export default About;
