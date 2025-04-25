import { BsArrowRight } from "react-icons/bs";
import React, { useState, useEffect } from "react";
import axios from "axios";
import mockupimg from "../assests/Mockup.png";
import arrowimg from "../assests/Golf Community.jpg"; // Ensure you have a proper arrow image for navigation
const MagazineCollection = () => {
  const [magazineImage, setMagazineImage] = useState("");
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [reviews, setReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://backend-5kh4.onrender.com"
      : "http://localhost:5001";

  // Fetch magazine data
  useEffect(() => {
    const fetchMagazineData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/magazine`);
        console.log("Magazine API Response:", response.data);
        if (response.data) {
          setHeading(response.data.heading || "No heading available");
          setSubheading(response.data.subheading || "No subheading available");
          setMagazineImage(response.data.image || "/default-image.jpg");
        }
      } catch (error) {
        console.error("Error fetching magazine content:", error);
      }
    };

    // Fetch reviews
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/reviews`);
        console.log("Reviews API Response:", response.data);
        if (response.data && response.data.length > 0) {
          setReviews(response.data);
        } else {
          setReviews([
            {
              reviewerName: "No reviews available",
              company: "",
              content: "Check back later for client testimonials.",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([
          {
            reviewerName: "Error",
            company: "",
            content: "Failed to load reviews. Please try again later.",
          },
        ]);
      }
    };

    fetchMagazineData();
    fetchReviews();
  }, []);

  // Handle review navigation
  const nextReview = () => {
    setCurrentReviewIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevReview = () => {
    setCurrentReviewIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      <div className=" bg-white py-8 px-4  md:px-8 lg:px-16  ">
        <div className="text-start">
          <h2 className="text-lg md:text-3xl text-center md:text-left font-playfair text-[#00603A] mt-8 mb-16">
            The Magazine Collection
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-0 p-0 ">
          <div className="relative w-full h-[70vh]">
            <img
              src={magazineImage}
              alt="Magazine"
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = "/default-image.jpg")} // Fallback image
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4 md:p-12 text-white flex flex-col">
              <h3 className="text-xl md:text-3xl font-playfair">{heading}</h3>
              <p className="mt-2 md:mt-4 text-sm md:text-base font-inter max-w-3xl">
                {subheading}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between space-x-0 mt-4  md:space-x-6   space-y-12   md:space-y-0">
            <p className="text-gray-600 font-inter text-center md:text-left max-w-2xl">
              Explore expert articles, market insights, and lifestyle features
              that showcase the latest in luxury properties and valuable assets.
              Check out our journal for exclusive updates, tips, and intriguing
              stories that celebrate the world of high-end real estate in Dubai
              and beyond.
            </p>

            <button className="z-0 mr-0 md:mr-20 font-inter px-20 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300">
              Read journals
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-screen  px-4 py-12  mt-8   md:px-8 lg:px-8 border-t   border-[#00603A]">
        <div className="p-6">
          <div className="text-center flex-1 p-4 md:p-6 flex flex-col justify-center items-center">
            <h2 className="text-xl md:text-3xl mb-8">
              <span className="text-[#00603A] font-playfair">
                The Spotlight On Iconic Estate
              </span>{" "}
              <span className="text-[#000000] font-inter font-thin pr-4">
                |
              </span>
              <span className="text-black font-inter tracking-[8px]">2025</span>
              <span className="text-[#000000] font-inter font-thin">
                {" "}
                EDITION
              </span>
            </h2>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="w-[250px] md:w-[740px] md:h-[320px] lg:h-[420px] font-inter flex flex-col items-center md:items-start px-6 md:px-16 lg:px-32 justify-center space-y-4 text-center md:text-left">
              <h3 className="text-xl md:text-3xl text-gray-700 leading-[2] tracking-[2px]">
                SPOT LIGHTS ON
              </h3>
              <p className="text-gray-600 text-[12px] md:text-base mt-2 leading-[2] tracking-[1px]">
                LUXURY LIVING | EXPERT INTERVIEW <br /> TRAVEL TO LUXURY
              </p>
              <a href="/signupsection">
                <button className="w-[300px] md:w-full  mt-6 p-2 text-base tracking-[0px] md:tracking-[2px] font-inter px-1 md:px-8 py-4 text-[#00603A] border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300">
                  SIGN UP FOR YOUR COPY
                </button>
              </a>
            </div>
            <div className="w-full md:w-[740px] px-6 md:px-0 flex justify-center items-center mt-4 md:mt-0">
              <img
                src={mockupimg}
                alt="Book Cover"
                className="w-full max-w-[320px] md:max-w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#f5f5f5] py-12 px-4 md:px-8 lg:px-16 mx-2 mt-0 md:mt-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl md:text-3xl font-playfair text-[#00603A] mb-16">
              Read the opinions shared by our clients
            </h2>
            {reviews.length > 0 && (
              <>
                <p className="text-gray-700 text-lg leading-relaxed mb-16">
                  {reviews[currentReviewIndex].content}
                </p>
                <p className="mt-4 text-gray-900 text-sm md:text-base">
                  - {reviews[currentReviewIndex].reviewerName},{" "}
                  {reviews[currentReviewIndex].company}
                </p>
              </>
            )}

            {reviews.length > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                  onClick={nextReview}
                  className="text-gray-700 hover:text-gray-900 text-xl"
                >
                  <BsArrowRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MagazineCollection;
