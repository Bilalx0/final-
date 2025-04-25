import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const MansionForm = () => {
  const { id } = useParams(); // Get ID from URL for editing
  const navigate = useNavigate();
  const [mansionData, setMansionData] = useState({
    reference: "",
    propertytype: "",
    size: "",
    bedrooms: "",
    bathrooms: "",
    furnishingtype: "",
    builtuparea: "",
    projectstatus: "",
    community: "",
    subcommunity: "",
    country: "",
    price: "",
    title: "",
    subtitle: "",
    description: "",
    amenities: "",
    video: "",
    propertyaddress: "",
    unitno: "",
    tag: "",
    status: "",
    agentname: "",
    designation: "",
    email: "",
    phone: "",
    whatsaapno: "",
    callno: "",
  });

  const [images, setImages] = useState([]); // New images to upload
  const [existingImages, setExistingImages] = useState([]); // Existing image URLs from backend
  const [agentimage, setAgentImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://backend-5kh4.onrender.com"
      : "http://localhost:5001";

  // Fetch existing data for editing
  useEffect(() => {
    if (id) {
      const fetchProperty = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/propertyDetail/${id}`);
          const data = response.data;
          // Populate mansion data
          setMansionData({
            ...data,
            amenities: Array.isArray(data.amenities) ? data.amenities.join(", ") : data.amenities || "",
          });
          // Populate existing images (assuming backend returns an array of image URLs)
          setExistingImages(data.images || []); // Adjust based on your backend response structure
        } catch (error) {
          console.error("Error fetching property:", error);
          setSubmitError("Failed to load property data.");
        }
      };
      fetchProperty();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMansionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    setImages(files); // Store new images
  };

  const handleAgentImageChange = (e) => {
    setAgentImage(e.target.files[0]);
  };

  // Remove an existing image
  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const formData = new FormData();
      // Append all mansion data fields
      Object.keys(mansionData).forEach((key) => {
        const value = mansionData[key] !== null && mansionData[key] !== undefined
          ? mansionData[key].toString()
          : "";
        formData.append(key, value);
      });

      // Append new images
      images.forEach((image) => {
        formData.append("images", image);
      });

      // Append existing image URLs to inform backend which images to keep
      if (existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      // Append agent image if it exists
      if (agentimage) {
        formData.append("agentimage", agentimage);
      }

      // Debug: Log form data entries
      console.log("Sending form data:", Object.fromEntries(formData));

      let response;
      if (id) {
        // Update existing property
        response = await axios.put(`${BASE_URL}/api/propertyDetail/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        });
      } else {
        // Create new property
        response = await axios.post(`${BASE_URL}/api/propertyDetail`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      console.log("Submission successful:", response.data);
      setSubmitSuccess(true);

      // Reset form for create, or navigate back for update
      if (!id) {
        setMansionData({
          reference: "",
          propertytype: "",
          size: "",
          bedrooms: "",
          bathrooms: "",
          furnishingtype: "",
          builtuparea: "",
          projectstatus: "",
          community: "",
          subcommunity: "",
          country: "",
          price: "",
          title: "",
          subtitle: "",
          description: "",
          amenities: "",
          video: "",
          propertyaddress: "",
          unitno: "",
          tag: "",
          status: "",
          agentname: "",
          designation: "",
          email: "",
          phone: "",
          whatsaapno: "",
          callno: "",
        });
        setImages([]);
        setExistingImages([]);
        setAgentImage(null);
        document.querySelectorAll('input[type="file"]').forEach((input) => (input.value = ""));
      } else {
        navigate(`/dashboard`);
      }
    } catch (error) {
      console.error("Submission error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to submit form.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto p-4 md:p-20 mb-8 font-inter">
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-md p-6 mb-6 -lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {id ? "Edit Property" : "Add New Property"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Reference*</label>
              <input
                type="text"
                name="reference"
                placeholder="Add Reference"
                value={mansionData.reference}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Property Type*</label>
              <select
                name="propertytype"
                value={mansionData.propertytype}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              >
                <option value="">Select Property Type</option>
                <option value="Mansion">Mansion</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Luxury Collectibles">Luxury Collectibles</option>
              </select>
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Size (SQFT)*</label>
              <input
                type="number"
                name="size"
                placeholder="Add Size"
                value={mansionData.size}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Bedrooms*</label>
              <input
                type="number"
                name="bedrooms"
                placeholder="Add Bedrooms"
                value={mansionData.bedrooms}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Bathrooms*</label>
              <input
                type="number"
                name="bathrooms"
                placeholder="Add Bathrooms"
                value={mansionData.bathrooms}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Furnishing Type</label>
              <select
                name="furnishingtype"
                value={mansionData.furnishingtype}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              >
                <option value="">Select Furnishing Type</option>
                <option value="Furnished">Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
              </select>
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Built-up Area (SQFT)</label>
              <input
                type="number"
                name="builtuparea"
                placeholder="Add Built-up Area"
                value={mansionData.builtuparea}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                min="1"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Project Status</label>
              <select
                name="projectstatus"
                value={mansionData.projectstatus}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              >
                <option value="">Select Project Status</option>
                <option value="Ready">Ready</option>
                <option value="Under Construction">Under Construction</option>
                <option value="Off Plan">Off Plan</option>
              </select>
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Community*</label>
              <input
                type="text"
                name="community"
                placeholder="Add Community"
                value={mansionData.community}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Sub Community</label>
              <input
                type="text"
                name="subcommunity"
                placeholder="Add Sub community"
                value={mansionData.subcommunity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Country*</label>
              <input
                type="text"
                name="country"
                placeholder="Add Country"
                value={mansionData.country}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md p-6 mb-6 -lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Pricing & Description</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Price ($)*</label>
              <input
                type="number"
                name="price"
                placeholder="Add Price"
                value={mansionData.price}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Title*</label>
              <input
                type="text"
                name="title"
                placeholder="Add Title"
                value={mansionData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              />
            </div>
            <div className="form-group md:col-span-2">
              <label className="block text-gray-700 mb-2">Sub Title</label>
              <input
                type="text"
                name="subtitle"
                placeholder="Add Sub Title"
                value={mansionData.subtitle}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
            <div className="form-group md:col-span-2">
              <label className="block text-gray-700 mb-2">Description*</label>
              <textarea
                rows="4"
                name="description"
                placeholder="Add Description"
                value={mansionData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              ></textarea>
            </div>
            <div className="form-group md:col-span-2">
              <label className="block text-gray-700 mb-2">Amenities*</label>
              <textarea
                rows="4"
                name="amenities"
                placeholder="List amenities separated by commas"
                value={mansionData.amenities}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              ></textarea>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md p-6 mb-6 -lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Property Images{!id && "*"}</label>
              {/* Display existing images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Existing Images:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl} // Adjust URL based on your backend
                          alt={`Property ${index}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Input for new images */}
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required={!id && existingImages.length === 0} // Required only for new properties if no existing images
              />
              {images.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>Selected new images:</p>
                  <ul className="list-disc pl-5">
                    {images.map((image, index) => (
                      <li key={index}>{image.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Video Link</label>
              <input
                type="url"
                name="video"
                placeholder="Enter Video Link"
                value={mansionData.video}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md p-6 mb-6 -lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Location & Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Property Address*</label>
              <input
                type="text"
                name="propertyaddress"
                placeholder="Add Property Address"
                value={mansionData.propertyaddress}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Unit No</label>
              <input
                type="text"
                name="unitno"
                placeholder="Add Unit no"
                value={mansionData.unitno}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Tag</label>
              <select
                name="tag"
                value={mansionData.tag}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              >
                <option value="">Select Tag</option>
                <option value="Featured">Featured</option>
                <option value="Popular">Popular</option>
                <option value="New">New</option>
                <option value="Hot Deal">Hot Deal</option>
              </select>
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Status*</label>
              <select
                name="status"
                value={mansionData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              >
                <option value="">Select Status</option>
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
                <option value="Sold">Sold</option>
                <option value="Rented">Rented</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md p-6 mb-6 -lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Agent Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Agent Name*</label>
              <input
                type="text"
                name="agentname"
                placeholder="Add Agent Name"
                value={mansionData.agentname}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Designation</label>
              <input
                type="text"
                name="designation"
                placeholder="Add Designation"
                value={mansionData.designation}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Phone*</label>
              <input
                type="tel"
                name="phone"
                placeholder="Add Phone Number"
                value={mansionData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Email*</label>
              <input
                type="email"
                name="email"
                placeholder="Add Email"
                value={mansionData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
                required
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">WhatsApp No</label>
              <input
                type="tel"
                name="whatsaapno"
                placeholder="Add WhatsApp Number"
                value={mansionData.whatsaapno}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Call No</label>
              <input
                type="tel"
                name="callno"
                placeholder="Add Call Number"
                value={mansionData.callno}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
            <div className="form-group">
              <label className="block text-gray-700 mb-2">Agent Profile Image</label>
              <input
                type="file"
                name="agentimage"
                accept="image/*"
                onChange={handleAgentImageChange}
                className="w-full p-2 border border-gray-300 outline-none focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-700">
            Property {id ? "updated" : "submitted"} successfully!
          </div>
        )}
        {submitError && (
          <div className="mb-6 p-4 bg-red-100 text-red-700">{submitError}</div>
        )}

        <div className="text-right">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 text-black border border-[#00603A] hover:bg-[#00603A] hover:text-white transition-all duration-300 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : id ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MansionForm;