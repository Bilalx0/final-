

import React, { useState } from "react";
import axios from "axios";

const NewDevelopmentform = () => {
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    link: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const BASE_URL =
process.env.NODE_ENV === "production"
  ? "https://backend-5kh4.onrender.com"
  : "http://localhost:5001";

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate form data
    if (!formData.title || !formData.link || !formData.image) {
      setError("Please fill out all fields and select an image.");
      setLoading(false);
      return;
    }

    // Prepare form data for multipart/form-data request
    const data = new FormData();
    data.append("title", formData.title);
    data.append("link", formData.link);
    data.append("image", formData.image);

    try {
      const response = await axios.post(`${BASE_URL}/api/developments`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Development added successfully!");
      // Reset form
      setFormData({
        title: "",
        image: null,
        link: "",
      });
      // Clear file input
      document.getElementById("imageInput").value = null;
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.response?.data?.message || "Failed to add development. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-4 md:p-8 font-inter">
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-md p-6 mb-6">
          <h3 className="font-semibold text-lg">New Development Section</h3>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border outline-none mb-2"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Development Title"
              className="w-full p-2 border outline-none"
            />
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="Link (e.g., https://example.com)"
              className="w-full p-2 border outline-none"
            />
          </div>
        </div>
        {error && (
          <p className="text-red-600 text-center mb-4">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-center mb-4">{success}</p>
        )}
        <div className="text-center mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`font-inter px-6 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewDevelopmentform;